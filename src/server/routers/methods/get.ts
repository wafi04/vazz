import { publicProcedure, router } from "@/server/trpc";
import { methodschema } from "@/types/schema/method";
import { Prisma } from "@prisma/client";
import { z } from "zod";

export const filterMethods = z.object({
  isActive: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
  type: z.string().optional(),
  search: z.string().optional(),
  isAll: z.boolean().optional(),
});

export const Methods = router({
  getAll: publicProcedure.input(filterMethods).query(async ({ ctx, input }) => {
    const { prisma } = ctx;
    const { isActive, page = 1, type, limit, search, isAll = false } = input;

    const where = {
      ...(isActive !== undefined && {
        isActive: isActive === "Active" ? true : false,
      }),
      ...(type && {
        tipe: type,
      }),
      ...(search && {
        name: {
          contains: search,
        },
      }),
    };

    if (isAll) {
      const methods = await prisma.method.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
      });

      const total = methods.length;

      return {
        data: methods,
        total,
        pagination: {
          page: 1,
          limit: total,
          totalPages: 1,
        },
      };
    }

    // Jika menggunakan pagination
    if (limit && limit > 0) {
      const skip = (page - 1) * limit;

      const methods = await prisma.method.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      });

      const total = await prisma.method.count({ where });
      const totalPages = Math.ceil(total / limit);

      return {
        data: methods,
        total,
        pagination: {
          page,
          limit,
          totalPages,
        },
      };
    }

    const methods = await prisma.method.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    const total = methods.length;

    return {
      data: methods,
      total,
      pagination: {
        page: 1,
        limit: total,
        totalPages: 1,
      },
    };
  }),
  create: publicProcedure
    .input(methodschema)
    .mutation(async ({ ctx, input }) => {
      try {
        const newMethod = await ctx.prisma.method.create({
          data: { ...input },
        });

        return {
          data: newMethod,
          status: true,
          message: "Method created successfully",
        };
      } catch (error) {
        return {
          data: null,
          status: false,
          message: "Failed to create method",
        };
      }
    }),

  // Update method (new procedure)
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        data: methodschema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const updatedMethod = await ctx.prisma.method.update({
          where: { id: input.id },
          data: input.data,
        });

        return {
          data: updatedMethod,
          status: true,
          message: "Method updated successfully",
        };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          // Handle specific Prisma errors
          if (error.code === "P2025") {
            return {
              data: null,
              status: false,
              message: "Method not found",
            };
          }
        }

        return {
          data: null,
          status: false,
          message: "Failed to update method",
        };
      }
    }),

  // Delete method (new procedure)
  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const deletedMethod = await ctx.prisma.method.delete({
          where: { id: input.id },
        });

        return {
          data: deletedMethod,
          status: true,
          message: "Method deleted successfully",
        };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          // Handle specific Prisma errors
          if (error.code === "P2025") {
            return {
              data: null,
              status: false,
              message: "Method not found",
            };
          }
        }

        return {
          data: null,
          status: false,
          message: "Failed to delete method",
        };
      }
    }),
});
