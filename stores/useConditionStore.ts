// LumbrScan Physical Condition Defect Assessment Zustand Store

import { create } from 'zustand';
import { SeverityLevel, FprdiGroupCode } from '../types';

export interface ConditionStoreState {
  hasDecayOrRot: boolean;
  hasEndSplitting: boolean;
  hasWarping: boolean;
  hasUnsoundKnots: boolean;
  hasInsectBoreholes: boolean;
  defectSeverity: SeverityLevel;

  // Actions
  toggleDecayOrRot: () => void;
  toggleEndSplitting: () => void;
  toggleWarping: () => void;
  toggleUnsoundKnots: () => void;
  toggleInsectBoreholes: () => void;
  setDefectSeverity: (severity: SeverityLevel) => void;
  resetCondition: () => void;
  getTotalPenalty: () => number;
  getEffectiveFprdiGroup: (nominalGroup: FprdiGroupCode) => FprdiGroupCode;
  getConditionFlags: () => {
    hasDecayOrRot: boolean;
    hasEndSplitting: boolean;
    hasWarping: boolean;
    hasUnsoundKnots: boolean;
    hasInsectBoreholes: boolean;
    defectSeverity: SeverityLevel;
  };
}

export const useConditionStore = create<ConditionStoreState>((set, get) => ({
  hasDecayOrRot: false,
  hasEndSplitting: false,
  hasWarping: false,
  hasUnsoundKnots: false,
  hasInsectBoreholes: false,
  defectSeverity: 'NONE',

  toggleDecayOrRot: () =>
    set((state) => ({
      hasDecayOrRot: !state.hasDecayOrRot,
      defectSeverity: state.defectSeverity === 'NONE' ? 'MODERATE' : state.defectSeverity,
    })),
  toggleEndSplitting: () =>
    set((state) => ({
      hasEndSplitting: !state.hasEndSplitting,
      defectSeverity: state.defectSeverity === 'NONE' ? 'LOW' : state.defectSeverity,
    })),
  toggleWarping: () =>
    set((state) => ({
      hasWarping: !state.hasWarping,
      defectSeverity: state.defectSeverity === 'NONE' ? 'LOW' : state.defectSeverity,
    })),
  toggleUnsoundKnots: () =>
    set((state) => ({
      hasUnsoundKnots: !state.hasUnsoundKnots,
      defectSeverity: state.defectSeverity === 'NONE' ? 'LOW' : state.defectSeverity,
    })),
  toggleInsectBoreholes: () =>
    set((state) => ({
      hasInsectBoreholes: !state.hasInsectBoreholes,
      defectSeverity: state.defectSeverity === 'NONE' ? 'MODERATE' : state.defectSeverity,
    })),
  setDefectSeverity: (severity) => set({ defectSeverity: severity }),

  resetCondition: () =>
    set({
      hasDecayOrRot: false,
      hasEndSplitting: false,
      hasWarping: false,
      hasUnsoundKnots: false,
      hasInsectBoreholes: false,
      defectSeverity: 'NONE',
    }),

  getTotalPenalty: () => {
    let penalty = 0;
    if (get().hasDecayOrRot) penalty += 2;
    if (get().hasEndSplitting) penalty += 1;
    if (get().hasWarping) penalty += 1;
    if (get().hasUnsoundKnots) penalty += 1;
    if (get().hasInsectBoreholes) penalty += 1;
    return penalty;
  },

  getEffectiveFprdiGroup: (nominalGroup: FprdiGroupCode): FprdiGroupCode => {
    const penalty = get().getTotalPenalty();
    const groups: FprdiGroupCode[] = ['GROUP_I', 'GROUP_II', 'GROUP_III', 'GROUP_IV'];
    const idx = groups.indexOf(nominalGroup);
    const effectiveIdx = Math.min(idx + penalty, groups.length - 1);
    return groups[effectiveIdx];
  },

  getConditionFlags: () => ({
    hasDecayOrRot: get().hasDecayOrRot,
    hasEndSplitting: get().hasEndSplitting,
    hasWarping: get().hasWarping,
    hasUnsoundKnots: get().hasUnsoundKnots,
    hasInsectBoreholes: get().hasInsectBoreholes,
    defectSeverity: get().defectSeverity,
  }),
}));
