import { create } from 'zustand';
import { CommunicationEntry, Enquiry, EnquiryStatus } from '../data/types';
import { seedEnquiries } from '../data/seed';

interface EnquiryState {
  enquiries: Enquiry[];
  getById: (id: string) => Enquiry | undefined;
  markSeen: (id: string) => void;
  addMessage: (id: string, message: string, author?: CommunicationEntry['author']) => void;
  sendQuote: (id: string, quote: number, message: string) => void;
  updateStatus: (id: string, status: EnquiryStatus) => void;
  rejectEnquiry: (id: string, reason: string) => void;
}

let msgCounter = 100;

export const useEnquiryStore = create<EnquiryState>((set, get) => ({
  enquiries: seedEnquiries,
  getById: (id) => get().enquiries.find((e) => e.id === id),
  markSeen: (id) =>
    set((s) => ({
      enquiries: s.enquiries.map((e) =>
        e.id === id ? { ...e, isNewLead: false, status: e.status === 'new' ? 'reviewing' : e.status } : e
      ),
    })),
  addMessage: (id, message, author = 'provider') => {
    msgCounter += 1;
    const entry: CommunicationEntry = { id: `msg-${msgCounter}`, author, message, at: new Date().toISOString() };
    set((s) => ({
      enquiries: s.enquiries.map((e) => (e.id === id ? { ...e, timeline: [...e.timeline, entry] } : e)),
    }));
  },
  sendQuote: (id, quote, message) => {
    get().addMessage(id, message || `Quoted ₹${quote.toLocaleString('en-IN')}.`, 'provider');
    set((s) => ({
      enquiries: s.enquiries.map((e) =>
        e.id === id ? { ...e, status: 'responded', quote, quoteMessage: message } : e
      ),
    }));
  },
  updateStatus: (id, status) =>
    set((s) => ({ enquiries: s.enquiries.map((e) => (e.id === id ? { ...e, status } : e)) })),
  rejectEnquiry: (id, reason) => {
    get().addMessage(id, reason || 'Unable to take this booking.', 'provider');
    set((s) => ({ enquiries: s.enquiries.map((e) => (e.id === id ? { ...e, status: 'rejected' } : e)) }));
  },
}));
