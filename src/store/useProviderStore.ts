import { create } from 'zustand';
import { BankDetails, DocumentItem, ProviderProfile, ServiceArea } from '../data/types';
import { seedProvider } from '../data/seed';

// A fresh signup starts empty; a returning demo provider (seedProvider) is
// used to showcase the fully-approved app experience. `startFresh` switches
// between the two so both the registration journey and the live app can be
// demoed from the same build.
const blankProvider: ProviderProfile = {
  id: 'prov-new',
  businessName: '',
  ownerName: '',
  mobile: '',
  whatsapp: '',
  category: 'catering',
  secondaryCategories: [],
  tagline: '',
  description: '',
  coverImage: '',
  logoColor: '#0E7C7B',
  district: '',
  areas: [],
  serviceAreas: [],
  minCapacity: 50,
  maxCapacity: 500,
  pricingModel: 'per_person',
  startingPrice: 0,
  veg: 'both',
  yearsActive: 0,
  status: 'draft',
  verified: false,
  rating: 0,
  reviewCount: 0,
  responseTime: 'Usually responds within a day',
  documents: [
    { id: 'doc-id', label: 'Owner ID Proof (Aadhaar / PAN)', required: true, status: 'missing' },
    { id: 'doc-fssai', label: 'FSSAI / Trade License', required: true, status: 'missing' },
    { id: 'doc-address', label: 'Business Address Proof', required: true, status: 'missing' },
    { id: 'doc-bank', label: 'Bank Proof (Passbook / Cancelled Cheque)', required: true, status: 'missing' },
    { id: 'doc-gst', label: 'GST Certificate (optional)', required: false, status: 'missing' },
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
  'Bank Details',
  'Review',
];

interface ProviderState {
  provider: ProviderProfile;
  demoMode: boolean;
  loadDemoProvider: () => void;
  startFresh: () => void;
  updateProvider: (patch: Partial<ProviderProfile>) => void;
  setServiceAreas: (areas: ServiceArea[]) => void;
  setBankDetails: (bank: BankDetails) => void;
  setDocumentStatus: (docId: string, status: DocumentItem['status'], fileName?: string) => void;
  goToStep: (step: number) => void;
  submitForApproval: () => void;
}

export const useProviderStore = create<ProviderState>((set) => ({
  provider: blankProvider,
  demoMode: false,
  loadDemoProvider: () => set({ provider: seedProvider, demoMode: true }),
  startFresh: () => set({ provider: blankProvider, demoMode: false }),
  updateProvider: (patch) => set((s) => ({ provider: { ...s.provider, ...patch } })),
  setServiceAreas: (serviceAreas) => set((s) => ({ provider: { ...s.provider, serviceAreas } })),
  setBankDetails: (bankDetails) => set((s) => ({ provider: { ...s.provider, bankDetails } })),
  setDocumentStatus: (docId, status, fileName) =>
    set((s) => ({
      provider: {
        ...s.provider,
        documents: s.provider.documents.map((d) => (d.id === docId ? { ...d, status, fileName: fileName ?? d.fileName } : d)),
      },
    })),
  goToStep: (registrationStep) => set((s) => ({ provider: { ...s.provider, registrationStep } })),
  submitForApproval: () =>
    set((s) => ({ provider: { ...s.provider, status: 'under_review', registrationStep: registrationSteps.length } })),
}));
