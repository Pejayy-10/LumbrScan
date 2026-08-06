// LumbrScan Onboarding Persistence Zustand Store

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OnboardingStoreState {
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingStoreState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,

      completeOnboarding: () => set({ hasCompletedOnboarding: true }),

      resetOnboarding: () => set({ hasCompletedOnboarding: false }),
    }),
    {
      name: '@lumbrscan_onboarding_v1',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
