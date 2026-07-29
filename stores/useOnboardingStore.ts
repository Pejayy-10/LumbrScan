// LumbrScan Onboarding Persistence Zustand Store

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
      storage: createJSONStorage(() => {
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            return window.localStorage;
          }
        } catch (e) {}
        const memoryStorage = new Map<string, string>();
        return {
          getItem: (name: string) => memoryStorage.get(name) || null,
          setItem: (name: string, value: string) => memoryStorage.set(name, value),
          removeItem: (name: string) => memoryStorage.delete(name),
        };
      }),
    }
  )
);
