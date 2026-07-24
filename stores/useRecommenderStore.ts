// LumbrScan Two-Way Recommender Engine Zustand Store

import { create } from 'zustand';
import { TaskToMaterialResult } from '../types';
import { mockApiClient } from '../services/mockApiClient';

export type RecommenderMode = 'TASK_TO_MATERIAL' | 'MATERIAL_TO_TASK';

export interface RecommenderStoreState {
  mode: RecommenderMode;
  selectedApplicationCode: string;
  selectedSpeciesId: string | null;
  budgetFilter: 'ALL' | 'LOW' | 'MEDIUM' | 'HIGH';
  isSearching: boolean;
  taskResult: TaskToMaterialResult | null;

  // Actions
  setMode: (mode: RecommenderMode) => void;
  setApplicationCode: (code: string) => void;
  setSpeciesId: (speciesId: string | null) => void;
  setBudgetFilter: (budget: RecommenderStoreState['budgetFilter']) => void;
  fetchTaskRecommendations: () => Promise<TaskToMaterialResult>;
  resetRecommender: () => void;
}

export const useRecommenderStore = create<RecommenderStoreState>((set, get) => ({
  mode: 'TASK_TO_MATERIAL',
  selectedApplicationCode: 'HEAVY_STRUCTURAL_BEAM',
  selectedSpeciesId: null,
  budgetFilter: 'ALL',
  isSearching: false,
  taskResult: null,

  setMode: (mode) => set({ mode }),
  setApplicationCode: (code) => set({ selectedApplicationCode: code }),
  setSpeciesId: (id) => set({ selectedSpeciesId: id }),
  setBudgetFilter: (budget) => set({ budgetFilter: budget }),

  fetchTaskRecommendations: async () => {
    set({ isSearching: true });
    try {
      const result = await mockApiClient.getRecommendationForTask(
        get().selectedApplicationCode,
        get().budgetFilter
      );
      set({ isSearching: false, taskResult: result });
      return result;
    } catch (error) {
      set({ isSearching: false });
      throw error;
    }
  },

  resetRecommender: () =>
    set({
      mode: 'TASK_TO_MATERIAL',
      selectedApplicationCode: 'HEAVY_STRUCTURAL_BEAM',
      selectedSpeciesId: null,
      budgetFilter: 'ALL',
      taskResult: null,
      isSearching: false,
    }),
}));
