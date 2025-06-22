import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { Prisma } from "@prisma/client";
import {
  findUserById,
  findUserByUsername,
  getProfile,
} from "@/app/(auth)/auth/components/server";

export const member = router({
  findAll: publicProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
        filter: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const where: Prisma.UserWhereInput = {};

        if (input.filter) {
          where.username = input.filter;
        }

        const skip = (input.page - 1) * input.perPage;
        const take = input.perPage;

        const [data, total] = await Promise.all([
          ctx.prisma.user.findMany({
            where,
            skip,
            take,
            orderBy: {
              createdAt: "desc",
            },
          }),
          ctx.prisma.user.count({ where }),
        ]);

        return {
          data,
          meta: {
            total,
            page: input.page,
            perPage: input.perPage,
            pageCount: Math.ceil(total / input.perPage),
          },
        };
      } catch (error) {
        throw new Error(
          `Failed to fetch members: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }),
  findMembership: publicProcedure.query(async ({ ctx }) => {
    try {
      const session = await getProfile();
      if (!session) {
        return {
          status: false,
          message: "Message retrieved successfully",
        };
      }
      const membershipme = await ctx.prisma.deposit.findMany({
        where: {
          username: session.session.username,
          depositId: {
            startsWith: "MEM",
          },
        },
      });

      return {
        status: true,
        data: membershipme,
      };
    } catch (error) {
      return {
        status: false,
        message: "Error retrieving membership data",
      };
    }
  }),
  findMe: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1).optional(),
        limit: z.number().min(1).max(100).default(10).optional(), // Optional limit with validation
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const session = await getProfile();
        if (!session) {
          return {
            data: null,
            status: false,
            message: "Session not found",
          };
        }

        const { page = 1, limit = 10 } = input;
        const skip = (page - 1) * limit;

        // Get total count of pembelian for pagination info
        const totalPembelian = await ctx.prisma.transaction.count({
          where: {
            username: session.session?.username, // Adjust this based on your relation
          },
        });

        const profile = await ctx.prisma.user.findUnique({
          where: {
            username: session.session?.username,
          },
          select: {
            id: true,
            name: true,
            username: true,
            balance: true,
            role: true,
            otp: true,
            whatsapp: true,
            apiKey: true,
            transactions: {
              skip: skip,
              take: limit,
              orderBy: {
                createdAt: "desc",
              },
            },
            createdAt: true,
            updatedAt: true,
          },
        });

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalPembelian / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return {
          status: true,
          data: {
            ...profile,
            pagination: {
              currentPage: page,
              totalPages: totalPages,
              totalItems: totalPembelian,
              itemsPerPage: limit,
              hasNextPage: hasNextPage,
              hasPrevPage: hasPrevPage,
            },
          },
          message: "Profile Retrieved Successfully",
        };
      } catch (error) {
        return {
          message: error instanceof Error ? error.message : "unknown error",
          status: false,
          data: null,
        };
      }
    }),
  add: publicProcedure
    .input(
      z.object({
        username: z.string(),
        name: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const validate = await findUserByUsername(input.username);

        if (validate) {
          throw new Error("Username Telah Terpakai");
        }

        const create = await ctx.prisma.user.create({
          data: {
            lastPaymentAt: new Date(),
            ...input,
            role: "Member",
            balance: 0,
          },
        });

        if (!create) {
          throw new Error("Failed to create user");
        }

        return {
          data: create,
          message: "Create user successfully",
          status: true,
        };
      } catch (error) {
        throw error instanceof Error ? error : new Error("Failed Create User");
      }
    }),
  edit: publicProcedure
    .input(
      z.object({
        name: z.string(),
        id: z.number(),
        role: z.string(),
        balance: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const create = await ctx.prisma.user.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
            role: input.role,
            balance: input.balance,
          },
        });

        if (!create) {
          throw new Error("Failed to create user");
        }

        return {
          data: create,
          message: "Update member successfully",
          status: true,
        };
      } catch (error) {
        throw error instanceof Error ? error : new Error("Failed Update User");
      }
    }),
  deleteUser: publicProcedure
    .input(
      z.object({
        userId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await findUserById(input.userId);

        if (!user) {
          return {
            status: false,
            message: "user not found",
          };
        }
        const userdelete = await ctx.prisma.user.delete({
          where: {
            id: input.userId,
          },
        });

        if (!userdelete) {
          return {
            status: false,
            message: "failed to delete Users",
          };
        }
        return {
          status: false,
          message: "delete user successfully",
          data: userdelete,
        };
      } catch (error) {
        return {
          status: false,
          message: "internal Server Erorr",
        };
      }
    }),
});
