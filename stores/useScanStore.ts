// LumbrScan Scan & Preprocessing Zustand Store

import { create } from 'zustand';
import type { OfflineSpeciesPrediction } from '../types/offlineInference';

export interface ScanStoreState {
  imageUri: string | null;
  croppedUri: string | null;
  woodGrainUri: string | null;
  isProcessing: boolean;
  activeResult: OfflineSpeciesPrediction | null;

  // Actions
  setImageUri: (uri: string | null) => void;
  setCroppedUri: (uri: string | null) => void;
  setWoodGrainUri: (uri: string | null) => void;
  runInference: () => Promise<OfflineSpeciesPrediction>;
  resetScan: () => void;
}

export const useScanStore = create<ScanStoreState>((set, get) => ({
  imageUri: null,
  croppedUri: null,
  woodGrainUri: null,
  isProcessing: false,
  activeResult: null,

  setImageUri: (uri) => set({ imageUri: uri, activeResult: null }),
  setCroppedUri: (uri) => set({ croppedUri: uri, activeResult: null }),
  setWoodGrainUri: (uri) => set({ woodGrainUri: uri, activeResult: null }),
  runInference: async () => {
    set({ isProcessing: true });
    try {
      const imageUri = get().croppedUri || get().imageUri;
      const woodGrainUri = get().woodGrainUri;
      if (!imageUri || !woodGrainUri) {
        throw new Error('Select an end-grain photo and a wood-grain photo of the same board.');
      }
      if (imageUri === woodGrainUri) {
        throw new Error('Select a different photo for each view of the same board.');
      }
      // Metro's runtime require defers the native ONNX module until the user
      // begins a scan, keeping the route available if a development build is
      // temporarily out of sync with its native dependencies.
      const { offlineSpeciesClassifier } = require('../services/offlineSpeciesClassifier.native') as typeof import('../services/offlineSpeciesClassifier.native');
      const result = await offlineSpeciesClassifier.classify(imageUri, woodGrainUri);

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
      woodGrainUri: null,
      activeResult: null,
      isProcessing: false,
    }),
}));
