import { create } from "zustand"

export type FilterProduct = {
    filter: string | undefined
    setFilter : (filter : string | undefined) => void
}


export const useFilterProduct = create<FilterProduct>((set) => ({
    filter: undefined,
    setFilter: (filter : string | undefined) => set({ filter }),
}))