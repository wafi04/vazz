/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { Prisma } from "@prisma/client";
import { layananFormSchema } from "@/types/layanans";

export const Layanans = router({
  getLayanans: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
        search: z.string().optional(),
        status: z.string().optional(),
        page: z.string().transform((val) => parseInt(val, 10) || 1),
        perPage: z.string().transform((val) => parseInt(val, 10) || 10),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const skip = (input.page - 1) * input.perPage;

        const where: Prisma.ServiceWhereInput = {};

        // Add search filter
        if (input.search) {
          where.serviceName = {
            contains: input.search,
          };
        }

        // Add status filter
        if (input.status) {
          where.status = input.status;
        }

        // Execute query with filters
        const data = await ctx.prisma.service.findMany({
          where,
          skip,
          take: input.perPage,
          orderBy: {
            serviceName: "desc", // Default ordering
          },
          select: {
            id: true,
            serviceName: true,
            pricePlatinum: true,
            price: true,
            status: true,
          },
        });

        // Get total count for pagination info (optional)
        const totalCount = await ctx.prisma.service.count({ where });

        return {
          data,
          pagination: {
            total: totalCount,
            page: input.page,
            perPage: input.perPage,
            pageCount: Math.ceil(totalCount / input.perPage),
          },
        };
      } catch (error) {
        if (error instanceof Error) {
          console.error("error : ", error.message);
        }
        console.error("error fetching layanans");
        return {
          data: [],
          pagination: {
            total: 0,
            page: input.page,
            perPage: input.perPage,
            pageCount: 0,
          },
        };
      }
    }),
  getAll: publicProcedure
    .input(
      z.object({
        categoryId: z.string().optional(),
        subCategoryId: z.number().optional(),
        providerId: z.string().optional(),
        search: z.string().optional(),
        status: z.string().optional(),
        isFlashSale: z.boolean().optional(),
        page: z.number(),
        perPage: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const skip = (input.page - 1) * input.perPage;

        const where: Prisma.ServiceWhereInput = {};

        // Add search filter
        if (input.search) {
          where.serviceName = {
            contains: input.search,
          };
        }

        // Add category filter
        if (input.categoryId) {
          where.categoryId = parseInt(input.categoryId);
        }

        // Add provider filter
        if (input.providerId) {
          where.providerId = input.providerId;
        }

        // Add status filter
        if (input.status !== undefined) {
          where.status = input.status;
        }

        // Add flash sale filter
        if (input.isFlashSale !== undefined) {
          where.isFlashSale =
            input.isFlashSale === true ? "active" : "inactive";
        }

        // Execute query with filters
        const data = await ctx.prisma.service.findMany({
          where,
          skip,
          take: input.perPage,
          orderBy: {
            serviceName: "asc", // Default ordering
          },
          // No include section since relationships don't exist
        });

        // Get total count for pagination info
        const totalCount = await ctx.prisma.service.count({ where });

        const transformedData = await Promise.all(
          data.map(async (item) => {
            const category = await ctx.prisma.category.findUnique({
              where: { id: item.categoryId },
              select: { id: true, name: true },
            });

            return {
              ...item,
              name: item.serviceName,
              price: item.price,
              isActive: item.status,
            };
          })
        );

        // Calculate pagination information
        const totalPages = Math.ceil(totalCount / input.perPage);
        const hasNextPage = input.page < totalPages;
        const hasPreviousPage = input.page > 1;

        return {
          data: transformedData,
          pagination: {
            totalCount,
            totalPages,
            currentPage: input.page,
            hasNextPage,
            hasPreviousPage,
          },
        };
      } catch (error) {
        return {
          data: [],
          pagination: {
            totalCount: 0,
            currentPage: input.page,
            perPage: input.perPage,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        };
      }
    }),
  getLayananByCategory: publicProcedure
    .input(
      z.object({
        category: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const category = await ctx.prisma.category.findFirst({
          where: { code: input.category },
        });
        const subCategories = await ctx.prisma.subCategory.findMany({
          where: {
            categoryId: category?.id,
            isActive: "active",
          },
        });
        const data = await ctx.prisma.service.findMany({
          where: {
            categoryId: category?.id,
          },
          select: {
            serviceName: true,
            providerId: true,
            pricePlatinum: true,
            price: true,
            priceFlashSale: true,
            isFlashSale: true,
            id: true,
          },
          orderBy: {
            price: "asc",
          },
        });
        return {
          status: true,
          layanan: data,
          subCategories,
        };
      } catch (error) {
        return {
          status: false,
          layanan: [],
          subCategories: [],
        };
      }
    }),
  getLayananByCategoryId: publicProcedure
    .input(
      z.object({
        category: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const category = await ctx.prisma.category.findFirst({
          where: { id: parseInt(input.category) },
        });

        if (!category) {
          throw new Error("failed to create category");
        }

        const data = await ctx.prisma.service.findMany({
          where: {
            categoryId: category?.id,
          },
          select: {
            serviceName: true,
            providerId: true,
            price: true,
            id: true,
          },
          orderBy: {
            price: "asc",
          },
        });
        return {
          layanan: data,
        };
      } catch (error) {
        return {
          error,
          status: false,
        };
      }
    }),
  edit: publicProcedure
    .input(layananFormSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.service.update({
          where: {
            id: input.id as number,
          },
          data: {
            ...input,
            status: input.status,
          },
        });

        return {
          status: true,
          message: "layanan update successfully",
        };
      } catch (error) {
        return {
          error,
          status: false,
        };
      }
    }),
  flashsale: publicProcedure.query(async ({ ctx }) => {
    try {
      // First, fetch all flash sale items
      const layananItems = await ctx.prisma.service.findMany({
        where: {
          isFlashSale: "active",
        },
      });

      // Get all the unique kategoriId values
      const categoryIds = Array.from(
        new Set(layananItems.map((item) => item.categoryId))
      );

      // Fetch all related categories in one query
      const categories = await ctx.prisma.category.findMany({
        where: {
          // Use 'in' operator to fetch multiple categories at once
          id: {
            in: categoryIds.map((id) => id),
          },
        },
      });

      const categoryMap = categories.reduce<
        Record<string, (typeof categories)[0]>
      >((acc, category) => {
        acc[category.id.toString()] = category;
        return acc;
      }, {});

      // Combine layanan items with their categories
      const data = layananItems.map((layanan) => ({
        ...layanan,
        category: categoryMap[layanan.categoryId] || null,
      }));

      return data;
    } catch (error) {
      return {
        error,
        status: false,
      };
    }
  }),
});
