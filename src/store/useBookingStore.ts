import { create } from 'zustand';
import { Booking, BookingStatus, Enquiry } from '../data/types';
import { seedBookings } from '../data/seed';
import { api } from '../services/api';

interface BookingState {
  bookings: Booking[];
  counts: Record<string, number>;
  isLoading: boolean;
  error: string | null;
  getById: (id: string) => Booking | undefined;
  updateStatus: (id: string, status: BookingStatus) => Promise<void>;
  createFromEnquiry: (enquiry: Enquiry, amount: number) => void;
  recordPayment: (id: string, amount: number, method?: string, referenceId?: string, notes?: string) => Promise<boolean>;
  fetchBookings: (status?: string) => Promise<void>;
  fetchCounts: () => Promise<void>;
}

let counter = 500;

function mapBackendBooking(b: any): Booking {
  return {
    id: b.id,
    enquiryId: b.enquiry_id || '',
    customerName: b.customer_name || b.customer?.name || 'Customer',
    customerMobile: b.customer_mobile || b.customer?.mobile || '',
    category: b.category || 'catering',
    eventType: b.event_type || 'Event',
    eventDate: b.event_date ? String(b.event_date).slice(0, 10) : new Date().toISOString().slice(0, 10),
    location: b.location || b.venue || 'Salem',
    guestCount: b.guest_count || 100,
    amount: b.total_amount ? Number(b.total_amount) : (b.amount ? Number(b.amount) : 50000),
    status: (b.status || 'confirmed') as BookingStatus,
    createdAt: b.created_at || new Date().toISOString(),
  };
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  counts: { all: 0, upcoming: 0, in_progress: 0, completed: 0, cancelled: 0 },
  isLoading: false,
  error: null,

  getById: (id) => get().bookings.find((b) => b.id === id),

  updateStatus: async (id, status) => {
    set((s) => ({ bookings: s.bookings.map((b) => (b.id === id ? { ...b, status } : b)) }));
    await api.bookings.updateStatus(id, status).catch(() => {});
  },

  createFromEnquiry: (enquiry, amount) => {
    counter += 1;
    const booking: Booking = {
      id: `bk-${counter}`,
      enquiryId: enquiry.id,
      customerName: enquiry.customerName,
      customerMobile: enquiry.customerMobile,
      category: enquiry.category,
      eventType: enquiry.eventType,
      eventDate: enquiry.eventDate,
      location: enquiry.location,
      guestCount: enquiry.guestCount,
      amount,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    set((s) => ({ bookings: [booking, ...s.bookings] }));
  },

  recordPayment: async (id, amount, method = 'upi', referenceId, notes) => {
    const res = await api.bookings.recordPayment(id, {
      amount,
      payment_method: method,
      reference_id: referenceId,
      notes,
    });
    return res.success;
  },

  fetchBookings: async (status) => {
    set({ isLoading: true, error: null });
    const res = await api.bookings.list({ status });
    set({ isLoading: false });

    if (res.success && Array.isArray(res.data)) {
      if (res.data.length > 0) {
        set({ bookings: res.data.map(mapBackendBooking) });
      } else {
        set((s) => ({ bookings: s.bookings.length === 0 ? seedBookings : s.bookings }));
      }
    } else {
      set((s) => ({ bookings: s.bookings.length === 0 ? seedBookings : s.bookings }));
    }
  },

  fetchCounts: async () => {
    const res = await api.bookings.getCounts();
    if (res.success && res.data) {
      set({ counts: res.data });
    }
  },
}));
