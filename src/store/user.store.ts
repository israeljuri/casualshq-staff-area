import { create } from 'zustand';
import { UserState } from '@/types';

const initialState = {
  user: null,
  timesheets: null,
};

export const useUserStore = create<UserState>((set) => ({
  ...initialState,

  setUser: (user: UserState['user']) => set({ user }),

  setTimesheets: (timesheets: UserState['timesheets']) => set({ timesheets }),
}));
