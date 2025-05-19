import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { Transaction } from "@/types/transaction";
import { FormatPrice } from "@/utils/formatPrice";

const getStartOfDayInWIB = () => {
  const now = new Date();
  const utcMillis = now.getTime();
  const startOfDay = new Date(utcMillis);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
};

const getStartOfMonthInWIB = () => {
  const now = new Date();
  const utcMillis = now.getTime();
  const startOfMonth = new Date(utcMillis);
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  return startOfMonth;
};

type AdminStats = {
  totalTransactions: number;
  recentTransactions: Transaction[];
  statusCounts: { successful: number; pending: number; failed: number };
  revenue: { today: string; thisMonth: string; thisMonthFormatted: number };
  profit: { today: string; thisMonth: string };
  percentages: { success: string; failed: string };
};

const calculateProfit = (transactions: { harga: number; profit: number }[]) =>
  transactions.reduce((sum, t) => {
    const profitAmount = Math.round((t.harga * t.profit) / (100 + t.profit));
    return sum + profitAmount;
  }, 0);

export const adminStats = publicProcedure.query(
  async ({ ctx }): Promise<AdminStats> => {
    try {
      const startOfToday = getStartOfDayInWIB();
      const startOfMonth = getStartOfMonthInWIB();

      // Aggregate revenue
      const [
        todayRevenue,
        thisMonthRevenue,
        statusCounts,
        recentTransactions,
        transactions,
      ] = await Promise.all([
        ctx.prisma.pembelian.aggregate({
          where: { status: "SUCCESS", createdAt: { gte: startOfToday } },
          _sum: { harga: true },
        }),
        ctx.prisma.pembelian.aggregate({
          where: { status: "SUCCESS", createdAt: { gte: startOfMonth } },
          _sum: { harga: true },
        }),
        ctx.prisma.pembelian.groupBy({
          by: ["status"],
          _count: { _all: true },
        }),
        ctx.prisma.pembelian.findMany({
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            pembayaran: true,
          },
        }),
        ctx.prisma.pembelian.findMany({
          where: { status: "SUCCESS", createdAt: { gte: startOfMonth } },
          select: { harga: true, profit: true, createdAt: true },
        }),
      ]);

      const todayProfit = calculateProfit(
        transactions.filter((t) => t.createdAt ?? new Date() >= startOfToday)
      );
      const thisMonthProfit = calculateProfit(transactions);

      const statusMap = statusCounts.reduce(
        (acc, curr) => ({
          ...acc,
          [curr.status.toLowerCase()]: curr._count._all,
        }),
        { successful: 0, pending: 0, failed: 0 }
      );

      const totalTransactions = Object.values(statusMap).reduce(
        (sum, count) => sum + count,
        0
      );
      const successPercentage =
        totalTransactions > 0
          ? ((statusMap.successful / totalTransactions) * 100).toFixed(2)
          : 0;
      const failedPercentage =
        totalTransactions > 0
          ? ((statusMap.failed / totalTransactions) * 100).toFixed(2)
          : 0;

      return {
        totalTransactions,
        recentTransactions,
        statusCounts: statusMap,
        revenue: {
          today: FormatPrice(todayRevenue._sum.harga || 0),
          thisMonth: FormatPrice(thisMonthRevenue._sum.harga || 0),
          thisMonthFormatted: thisMonthRevenue._sum.harga || 0,
        },
        profit: {
          today: FormatPrice(todayProfit),
          thisMonth: FormatPrice(thisMonthProfit),
        },
        percentages: {
          success: `${successPercentage}%`,
          failed: `${failedPercentage}%`,
        },
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch admin statistics: ${
          error instanceof Error && error.message
        }`
      );
    }
  }
);
export const PembelianAll = router({
  getId: publicProcedure
    .input(
      z.object({
        merchantOrderId: z.string().nullable(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { merchantOrderId } = input;

      // Periksa apakah merchantOrderId ada
      if (!merchantOrderId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Merchant Order ID is required",
        });
      }

      // Gunakan findUnique dengan kondisi yang spesifik
      const purchase = await ctx.prisma.pembelian.findUnique({
        where: {
          orderId: merchantOrderId,
        },
        include: {
          pembayaran: true,
        },
      });

      if (!purchase) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Transaction details not found",
        });
      }

      // Fetch layanan details jika diperlukan
      let layananDetails = null;
      if (purchase.layanan) {
        layananDetails = await ctx.prisma.layanan.findFirst({
          where: {
            layanan: purchase.layanan,
          },
        });
      }

      return {
        purchase,
        layananDetails,
      };
    }),
  getAll: publicProcedure
    .input(
      z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        status: z.string().optional(),
        page: z.number().min(1).optional().default(1),
        limit: z.number().min(1).optional().default(10),
        searchTerm: z.string().optional().default(""),
        all: z.boolean().optional().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { status, page, limit, searchTerm, endDate, startDate, all } =
          input;

        // Build the where clause
        const where: Prisma.PembelianWhereInput = {};

        // Filter by status
        if (status) {
          where.status = status;
        }

        // Search filter
        if (searchTerm) {
          where.OR = [
            { orderId: { contains: searchTerm } },
            { nickname: { contains: searchTerm } },
          ];
        }

        // Date filters
        if (startDate || endDate) {
          where.createdAt = {};

          if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            where.createdAt.gte = start;
          }

          if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            where.createdAt.lte = end;
          }
        }

        // Return all records if all flag is set
        if (all) {
          const allTransactions = await ctx.prisma.pembelian.findMany({
            where,
            include: {
              pembayaran: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          });

          return {
            transactions: allTransactions,
            totalCount: allTransactions.length,
          };
        }

        // Pagination
        const skip = (page - 1) * limit;

        // Execute queries in parallel
        const [transactions, totalCount] = await Promise.all([
          ctx.prisma.pembelian.findMany({
            where,
            skip,
            take: limit,
            include: {
              pembayaran: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          }),
          ctx.prisma.pembelian.count({ where }),
        ]);

        return {
          transactions,
          totalCount,
          pageCount: Math.ceil(totalCount / limit),
          currentPage: page,
        };
      } catch (error) {
        // Enhanced error reporting
        if (error instanceof Error) {
          throw new Error(`Failed to fetch pembelian data: ${error.message}`);
        }
        throw new Error("Failed to fetch pembelian data: Unknown error");
      }
    }),
  trackingInvoice: publicProcedure
    .input(
      z.object({
        invoice: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.pembayaran.findFirst({
          where: {
            orderId: input.invoice,
          },
          select: {
            orderId: true,
            noPembeli: true,
            status: true,
            updatedAt: true,
          },
        });
      } catch (error) {
        throw new Error("Invoice tidak ditemukan");
      }
    }),
  findMostPembelian: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.pembayaran.findMany({
      take: 10,
      select: {
        orderId: true,
        noPembeli: true,
        status: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  getAllPembelianData: publicProcedure.query(async ({ ctx }) => {
    const now = new Date();

    // Today: Last 24 hours
    const last24Hours = new Date(now);
    last24Hours.setHours(now.getHours() - 24);

    const lastWeek = new Date(now);
    lastWeek.setDate(now.getDate() - 7);

    const lastMonth = new Date(now);
    lastMonth.setDate(now.getDate() - 30);

    const aggregateAndSort = (transactions: any[]) => {
      const userTotals = new Map();

      transactions.forEach((tx) => {
        console.log(tx);
        const userKey = tx.username;

        if (!userKey) return;

        if (userTotals.has(userKey)) {
          const existingData = userTotals.get(userKey);
          userTotals.set(userKey, {
            username: tx.username || existingData.username,
            harga: existingData.harga + tx.harga,
          });
        } else {
          userTotals.set(userKey, {
            username: tx.username,
            harga: tx.harga,
          });
        }
      });

      return Array.from(userTotals.values())
        .sort((a, b) => b.harga - a.harga)
        .slice(0, 10); // Take top 10
    };

    // Common filter for successful transactions
    const commonFilter = {
      NOT: {
        AND: [{ username: "Guest" }, { nickname: "not-found" }],
      },
      status: {
        in: ["SUCCESS", "Success"],
      },
    };

    // Execute all queries in parallel for better performance
    const [todayTransactions, weekTransactions, monthTransactions] =
      await Promise.all([
        // Today's transactions (last 24 hours)
        ctx.prisma.pembelian.findMany({
          where: {
            createdAt: {
              gte: last24Hours,
              lte: now,
            },
            ...commonFilter,
          },
          select: {
            nickname: true,
            username: true,
            harga: true,
          },
        }),

        // This week's transactions (last 7 days)
        ctx.prisma.pembelian.findMany({
          where: {
            createdAt: {
              gte: lastWeek,
              lte: now,
            },
            ...commonFilter,
          },
          select: {
            nickname: true,
            username: true,
            harga: true,
          },
        }),

        // This month's transactions (last 30 days)
        ctx.prisma.pembelian.findMany({
          where: {
            createdAt: {
              gte: lastMonth,
              lte: now,
            },
            ...commonFilter,
          },
          select: {
            nickname: true,
            username: true,
            harga: true,
          },
        }),
      ]);

    // Aggregate and sort each time period's data
    const expensiveToday = aggregateAndSort(todayTransactions);
    const expensiveWeek = aggregateAndSort(weekTransactions);
    const expensiveMonth = aggregateAndSort(monthTransactions);

    // Return all data in a structured object
    return {
      expensive: {
        today: expensiveToday,
        week: expensiveWeek,
        month: expensiveMonth,
      },
    };
  }),
});
