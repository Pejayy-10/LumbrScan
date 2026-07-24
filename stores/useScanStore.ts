// LumbrScan Scan & Preprocessing Zustand Store

import { create } from 'zustand';
import { ModalityType, PredictionResponse } from '../types';
import { mockApiClient } from '../services/mockApiClient';

export interface ScanStoreState {
  imageUri: string | null;
  croppedUri: string | null;
  modalityType: ModalityType;
  isProcessing: boolean;
  activeResult: PredictionResponse | null;
  scanHistory: PredictionResponse[];

  // Actions
  setImageUri: (uri: string | null) => void;
  setCroppedUri: (uri: string | null) => void;
  setModalityType: (modality: ModalityType) => void;
  runInference: (conditionFlags: any) => Promise<PredictionResponse>;
  resetScan: () => void;
}

export const useScanStore = create<ScanStoreState>((set, get) => ({
  imageUri: null,
  croppedUri: null,
  modalityType: 'TRANSVERSAL_CROSS_SECTION',
  isProcessing: false,
  activeResult: null,
  scanHistory: [],

  setImageUri: (uri) => set({ imageUri: uri }),
  setCroppedUri: (uri) => set({ croppedUri: uri }),
  setModalityType: (modality) => set({ modalityType: modality }),

  runInference: async (conditionFlags) => {
    set({ isProcessing: true });
    try {
      const payload = {
        imageUri: get().croppedUri || get().imageUri || 'mock_timber_image.jpg',
        modalityType: get().modalityType,
        conditionAssessment: conditionFlags,
      };

      const result = await mockApiClient.predictSpecies(payload);

      set((state) => ({
        isProcessing: false,
        activeResult: result,
        scanHistory: [result, ...state.scanHistory],
      }));

      return result;
    } catch (error) {
      set({ isProcessing: false });
      throw error;
    }
  },

  resetScan: () =>
    set({
      imageUri: null,
      croppedUri: null,
      activeResult: null,
      isProcessing: false,
    }),
}));
