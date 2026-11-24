import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OfflineScanLog, OfflineSpeciesPrediction } from '../types/offlineInference';

type HistoryStoreState = {
  logs: OfflineScanLog[];
  addLog: (prediction: OfflineSpeciesPrediction, imageUri: string) => void;
  deleteLog: (id: string) => void;
  clearAllLogs: () => void;
};

export const useHistoryStore = create<HistoryStoreState>()(
  persist(
    (set) => ({
      logs: [],
      addLog: (prediction, imageUri) => {
        if (prediction.status !== 'accepted') return;
        const log: OfflineScanLog = {
          id: `scan-${Date.now()}`,
          timestamp: new Date().toISOString(),
          imageUri,
          speciesId: prediction.predictedSpeciesId,
          confidence: prediction.confidence,
          processingTimeMs: prediction.processingTimeMs,
        };
        set((state) => ({ logs: [log, ...state.logs].slice(0, 50) }));
      },
      deleteLog: (id) => set((state) => ({ logs: state.logs.filter((log) => log.id !== id) })),
      clearAllLogs: () => set({ logs: [] }),
    }),
    { name: '@lumbrscan_history_v2', storage: createJSONStorage(() => AsyncStorage) }
  )
);
