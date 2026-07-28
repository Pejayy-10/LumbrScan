// LumbrScan Budgeting & Timber Estimator Zustand Store

import { create } from 'zustand';
import { EstimatorResponsePayload, EstimatorRequestPayload } from '../types';
import { mockApiClient } from '../services/mockApiClient';

export interface EstimatorStoreState {
  selectedTaskCode: string;
  estimatedBoardFeet: number;
  maxBudgetPhp: number;
  isCalculating: boolean;
  estimationResult: EstimatorResponsePayload | null;

  // Actions
  setSelectedTaskCode: (code: string) => void;
  setEstimatedBoardFeet: (bdft: number) => void;
  setMaxBudgetPhp: (budget: number) => void;
  calculateEstimate: () => Promise<EstimatorResponsePayload>;
  resetEstimator: () => void;
}

export const useEstimatorStore = create<EstimatorStoreState>((set, get) => ({
  selectedTaskCode: 'ROOF_TRUSS_RAFTER',
  estimatedBoardFeet: 150,
  maxBudgetPhp: 25000,
  isCalculating: false,
  estimationResult: null,

  setSelectedTaskCode: (code) => set({ selectedTaskCode: code }),
  setEstimatedBoardFeet: (bdft) => set({ estimatedBoardFeet: bdft }),
  setMaxBudgetPhp: (budget) => set({ maxBudgetPhp: budget }),

  calculateEstimate: async () => {
    set({ isCalculating: true });
    try {
      const payload: EstimatorRequestPayload = {
        constructionTask: get().selectedTaskCode,
        estimatedBoardFeet: get().estimatedBoardFeet,
        maxBudgetPhp: get().maxBudgetPhp,
      };

      const result = await mockApiClient.calculateBudgetEstimate(payload);

      set({
        isCalculating: false,
        estimationResult: result,
      });

      return result;
    } catch (error) {
      set({ isCalculating: false });
      throw error;
    }
  },

  resetEstimator: () =>
    set({
      selectedTaskCode: 'ROOF_TRUSS_RAFTER',
      estimatedBoardFeet: 150,
      maxBudgetPhp: 25000,
      estimationResult: null,
      isCalculating: false,
    }),
}));
