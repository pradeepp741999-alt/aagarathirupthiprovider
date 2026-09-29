import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  mobile: string;
  setMobile: (mobile: string) => void;
  completeLogin: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  mobile: '',
  setMobile: (mobile) => set({ mobile }),
  completeLogin: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false, mobile: '' }),
}));
