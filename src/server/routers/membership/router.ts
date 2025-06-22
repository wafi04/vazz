import { getProfile } from "@/app/(auth)/auth/components/server";
import { formatResponse } from "@/lib/trpc-response";
import { publicProcedure, router } from "@/server/trpc";
import {
  membershipById,
  membershipCreate,
  membershipUpdate,
} from "@/types/schema/membership";
import { TRPCClientError } from "@trpc/client";
import { z } from "zod";

export const MembershipRouter = router({
  // CREATE
  create: publicProcedure
    .input(membershipCreate)
    .mutation(async ({ ctx, input }) => {
      try {
        const create = await ctx.prisma.membership.create({
          data: {
            ...input,
          },
        });
        return formatResponse(create, "Membership created successfully");
      } catch (error) {
        return formatResponse(null, "Failed to create membership");
      }
    }),

  // READ - Get All
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      const memberships = await ctx.prisma.membership.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
      return formatResponse(memberships, "Memberships retrieved successfully");
    } catch (error) {
      return formatResponse(null, "Failed to retrieve memberships");
    }
  }),

  // READ - Get By ID
  getById: publicProcedure
    .input(membershipById)
    .query(async ({ ctx, input }) => {
      try {
        const membership = await ctx.prisma.membership.findUnique({
          where: {
            id: input.id,
          },
        });

        if (!membership) {
          return formatResponse(null, "Membership not found");
        }

        return formatResponse(membership, "Membership retrieved successfully");
      } catch (error) {
        return formatResponse(null, "Failed to retrieve membership");
      }
    }),

  // UPDATE
  update: publicProcedure
    .input(membershipUpdate)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...updateData } = input;

        // Check if membership exists
        const existingMembership = await ctx.prisma.membership.findUnique({
          where: { id },
        });

        if (!existingMembership) {
          return formatResponse(null, "Membership not found");
        }

        const updatedMembership = await ctx.prisma.membership.update({
          where: {
            id,
          },
          data: updateData,
        });

        return formatResponse(
          updatedMembership,
          "Membership updated successfully"
        );
      } catch (error) {
        return formatResponse(null, "Failed to update membership");
      }
    }),

  // DELETE
  delete: publicProcedure
    .input(membershipById)
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if membership exists
        const existingMembership = await ctx.prisma.membership.findUnique({
          where: { id: input.id },
        });

        if (!existingMembership) {
          return formatResponse(null, "Membership not found");
        }

        await ctx.prisma.membership.delete({
          where: {
            id: input.id,
          },
        });

        return formatResponse(null, "Membership deleted successfully");
      } catch (error) {
        return formatResponse(null, "Failed to delete membership");
      }
    }),

  getMembership: publicProcedure.query(async ({ ctx }) => {
    try {
      const user = await getProfile();
      if (!user) {
        throw new TRPCClientError("unauthentcated");
      }
      const membership = await ctx.prisma.transaction.findMany({
        where: {
          AND: [
            {
              username: user?.session.username,
              transactionType: "Membership",
            },
          ],
        },
        include: {
          payment: true,
        },
      });

      return formatResponse(
        membership,
        "Membership User Retrieved successfully"
      );
    } catch (error) {
      throw new TRPCClientError("failed to get membership");
    }
  }),

  // ADDITIONAL: Get with pagination
  getPaginated: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { page, limit, search } = input;
        const skip = (page - 1) * limit;

        const where = search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" as const } },
                {
                  description: {
                    contains: search,
                    mode: "insensitive" as const,
                  },
                },
              ],
            }
          : {};

        const [memberships, total] = await Promise.all([
          ctx.prisma.membership.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
              createdAt: "desc",
            },
          }),
          ctx.prisma.membership.count({ where }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return formatResponse(
          {
            data: memberships,
            pagination: {
              page,
              limit,
              total,
              totalPages,
              hasNext: page < totalPages,
              hasPrev: page > 1,
            },
          },
          "Memberships retrieved successfully"
        );
      } catch (error) {
        return formatResponse(null, "Failed to retrieve memberships");
      }
    }),
});
