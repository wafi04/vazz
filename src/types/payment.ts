export interface PaymentMethod {
  name: string;
  id: number;
  tipe: string;
  createdAt: string | null;
  updatedAt: string | null;
  code: string;
  images: string;
  keterangan: string;
  min: number | null;
  typeTax: string | null;
  taxAdmin: number | null;
  minExpired: number | null;
  maxExpired: number | null;
  max: number | null;
  isActive: boolean;
}

export type checkingVoucher = {
  message: string;
  code: number;
  status: boolean;
  data: {
    status: boolean;
    discountAmount: number;
    finalPrice: number;
    voucherId: number;
    message: string;
  };
};

export type PaymentDetails = {
  success: boolean;
  paymentUrl: string;
  reference: string;
  statusCode: string;
  message: string;
  merchantOrderId: string;
  transactionId: number;
  amount: number;
  data: {
    orderId: string;
    paymentUrl: string;
    va_numbers?: [
      {
        bank: string;
        va_number: string;
      }
    ];
    expiry_time: string;
  };
};

export interface DuitkuResponse {
  merchantCode: string;
  reference: string;
  paymentUrl: string;
  vaNumber: string;
  amount: string;
  statusCode: string;
  statusMessage: string;
}
