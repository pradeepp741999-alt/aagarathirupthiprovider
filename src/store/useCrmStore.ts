import { create } from 'zustand';
import { CrmCustomer, CrmStage } from '../data/types';
import { seedCrmCustomers } from '../data/seed';
import { api } from '../services/api';

interface CrmState {
  customers: CrmCustomer[];
  stats: { totalCustomers?: number; repeatClients?: number; repeatRate?: number; avgLtv?: number } | null;
  isLoading: boolean;
  error: string | null;
  getById: (id: string) => CrmCustomer | undefined;
  updateStage: (id: string, stage: CrmStage) => void;
  addNote: (id: string, message: string) => Promise<void>;
  fetchCustomers: (search?: string, tag?: string) => Promise<void>;
  fetchStats: () => Promise<void>;
}

let noteCounter = 100;

function mapBackendCustomer(c: any): CrmCustomer {
  return {
    id: c.id,
    name: c.name || 'Client',
    mobile: c.mobile || '',
    whatsapp: c.whatsapp || c.mobile || '',
    avatarColor: c.avatarColor || '#0E7C7B',
    stage: (c.stage || 'booked') as CrmStage,
    totalEnquiries: c.totalEnquiries || 1,
    totalBookings: c.total_bookings ? Number(c.total_bookings) : (c.totalBookings || 1),
    lifetimeValue: c.total_spent ? Number(c.total_spent) : (c.lifetimeValue || 0),
    tags: Array.isArray(c.tags) ? c.tags : ['recent'],
    notes: Array.isArray(c.notes)
      ? c.notes.map((n: any, idx: number) => ({
          id: n.id || `note-${idx}`,
          message: n.message || n.note || '',
          at: n.created_at || n.at || new Date().toISOString(),
        }))
      : [],
    enquiryIds: Array.isArray(c.enquiryIds) ? c.enquiryIds : [],
    lastContactAt: c.last_event_date || c.lastContactAt || new Date().toISOString(),
  };
}

export const useCrmStore = create<CrmState>((set, get) => ({
  customers: [],
  stats: null,
  isLoading: false,
  error: null,

  getById: (id) => get().customers.find((c) => c.id === id),

  updateStage: (id, stage) =>
    set((s) => ({
      customers: s.customers.map((c) => (c.id === id ? { ...c, stage, lastContactAt: new Date().toISOString() } : c)),
    })),

  addNote: async (id, message) => {
    noteCounter += 1;
    set((s) => ({
      customers: s.customers.map((c) =>
        c.id === id
          ? {
              ...c,
              notes: [{ id: `note-${noteCounter}`, message, at: new Date().toISOString() }, ...c.notes],
              lastContactAt: new Date().toISOString(),
            }
          : c
      ),
    }));
    await api.crm.addCustomerNote(id, message).catch(() => {});
  },

  fetchCustomers: async (search, tag) => {
    set({ isLoading: true, error: null });
    const res = await api.crm.listCustomers({ search, tag });
    set({ isLoading: false });

    if (res.success && Array.isArray(res.data)) {
      if (res.data.length > 0) {
        set({ customers: res.data.map(mapBackendCustomer) });
      } else {
        set((s) => ({ customers: s.customers.length === 0 ? seedCrmCustomers : s.customers }));
      }
    } else {
      set((s) => ({ customers: s.customers.length === 0 ? seedCrmCustomers : s.customers }));
    }
  },

  fetchStats: async () => {
    const res = await api.crm.getStats();
    if (res.success && res.data) {
      set({ stats: res.data });
    }
  },
}));
