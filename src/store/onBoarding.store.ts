import { create } from 'zustand';
import { OnboardingState } from '@/types';

const initialState = {
  stage: 'EMAIL_VERIFICATION' as OnboardingState['stage'],
  tokenId: null,
  password: null,

  personalInformation: null,
  address: null,
  emergencyContactInformation: null,
  financialInformation: null,
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialState,

  setPassword: (password) => set({ password }),

  setToken: (tokenId) => set({ tokenId }),

  setStage: (stage: OnboardingState['stage']) => set({ stage }),

  setPersonalInformationData: (data) =>
    set((state) => ({
      personalInformation: { ...state.personalInformation, ...data }, // Merge data in case of partial updates
      stage: 'ADDRESS' as OnboardingState['stage'], // Move to step ADDRESS after setting personal information data
    })),

  setAddressData: (data) =>
    set((state) => ({
      address: { ...state.address, ...data }, // Merge data in case of partial updates
      stage: 'EMERGENCY_CONTACT' as OnboardingState['stage'], // Move to step EMERGENCY_CONTACT after setting address data
    })),

  setEmergencyContactInformationData: (data) =>
    set((state) => ({
      emergencyContactInformation: {
        ...state.emergencyContactInformation,
        ...data,
      }, // Merge data in case of partial updates
      stage: 'FINANCIAL_INFORMATION' as OnboardingState['stage'], // Move to step FINANCIAL_INFORMATION after setting emergency contact information data
    })),

  setFinancialInformationData: (data) =>
    set((state) => ({
      financialInformation: { ...state.financialInformation, ...data }, // Merge data in case of partial updates
      stage: 'COMPLETED' as OnboardingState['stage'], // Move to step COMPLETED after setting financial information data
    })),
}));
