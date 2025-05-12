import { create } from "zustand"

export type OrderType = {
    userId: string 
    zone: string | undefined
    productDetails: {
        code: string,
        name: string,
        price : number
    },
    voucherCode: string
    setVoucherCode : (voucherCode: string) => void
    method : {
        code : string,
        name :  string
    },
    price: number
    setUserId: (userId: string) => void
    setZone: (zone: string) => void
    setProduct: (product: {code : string,name : string,price : number}) => void
    setMethod: (method : {
        code : string,
        name : string
    }) => void
    setPrice: (price: number) => void
}

export const useOrderStore = create<OrderType>((set) => ({
    userId: "",
    zone: undefined,
    productDetails: {
        code: "",
        name: "",
        price: 0,
    },
    method: {
        name : "",
        code : ""
    },
    voucherCode: "",
    setVoucherCode: (voucherCode) => set({ voucherCode }),
    price: 0,
    setUserId: (userId) => set({ userId }),
    setZone: (zone) => set({ zone }),
    setProduct: (product: {code: string, name: string, price: number}) => set({ productDetails : product }),
    setMethod: (method) => set({ method }),
    setPrice: (price) => set({ price }),
}))