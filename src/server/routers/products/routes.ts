import { publicProcedure, router } from "@/server/trpc";
import { Prisma } from "@prisma/client";
import { z } from "zod";

export const getAll = z.object({
  isFlashSale: z.string().optional(),
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

      const where: Prisma.ServiceWhereInput = {};

      if (search) {
        where.OR = [
          {
            serviceName: { contains: search, mode: "insensitive" },
          },
        ];
      }

      if (categoryId) {
        where.categoryId = parseInt(categoryId);
      }

      if (typeof isFlashSale === "boolean") {
        where.isFlashSale = isFlashSale;
      }

      if (status !== "all") {
        where.status = status;
      }

      const orderBy: Prisma.ServiceOrderByWithRelationInput = {};

      if (price) {
        orderBy.price = price;
      } else {
        orderBy.createdAt = "desc";
      }

      const [data, total] = await Promise.all([
        ctx.prisma.service.findMany({
          where,
          skip: (page - 1) * perPage,
          take: perPage,
          orderBy: {
            createdAt: "desc",
          },
        }),
        ctx.prisma.service.count({
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
