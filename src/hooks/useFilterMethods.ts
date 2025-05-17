import { create } from "zustand";

export type useFilterMethodType = {
  // state
  type: string | undefined;
  isActive: string | undefined;
  search: string | undefined;
  page: number;
  perPage: number;
  isAll: boolean;

  //   action
  setIsAll: (isAll: boolean) => void;
  setPage: (page: number) => void;
  setType: (type: string | undefined) => void;
  setIsActive: (isActive: string | undefined) => void;
  setSearch: (search: string | undefined) => void;
  setPerPage: (perPage: number) => void;
};

export const useFilterMethods = create<useFilterMethodType>((set) => ({
  isActive: undefined,
  search: undefined,
  type: undefined,
  isAll: false,
  page: 1,
  perPage: 10,

  setIsAll: (isAll) => set({ isAll }),
  setPage: (page) => set({ page }),
  setPerPage: (perPage) => set({ perPage }),
  setIsActive: (isActive) => set({ isActive }),
  setType: (type) => set({ type }),
  setSearch: (search) => set({ search }),
}));
