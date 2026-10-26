import { create } from 'zustand';
import { CommunicationEntry, Enquiry, EnquiryStatus } from '../data/types';
import { seedEnquiries } from '../data/seed';
import { api } from '../services/api';

interface EnquiryState {
  enquiries: Enquiry[];
  counts: Record<string, number>;
  isLoading: boolean;
  error: string | null;
  getById: (id: string) => Enquiry | undefined;
  markSeen: (id: string) => void;
  addMessage: (id: string, message: string, author?: CommunicationEntry['author']) => void;
  sendQuote: (id: string, quote: number, message: string) => Promise<void>;
  updateStatus: (id: string, status: EnquiryStatus, note?: string) => Promise<void>;
  rejectEnquiry: (id: string, reason: string) => Promise<void>;
  fetchEnquiries: (status?: string) => Promise<void>;
  fetchCounts: () => Promise<void>;
}

let msgCounter = 100;

function mapBackendEnquiry(b: any): Enquiry {
  return {
    id: b.id,
    customerName: b.customer_name || b.customer?.name || 'Customer',
    customerMobile: b.customer_mobile || b.customer?.mobile || '',
    customerWhatsapp: b.customer_whatsapp || b.customer?.whatsapp || b.customer_mobile || '',
    avatarColor: b.avatar_color || '#0E7C7B',
    category: b.category || 'catering',
    eventType: b.event_type || 'Event',
    eventDate: b.event_date ? String(b.event_date).slice(0, 10) : new Date().toISOString().slice(0, 10),
    location: b.location || 'Salem',
    district: b.district || 'Salem',
    guestCount: b.guest_count || 100,
    estimatedTotal: b.estimated_total ? Number(b.estimated_total) : (b.quote_amount ? Number(b.quote_amount) : 50000),
    status: (b.status || 'new') as EnquiryStatus,
    quote: b.quote_amount ? Number(b.quote_amount) : undefined,
    quoteMessage: b.quote_message || undefined,
    items: Array.isArray(b.items)
      ? b.items.map((it: any) => ({
          name: it.name || 'Service Item',
          price: it.price || 0,
          quantity: it.qty || it.quantity || 1,
        }))
      : [],
    timeline: Array.isArray(b.timeline)
      ? b.timeline.map((t: any, idx: number) => ({
          id: `tl-${idx}`,
          author: t.sender || (t.status ? 'system' : 'provider'),
          message: t.note || t.message || `Status changed to ${t.status}`,
          at: t.timestamp || new Date().toISOString(),
        }))
      : [
          {
            id: 'init-msg',
            author: 'customer',
            message: b.notes || 'Looking for pricing and availability.',
            at: b.created_at || new Date().toISOString(),
          },
        ],
    isNewLead: b.status === 'new' || b.status === 'pending',
    createdAt: b.created_at || new Date().toISOString(),
  };
}

export const useEnquiryStore = create<EnquiryState>((set, get) => ({
  enquiries: [],
  counts: { all: 0, new: 0, reviewing: 0, responded: 0, accepted: 0, rejected: 0 },
  isLoading: false,
  error: null,

  getById: (id) => get().enquiries.find((e) => e.id === id),

  markSeen: (id) => {
    set((s) => ({
      enquiries: s.enquiries.map((e) =>
        e.id === id ? { ...e, isNewLead: false, status: e.status === 'new' ? 'reviewing' : e.status } : e
      ),
    }));
    api.enquiries.updateStatus(id, 'reviewing').catch(() => {});
  },

  addMessage: (id, message, author = 'provider') => {
    msgCounter += 1;
    const entry: CommunicationEntry = { id: `msg-${msgCounter}`, author, message, at: new Date().toISOString() };
    set((s) => ({
      enquiries: s.enquiries.map((e) => (e.id === id ? { ...e, timeline: [...e.timeline, entry] } : e)),
    }));
    api.enquiries.sendMessage(id, message).catch(() => {});
  },

  sendQuote: async (id, quote, message) => {
    get().addMessage(id, message || `Quoted ₹${quote.toLocaleString('en-IN')}.`, 'provider');
    set((s) => ({
      enquiries: s.enquiries.map((e) =>
        e.id === id ? { ...e, status: 'responded', quote, quoteMessage: message } : e
      ),
    }));
    await api.enquiries.sendQuote(id, {
      quote_amount: quote,
      terms: message,
    }).catch(() => {});
  },

  updateStatus: async (id, status, note) => {
    set((s) => ({ enquiries: s.enquiries.map((e) => (e.id === id ? { ...e, status } : e)) }));
    await api.enquiries.updateStatus(id, status, note).catch(() => {});
  },

  rejectEnquiry: async (id, reason) => {
    get().addMessage(id, reason || 'Unable to take this booking.', 'provider');
    set((s) => ({ enquiries: s.enquiries.map((e) => (e.id === id ? { ...e, status: 'rejected' } : e)) }));
    await api.enquiries.updateStatus(id, 'rejected', reason).catch(() => {});
  },

  fetchEnquiries: async (status) => {
    set({ isLoading: true, error: null });
    const res = await api.enquiries.list({ status });
    set({ isLoading: false });

    if (res.success && Array.isArray(res.data)) {
      if (res.data.length > 0) {
        set({ enquiries: res.data.map(mapBackendEnquiry) });
      } else {
        // If cloud database has no enquiries for this account yet, fall back to seed data if in demo mode
        set((s) => ({ enquiries: s.enquiries.length === 0 ? seedEnquiries : s.enquiries }));
      }
    } else {
      // In case of unapproved provider or error, hydrate with seed data so UI does not freeze
      set((s) => ({ enquiries: s.enquiries.length === 0 ? seedEnquiries : s.enquiries }));
    }
  },

  fetchCounts: async () => {
    const res = await api.enquiries.getCounts();
    if (res.success && res.data) {
      set({ counts: res.data });
    }
  },
}));
