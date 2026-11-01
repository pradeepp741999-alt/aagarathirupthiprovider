// Aagara Thirupthi Provider — Cloud API Service Client
// Configured for deployed backend: https://aagara-backend.onrender.com/api/v1

import {
  getSyncToken,
  saveAuthSession,
  clearAuthSession,
  touchWebSession,
  isSessionValid,
} from './storage';

export const API_BASE_URL = 'https://aagara-backend.onrender.com/api/v1';
export const APP_ROLE = 'provider';

// Safe storage access that handles permanent mobile persistence & 30-min web sessions
export const tokenStorage = {
  getToken: (): string | null => {
    return getSyncToken();
  },
  setToken: (token: string, refreshToken?: string, authInfo?: any) => {
    saveAuthSession(token, refreshToken, authInfo);
  },
  clearToken: () => {
    clearAuthSession();
  },
};

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  role?: string;
  skipAuth?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  meta?: any;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export async function request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const method = options.method || 'GET';
  const role = options.role || APP_ROLE;

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'X-App-Role': role,
    ...(options.headers || {}),
  };

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (!options.skipAuth) {
    if (!isSessionValid()) {
      tokenStorage.clearToken();
      return {
        success: false,
        error: {
          code: 'SESSION_EXPIRED',
          message: 'Your session has expired (30-minute limit on web). Please log in again.',
        },
      };
    }
    touchWebSession();
    const token = tokenStorage.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  if (options.body) {
    fetchOptions.body = options.body instanceof FormData ? options.body : JSON.stringify(options.body);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout for Render cold starts
    fetchOptions.signal = controller.signal;

    const res = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        error: json.error || {
          code: json.code || `HTTP_${res.status}`,
          message: json.message || `Request failed with status ${res.status}`,
        },
      };
    }
    return json;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return {
        success: false,
        error: {
          code: 'TIMEOUT',
          message: 'Server took too long to respond. The cloud service may be waking up.',
        },
      };
    }
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: err?.message || 'Unable to connect to Aagara cloud server.',
      },
    };
  }
}

// =============================================================================
// PROVIDER API ENDPOINTS
// =============================================================================

export const api = {
  // System Health
  checkHealth: () => request('/health', { skipAuth: true }),

  // Auth Endpoints
  auth: {
    sendOtp: (payload: { mobile?: string; email?: string } | string, email?: string) => {
      let body: any = {};
      if (typeof payload === 'string') {
        if (payload.includes('@')) {
          body.email = payload.trim();
        } else {
          body.mobile = payload.trim();
          if (email) body.email = email.trim();
        }
      } else {
        body = { ...payload };
      }
      return request<{
        mobile?: string;
        email?: string;
        expires_in_seconds?: number;
        resend_available_in_seconds?: number;
        txnId?: string;
      }>('/auth/send-otp', {
        method: 'POST',
        body,
        skipAuth: true,
      });
    },

    verifyOtp: (payload: { mobile?: string; email?: string; otp: string; txnId?: string } | string, otp?: string, txnId?: string) => {
      let body: any = {};
      if (typeof payload === 'string') {
        if (payload.includes('@')) {
          body.email = payload.trim();
        } else {
          body.mobile = payload.trim();
        }
        body.otp = otp;
        if (txnId) body.txnId = txnId;
      } else {
        body = { ...payload };
      }
      return request<{
        token?: string;
        access_token?: string;
        refreshToken?: string;
        refresh_token?: string;
        isNewProvider?: boolean;
        provider: {
          id: string;
          mobile?: string;
          email?: string;
          businessName?: string;
          business_name?: string | null;
          status: string;
          registrationStep?: number;
          registration_step?: number;
        };
      }>('/auth/verify-otp', {
        method: 'POST',
        body,
        skipAuth: true,
      });
    },

    resendOtp: (payload: { mobile?: string; email?: string } | string, email?: string) => {
      let body: any = {};
      if (typeof payload === 'string') {
        if (payload.includes('@')) {
          body.email = payload.trim();
        } else {
          body.mobile = payload.trim();
          if (email) body.email = email.trim();
        }
      } else {
        body = { ...payload };
      }
      return request<{ message?: string }>('/auth/resend-otp', {
        method: 'POST',
        body,
        skipAuth: true,
      });
    },

    refreshToken: (refreshToken: string) =>
      request<{ token?: string; access_token?: string }>('/auth/refresh-token', {
        method: 'POST',
        body: { refreshToken, refresh_token: refreshToken },
        skipAuth: true,
      }),

    logout: () => request('/auth/logout', { method: 'POST' }),
  },

  // Master Data (Categories, Districts, Config)
  master: {
    getCategories: () => request('/categories'),
    getCategoryDetails: () => request('/categories/details'),
    getDistricts: () => request('/districts'),
    getEventTypes: (category?: string) =>
      request(`/config/event-types${category ? `?category=${category}` : ''}`),
    getFaqs: () => request('/support/faqs'),
  },

  // Provider Profile & Settings
  profile: {
    getMe: () => request('/providers/me'),
    updateMe: (data: any) => request('/providers/me', { method: 'PUT', body: data }),
    setOnlineStatus: (isOnline: boolean) =>
      request('/providers/me/online-status', { method: 'PATCH', body: { is_online: isOnline } }),
    getSettings: () => request('/providers/settings'),
    updateSettings: (data: any) => request('/providers/settings', { method: 'PUT', body: data }),
    getDocuments: () => request('/providers/documents'),
    updateDocument: (type: string, data: any) =>
      request(`/providers/documents/${type}`, { method: 'PUT', body: data }),
  },

  // Provider Registration
  registration: {
    getDraft: () => request('/providers/registration/draft'),
    saveStep: (step: number, data: any) =>
      request(`/providers/registration/step/${step}`, { method: 'PUT', body: data }),
    getSummary: () => request('/providers/registration/summary'),
    submit: (termsAccepted: boolean = true) =>
      request('/providers/registration/submit', { method: 'POST', body: { terms_accepted: termsAccepted } }),
    getStatus: () => request('/providers/me/status'),
  },

  // Dashboard & Analytics
  dashboard: {
    getMetrics: () => request('/dashboard/metrics'),
    getAnalyticsOverview: (period?: string) =>
      request(`/analytics/overview${period ? `?period=${period}` : ''}`),
    getRevenueChart: (year?: number) =>
      request(`/analytics/revenue-chart${year ? `?year=${year}` : ''}`),
    getEarningsSummary: () => request('/providers/earnings/summary'),
    getEarningsTransactions: (page: number = 1, limit: number = 20) =>
      request(`/providers/earnings/transactions?page=${page}&limit=${limit}`),
  },

  // Enquiries
  enquiries: {
    getCounts: () => request('/enquiries/counts'),
    list: (params?: { status?: string; search?: string; page?: number; limit?: number }) => {
      const qs = new URLSearchParams();
      if (params?.status && params.status !== 'all') qs.set('status', params.status);
      if (params?.search) qs.set('search', params.search);
      if (params?.page) qs.set('page', String(params.page));
      if (params?.limit) qs.set('limit', String(params.limit));
      const q = qs.toString();
      return request(`/enquiries${q ? `?${q}` : ''}`);
    },
    getById: (id: string) => request(`/enquiries/${id}`),
    updateStatus: (id: string, status: string, note?: string) =>
      request(`/enquiries/${id}/status`, { method: 'PATCH', body: { status, note } }),
    sendQuote: (id: string, payload: { quote_amount: number; valid_until?: string; inclusions?: string[]; terms?: string }) =>
      request(`/enquiries/${id}/quote`, { method: 'POST', body: payload }),
    sendMessage: (id: string, message: string) =>
      request(`/enquiries/${id}/messages`, { method: 'POST', body: { sender: 'provider', message } }),
  },

  // Bookings
  bookings: {
    getCounts: () => request('/bookings/counts'),
    list: (params?: { status?: string; search?: string; page?: number; limit?: number }) => {
      const qs = new URLSearchParams();
      if (params?.status && params.status !== 'all') qs.set('status', params.status);
      if (params?.search) qs.set('search', params.search);
      if (params?.page) qs.set('page', String(params.page));
      if (params?.limit) qs.set('limit', String(params.limit));
      const q = qs.toString();
      return request(`/bookings${q ? `?${q}` : ''}`);
    },
    getById: (id: string) => request(`/bookings/${id}`),
    updateStatus: (id: string, status: string) =>
      request(`/bookings/${id}/status`, { method: 'PATCH', body: { status } }),
    recordPayment: (id: string, payload: { amount: number; payment_method: string; reference_id?: string; notes?: string }) =>
      request(`/bookings/${id}/payments`, { method: 'POST', body: payload }),
    getInvoice: (id: string) => request(`/bookings/${id}/invoice`),
  },

  // CRM
  crm: {
    getStats: () => request('/crm/stats'),
    listCustomers: (params?: { search?: string; tag?: string; page?: number; limit?: number }) => {
      const qs = new URLSearchParams();
      if (params?.search) qs.set('search', params.search);
      if (params?.tag && params.tag !== 'all') qs.set('tag', params.tag);
      if (params?.page) qs.set('page', String(params.page));
      if (params?.limit) qs.set('limit', String(params.limit));
      const q = qs.toString();
      return request(`/crm/customers${q ? `?${q}` : ''}`);
    },
    getCustomerById: (id: string) => request(`/crm/customers/${id}`),
    getCustomerHistory: (id: string) => request(`/crm/customers/${id}/history`),
    getCustomerNotes: (id: string) => request(`/crm/customers/${id}/notes`),
    addCustomerNote: (id: string, note: string) =>
      request(`/crm/customers/${id}/notes`, { method: 'POST', body: { note } }),
  },

  // Catalog: Dishes, Packages, Combos
  catalog: {
    // Dishes
    getDishes: () => request('/providers/dishes'),
    getDishById: (id: string) => request(`/providers/dishes/${id}`),
    createDish: (data: any) => request('/providers/dishes', { method: 'POST', body: data }),
    updateDish: (id: string, data: any) => request(`/providers/dishes/${id}`, { method: 'PUT', body: data }),
    toggleDishStatus: (id: string, isActive: boolean) =>
      request(`/providers/dishes/${id}/status`, { method: 'PATCH', body: { is_active: isActive } }),
    deleteDish: (id: string) => request(`/providers/dishes/${id}`, { method: 'DELETE' }),

    // Packages
    getPackages: () => request('/providers/packages'),
    getPackageById: (id: string) => request(`/providers/packages/${id}`),
    createPackage: (data: any) => request('/providers/packages', { method: 'POST', body: data }),
    updatePackage: (id: string, data: any) => request(`/providers/packages/${id}`, { method: 'PUT', body: data }),
    togglePackageStatus: (id: string, isActive: boolean) =>
      request(`/providers/packages/${id}/status`, { method: 'PATCH', body: { is_active: isActive } }),
    deletePackage: (id: string) => request(`/providers/packages/${id}`, { method: 'DELETE' }),

    // Special Combos
    getCombos: () => request('/providers/combos'),
    getPublicSpecialCombos: () => request('/combos/special'),
    getComboById: (id: string) => request(`/providers/combos/${id}`),
    createCombo: (data: any) => request('/providers/combos', { method: 'POST', body: data }),
    updateCombo: (id: string, data: any) => request(`/providers/combos/${id}`, { method: 'PUT', body: data }),
    toggleComboStatus: (id: string, isActive: boolean) =>
      request(`/providers/combos/${id}/status`, { method: 'PATCH', body: { is_active: isActive } }),
    deleteCombo: (id: string) => request(`/providers/combos/${id}`, { method: 'DELETE' }),
  },

  // Calendar & Availability
  calendar: {
    getMonth: (year: number, month: number) =>
      request(`/providers/availability/month?year=${year}&month=${month}`),
    setDateStatus: (date: string, status: string, note?: string) =>
      request('/providers/availability/date', { method: 'PUT', body: { date, status, note } }),
    bulkSetDates: (startDate: string, endDate: string, status: string, note?: string) =>
      request('/providers/availability/bulk', { method: 'POST', body: { start_date: startDate, end_date: endDate, status, note } }),
  },

  // Reviews
  reviews: {
    list: (params?: { rating?: string; page?: number; limit?: number }) => {
      const qs = new URLSearchParams();
      if (params?.rating && params.rating !== 'all') qs.set('rating', params.rating);
      if (params?.page) qs.set('page', String(params.page));
      if (params?.limit) qs.set('limit', String(params.limit));
      const q = qs.toString();
      return request(`/providers/reviews${q ? `?${q}` : ''}`);
    },
    getSummary: () => request('/providers/reviews/summary'),
    reply: (id: string, replyText: string) =>
      request(`/providers/reviews/${id}/reply`, { method: 'POST', body: { reply_text: replyText } }),
  },

  // Notifications
  notifications: {
    list: () => request('/notifications'),
    markRead: (id: string) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
    markAllRead: () => request('/notifications/mark-all-read', { method: 'PATCH' }),
    remove: (id: string) => request(`/notifications/${id}`, { method: 'DELETE' }),
  },

  // Support
  support: {
    createTicket: (data: { subject: string; category: string; message: string }) =>
      request('/support/tickets', { method: 'POST', body: data }),
    submitEnquiry: (data: { subject: string; message: string }) =>
      request('/support/enquiry', { method: 'POST', body: data }),
  },

  // Media
  media: {
    getUploadUrl: (fileName: string, mimeType: string, category: string = 'general') =>
      request('/media/upload-url', {
        method: 'POST',
        body: { file_name: fileName, mime_type: mimeType, category },
      }),
  },
};
