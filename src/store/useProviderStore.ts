import { create } from 'zustand';
import { BankDetails, DocumentItem, ProviderProfile, ServiceArea } from '../data/types';
import { seedProvider } from '../data/seed';
import { api } from '../services/api';
import { saveProviderProfile } from '../services/storage';

const blankProvider: ProviderProfile = {
  id: 'prov-new',
  businessName: '',
  ownerName: '',
  mobile: '',
  whatsapp: '',
  category: '' as any,
  secondaryCategories: [],
  tagline: '',
  description: '',
  coverImage: '',
  logoColor: '#0E7C7B',
  district: '',
  areas: [],
  serviceAreas: [],
  minCapacity: 0,
  maxCapacity: 0,
  pricingModel: '' as any,
  startingPrice: 0,
  veg: '' as any,
  yearsActive: 0,
  status: 'draft',
  verified: false,
  rating: 0,
  reviewCount: 0,
  responseTime: 'Usually responds within a day',
  documents: [
    { id: 'doc-id', label: 'Owner ID Proof (Aadhaar / PAN)', required: true, status: 'missing', fileName: undefined },
    { id: 'doc-address', label: 'Business Address Proof', required: true, status: 'missing', fileName: undefined },
    { id: 'doc-trade', label: 'Trade License (optional)', required: false, status: 'missing', fileName: undefined },
    { id: 'doc-fssai', label: 'FSSAI Certificate (optional)', required: false, status: 'missing', fileName: undefined },
    { id: 'doc-gst', label: 'GST Certificate (optional)', required: false, status: 'missing', fileName: undefined },
  ],
  bankDetails: { accountHolder: '', accountNumber: '', ifsc: '' },
  registrationStep: 0,
  portfolio: [],
};

export const registrationSteps = [
  'Business Info',
  'Category',
  'Service Details',
  'Pricing',
  'Coverage Area',
  'Documents',
  'Review',
];

interface ProviderState {
  provider: ProviderProfile;
  demoMode: boolean;
  isLoading: boolean;
  error: string | null;
  loadDemoProvider: () => void;
  startFresh: () => void;
  restoreSavedProfile: (saved: Partial<ProviderProfile>) => void;
  updateProvider: (patch: Partial<ProviderProfile>) => void;
  setServiceAreas: (areas: ServiceArea[]) => void;
  setBankDetails: (bank: BankDetails) => void;
  setDocumentStatus: (docId: string, status: DocumentItem['status'], fileName?: string) => void;
  goToStep: (step: number) => void;
  submitForApproval: () => Promise<boolean>;
  fetchProfile: () => Promise<void>;
  fetchRegistrationDraft: () => Promise<void>;
  saveStepToCloud: (step: number, data: any) => Promise<boolean>;
  updateFromBackend: (backendData: any) => void;
}

export const useProviderStore = create<ProviderState>((set, get) => ({
  provider: blankProvider,
  demoMode: false,
  isLoading: false,
  error: null,

  loadDemoProvider: () => {
    saveProviderProfile(seedProvider);
    set({ provider: seedProvider, demoMode: true });
  },

  startFresh: () => {
    saveProviderProfile(null);
    set({ provider: blankProvider, demoMode: false });
  },

  restoreSavedProfile: (saved) => {
    if (saved) {
      set((s) => ({ provider: { ...s.provider, ...saved } }));
    }
  },

  updateProvider: (patch) => {
    set((s) => {
      const updated = { ...s.provider, ...patch };
      saveProviderProfile(updated);
      return { provider: updated };
    });
  },

  setServiceAreas: (serviceAreas) => {
    set((s) => {
      const updated = { ...s.provider, serviceAreas };
      saveProviderProfile(updated);
      return { provider: updated };
    });
  },

  setBankDetails: (bankDetails) => {
    set((s) => {
      const updated = { ...s.provider, bankDetails };
      saveProviderProfile(updated);
      return { provider: updated };
    });
  },

  setDocumentStatus: (docId, status, fileName) => {
    set((s) => {
      const updated = {
        ...s.provider,
        documents: s.provider.documents.map((d) => (d.id === docId ? { ...d, status, fileName: fileName ?? d.fileName } : d)),
      };
      saveProviderProfile(updated);
      return { provider: updated };
    });
  },

  goToStep: (registrationStep) => {
    set((s) => {
      const updated = { ...s.provider, registrationStep };
      saveProviderProfile(updated);
      return { provider: updated };
    });
  },

  updateFromBackend: (b: any) => {
    if (!b) return;
    set((s) => {
      const updated: ProviderProfile = {
        ...s.provider,
        id: b.id || s.provider.id,
        businessName: b.business_name ?? b.businessName ?? s.provider.businessName,
        ownerName: b.owner_name ?? b.ownerName ?? s.provider.ownerName,
        mobile: b.mobile ?? s.provider.mobile,
        whatsapp: b.whatsapp ?? s.provider.whatsapp,
        email: b.email ?? s.provider.email,
        category: b.category ?? s.provider.category,
        secondaryCategories: b.secondary_categories ?? b.secondaryCategories ?? s.provider.secondaryCategories,
        tagline: b.tagline ?? s.provider.tagline,
        description: b.description ?? s.provider.description,
        coverImage: b.cover_image ?? b.coverImage ?? s.provider.coverImage,
        logoColor: b.logo_color ?? b.logoColor ?? s.provider.logoColor,
        district: b.district ?? s.provider.district,
        areas: b.areas ?? s.provider.areas,
        minCapacity: b.min_capacity ?? b.minCapacity ?? s.provider.minCapacity,
        maxCapacity: b.max_capacity ?? b.maxCapacity ?? s.provider.maxCapacity,
        pricingModel: b.pricing_model ?? b.pricingModel ?? s.provider.pricingModel,
        startingPrice: b.starting_price ?? b.startingPrice ?? s.provider.startingPrice,
        veg: (b.veg_preference || b.veg || s.provider.veg) as any,
        yearsActive: b.years_active ?? b.yearsActive ?? s.provider.yearsActive,
        status: b.status ?? s.provider.status,
        verified: b.verified !== undefined ? Boolean(b.verified) : s.provider.verified,
        rating: b.rating ? Number(b.rating) : s.provider.rating,
        reviewCount: b.review_count ? Number(b.review_count) : s.provider.reviewCount,
        registrationStep: b.registration_step !== undefined ? Number(b.registration_step) : s.provider.registrationStep,
      };
      saveProviderProfile(updated);
      return { provider: updated };
    });
  },

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    const res = await api.profile.getMe();
    set({ isLoading: false });
    if (res.success && res.data) {
      get().updateFromBackend(res.data);
    }
  },

  fetchRegistrationDraft: async () => {
    set({ isLoading: true, error: null });
    const res = await api.registration.getDraft();
    set({ isLoading: false });
    if (res.success && res.data) {
      get().updateFromBackend(res.data);
    }
  },

  saveStepToCloud: async (step: number, data: any) => {
    set({ isLoading: true, error: null });
    const res = await api.registration.saveStep(step, data);
    set({ isLoading: false });
    if (res.success) {
      set((s) => {
        const updated = {
          ...s.provider,
          ...data,
          registrationStep: Math.max(s.provider.registrationStep, step),
        };
        saveProviderProfile(updated);
        return { provider: updated };
      });
      return true;
    } else {
      set({ error: res.error?.message || `Failed to save step ${step}` });
      return false;
    }
  },

  submitForApproval: async () => {
    set({ isLoading: true, error: null });
    const res = await api.registration.submit(true);
    set({ isLoading: false });
    if (res.success) {
      set((s) => {
        const updated: ProviderProfile = {
          ...s.provider,
          status: 'under_review',
          registrationStep: registrationSteps.length,
        };
        saveProviderProfile(updated);
        return { provider: updated };
      });
      return true;
    } else {
      // Fallback local update if API not available
      set((s) => {
        const updated: ProviderProfile = {
          ...s.provider,
          status: 'under_review',
          registrationStep: registrationSteps.length,
        };
        saveProviderProfile(updated);
        return { provider: updated };
      });
      return false;
    }
  },
}));
