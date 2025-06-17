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
  layanan: z.string().min(1, "Nama layanan wajib diisi"),
  kategoriId: z.number().int().positive("Kategori wajib dipilih"), // Corrected to number
  subCategoryId: z.number().int().positive("Sub kategori wajib dipilih"),
  providerId: z.string().min(1, "Provider wajib dipilih"),
  harga: z.number().positive("Harga harus lebih dari 0"),
  hargaReseller: z.number().positive("Harga reseller harus lebih dari 0"),
  hargaSuggest: z.number().positive("Harga reseller harus lebih dari 0"),
  hargaPlatinum: z.number().positive("Harga platinum harus lebih dari 0"),
  hargaFlashSale: z.number().nullable().optional(), // Corrected to optional
  profit: z.number().min(0, "Profit tidak boleh negatif"),
  profitReseller: z.number().min(0, "Profit reseller tidak boleh negatif"),
  profitPlatinum: z.number().min(0, "Profit platinum tidak boleh negatif"),
  isFlashSale: z.boolean().default(false),
  judulFlashSale: z.string().nullable().optional(),
  bannerFlashSale: z.string().nullable().optional(),
  expiredFlashSale: z.string().nullable().optional(),
  catatan: z.string().default("").nullable(),
  status: z.boolean().default(true),
  provider: z
    .string()
    .min(1, "Provider wajib diisi")
    .nullable()
    .default("digiflazz"),
  productLogo: z.string().nullable().optional(),
});
