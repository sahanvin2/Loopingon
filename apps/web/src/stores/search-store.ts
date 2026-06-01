import { create } from "zustand";
import type { SearchFilters, ViewMode } from "@/types";

interface SearchState {
  query: string;
  filters: SearchFilters;
  sort: string;
  view: ViewMode;
  page: number;

  setQuery: (query: string) => void;
  setFilter: <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K],
  ) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  clearFilters: () => void;
  clearAllFilters: () => void;
  removeFilter: (key: keyof SearchFilters) => void;
  setSort: (sort: string) => void;
  setView: (view: ViewMode) => void;
  setPage: (page: number) => void;
  getActiveFilterCount: () => number;
  getActiveFilters: () => Partial<SearchFilters>;
  resetAll: () => void;
}

const defaultFilters: SearchFilters = {
  query: "",
  category: undefined,
  craftType: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  rating: undefined,
  district: undefined,
  materials: undefined,
  shipping: undefined,
  features: undefined,
  onSale: undefined,
  inStock: undefined,
};

export const useSearchStore = create<SearchState>()((set, get) => ({
  query: "",
  filters: { ...defaultFilters },
  sort: "newest",
  view: "grid",
  page: 1,

  setQuery: (query) => set({ query, page: 1 }),

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
      page: 1,
    })),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
      page: 1,
    })),

  clearFilters: () =>
    set((state) => ({
      filters: { ...defaultFilters, query: state.filters.query },
      page: 1,
    })),

  clearAllFilters: () =>
    set({
      query: "",
      filters: { ...defaultFilters },
      page: 1,
      sort: "newest",
    }),

  removeFilter: (key) =>
    set((state) => {
      const newFilters = { ...state.filters };
      delete newFilters[key];
      return { filters: newFilters, page: 1 };
    }),

  setSort: (sort) => set({ sort }),

  setView: (view) => set({ view }),

  setPage: (page) => set({ page }),

  getActiveFilterCount: () => {
    const { filters } = get();
    let count = 0;
    if (filters.category) count++;
    if (filters.craftType) count++;
    if (filters.minPrice !== undefined) count++;
    if (filters.maxPrice !== undefined) count++;
    if (filters.rating) count++;
    if (filters.district) count++;
    if (filters.materials && filters.materials.length > 0) count++;
    if (filters.shipping) count++;
    if (filters.features && filters.features.length > 0) count++;
    if (filters.onSale) count++;
    if (filters.inStock) count++;
    return count;
  },

  getActiveFilters: () => {
    const { filters } = get();
    const active: Partial<SearchFilters> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        (active as Record<string, unknown>)[key] = value;
      }
    });
    return active;
  },

  resetAll: () =>
    set({
      query: "",
      filters: { ...defaultFilters },
      sort: "newest",
      view: "grid",
      page: 1,
    }),
}));
