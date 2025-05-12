import { create } from "zustand";

export type CategoriesDashboardFilter = {
  // State
  search: string | undefined;
  status: string | undefined
  type: string | undefined
  page: number;
  perPage: number;

  // Actions
  setSearch: (search: string | undefined) => void;
  setStatus: (status: string | undefined) => void;
  setType: (type: string | undefined) => void;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
};

export const useFilterCategoryDashboard = create<CategoriesDashboardFilter>(
  (set) => ({
    // Default state
    search: undefined,
    status: undefined,
    type: undefined,
    page: 1,
    perPage: 10,

    // Actions
    setSearch: (search) => set({ search }),
    setStatus: (status) => set({ status }),
    setType: (type) => set({ type }),
    setPage: (page) => set({ page }),
    setPerPage: (perPage) => set({ perPage }),
  })
);
