// LumbrScan History Logs Persistent Zustand Store

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HistoryLogRecord, PredictionResponse } from '../types';

export interface HistoryStoreState {
  logs: HistoryLogRecord[];
  addLog: (prediction: PredictionResponse, imageUri: string) => void;
  deleteLog: (id: string) => void;
  clearAllLogs: () => void;
  getLogById: (id: string) => HistoryLogRecord | undefined;
}

const MAX_HISTORY_ITEMS = 50;

export const useHistoryStore = create<HistoryStoreState>()(
  persist(
    (set, get) => ({
      logs: [
        // Seed initial history item for demo/presentation
        {
          id: 'ls-log-001',
          timestamp: new Date().toISOString(),
          imageUri: 'file:///mock/timber_sample_01.jpg',
          speciesId: 'apitong',
          commonName: 'Apitong',
          botanicalName: 'Dipterocarpus grandiflorus',
          confidenceScore: 0.942,
          detectedDefectsSummary: 'End Splitting / Cracks (Minor)',
          overallDefectSeverity: 'LOW',
          effectiveFprdiGroup: 'GROUP_II',
          safetyRating: 'SAFE',
          remediationCount: 3,
        },
      ],

      addLog: (prediction, imageUri) => {
        const primary = prediction.prediction.primaryMatch;
        const defects = prediction.automatedDefectDetection.detectedDefects;
        const defectSummary =
          defects.length > 0
            ? defects.map((d) => `${d.label} (${d.severity})`).join(', ')
            : 'No defects detected';

        const newLog: HistoryLogRecord = {
          id: `ls-log-${Date.now()}`,
          timestamp: prediction.timestamp || new Date().toISOString(),
          imageUri: imageUri || 'file:///mock/timber_sample.jpg',
          speciesId: primary.id,
          commonName: primary.commonName,
          botanicalName: primary.botanicalName,
          confidenceScore: primary.confidenceScore,
          detectedDefectsSummary: defectSummary,
          overallDefectSeverity: prediction.automatedDefectDetection.overallSeverity,
          effectiveFprdiGroup: prediction.structuralAssessment.effectiveFprdiGroup,
          safetyRating: prediction.structuralAssessment.safetyRating,
          remediationCount: prediction.automatedDefectDetection.remediationRecommendations.length,
        };

        set((state) => ({
          logs: [newLog, ...state.logs].slice(0, MAX_HISTORY_ITEMS),
        }));
      },

      deleteLog: (id) =>
        set((state) => ({
          logs: state.logs.filter((log) => log.id !== id),
        })),

      clearAllLogs: () => set({ logs: [] }),

      getLogById: (id) => get().logs.find((log) => log.id === id),
    }),
    {
      name: '@lumbrscan_history_v1',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
