import { z } from "zod";

export type Layanan = {
  bannerFlashSale: string | null;
  catatan: string | null;
  createdAt: string | null;
  expiredFlashSale: string | null;
  harga: number;
  hargaFlashSale: number | null;
  hargaFromDigi: number;
  hargaPlatinum: number;
  hargaReseller: number;
  hargaSuggest: number;
  id: number;
  isFlashSale: boolean;
  isProfitFixed: boolean;
  isSuggest: boolean;
  judulFlashSale: string | null;
  kategoriId: number;
  layanan: string;
  productLogo: string | null;
  profit: number;
  profitPlatinum: number;
  profitReseller: number;
  profitSuggest: number;
  provider: string | null;
  providerId: string;
  status: boolean;
  subCategoryId: number;
  updatedAt: string | null;
};

export const layananFormSchema = z.object({
  id: z.number(),
  service: z.string().min(1, "Nama layanan wajib diisi"),
  categoryId: z.number().int().positive("Kategori wajib dipilih"), // Corrected to number
  subCategoryId: z.number().int().positive("Sub kategori wajib dipilih"),
  providerId: z.string().min(1, "Provider wajib dipilih"),
  price: z.number().positive("price harus lebih dari 0"),
  priceReseller: z.number().positive("price reseller harus lebih dari 0"),
  priceSuggest: z.number().positive("price reseller harus lebih dari 0"),
  pricePlatinum: z.number().positive("price platinum harus lebih dari 0"),
  priceFlashSale: z.number().nullable().optional(), // Corrected to optional
  profit: z.number().min(0, "Profit tidak boleh negatif"),
  profitReseller: z.number().min(0, "Profit reseller tidak boleh negatif"),
  profitPlatinum: z.number().min(0, "Profit platinum tidak boleh negatif"),
  isFlashSale: z.string().default("inactive"),
  titleFlashSale: z.string().nullable().optional(),
  bannerFlashSale: z.string().nullable().optional(),
  expiredFlashSale: z.string().nullable().optional(),
  note: z.string(),
  status: z.string().default("active"),
  provider: z.string().min(1, "Provider wajib diisi").default("digiflazz"),
  productLogo: z.string().nullable().optional(),
});
