import { prisma } from "@/lib/prisma";
import { publicProcedure, router } from "@/server/trpc";
import { z } from "zod";
import { 
  handleDatabaseOperation, 
  formatResponse,
  validateResourceExists
} from "@/lib/trpc-response";

export const filterByCodeSchema = z.object({
  code: z.string().trim().min(1, "Kode kategori harus diisi"),
  layananFilter: z.object({
    price: z.string().optional(),
  }).optional()
});
export const categoriesRouter = router({
  getByCode: publicProcedure
    .input(filterByCodeSchema)
    .query(async ({ input }) => {
      return handleDatabaseOperation(
        async () => {
          const category = await prisma.categories.findUnique({
            where: { kode: input.code },
            include: {
              subCategories: true,
                layanan: {
                    where: {
                      status : true
                  },
                  orderBy: {
                    harga : "asc"
                  }
              }
            }
          });
            validateResourceExists(category, "Category", input.code);
          
          return formatResponse(category, "Kategori berhasil ditemukan");
        },
        `Failed to fetch category with code: ${input.code}`
      );
    }),
  getAll: publicProcedure
    .query(async () => {
      return handleDatabaseOperation(
        async () => {
          const categories = await prisma.categories.findMany({
            include: {
              _count: {
                select: {
                  subCategories: true,
                  layanan: true
                }
              }
            }
          });
          
          return formatResponse(categories, "Daftar kategori berhasil diambil");
        },
        "Gagal mengambil daftar kategori"
      );
    })
});