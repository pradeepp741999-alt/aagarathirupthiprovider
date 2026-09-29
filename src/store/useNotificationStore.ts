import { create } from 'zustand';
import { AppNotification } from '../data/types';
import { seedNotifications } from '../data/seed';

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: () => number;
  markAllRead: () => void;
  markRead: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: seedNotifications,
  unreadCount: () => get().notifications.filter((n) => !n.read).length,
  markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
  markRead: (id) =>
    set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
}));
