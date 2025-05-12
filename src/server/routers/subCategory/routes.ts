import { formatResponse } from "@/lib/trpc-response";
import { publicProcedure, router } from "@/server/trpc";
import {
  DeleteSubCategorySchema,
  createSubCategorySchema,
  getAll,
  getByCategoryId,
  updateSubCategory,
} from "@/types/schema/subCategory";
import { Prisma } from "@prisma/client";

export const subCategories = router({
  getAll: publicProcedure.input(getAll).query(async ({ ctx, input }) => {
    try {
      const { page, perPage, search } = input;
      const where: Prisma.SubCategoryWhereInput = {};

      if (search) {
        where.name = {
          contains: search,
          mode: "insensitive",
        };
      }

      if (input.active !== "all") {
        where.active = input.active === "active";
      }

      const skip = (page - 1) * perPage;
      const total = await ctx.prisma.subCategory.count({ where });
      const totalPages = Math.ceil(total / perPage);

      const data = await ctx.prisma.subCategory.findMany({
        where,
        skip,
        take: perPage, // Changed from 'page' to 'perPage'
        orderBy: {
          createdAt: "desc",
        },
      });

      return formatResponse(
        {
          data,
          meta: {
            currentPage: page,
            perPage,
            totalItems: total, // Changed from 'data.length' to 'total'
            totalPages,
            total, // Changed from 'data.length' to 'total'
          },
        },
        "Sub Category Received Successfully"
      );
    } catch (error) {
      return formatResponse(null, "Failed to Receive Sub Category");
    }
  }),

  getByCode: publicProcedure
    .input(getByCategoryId)
    .query(async ({ ctx, input }) => {
      try {
        const sub = await ctx.prisma.subCategory.findMany({
          where: {
            categoryId: input.categoryId,
          },
        });

        return formatResponse(sub, "Sub Category Received Successfully");
      } catch (error) {
        return formatResponse(undefined, "Failed To Receive Sub Category");
      }
    }),
  create: publicProcedure
    .input(createSubCategorySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const subcategory = await ctx.prisma.subCategory.create({
          data: {
            ...input,
          },
        });

        return formatResponse(subcategory, "Create Sub Category Succesfully");
      } catch (error) {
        return formatResponse(undefined, "Failed To Received SubCategory");
      }
    }),

  update: publicProcedure
    .input(updateSubCategory)
    .mutation(async ({ ctx, input }) => {
      try {
        const subCategory = await ctx.prisma.subCategory.update({
          where: {
            id: input.id,
          },
          data: {
            ...input,
          },
        });
        return formatResponse(subCategory, "Sub Category Successfully Update");
      } catch (error) {
        return formatResponse(undefined, "Failed To Update Sub Category");
      }
    }),

  delete: publicProcedure
    .input(DeleteSubCategorySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const subCategory = await ctx.prisma.subCategory.delete({
          where: {
            id: input.id,
          },
        });

        return formatResponse(subCategory, "Successfully Delete Sub Category");
      } catch (error) {
        return formatResponse(error, "Failed To Delete Sub categories");
      }
    }),
});
