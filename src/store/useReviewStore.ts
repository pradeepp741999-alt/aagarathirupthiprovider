import { create } from 'zustand';
import { Review } from '../data/types';
import { seedReviews } from '../data/seed';

interface ReviewState {
  reviews: Review[];
  replyToReview: (id: string, message: string) => void;
}

export const useReviewStore = create<ReviewState>((set) => ({
  reviews: seedReviews,
  replyToReview: (id, message) =>
    set((s) => ({
      reviews: s.reviews.map((r) =>
        r.id === id ? { ...r, providerReply: { message, date: new Date().toISOString() } } : r
      ),
    })),
}));
