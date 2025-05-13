import { create } from "zustand";
// Import persist but we'll modify how we use it
import { persist } from "zustand/middleware";

export type ProductDetails = {
  code: string;
  name: string;
  price: number;
};

export type PaymentMethod = {
  code: string;
  name: string;
};

export type OrderState = {
  userId: string;
  zone: string | undefined;
  productDetails: ProductDetails;
  voucherCode: string;
  whatsAppNumber: string;
  method: PaymentMethod;
  price: number;
};

export type OrderActions = {
  setUserId: (userId: string) => void;
  setZone: (zone: string) => void;
  setProduct: (product: ProductDetails) => void;
  setMethod: (method: PaymentMethod) => void;
  setVoucherCode: (voucherCode: string) => void;
  setPrice: (price: number) => void;
  setWhatsAppNumber: (wa: string) => void;
  resetOrder: () => void;
};

export type OrderStore = OrderState & OrderActions;

const initialState: OrderState = {
  userId: "",
  zone: undefined,
  whatsAppNumber: "",
  productDetails: {
    code: "",
    name: "",
    price: 0,
  },
  method: {
    name: "",
    code: "",
  },
  voucherCode: "",
  price: 0,
};

// Solution 1: Use without persist middleware (memory only storage)
export const useOrderStore = create<OrderStore>()((set) => ({
  ...initialState,
  setWhatsAppNumber: (wa) => set({ whatsAppNumber: wa }),
  setUserId: (userId) => set({ userId }),
  setZone: (zone) => set({ zone }),
  setProduct: (productDetails) => set({ productDetails }),
  setMethod: (method) => set({ method }),
  setVoucherCode: (voucherCode) => set({ voucherCode }),
  setPrice: (price) => set({ price }),
  resetOrder: () => set(initialState),
}));

// Solution 2 (Alternative): Use with persist but disable storage
// Uncomment this and comment out the above if you want to keep the persist middleware structure
/*
export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      ...initialState,
      setWhatsAppNumber: (wa) => set({ whatsAppNumber: wa }),
      setUserId: (userId) => set({ userId }),
      setZone: (zone) => set({ zone }),
      setProduct: (productDetails) => set({ productDetails }),
      setMethod: (method) => set({ method }),
      setVoucherCode: (voucherCode) => set({ voucherCode }),
      setPrice: (price) => set({ price }),
      resetOrder: () => set(initialState),
    }),
    {
      name: "order-storage",
      // Use memory storage instead of localStorage
      storage: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      },
    }
  )
);
*/
