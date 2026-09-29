import { create } from 'zustand';
import { AvailabilityDay, Dish, MenuPackage } from '../data/types';
import { seedAvailability, seedDishes, seedPackages } from '../data/seed';

interface ServiceState {
  dishes: Dish[];
  packages: MenuPackage[];
  availability: AvailabilityDay[];
  addDish: (dish: Omit<Dish, 'id'>) => void;
  updateDish: (id: string, patch: Partial<Dish>) => void;
  removeDish: (id: string) => void;
  addPackage: (pkg: Omit<MenuPackage, 'id'>) => void;
  updatePackage: (id: string, patch: Partial<MenuPackage>) => void;
  removePackage: (id: string) => void;
  setDayStatus: (date: string, status: AvailabilityDay['status'], note?: string) => void;
  getDayStatus: (date: string) => AvailabilityDay['status'];
}

let dishCounter = 100;
let pkgCounter = 100;

export const useServiceStore = create<ServiceState>((set, get) => ({
  dishes: seedDishes,
  packages: seedPackages,
  availability: seedAvailability,
  addDish: (dish) => {
    dishCounter += 1;
    set((s) => ({ dishes: [{ ...dish, id: `d-${dishCounter}` }, ...s.dishes] }));
  },
  updateDish: (id, patch) => set((s) => ({ dishes: s.dishes.map((d) => (d.id === id ? { ...d, ...patch } : d)) })),
  removeDish: (id) => set((s) => ({ dishes: s.dishes.filter((d) => d.id !== id) })),
  addPackage: (pkg) => {
    pkgCounter += 1;
    set((s) => ({ packages: [{ ...pkg, id: `pk-${pkgCounter}` }, ...s.packages] }));
  },
  updatePackage: (id, patch) =>
    set((s) => ({ packages: s.packages.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
  removePackage: (id) => set((s) => ({ packages: s.packages.filter((p) => p.id !== id) })),
  setDayStatus: (date, status, note) =>
    set((s) => {
      const existing = s.availability.find((a) => a.date === date);
      if (existing) {
        return { availability: s.availability.map((a) => (a.date === date ? { ...a, status, note } : a)) };
      }
      return { availability: [...s.availability, { date, status, note }] };
    }),
  getDayStatus: (date) => get().availability.find((a) => a.date === date)?.status ?? 'available',
}));
