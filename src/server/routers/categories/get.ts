import { prisma } from "@/lib/prisma";
import { publicProcedure, router } from "@/server/trpc";
import { z } from "zod";
import {
  handleDatabaseOperation,
  formatResponse,
  validateResourceExists,
} from "@/lib/trpc-response";
import { Prisma } from "@prisma/client";
import { getProfile } from "@/app/(auth)/auth/components/server";

// ====== Schemas ======
export const filterByCodeSchema = z.object({
  code: z.string().trim().min(1, "Kode kategori harus diisi"),
  providerId: z.string().optional(),
  subCategory: z.number().optional(),
  layananFilter: z
    .object({
      price: z.string().optional(),
    })
    .optional(),
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
      return handleDatabaseOperation(async () => {
        // 1. Parallel execution - jalankan secara bersamaan
        const [user, category] = await Promise.all([
          getProfile().catch(() => undefined),
          prisma.categories.findUnique({
            where: { kode: input.code, status: "active" },
            select: {
              id: true,
              isChecknickname: true,
              nama: true,
              subNama: true,
              brand: true,
              kode: true,
              serverId: true,
              status: true,
              thumbnail: true,
              tipe: true,
              petunjuk: true,
              ketLayanan: true,
              ketId: true, // Sesuai dengan `ketId` di Prisma (String? @db.Text)
              placeholder1: true, // Sesuai dengan `placeholder1` di Prisma (String @db.Text)
              placeholder2: true, // Sesuai dengan `placeholder2` di Prisma (String @db.Text)
              createdAt: true, // Sesuai dengan `createdAt` di Prisma (DateTime?)
              updatedAt: true, // Sesuai dengan `updatedAt` di Prisma (DateTime?)
              bannerLayanan: true, // Sesuai dengan `bannerLayanan` di Prisma (String)
              subCategories: {
                where: {
                  active: true,
                },
                select: {
                  id: true,
                  name: true,
                },
              },
              layanan: {
                where: {
                  status: true,
                  subCategoryId: input.subCategory,
                },
                select: {
                  id: true,
                  layanan: true,
                  harga: true,
                  productLogo: true,
                  providerId: true,
                  hargaPlatinum: true,
                  hargaReseller: true,
                  hargaFlashSale: true,
                  hargaSuggest: true,
                  isFlashSale: true,
                  subCategoryId: true,
                  isSuggest: true,
                },
                orderBy: { harga: "asc" },
              },
            },
          }),
        ]);

        validateResourceExists(category, "Category", input.code);

        // 3. Optimasi price calculation - harga berdasarkan role atau default untuk non-login
        const layananWithAdjustedPrice = category?.layanan.map((item) => {
          let finalPrice = item.harga;
          if (user?.session?.role) {
            if (user.session.role === "Platinum") {
              finalPrice = item.hargaPlatinum;
            } else if (user.session.role === "Reseller") {
              finalPrice = item.hargaReseller;
            }
          }
          return {
            ...item,
            userRole: user?.session.role as string,
            finalPrice,
          };
        });

        // 4. Return optimized data structure
        const optimizedCategory = {
          ...category,
          layanan: layananWithAdjustedPrice,
        };

        return formatResponse(optimizedCategory, "Kategori berhasil ditemukan");
      }, `Failed to fetch category with code: ${input.code}`);
    }),

  getAll: publicProcedure.input(filterCategoryAll).query(async ({ input }) => {
    return handleDatabaseOperation(async () => {
      const {
        search,
        type,
        active,
        page = 1,
        perPage = 10,
        isAll = false,
      } = input;

      const where: Prisma.CategoriesWhereInput = {
        ...(active ? { status: active } : {}),
        ...(type ? { tipe: type } : {}),
        ...(search
          ? {
              OR: [
                { kode: { startsWith: search } },
                { nama: { contains: search } },
                { subNama: { contains: search } },
              ],
            }
          : {}),
      };

      const include = {
        _count: {
          select: {
            subCategories: true,
            layanan: true,
          },
        },
      };

      const orderBy: { nama: Prisma.SortOrder } = { nama: "asc" };

      const allCategories = await prisma.categories.findMany({
        where,
        include,
        orderBy,
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
              total: allCategories.length,
            },
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
              total: totalCount,
            },
          },
          "Daftar kategori berhasil diambil"
        );
      }
    }, "Gagal mengambil daftar kategori");
  }),
});
