import { prisma } from "@/lib/prisma";
import { publicProcedure, router } from "@/server/trpc";
import { z } from "zod";
import {
  handleDatabaseOperation,
  formatResponse,
  validateResourceExists
} from "@/lib/trpc-response";
import { Prisma } from "@prisma/client";

// ====== Schemas ======
export const filterByCodeSchema = z.object({
  code: z.string().trim().min(1, "Kode kategori harus diisi"),
  layananFilter: z.object({
    price: z.string().optional(),
  }).optional()
});

export const filterCategoryAll = z.object({
  type: z.string().optional(),
  search: z.string().optional(),
  active: z.string().optional(),
  page: z.number().optional().default(1),
  perPage: z.number().optional().default(10),
  isAll: z.boolean().optional().default(false),
});

// ====== Router ======
export const categoriesRouter = router({
  getByCode: publicProcedure
    .input(filterByCodeSchema)
    .query(async ({ input }) => {
      return handleDatabaseOperation(
        async () => {
          const layananWhere = {
            status: true,
            ...(input.layananFilter?.price && {
              harga: { lte: parseFloat(input.layananFilter.price) }
            })
          };

          const category = await prisma.categories.findUnique({
            where: { kode: input.code },
            include: {
              subCategories: true,
              layanan: {
                where: layananWhere,
                orderBy: { harga: "asc" }
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
    .input(filterCategoryAll)
    .query(async ({ input }) => {
      return handleDatabaseOperation(
        async () => {
          const {
            search,
            type,
            active,
            page = 1,
            perPage = 10,
            isAll = false
          } = input;

          const where = {
            ...({ status: active ? "active" : undefined}),
            ...(type && { tipe: type }),
            ...(search && {
              OR: [
                { kode: { contains: search, mode: "insensitive" } },
                { nama: { contains: search, mode: "insensitive" } },
                { deskripsi: { contains: search, mode: "insensitive" } }
              ]
            })
          };

          const include = {
            _count: {
              select: {
                subCategories: true,
                layanan: true
              }
            }
          };

          const orderBy: { nama: Prisma.SortOrder } = { nama: "asc" };

          const allCategories = await prisma.categories.findMany({
            where,
            include,
            orderBy
          });

          if (isAll) {
            return formatResponse(
              {
                data: allCategories,
                meta: {
                  currentPage: page,
                  perPage,
                  totalItems: allCategories.length,
                  totalPages: 10,
                  total: allCategories.length
                }
              },
              "Daftar kategori berhasil diambil"
            );
          } else {
            const skip = (page - 1) * perPage;
            const totalCount = allCategories.length;
            const paginatedCategories = allCategories.slice(skip, skip + perPage);
            const totalPages = Math.ceil(totalCount / perPage);

            return formatResponse(
              {
                data: paginatedCategories,
                meta: {
                  currentPage: page,
                  perPage,
                  totalItems: totalCount,
                  totalPages,
                  total: totalCount
                }
              },
              "Daftar kategori berhasil diambil"
            );
          }
        },
        "Gagal mengambil daftar kategori"
      );
    })
});
