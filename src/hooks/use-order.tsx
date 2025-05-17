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
  discount: number | undefined;
  finalPrice: number | undefined;
  method: PaymentMethod;
  price: number;
};

export type OrderActions = {
  setUserId: (userId: string) => void;
  setFinalPrice: (fp: number | undefined) => void;
  setDiscount: (disc: number | undefined) => void;
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
  discount: undefined,
  finalPrice: undefined,
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
  setDiscount: (disc) => set({ discount: disc }),
  setFinalPrice: (fp) => set({ finalPrice: fp }),
  setWhatsAppNumber: (wa) => set({ whatsAppNumber: wa }),
  setUserId: (userId) => set({ userId }),
  setZone: (zone) => set({ zone }),
  setProduct: (productDetails) => set({ productDetails }),
  setMethod: (method) => set({ method }),
  setVoucherCode: (voucherCode) => set({ voucherCode }),
  setPrice: (price) => set({ price }),
  resetOrder: () => set(initialState),
}));
