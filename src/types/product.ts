export type ProductData = {
  id: number;
  layanan: string;
  provider: string;
  providerId: string;
  kategoriId: number;
  subCategoryId: number;
  catatan: string;
  status: boolean;
  harga: number;
  hargaGold: number;
  hargaPlatinum: number;
  hargaReseller: number;
  profit: number;
  profitGold: number;
  profitPlatinum: number;
  profitReseller: number;
  productLogo: string | null;
  isFlashSale: boolean;
  judulFlashSale: string | null;
  bannerFlashSale: string | null;
  expiredFlashSale: string | null;
  hargaFlashSale: number |null
  createdAt: string | null
  updatedAt: string | null
};
