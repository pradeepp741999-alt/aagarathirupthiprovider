import { create } from 'zustand';
import { CrmCustomer, CrmStage } from '../data/types';
import { seedCrmCustomers } from '../data/seed';

interface CrmState {
  customers: CrmCustomer[];
  getById: (id: string) => CrmCustomer | undefined;
  updateStage: (id: string, stage: CrmStage) => void;
  addNote: (id: string, message: string) => void;
}

let noteCounter = 100;

export const useCrmStore = create<CrmState>((set, get) => ({
  customers: seedCrmCustomers,
  getById: (id) => get().customers.find((c) => c.id === id),
  updateStage: (id, stage) =>
    set((s) => ({
      customers: s.customers.map((c) => (c.id === id ? { ...c, stage, lastContactAt: new Date().toISOString() } : c)),
    })),
  addNote: (id, message) => {
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
  },
}));
