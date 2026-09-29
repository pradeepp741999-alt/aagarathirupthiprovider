import { create } from 'zustand';
import { Booking, BookingStatus, Enquiry } from '../data/types';
import { seedBookings } from '../data/seed';

interface BookingState {
  bookings: Booking[];
  getById: (id: string) => Booking | undefined;
  updateStatus: (id: string, status: BookingStatus) => void;
  createFromEnquiry: (enquiry: Enquiry, amount: number) => void;
}

let counter = 500;

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: seedBookings,
  getById: (id) => get().bookings.find((b) => b.id === id),
  updateStatus: (id, status) =>
    set((s) => ({ bookings: s.bookings.map((b) => (b.id === id ? { ...b, status } : b)) })),
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
}));
