import { create } from "zustand"

export type FilterProduct = "gamelainnya" | "voucher" | "pulsa" | "pln"

export type HeaderFilterGame = {
  filter: FilterProduct;
    setFilter: (filter: FilterProduct) => void;
    page: number,
    setPage: (page : number)  => void,
    setPerpage: (perPage : number)  => void,
    perPage : number,
    subCategory: string
    setSubCategory : (sub  : string)  => void
    price: "min" | "max"
    setPrice: (price: "min" | "max") => void;
    productCode: string | undefined
    setProductCode: (code: string | undefined) => void
  resetFilters: () => void;
}

// Default values
const DEFAULT_FILTER: FilterProduct = "gamelainnya";
const DEFAULT_PRICE= "min"

export const useFilterCategoryHome = create<HeaderFilterGame>((set) => ({
  filter: DEFAULT_FILTER,
  setFilter: (filter) => set({ filter }),
    page: 1,
    perPage: 10,
    setPage: (page) => set({ page }),
  setPerpage : (perPage)  => set({perPage}),
  // Price filter
  price: DEFAULT_PRICE,
    setPrice: (price) => set({ price }),
  
    productCode: undefined,
    setProductCode : (code)  => set({productCode : code}),
    
    subCategory : "all",
    setSubCategory : (sub : string)  => set({ subCategory : sub}),
  
  resetFilters: () => set({ 
    price: DEFAULT_PRICE
  })
}))