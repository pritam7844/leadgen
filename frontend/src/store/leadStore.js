import { create } from 'zustand'

export const useLeadStore = create((set) => ({
  leads: [],
  total: 0,
  stats: null,
  loading: false,
  filters: { page: 0, size: 20, sortBy: 'createdAt', sortDir: 'desc' },

  setLeads: (leads, total) => set({ leads, total }),
  setStats: (stats) => set({ stats }),
  setLoading: (loading) => set({ loading }),
  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),
}))
