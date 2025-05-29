export interface TransactionType {
  data: {
    ref_id: string;
    customer_no: string;
    buyer_sku_code: string;
    message: string;
    status: string;
    trx_id: string;
    rc: string;
    sn: string;
  };
}
export enum TRANSACTION_FLOW {
  PENDING = "PENDING",
  PAID = "PAID",
  PROCESS = "PROCESS",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export interface PembelianManualData {
  id: number;
  productName: string;
  status: string;
  orderId: string | null;
  createdAt: string;
  pembelianManualId: string;
  userId: string;
  nickname: string | null;
  zone: string | null;
  profit: number;
  profitRupiah: number;
  harga: number;
  createdBy: string | null;
  whatsapp?: string;
  reason: string | null;
  pembelian: {
    orderId: string;
    status: string;
    providerOrderId: string | null;
    tipeTransaksi: string;
    harga: number;
    profit?: number;
    profitRupiah?: number;
  } | null;
}

export interface PaymentDetails {
  id: number;
  createdAt: string | null;
  updatedAt: string | null;
  status: string;
  harga: string;
  orderId: string;
  noPembayaran: string | null;
  noPembeli: string;
  metode: string;
  reference: string | null;
}

export interface Transaction {
  id: number;
  isReorder: boolean;
  orderId: string;
  username: string | null;
  layanan: string;
  profit: number;
  harga: number;
  status: string;
  createdAt?: string | null;
  pembayaran: PaymentDetails | null;
  log?: string | null;
  nickname: string | null;
  updatedAt?: string | null;
  zone: string | null;
  userId: string | null;
  successReportSended?: boolean;
}
