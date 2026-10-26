import { create } from 'zustand';
import { api, tokenStorage } from '../services/api';
import { useProviderStore } from './useProviderStore';

interface ProviderAuthInfo {
  id: string;
  mobile: string;
  status: string;
  registration_step?: number;
  business_name?: string | null;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  mobile: string;
  providerInfo: ProviderAuthInfo | null;
  isLoading: boolean;
  error: string | null;
  setMobile: (mobile: string) => void;
  completeLogin: (info?: Partial<ProviderAuthInfo>) => void;
  sendOtp: (mobile: string) => Promise<{ success: boolean; message?: string }>;
  verifyOtp: (mobile: string, otp: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  checkSession: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: !!tokenStorage.getToken(),
  token: tokenStorage.getToken(),
  mobile: '',
  providerInfo: null,
  isLoading: false,
  error: null,

  setMobile: (mobile) => set({ mobile, error: null }),

  completeLogin: (info) => {
    set({
      isAuthenticated: true,
      error: null,
      providerInfo: info ? { id: info.id || 'prov-demo', mobile: info.mobile || get().mobile, status: info.status || 'approved', ...info } : null,
    });
  },

  sendOtp: async (mobile: string) => {
    set({ isLoading: true, error: null, mobile });
    const res = await api.auth.sendOtp(mobile);
    set({ isLoading: false });
    if (!res.success) {
      const err = res.error?.message || 'Failed to send OTP';
      set({ error: err });
      return { success: false, message: err };
    }
    return { success: true, message: res.message || 'OTP sent successfully' };
  },

  verifyOtp: async (mobile: string, otp: string) => {
    set({ isLoading: true, error: null });
    const res = await api.auth.verifyOtp(mobile, otp);
    set({ isLoading: false });

    if (!res.success || !res.data) {
      const err = res.error?.message || 'Invalid or expired OTP';
      set({ error: err });
      return { success: false, message: err };
    }

    const { access_token, refresh_token, provider } = res.data;
    tokenStorage.setToken(access_token, refresh_token);

    set({
      isAuthenticated: true,
      token: access_token,
      providerInfo: provider,
      error: null,
    });

    // Sync with provider store
    if (provider) {
      useProviderStore.getState().updateFromBackend(provider);
      // Fetch fresh profile from cloud
      useProviderStore.getState().fetchProfile();
    }

    return { success: true, message: 'Verified successfully' };
  },

  logout: async () => {
    try {
      await api.auth.logout();
    } catch {
      // Ignore network errors on logout
    }
    tokenStorage.clearToken();
    set({
      isAuthenticated: false,
      token: null,
      mobile: '',
      providerInfo: null,
      error: null,
    });
    useProviderStore.getState().startFresh();
  },

  checkSession: async () => {
    const token = tokenStorage.getToken();
    if (!token) {
      set({ isAuthenticated: false, token: null });
      return false;
    }
    try {
      const res = await api.profile.getMe();
      if (res.success && res.data) {
        set({
          isAuthenticated: true,
          providerInfo: res.data,
          mobile: res.data.mobile || '',
        });
        useProviderStore.getState().updateFromBackend(res.data);
        return true;
      } else {
        tokenStorage.clearToken();
        set({ isAuthenticated: false, token: null });
        return false;
      }
    } catch {
      return !!tokenStorage.getToken();
    }
  },
}));
