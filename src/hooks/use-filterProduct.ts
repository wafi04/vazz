import { create } from "zustand";

export type FilterProduct = {
  filter: number | undefined;
  setFilter: (filter: number | undefined) => void;
};

export const useFilterProduct = create<FilterProduct>((set) => ({
  filter: undefined,
  setFilter: (filter: number | undefined) => set({ filter }),
}));
