// LumbrScan Scan & Preprocessing Zustand Store

import { create } from 'zustand';
import type { OfflineSpeciesPrediction } from '../types/offlineInference';

export interface ScanStoreState {
  imageUri: string | null;
  croppedUri: string | null;
  isProcessing: boolean;
  activeResult: OfflineSpeciesPrediction | null;

  // Actions
  setImageUri: (uri: string | null) => void;
  setCroppedUri: (uri: string | null) => void;
  runInference: () => Promise<OfflineSpeciesPrediction>;
  resetScan: () => void;
}

export const useScanStore = create<ScanStoreState>((set, get) => ({
  imageUri: null,
  croppedUri: null,
  isProcessing: false,
  activeResult: null,

  setImageUri: (uri) => set({ imageUri: uri }),
  setCroppedUri: (uri) => set({ croppedUri: uri }),
  runInference: async () => {
    set({ isProcessing: true });
    try {
      const imageUri = get().croppedUri || get().imageUri;
      if (!imageUri) {
        throw new Error('Capture or select one clear end-grain photo before scanning.');
      }
      // Metro's runtime require defers the native ONNX module until the user
      // begins a scan, keeping the route available if a development build is
      // temporarily out of sync with its native dependencies.
      const { offlineSpeciesClassifier } = require('../services/offlineSpeciesClassifier.native') as typeof import('../services/offlineSpeciesClassifier.native');
      const result = await offlineSpeciesClassifier.classify(imageUri);

      set({
        isProcessing: false,
        activeResult: result,
      });

      return result;
    } catch (error) {
      // Keep the user-facing alert concise while preserving the native error
      // in Android diagnostics for device-specific troubleshooting.
      console.error('[LumbrScan] Offline species scan failed.', error);
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
