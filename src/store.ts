import { create } from 'zustand';
import { User } from './types';

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  currentView: 'dashboard',
  setCurrentView: (view) => set({ currentView: view }),
}));

