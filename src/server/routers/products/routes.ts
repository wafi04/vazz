import { publicProcedure, router } from "@/server/trpc";
import { Prisma } from "@prisma/client";
import { z } from "zod";

export const getAll = z.object({
  isFlashSale: z.boolean().optional(),
  categoryId: z.string().optional(),
  status: z.string().optional(),
  price: z.enum(["asc", "desc"]).optional(),
  search: z.string().optional(),
  page: z.number().optional(),
  perPage: z.number().optional(),
});

export const Products = router({
  getAll: publicProcedure.input(getAll).query(async ({ ctx, input }) => {
    try {
      const {
        categoryId,
        isFlashSale,
        price,
        search,
        status,
        page = 1,
        perPage = 10,
      } = input;

      const where: Prisma.LayananWhereInput = {};

      if (search) {
        where.OR = [
          {
            layanan: { contains: search, mode: "insensitive" },
          },
        ];
      }

      if (categoryId) {
        where.kategoriId = parseInt(categoryId);
      }

      if (typeof isFlashSale === "boolean") {
        where.isFlashSale = isFlashSale;
      }

      if (status !== "all") {
        where.status = status === "active";
      }

      const orderBy: Prisma.LayananOrderByWithRelationInput = {};

      if (price) {
        orderBy.harga = price;
      } else {
        orderBy.createdAt = "desc";
      }

      const [data, total] = await Promise.all([
        ctx.prisma.layanan.findMany({
          where,
          skip: (page - 1) * perPage,
          take: perPage,
          orderBy: {
            createdAt: "desc",
          },
        }),
        ctx.prisma.layanan.count({
          where,
        }),
      ]);

      return {
        data,
        meta: {
          total,
          page,
          perPage,
          totalPages: Math.ceil(total / perPage),
        },
      };
    } catch (error) {
      throw new Error("Failed to fetch products");
    }
  }),
});
