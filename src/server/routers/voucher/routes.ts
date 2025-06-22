import { publicProcedure, router } from "@/server/trpc";
import { createVoucherSchema } from "@/types/schema/voucher";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { validateVoucher } from "../vouchers";
import { checkingVoucher } from "@/features/transaction/voucher/checkingVoucher";

export const Vouchers = router({
  getAll: publicProcedure
    .input(
      z.object({
        code: z.string().optional(),
        category: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const params: any[] = [];
        let paramIndex = 1;

        // Build WHERE conditions
        const conditions: string[] = [];

        if (input.code) {
          conditions.push(`code ILIKE $${paramIndex}`);
          params.push(`%${input.code}%`);
          paramIndex++;
        }

        const today = new Date();

        switch (input.category) {
          case "active":
            conditions.push(`start_date <= $${paramIndex}`);
            params.push(today);
            paramIndex++;

            conditions.push(`expiry_date >= $${paramIndex}`);
            params.push(today);
            paramIndex++;

            conditions.push(`is_active = true`);
            break;

          case "inactive":
            conditions.push(`is_active = false`);
            break;

          case "upcoming":
            conditions.push(`start_date > $${paramIndex}`);
            params.push(today);
            paramIndex++;
            break;

          case "expired":
            conditions.push(`expiry_date < $${paramIndex}`);
            params.push(today);
            paramIndex++;
            break;
        }

        const whereClause =
          conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

        // Get vouchers
        const vouchersQuery = `
          SELECT 
            id,
            code,
            "discountType",
           "discountValue",
          "maxDiscount",
            "minPurchase",
           "usageLimit",
            "usageCount",
            is_for_all_categories as "isForAllCategories",
            is_active as "isActive",
            start_date as "startDate",
            expiry_date as "expiryDate",
            description,
            created_at as "createdAt",
            updated_at as "updatedAt"
          FROM vouchers
          ${whereClause}
          ORDER BY created_at DESC
        `;

        const vouchers = (await ctx.prisma.$queryRawUnsafe(
          vouchersQuery,
          ...params
        )) as any[];

        if (vouchers.length === 0) {
          return [];
        }

        const voucherIds = vouchers.map((v) => v.id);
        const placeholders = voucherIds.map((_, i) => `$${i + 1}`).join(",");

        // Get usage data
        const usageQuery = `
          SELECT 
            id,
            voucher_id as "voucherId",
            order_id as "orderId",
            username,
            whatsapp,
            amount,
            created_at as "createdAt",
            expires_at as "expiresAt"
          FROM voucher_usages
          WHERE voucher_id IN (${placeholders})
          ORDER BY created_at DESC
        `;

        const usage = (await ctx.prisma.$queryRawUnsafe(
          usageQuery,
          ...voucherIds
        )) as any[];

        // Get categories data
        const categoriesQuery = `
        SELECT 
          vc.id,
          vc.voucher_id as "voucherId",
          vc.category_id as "categoryId",
          k.id as "categoryDetailId",
          k.nama as "categoryName"
        FROM voucher_categories vc
        LEFT JOIN kategoris k ON vc.category_id = k.id
        WHERE vc.voucher_id IN (${placeholders})
      `;

        const categories = (await ctx.prisma.$queryRawUnsafe(
          categoriesQuery,
          ...voucherIds
        )) as any[];

        // Group usage and categories by voucher ID
        const usageByVoucher = usage.reduce((acc, item) => {
          if (!acc[item.voucherId]) acc[item.voucherId] = [];
          acc[item.voucherId].push(item);
          return acc;
        }, {} as Record<number, any[]>);

        const categoriesByVoucher = categories.reduce((acc, item) => {
          if (!acc[item.voucherId]) acc[item.voucherId] = [];
          acc[item.voucherId].push(item);
          return acc;
        }, {} as Record<number, any[]>);

        const result = vouchers.map((voucher) => ({
          ...voucher,
          usage: usageByVoucher[voucher.id] || [],
          categories: (categoriesByVoucher[voucher.id] || []).map(
            (cat: any) => ({
              id: cat.id,
              voucherId: cat.voucherId,
              categoryId: cat.categoryId,
              category: {
                id: cat.categoryDetailId,
                nama: cat.categoryName,
              },
            })
          ),
        }));
        return result;
      } catch (error) {
        if (error instanceof TRPCError) {
          console.error(error.message);
        }
        throw error;
      }
    }),
  create: publicProcedure
    .input(createVoucherSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const parsedInput = {
          ...input,
          startDate:
            input.startDate instanceof Date
              ? input.startDate
              : new Date(input.startDate),
          expiryDate:
            input.expiryDate instanceof Date
              ? input.expiryDate
              : new Date(input.expiryDate),
        };
        const {
          code,
          discountType,
          discountValue,
          expiryDate,
          isActive,
          isForAllCategories,
          startDate,
          categoryIds,
          description,
          maxDiscount,
          minPurchase,
          usageLimit,
        } = parsedInput;

        const data = await ctx.prisma.voucher.create({
          data: {
            code,
            discountType,
            discountValue,
            expiryDate,
            isActive,
            maxDiscount,
            description,
            startDate,
            isForAllCategories,
            usageLimit,
            minPurchase,
          },
        });

        if (categoryIds) {
          const categoryId = Promise.all(
            categoryIds.map(async (p) => {
              await ctx.prisma.voucherCategory.create({
                data: {
                  categoryId: p,
                  voucherId: data.id,
                },
              });
            })
          );

          return categoryId;
        }
        return data;
      } catch (error) {
        if (error instanceof TRPCError) {
          console.error(error.message);
        }
        throw error;
      }
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        data: createVoucherSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const parsedInput = {
          ...input.data,
          startDate:
            input.data.startDate instanceof Date
              ? input.data.startDate
              : new Date(input.data.startDate as string),
          expiryDate:
            input.data.expiryDate instanceof Date
              ? input.data.expiryDate
              : new Date(input.data.expiryDate as string),
        };
        const {
          code,
          discountType,
          discountValue,
          expiryDate,
          isActive,
          isForAllCategories,
          startDate,
          categoryIds,
          description,
          maxDiscount,
          minPurchase,
          usageLimit,
        } = parsedInput;

        const data = await ctx.prisma.voucher.update({
          where: {
            id: input.id,
          },
          data: {
            code,
            discountType,
            discountValue,
            expiryDate,
            isActive,
            maxDiscount,
            description,
            startDate,
            isForAllCategories,
            usageLimit,
            minPurchase,
          },
        });

        if (categoryIds) {
          const categoryId = Promise.all(
            categoryIds.map(async (p) => {
              await ctx.prisma.voucherCategory.create({
                data: {
                  categoryId: p,
                  voucherId: data.id,
                },
              });
            })
          );

          return categoryId;
        }
        return data;
      } catch (error) {
        if (error instanceof TRPCError) {
          console.error(error.message);
        }
        throw error;
      }
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.voucher.delete({
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new Error("Terjadi Kesalahan");
        }
        throw error;
      }
    }),
  validateVoucher: publicProcedure
    .input(
      z.object({
        code: z.string(),
        categoryCode: z.string(),
        amount: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { amount, categoryCode, code } = input;
        let discountAmount = 0;
        let finalPrice = 0;

        if (!code || !amount || amount < 0) {
          return {
            status: false,
            message:
              "Kode voucher belum diisi dan pilih product terlebih dahulu",
            discountAmount: 0,
            finalPrice: 0,
            voucherId: 0,
          };
        }

        const prismaTransaction = await ctx.prisma.$transaction(async (tx) => {
          const category = await tx.categories.findFirst({
            where: {
              kode: categoryCode,
            },
            select: {
              id: true,
            },
          });

          if (!category) {
            return {
              status: false,
              message: "Voucher ini tidak tersedia untuk kategori ini",
              discountAmount: 0,
              finalPrice: 0,
              voucherId: 0,
            };
          }

          const validate = await checkingVoucher(tx, {
            amount,
            categoryId: category?.id,
            voucherCode: code,
          });

          finalPrice = validate.finalPrice;
          discountAmount = validate.discountAmount;
        });

        return {
          status: true,
          message: "Voucher is valid and applicable",
          discountAmount,
          finalPrice,
          voucherId: 0,
        };
      } catch (error) {
        return {
          status: false,
          message: "Validated voucher failed",
          discountAmount: 0,
          finalPrice: 0,
          voucherId: 0,
        };
      }
    }),

  applyVoucher: publicProcedure
    .input(
      z.object({
        code: z.string(),
        categoryId: z.string(),
        amount: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Reuse validasi yang sama dengan validateVoucher
        const validationResult = await ctx.prisma.$transaction(
          async (prisma) => {
            const currentDate = new Date();

            // Cari dan lock voucher untuk mencegah race condition
            const voucher = await prisma.voucher.findFirst({
              where: {
                code: input.code,
                isActive: "active",
                startDate: { lte: currentDate },
                expiryDate: { gte: currentDate },
                AND: [
                  {
                    OR: [
                      { isForAllCategories: "yes" },
                      {
                        categories: {
                          some: {
                            categoryId: parseInt(input.categoryId),
                          },
                        },
                      },
                    ],
                  },
                  {
                    OR: [
                      { minPurchase: null },
                      { minPurchase: { lte: input.amount } },
                    ],
                  },
                ],
              },
            });

            if (!voucher) {
              throw new TRPCError({
                code: "NOT_FOUND",
                message:
                  "Kode voucher tidak valid atau tidak berlaku untuk kategori ini",
              });
            }

            // Hitung diskon
            let discountAmount = 0;

            if (voucher.discountType === "PERCENTAGE") {
              discountAmount = (input.amount * voucher.discountValue) / 100;

              if (voucher.maxDiscount && discountAmount > voucher.maxDiscount) {
                discountAmount = voucher.maxDiscount;
              }
            } else if (voucher.discountType === "FIXED") {
              discountAmount = voucher.discountValue;

              if (discountAmount > input.amount) {
                discountAmount = input.amount;
              }
            }

            return {
              voucherId: voucher.id,
              discountAmount,
              finalAmount: input.amount - discountAmount,
            };
          }
        );

        return {
          success: true,
          ...validationResult,
          message: "Voucher berhasil diterapkan pada transaksi",
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Terjadi kesalahan saat menerapkan voucher",
        });
      }
    }),
});
