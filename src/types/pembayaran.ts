type Pembayaran = {
  id: number;
  orderId: string;
  harga: string;
  noPembayaran: string | null;
  noPembeli: string; // Changed from number to string
  status: string;
  metode: string;
  reference: string | null;
  fee: number; // Added missing field
  feeRupiah: number | null; // Added missing field
  totalAmount: number; // Added missing field
  createdAt: string | null; // ISO date string
  updatedAt: string | null; // ISO date string
};

export type Transaksi = {
  id: number;
  orderId: string;
  username: string | null;
  userId: string | null;
  zone: string | null;
  nickname: string | null;
  emailVilog: string | null;
  passwordVilog: string | null;
  loginviaVilog: string | null;
  layanan: string;
  harga: number;
  profit: number;
  providerOrderId: string | null;
  status: string;
  log: string | null;
  sn: string | null;
  tipeTransaksi: string;
  isDigi: boolean;
  refId: string | null;
  successReportSended: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  pembayaran?: Pembayaran | null;
};

export type TransaksiPagination = Transaksi & {
  pagination: {
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
};
