import { publicProcedure, router } from "@/server/trpc";
import { z } from "zod";
import { Prisma } from "@prisma/client";

// Schema untuk filter
export const filterManual = z.object({
  page: z.number().default(1),
  perPage: z.number().default(10),
  isAll: z.boolean().optional().default(false),
  status: z.string().optional(),
  orderId: z.string().optional(),
  pembelianManualId: z.string().optional(),
  createdBy: z.string().optional(),
});

export const manualOrder = router({
  getManualOrder: publicProcedure
    .input(filterManual)
    .query(async ({ ctx, input }) => {
      try {
        const where: Prisma.PembelianManualWhereInput = {};

        if (!input.isAll) {
          where.AND = [];

          if (input.status) {
            where.AND.push({ status: input.status });
          }

          if (input.orderId) {
            where.AND.push({ orderId: input.orderId });
          }

          if (input.pembelianManualId) {
            where.AND.push({ pembelianManualId: input.pembelianManualId });
          }

          if (input.createdBy) {
            where.AND.push({ createdBy: input.createdBy });
          }
        }

        // Hitung total data untuk pagination
        const total = await ctx.prisma.pembelianManual.count({ where });

        // Ambil data dengan pagination
        const transactions = await ctx.prisma.pembelianManual.findMany({
          where,
          skip: (input.page - 1) * input.perPage,
          take: input.perPage,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            pembelian: true,
          },
        });

        return {
          data: transactions,
          meta: {
            total,
            page: input.page,
            perPage: input.perPage,
            totalPages: Math.ceil(total / input.perPage),
          },
        };
      } catch (error) {
        return {
          data: [],
          meta: {
            total: 0,
            page: input.page,
            perPage: input.perPage,
            totalPages: Math.ceil(0 / input.perPage),
          },
        };
      }
    }),
});
