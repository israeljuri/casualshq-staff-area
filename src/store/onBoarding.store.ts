import { create } from 'zustand';
import { OnboardingState } from '@/types';

const initialState = {
  currentStep: 1,
  account: null,
  password: null,
  personalInformation: null,
  financialInformation: null,
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialState,

  setAccount: (account) => set({ account }), // Move to step 2 after setting email
  setPassword: (password) => set({ password, currentStep: 2 }), // Move to step 2 after setting email

  setPersonalInformationData: (data) =>
    set((state) => ({
      personalInformation: { ...state.personalInformation, ...data }, // Merge data in case of partial updates
      currentStep: 3, // Move to step 3 after setting org data
    })),

  setFinancialInformationData: (data) =>
    set((state) => ({
      financialInformation: { ...state.financialInformation, ...data }, // Merge data in case of partial updates
      currentStep: 4, // Move to step 3 after setting org data
    })),

  goToStep: (step) => set({ currentStep: step }),

  goToNextStep: () =>
    set((state) => ({ currentStep: Math.min(state.currentStep + 1, 3) })), // Assuming 3 steps max for now

  goToPreviousStep: () =>
    set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

  resetOnboarding: () => set(initialState),
}));
