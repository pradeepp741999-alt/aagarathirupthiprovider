import { create } from 'zustand';
import { AvailabilityDay, Dish, MenuPackage, SpecialCombo } from '../data/types';
import { seedAvailability, seedCombos, seedDishes, seedPackages } from '../data/seed';
import { api } from '../services/api';

interface ServiceState {
  dishes: Dish[];
  packages: MenuPackage[];
  combos: SpecialCombo[];
  availability: AvailabilityDay[];
  isLoading: boolean;
  error: string | null;
  fetchCatalog: () => Promise<void>;
  addDish: (dish: Omit<Dish, 'id'>) => Promise<void>;
  updateDish: (id: string, patch: Partial<Dish>) => Promise<void>;
  removeDish: (id: string) => Promise<void>;
  addPackage: (pkg: Omit<MenuPackage, 'id'>) => Promise<void>;
  updatePackage: (id: string, patch: Partial<MenuPackage>) => Promise<void>;
  removePackage: (id: string) => Promise<void>;
  addCombo: (combo: Omit<SpecialCombo, 'id'>) => Promise<void>;
  updateCombo: (id: string, patch: Partial<SpecialCombo>) => Promise<void>;
  removeCombo: (id: string) => Promise<void>;
  fetchMonthAvailability: (year: number, month: number) => Promise<void>;
  setDayStatus: (date: string, status: AvailabilityDay['status'], note?: string) => Promise<void>;
  getDayStatus: (date: string) => AvailabilityDay['status'];
}

let dishCounter = 100;
let pkgCounter = 100;
let comboCounter = 100;

export const useServiceStore = create<ServiceState>((set, get) => ({
  dishes: seedDishes,
  packages: seedPackages,
  combos: seedCombos,
  availability: seedAvailability,
  isLoading: false,
  error: null,

  fetchCatalog: async () => {
    set({ isLoading: true, error: null });
    try {
      // 1. Fetch Combos
      const comboRes = await api.catalog.getCombos();
      let liveCombos: SpecialCombo[] = [];
      if (comboRes.success && Array.isArray(comboRes.data) && comboRes.data.length > 0) {
        liveCombos = comboRes.data.map((c: any) => ({
          id: c.id,
          name: c.name,
          description: c.description,
          includedItems: Array.isArray(c.included_items) ? c.included_items : (c.includedItems || []),
          price: Number(c.price || 0),
          originalPrice: c.original_price ? Number(c.original_price) : undefined,
          image: c.image_url || c.image,
          validUntil: c.valid_until || c.validUntil || '2026-12-31',
          active: c.is_active !== undefined ? Boolean(c.is_active) : true,
        }));
      } else {
        // Fallback to public special combos endpoint if provider combos empty
        const pubRes = await api.catalog.getPublicSpecialCombos();
        if (pubRes.success && Array.isArray(pubRes.data) && pubRes.data.length > 0) {
          liveCombos = pubRes.data.map((c: any) => ({
            id: c.id,
            name: c.name,
            description: c.description,
            includedItems: Array.isArray(c.included_items) ? c.included_items : [],
            price: Number(c.price || 0),
            originalPrice: c.original_price ? Number(c.original_price) : undefined,
            image: c.image_url || c.image,
            validUntil: c.valid_until || '2026-12-31',
            active: true,
          }));
        }
      }

      if (liveCombos.length > 0) {
        set({ combos: liveCombos });
      }

      // 2. Fetch Dishes
      const dishRes = await api.catalog.getDishes();
      if (dishRes.success && Array.isArray(dishRes.data) && dishRes.data.length > 0) {
        set({
          dishes: dishRes.data.map((d: any) => ({
            id: d.id,
            name: d.name,
            category: d.category || 'Main',
            price: Number(d.price || 0),
            veg: Boolean(d.is_veg),
            popular: Boolean(d.is_popular),
            active: d.is_active !== undefined ? Boolean(d.is_active) : true,
            photo: d.photo_url || d.photo,
          })),
        });
      }

      // 3. Fetch Packages
      const pkgRes = await api.catalog.getPackages();
      if (pkgRes.success && Array.isArray(pkgRes.data) && pkgRes.data.length > 0) {
        set({
          packages: pkgRes.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            pricePerPerson: Number(p.price_per_plate || p.price || 0),
            minGuests: Number(p.min_guests || 50),
            includes: Array.isArray(p.dish_names) ? p.dish_names : (Array.isArray(p.includes) ? p.includes : []),
            veg: Boolean(p.is_veg),
            active: p.is_active !== undefined ? Boolean(p.is_active) : true,
          })),
        });
      }
    } catch {
      // Retain existing data
    } finally {
      set({ isLoading: false });
    }
  },

  addDish: async (dish) => {
    dishCounter += 1;
    const localId = `d-${dishCounter}`;
    set((s) => ({ dishes: [{ ...dish, id: localId }, ...s.dishes] }));

    const res = await api.catalog.createDish({
      name: dish.name,
      category: dish.category,
      price: dish.price,
      is_veg: dish.veg,
      is_popular: dish.popular,
      is_active: dish.active,
      photo_url: dish.photo,
    }).catch(() => null);

    if (res?.success && res?.data?.id) {
      set((s) => ({
        dishes: s.dishes.map((d) => (d.id === localId ? { ...d, id: res.data.id } : d)),
      }));
    }
  },

  updateDish: async (id, patch) => {
    set((s) => ({ dishes: s.dishes.map((d) => (d.id === id ? { ...d, ...patch } : d)) }));
    await api.catalog.updateDish(id, {
      name: patch.name,
      category: patch.category,
      price: patch.price,
      is_veg: patch.veg,
      is_popular: patch.popular,
      is_active: patch.active,
      photo_url: patch.photo,
    }).catch(() => {});
  },

  removeDish: async (id) => {
    set((s) => ({ dishes: s.dishes.filter((d) => d.id !== id) }));
    await api.catalog.deleteDish(id).catch(() => {});
  },

  addPackage: async (pkg) => {
    pkgCounter += 1;
    const localId = `pk-${pkgCounter}`;
    set((s) => ({ packages: [{ ...pkg, id: localId }, ...s.packages] }));

    await api.catalog.createPackage({
      name: pkg.name,
      price_per_plate: pkg.pricePerPerson,
      min_guests: pkg.minGuests,
      is_veg: pkg.veg,
      includes: pkg.includes,
    }).catch(() => {});
  },

  updatePackage: async (id, patch) => {
    set((s) => ({ packages: s.packages.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
    await api.catalog.updatePackage(id, {
      name: patch.name,
      price_per_plate: patch.pricePerPerson,
      min_guests: patch.minGuests,
      is_veg: patch.veg,
      includes: patch.includes,
    }).catch(() => {});
  },

  removePackage: async (id) => {
    set((s) => ({ packages: s.packages.filter((p) => p.id !== id) }));
    await api.catalog.deletePackage(id).catch(() => {});
  },

  addCombo: async (combo) => {
    comboCounter += 1;
    const localId = `combo-${comboCounter}`;
    set((s) => ({ combos: [{ ...combo, id: localId }, ...s.combos] }));

    const res = await api.catalog.createCombo({
      name: combo.name,
      description: combo.description,
      included_items: combo.includedItems,
      price: combo.price,
      original_price: combo.originalPrice,
      image_url: combo.image,
      valid_until: combo.validUntil,
      is_active: combo.active,
    }).catch(() => null);

    if (res?.success && res?.data?.id) {
      set((s) => ({
        combos: s.combos.map((c) => (c.id === localId ? { ...c, id: res.data.id } : c)),
      }));
    }
  },

  updateCombo: async (id, patch) => {
    set((s) => ({ combos: s.combos.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
    await api.catalog.updateCombo(id, {
      name: patch.name,
      description: patch.description,
      included_items: patch.includedItems,
      price: patch.price,
      original_price: patch.originalPrice,
      image_url: patch.image,
      valid_until: patch.validUntil,
      is_active: patch.active,
    }).catch(() => {});
  },

  removeCombo: async (id) => {
    set((s) => ({ combos: s.combos.filter((c) => c.id !== id) }));
    await api.catalog.deleteCombo(id).catch(() => {});
  },

  fetchMonthAvailability: async (year, month) => {
    const res = await api.calendar.getMonth(year, month);
    if (res.success && res.data?.dates) {
      set({
        availability: res.data.dates.map((d: any) => ({
          date: d.date,
          status: d.status,
          note: d.note,
        })),
      });
    }
  },

  setDayStatus: async (date, status, note) => {
    set((s) => {
      const existing = s.availability.find((a) => a.date === date);
      if (existing) {
        return { availability: s.availability.map((a) => (a.date === date ? { ...a, status, note } : a)) };
      }
      return { availability: [...s.availability, { date, status, note }] };
    });
    await api.calendar.setDateStatus(date, status, note).catch(() => {});
  },

  getDayStatus: (date) => get().availability.find((a) => a.date === date)?.status ?? 'available',
}));
