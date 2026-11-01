import { create } from 'zustand';
import { api, tokenStorage } from '../services/api';
import {
  saveAuthSession,
  getStoredSession,
  clearAuthSession,
  setSessionExpiredHandler,
  saveProviderProfile,
} from '../services/storage';
import { useProviderStore } from './useProviderStore';

export interface ProviderAuthInfo {
  id: string;
  mobile?: string;
  email?: string;
  status: string;
  registration_step?: number;
  registrationStep?: number;
  business_name?: string | null;
  businessName?: string | null;
}

interface AuthState {
  isAuthenticated: boolean;
  isInitializing: boolean;
  token: string | null;
  mobile: string;
  email: string;
  loginType: 'mobile' | 'email';
  txnId: string | null;
  providerInfo: ProviderAuthInfo | null;
  isLoading: boolean;
  error: string | null;
  setLoginIdentifier: (identifier: string, type: 'mobile' | 'email') => void;
  setMobile: (mobile: string) => void;
  setEmail: (email: string) => void;
  completeLogin: (info?: Partial<ProviderAuthInfo>) => void;
  sendOtp: (params: { mobile?: string; email?: string } | string) => Promise<{ success: boolean; message?: string; txnId?: string }>;
  resendOtp: (params?: { mobile?: string; email?: string }) => Promise<{ success: boolean; message?: string }>;
  verifyOtp: (params: { mobile?: string; email?: string; otp: string; txnId?: string } | string, otpOnly?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  checkSession: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isInitializing: true,
  token: null,
  mobile: '',
  email: '',
  loginType: 'mobile',
  txnId: null,
  providerInfo: null,
  isLoading: false,
  error: null,

  setLoginIdentifier: (identifier, type) => {
    if (type === 'email') {
      set({ email: identifier, loginType: 'email', error: null });
    } else {
      set({ mobile: identifier, loginType: 'mobile', error: null });
    }
  },

  setMobile: (mobile) => set({ mobile, loginType: 'mobile', error: null }),
  setEmail: (email) => set({ email, loginType: 'email', error: null }),

  completeLogin: (info) => {
    const demoToken = 'demo-session-token-' + Date.now();
    const authInfo: ProviderAuthInfo = {
      id: info?.id || 'prov-demo',
      mobile: info?.mobile || get().mobile || '9876500001',
      email: info?.email || get().email,
      status: info?.status || 'approved',
      ...info,
    };

    saveAuthSession(demoToken, undefined, authInfo);
    saveProviderProfile(useProviderStore.getState().provider);

    set({
      isAuthenticated: true,
      token: demoToken,
      error: null,
      providerInfo: authInfo,
      mobile: authInfo.mobile || '',
      email: authInfo.email || '',
      isInitializing: false,
    });
  },

  sendOtp: async (params: { mobile?: string; email?: string } | string) => {
    let payload: { mobile?: string; email?: string };
    if (typeof params === 'string') {
      if (params.includes('@')) {
        payload = { email: params.trim() };
      } else {
        payload = { mobile: params.trim() };
      }
    } else {
      payload = params;
    }

    const isEmail = !!payload.email && !payload.mobile;
    set({
      isLoading: true,
      error: null,
      mobile: payload.mobile || '',
      email: payload.email || '',
      loginType: isEmail ? 'email' : 'mobile',
    });

    const res = await api.auth.sendOtp(payload);
    set({ isLoading: false });

    if (!res.success) {
      const err = res.error?.message || 'Failed to send OTP';
      set({ error: err });
      return { success: false, message: err };
    }

    const txnId = (res.data as any)?.txnId || (res as any)?.txnId;
    if (txnId) set({ txnId });

    return { success: true, message: res.message || 'OTP sent successfully', txnId };
  },

  resendOtp: async (params?: { mobile?: string; email?: string }) => {
    const payload = params || (get().loginType === 'email' ? { email: get().email } : { mobile: get().mobile });
    set({ isLoading: true, error: null });
    const res = await api.auth.resendOtp(payload);
    set({ isLoading: false });

    if (!res.success) {
      const err = res.error?.message || 'Failed to resend OTP';
      set({ error: err });
      return { success: false, message: err };
    }
    return { success: true, message: res.message || 'New OTP sent successfully' };
  },

  verifyOtp: async (
    params: { mobile?: string; email?: string; otp: string; txnId?: string } | string,
    otpOnly?: string
  ) => {
    let payload: { mobile?: string; email?: string; otp: string; txnId?: string };
    if (typeof params === 'string') {
      const identifier = params;
      const otp = otpOnly || '';
      if (identifier.includes('@')) {
        payload = { email: identifier.trim(), otp, txnId: get().txnId || undefined };
      } else {
        payload = { mobile: identifier.trim(), otp, txnId: get().txnId || undefined };
      }
    } else {
      payload = {
        ...params,
        txnId: params.txnId || get().txnId || undefined,
      };
    }

    set({ isLoading: true, error: null });
    const res = await api.auth.verifyOtp(payload);
    set({ isLoading: false });

    if (res.success && res.data) {
      const accessToken = res.data.token || res.data.access_token || '';
      const refreshToken = res.data.refreshToken || res.data.refresh_token;
      const rawProvider = res.data.provider;

      const providerAuth: ProviderAuthInfo = {
        id: rawProvider?.id || 'prov-me',
        mobile: rawProvider?.mobile || payload.mobile || get().mobile,
        email: rawProvider?.email || payload.email || get().email,
        status: rawProvider?.status || 'approved',
        registration_step: rawProvider?.registration_step ?? rawProvider?.registrationStep,
        registrationStep: rawProvider?.registrationStep ?? rawProvider?.registration_step,
        business_name: rawProvider?.business_name || rawProvider?.businessName,
        businessName: rawProvider?.businessName || rawProvider?.business_name,
      };

      // Permanently save session on mobile / save 30-min session on web
      await saveAuthSession(accessToken, refreshToken, providerAuth);

      const isNew = res.data.isNewProvider === true ||
        (!providerAuth.businessName && !providerAuth.business_name) ||
        (providerAuth.registrationStep !== undefined && providerAuth.registrationStep < 7 && providerAuth.status === 'draft');

      if (isNew) {
        useProviderStore.getState().startFresh();
        useProviderStore.getState().updateProvider({
          mobile: providerAuth.mobile || '',
          whatsapp: providerAuth.mobile || '',
          status: 'draft',
          registrationStep: providerAuth.registrationStep || 0,
        });
      } else {
        if (rawProvider) {
          useProviderStore.getState().updateFromBackend(rawProvider);
          useProviderStore.getState().fetchProfile();
        }
      }

      set({
        isAuthenticated: true,
        token: accessToken,
        providerInfo: providerAuth,
        mobile: providerAuth.mobile || '',
        email: providerAuth.email || '',
        error: null,
        isInitializing: false,
      });

      return { success: true, message: res.message || 'Verified successfully' };
    }

    // Demo / offline fallback if OTP is 123456
    if (payload.otp === '123456') {
      const isExisting = payload.mobile === '9876500001' || (payload.mobile && payload.mobile.endsWith('1')) || payload.email === 'partner@aagara.com';
      const demoToken = 'demo-session-token-' + Date.now();
      const mockProvider: ProviderAuthInfo = {
        id: isExisting ? 'prov-101' : `prov-${Date.now()}`,
        mobile: payload.mobile || (isExisting ? '9876500001' : '9876543210'),
        email: payload.email || (isExisting ? 'partner@aagara.com' : 'provider@aagara.com'),
        status: isExisting ? 'approved' : 'draft',
        registration_step: isExisting ? 7 : 0,
        registrationStep: isExisting ? 7 : 0,
        business_name: isExisting ? 'Sree Annapoorna Catering' : undefined,
        businessName: isExisting ? 'Sree Annapoorna Catering' : undefined,
      };

      await saveAuthSession(demoToken, undefined, mockProvider);

      if (!isExisting) {
        useProviderStore.getState().startFresh();
        useProviderStore.getState().updateProvider({
          mobile: mockProvider.mobile,
          whatsapp: mockProvider.mobile,
        });
      } else {
        useProviderStore.getState().loadDemoProvider();
        useProviderStore.getState().updateProvider({
          mobile: mockProvider.mobile,
          status: 'approved',
          registrationStep: 7,
        });
      }

      set({
        isAuthenticated: true,
        token: demoToken,
        providerInfo: mockProvider,
        mobile: mockProvider.mobile || '',
        email: mockProvider.email || '',
        error: null,
        isInitializing: false,
      });

      return { success: true, message: 'Verified successfully (Demo)' };
    }

    const err = res.error?.message || 'Invalid or expired OTP';
    set({ error: err });
    return { success: false, message: err };
  },

  logout: async () => {
    try {
      await api.auth.logout();
    } catch {
      // Ignore network errors on logout
    }
    await clearAuthSession();
    set({
      isAuthenticated: false,
      token: null,
      mobile: '',
      email: '',
      providerInfo: null,
      error: null,
      isInitializing: false,
    });
    useProviderStore.getState().startFresh();
  },

  checkSession: async () => {
    try {
      // Read saved session (permanent from AsyncStorage on mobile, 30-min checked on web)
      const session = await getStoredSession();

      if (!session.token) {
        set({
          isAuthenticated: false,
          token: null,
          providerInfo: null,
          isInitializing: false,
        });
        return false;
      }

      // Restore session immediately
      set({
        isAuthenticated: true,
        token: session.token,
        providerInfo: session.authInfo,
        mobile: session.authInfo?.mobile || '',
        email: session.authInfo?.email || '',
        isInitializing: false,
      });

      // Restore saved provider profile immediately
      if (session.providerProfile) {
        useProviderStore.getState().restoreSavedProfile(session.providerProfile);
      }

      // Refresh live profile in background
      api.profile.getMe().then((res) => {
        if (res.success && res.data) {
          set({
            providerInfo: res.data,
            mobile: res.data.mobile || get().mobile,
            email: res.data.email || get().email,
          });
          useProviderStore.getState().updateFromBackend(res.data);
          saveAuthSession(session.token!, session.refreshToken || undefined, res.data);
        } else if (res.error?.code === 'UNAUTHORIZED' || res.error?.code === 'SESSION_EXPIRED') {
          get().logout();
        }
      }).catch(() => {
        // Offline or server asleep, keep existing offline session
      });

      return true;
    } catch (e) {
      set({ isInitializing: false });
      return false;
    }
  },
}));

// Auto-trigger logout when web 30-minute inactivity timer expires
setSessionExpiredHandler(() => {
  useAuthStore.getState().logout();
});
