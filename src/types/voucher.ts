export interface Voucher {
  code: string;
  createdAt: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  expiryDate: string;
  id: number;
  isActive: boolean;
  isForAllCategories: boolean;
  maxDiscount: number | null;
  minPurchase: number | null;
  startDate: string;
  updatedAt: string;
  usage: VoucherUsage[];
  usageCount: number;
  usageLimit: number | null;
}

export type VoucherUsage = {
  id: number;
  createdAt: string;
  whatsapp: string | null;
  orderId: string;
  username: string | null;
  amount: number;
  voucherId: number;
  expiresAt: string | null;
};
