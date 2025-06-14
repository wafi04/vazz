import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { FormatPrice } from "@/utils/formatPrice";
import { Transaction } from "@/types/transaction";

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
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
    totalCount: number;
  };
};

const calculateProfit = (
  transactions: { harga: number; profitRupiah: number }[]
) =>
  transactions.reduce((sum, t) => {
    const profitAmount = Math.round(t.profitRupiah);
    return sum + profitAmount;
  }, 0);

// Input validation schema - pagination only for recent transactions
const adminStatsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

export const adminStats = publicProcedure
  .input(adminStatsSchema)
  .query(async ({ ctx, input }): Promise<AdminStats> => {
    try {
      const { page, limit } = input;
      const offset = (page - 1) * limit;
      const startOfToday = getStartOfDayInWIB();
      const startOfMonth = getStartOfMonthInWIB();

      // Raw SQL queries for better performance
      const [
        todayRevenueResult,
        thisMonthRevenueResult,
        statusCountsResult,
        transactionsResult,
        totalTransactionsCountResult,
        profitTransactionsResult,
      ] = await Promise.all([
        // Today's revenue
        ctx.prisma.$queryRaw<[{ total_revenue: bigint | null }]>`
          SELECT COALESCE(SUM(harga), 0) as total_revenue
          FROM pembelians 
          WHERE status = 'SUCCESS' 
          AND created_at >= ${startOfToday}
        `,

        // This month's revenue
        ctx.prisma.$queryRaw<[{ total_revenue: bigint | null }]>`
          SELECT COALESCE(SUM(harga), 0) as total_revenue
          FROM pembelians 
          WHERE status = 'SUCCESS' 
          AND created_at >= ${startOfMonth}
        `,

        // Status counts - no pagination, get all status counts
        ctx.prisma.$queryRaw<Array<{ status: string; count: bigint }>>`
          SELECT status, COUNT(*) as count
          FROM pembelians 
          GROUP BY status
        `,

        // Recent transactions with pagination - adjusted for new interface
        ctx.prisma.$queryRaw<
          Array<{
            id: number;
            order_id: string;
            username: string | null;
            user_id: string | null;
            zone: string | null;
            nickname: string | null;
            layanan: string;
            price_buy: number;
            discount: number;
            harga: number;
            profit: number;
            profit_rupiah: number;
            status: string;
            is_re_order: boolean;
            created_at: Date | null;
            updated_at: Date | null;
            log: string | null;
            success_report_sended: boolean | null;
            // Payment fields
            payment_id: number | null;
            payment_created_at: Date | null;
            payment_updated_at: Date | null;
            payment_status: string | null;
            payment_fee: number | null;
            payment_fee_rupiah: number | null;
            payment_total_amount: number | null;
            payment_harga: string | null;
            payment_order_id: string | null;
            payment_no_pembeli: string | null;
            payment_metode: string | null;
            payment_reference: string | null;
          }>
        >`
          SELECT 
            p.id,
            p.order_id,
            p.username,
            p.user_id,
            p.zone,
            p.nickname,
            p.layanan,
            p.price_buy,
            p.discount,
            p.harga,
            p.profit,
            p.profit_rupiah,
            p.status,
            p.is_re_order,
            p.created_at,
            p.updated_at,
            p.log,
            p.success_report_sended,
            -- Payment details
            pb.id as payment_id,
            pb.created_at as payment_created_at,
            pb.updated_at as payment_updated_at,
            pb.status as payment_status,
            pb.fee as payment_fee,
            pb.fee_rupiah as payment_fee_rupiah,
            pb.total_amount as payment_total_amount,
            pb.harga as payment_harga,
            pb.order_id as payment_order_id,
            pb.no_pembeli as payment_no_pembeli,
            pb.metode as payment_metode,
            pb.reference as payment_reference
          FROM pembelians p
          LEFT JOIN pembayarans pb ON p.order_id = pb.order_id
          ORDER BY p.created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `,

        // Total count for recent transactions pagination only
        ctx.prisma.$queryRaw<[{ total_count: bigint }]>`
          SELECT COUNT(*) as total_count
          FROM pembelians
        `,

        // Profit calculations
        ctx.prisma.$queryRaw<
          Array<{
            harga: number;
            profit_rupiah: number;
            created_at: Date;
          }>
        >`
          SELECT harga, profit_rupiah, created_at
          FROM pembelians 
          WHERE status = 'SUCCESS' 
          AND created_at >= ${startOfMonth}
        `,
      ]);

      // Process results
      const todayRevenue = Number(todayRevenueResult[0]?.total_revenue || 0);
      const thisMonthRevenue = Number(
        thisMonthRevenueResult[0]?.total_revenue || 0
      );

      // Transform transactions data to match interface
      const recentTransactions: Transaction[] = transactionsResult.map(
        (row) => ({
          id: row.id,
          isReorder: row.is_re_order,
          orderId: row.order_id,
          username: row.username,
          layanan: row.layanan,
          discount: row.discount,
          priceBuy: row.price_buy,
          profit: row.profit,

          profitRupiah: row.profit_rupiah.toString(),
          harga: row.harga,
          status: row.status,
          createdAt: row.created_at?.toISOString() || null,
          updatedAt: row.updated_at?.toISOString() || null,
          log: row.log,
          nickname: row.nickname,
          zone: row.zone,
          userId: row.user_id,
          successReportSended: row.success_report_sended || false,
          pembayaran: row.payment_id
            ? {
                id: row.payment_id,
                createdAt: row.payment_created_at?.toISOString() || null,
                updatedAt: row.payment_updated_at?.toISOString() || null,
                status: row.payment_status || "",
                fee: row.payment_fee,
                feeRupiah: row.payment_fee_rupiah,
                totalAmount: row.payment_total_amount || 0,
                harga: row.payment_harga || "",
                orderId: row.payment_order_id || row.order_id,
                noPembayaran: "",
                noPembeli: row.payment_no_pembeli || "",
                metode: row.payment_metode || "",
                reference: row.payment_reference,
              }
            : null,
        })
      );

      // Process status counts
      const statusMap = statusCountsResult.reduce(
        (acc, curr) => ({
          ...acc,
          [curr.status.toLowerCase()]: Number(curr.count),
        }),
        { successful: 0, pending: 0, failed: 0 }
      );

      // Calculate profits
      const todayProfit = calculateProfit(
        profitTransactionsResult
          .filter((t) => t.created_at >= startOfToday)
          .map((t) => ({ harga: t.harga, profitRupiah: t.profit_rupiah }))
      );

      const thisMonthProfit = calculateProfit(
        profitTransactionsResult.map((t) => ({
          harga: t.harga,
          profitRupiah: t.profit_rupiah,
        }))
      );

      // Calculate pagination - only for recent transactions
      const totalCount = Number(
        totalTransactionsCountResult[0]?.total_count || 0
      );
      const totalPages = Math.ceil(totalCount / limit);
      const hasMore = page < totalPages;

      // Calculate percentages
      const totalTransactions = Object.values(statusMap).reduce(
        (sum, count) => sum + count,
        0
      );

      const successPercentage =
        totalTransactions > 0
          ? ((statusMap.successful / totalTransactions) * 100).toFixed(2)
          : "0";

      const failedPercentage =
        totalTransactions > 0
          ? ((statusMap.failed / totalTransactions) * 100).toFixed(2)
          : "0";

      return {
        totalTransactions,
        recentTransactions,
        statusCounts: statusMap,
        revenue: {
          today: FormatPrice(todayRevenue),
          thisMonth: FormatPrice(thisMonthRevenue),
          thisMonthFormatted: thisMonthRevenue,
        },
        profit: {
          today: FormatPrice(todayProfit),
          thisMonth: FormatPrice(thisMonthProfit),
        },
        percentages: {
          success: `${successPercentage}%`,
          failed: `${failedPercentage}%`,
        },
        pagination: {
          page,
          limit,
          totalPages,
          hasMore,
          totalCount,
        },
      };
    } catch (error) {
      console.error("Admin stats query error:", error);
      throw new Error(
        `Failed to fetch admin statistics: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  });

// Optional: Separate procedure for real-time stats (without pagination)
export const adminStatsRealtime = publicProcedure.query(async ({ ctx }) => {
  try {
    const startOfToday = getStartOfDayInWIB();
    const startOfMonth = getStartOfMonthInWIB();

    const [todayStats, monthStats, statusCounts] = await Promise.all([
      // Today's stats
      ctx.prisma.$queryRaw<
        [
          {
            revenue: bigint | null;
            profit: bigint | null;
            transactions: bigint;
          }
        ]
      >`
        SELECT 
          COALESCE(SUM(CASE WHEN status = 'SUCCESS' THEN harga END), 0) as revenue,
          COALESCE(SUM(CASE WHEN status = 'SUCCESS' THEN profit_rupiah END), 0) as profit,
          COUNT(*) as transactions
        FROM pembelians 
        WHERE created_at >= ${startOfToday}
      `,

      // This month's stats
      ctx.prisma.$queryRaw<
        [
          {
            revenue: bigint | null;
            profit: bigint | null;
            transactions: bigint;
          }
        ]
      >`
        SELECT 
          COALESCE(SUM(CASE WHEN status = 'SUCCESS' THEN harga END), 0) as revenue,
          COALESCE(SUM(CASE WHEN status = 'SUCCESS' THEN profit_rupiah END), 0) as profit,
          COUNT(*) as transactions
        FROM pembelians 
        WHERE created_at >= ${startOfMonth}
      `,

      // Status distribution
      ctx.prisma.$queryRaw<Array<{ status: string; count: bigint }>>`
        SELECT status, COUNT(*) as count
        FROM pembelians 
        WHERE created_at >= ${startOfMonth}
        GROUP BY status
      `,
    ]);

    return {
      today: {
        revenue: FormatPrice(Number(todayStats[0]?.revenue || 0)),
        profit: FormatPrice(Number(todayStats[0]?.profit || 0)),
        transactions: Number(todayStats[0]?.transactions || 0),
      },
      thisMonth: {
        revenue: FormatPrice(Number(monthStats[0]?.revenue || 0)),
        profit: FormatPrice(Number(monthStats[0]?.profit || 0)),
        transactions: Number(monthStats[0]?.transactions || 0),
      },
      statusDistribution: statusCounts.reduce(
        (acc, curr) => ({
          ...acc,
          [curr.status.toLowerCase()]: Number(curr.count),
        }),
        {}
      ),
    };
  } catch (error) {
    console.error("Real-time stats error:", error);
    throw new Error("Failed to fetch real-time statistics");
  }
});
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
