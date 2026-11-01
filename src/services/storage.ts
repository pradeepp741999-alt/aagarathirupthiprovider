import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const IS_WEB = Platform.OS === 'web';

// Web session validity: 30 minutes (1800000 ms)
export const WEB_SESSION_TIMEOUT_MS = 30 * 60 * 1000;

export const STORAGE_KEYS = {
  TOKEN: 'aagara_provider_token',
  REFRESH_TOKEN: 'aagara_provider_refresh_token',
  AUTH_INFO: 'aagara_provider_auth_info',
  PROVIDER_PROFILE: 'aagara_provider_profile',
  WEB_SESSION_START: 'aagara_web_session_start',
  WEB_LAST_ACTIVE: 'aagara_web_last_active',
};

export interface StoredSession {
  token: string | null;
  refreshToken: string | null;
  authInfo: any | null;
  providerProfile: any | null;
}

// In-memory cache for synchronous token access during HTTP calls
let memoryToken: string | null = null;
let memoryRefreshToken: string | null = null;
let memoryAuthInfo: any | null = null;

let onSessionExpiredCallback: (() => void) | null = null;

export const setSessionExpiredHandler = (callback: () => void) => {
  onSessionExpiredCallback = callback;
};

/**
 * Checks if the current web session has exceeded the 30-minute inactivity limit.
 * On mobile apps, returns true (permanent access until uninstall or explicit logout).
 */
export const isSessionValid = (): boolean => {
  if (!IS_WEB) {
    // Mobile app: permanent storage
    return true;
  }

  if (typeof window === 'undefined' || !window.localStorage) {
    return true;
  }

  const token = window.localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (!token) {
    return false;
  }

  const lastActiveStr = window.localStorage.getItem(STORAGE_KEYS.WEB_LAST_ACTIVE);
  if (!lastActiveStr) {
    return false;
  }

  const lastActive = parseInt(lastActiveStr, 10);
  if (isNaN(lastActive)) {
    return false;
  }

  const elapsed = Date.now() - lastActive;
  if (elapsed > WEB_SESSION_TIMEOUT_MS) {
    // Session expired (> 30 mins)
    return false;
  }

  return true;
};

/**
 * Touches the web session to refresh the 30-minute inactivity timer.
 */
export const touchWebSession = () => {
  if (!IS_WEB || typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  const token = window.localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (!token) return;

  if (!isSessionValid()) {
    clearAuthSession();
    if (onSessionExpiredCallback) {
      onSessionExpiredCallback();
    }
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.WEB_LAST_ACTIVE, String(Date.now()));
};

/**
 * Save auth session (tokens + user auth info).
 * On mobile: saved permanently to AsyncStorage (persists across restarts until uninstall).
 * On web: saved with 30-minute session expiry tracking.
 */
export const saveAuthSession = async (token: string, refreshToken?: string, authInfo?: any) => {
  memoryToken = token;
  if (refreshToken) memoryRefreshToken = refreshToken;
  if (authInfo) memoryAuthInfo = authInfo;

  if (IS_WEB) {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      if (refreshToken) {
        window.localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
      if (authInfo) {
        window.localStorage.setItem(STORAGE_KEYS.AUTH_INFO, JSON.stringify(authInfo));
      }
      const now = String(Date.now());
      window.localStorage.setItem(STORAGE_KEYS.WEB_LAST_ACTIVE, now);
      window.localStorage.setItem(STORAGE_KEYS.WEB_SESSION_START, now);
    }
  } else {
    // Mobile: permanent native storage via AsyncStorage
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
      if (refreshToken) {
        await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
      if (authInfo) {
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_INFO, JSON.stringify(authInfo));
      }
    } catch (e) {
      console.warn('Failed to save auth to AsyncStorage', e);
    }
  }
};

/**
 * Save the entire provider profile to storage so registration/business details
 * are immediately restored on app launch without needing to log in again.
 */
export const saveProviderProfile = async (profile: any) => {
  if (!profile) return;
  const json = JSON.stringify(profile);

  if (IS_WEB) {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEYS.PROVIDER_PROFILE, json);
    }
  } else {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PROVIDER_PROFILE, json);
    } catch (e) {
      console.warn('Failed to save profile to AsyncStorage', e);
    }
  }
};

/**
 * Retrieve the saved session from persistent storage.
 */
export const getStoredSession = async (): Promise<StoredSession> => {
  if (IS_WEB) {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { token: null, refreshToken: null, authInfo: null, providerProfile: null };
    }

    if (!isSessionValid()) {
      await clearAuthSession();
      return { token: null, refreshToken: null, authInfo: null, providerProfile: null };
    }

    // Session is valid, refresh last active time
    touchWebSession();

    const token = window.localStorage.getItem(STORAGE_KEYS.TOKEN);
    const refreshToken = window.localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    const authInfoStr = window.localStorage.getItem(STORAGE_KEYS.AUTH_INFO);
    const profileStr = window.localStorage.getItem(STORAGE_KEYS.PROVIDER_PROFILE);

    memoryToken = token;
    memoryRefreshToken = refreshToken;

    let authInfo = null;
    let providerProfile = null;
    try {
      if (authInfoStr) authInfo = JSON.parse(authInfoStr);
      if (profileStr) providerProfile = JSON.parse(profileStr);
    } catch {}

    memoryAuthInfo = authInfo;

    return { token, refreshToken, authInfo, providerProfile };
  } else {
    // Mobile: read from AsyncStorage
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      const authInfoStr = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_INFO);
      const profileStr = await AsyncStorage.getItem(STORAGE_KEYS.PROVIDER_PROFILE);

      memoryToken = token;
      memoryRefreshToken = refreshToken;

      let authInfo = null;
      let providerProfile = null;
      try {
        if (authInfoStr) authInfo = JSON.parse(authInfoStr);
        if (profileStr) providerProfile = JSON.parse(profileStr);
      } catch {}

      memoryAuthInfo = authInfo;

      return { token, refreshToken, authInfo, providerProfile };
    } catch (e) {
      console.warn('Failed to read session from AsyncStorage', e);
      return { token: null, refreshToken: null, authInfo: null, providerProfile: null };
    }
  }
};

/**
 * Clear all auth and profile details from persistent storage (called on explicit Logout or Web session timeout).
 */
export const clearAuthSession = async () => {
  memoryToken = null;
  memoryRefreshToken = null;
  memoryAuthInfo = null;

  if (IS_WEB) {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEYS.TOKEN);
      window.localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      window.localStorage.removeItem(STORAGE_KEYS.AUTH_INFO);
      window.localStorage.removeItem(STORAGE_KEYS.PROVIDER_PROFILE);
      window.localStorage.removeItem(STORAGE_KEYS.WEB_SESSION_START);
      window.localStorage.removeItem(STORAGE_KEYS.WEB_LAST_ACTIVE);
    }
  } else {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_INFO);
      await AsyncStorage.removeItem(STORAGE_KEYS.PROVIDER_PROFILE);
    } catch (e) {
      console.warn('Failed to clear AsyncStorage', e);
    }
  }
};

/**
 * Synchronous token getter for HTTP request headers.
 */
export const getSyncToken = (): string | null => {
  if (IS_WEB) {
    if (!isSessionValid()) {
      clearAuthSession();
      return null;
    }
    touchWebSession();
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(STORAGE_KEYS.TOKEN);
    }
  }
  return memoryToken;
};

// Start web session activity listeners and idle checking interval
if (IS_WEB && typeof window !== 'undefined') {
  let lastThrottle = 0;
  const onUserActivity = () => {
    const now = Date.now();
    if (now - lastThrottle > 15000) {
      // Throttle updates to once every 15 seconds
      lastThrottle = now;
      touchWebSession();
    }
  };

  window.addEventListener('mousemove', onUserActivity, { passive: true });
  window.addEventListener('keydown', onUserActivity, { passive: true });
  window.addEventListener('click', onUserActivity, { passive: true });
  window.addEventListener('scroll', onUserActivity, { passive: true });
  window.addEventListener('touchstart', onUserActivity, { passive: true });

  // Check every 30 seconds if the session has expired
  setInterval(() => {
    const token = window.localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token && !isSessionValid()) {
      clearAuthSession();
      if (onSessionExpiredCallback) {
        onSessionExpiredCallback();
      }
    }
  }, 30000);
}
