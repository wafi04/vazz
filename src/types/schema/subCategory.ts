import { z } from "zod";

export const getAll = z.object({
  search: z.string().optional(),
  page: z.number(),
  perPage: z.number(),
  active: z.string().optional(),
  categoryId: z.number().optional(),
});

export const getByCategoryId = z.object({
  categoryId: z.number(),
});

export const createSubCategorySchema = z.object({
  code: z.string(),
  name: z.string(),
  isActive: z.string(),
  categoryId: z.number(),
});

export type CreateSubCategory = z.infer<typeof createSubCategorySchema>;
export const updateSubCategory = z.object({
  code: z.string(),
  name: z.string(),
  id: z.number(),
  active: z.boolean(),
  categoryId: z.number(),
});
export type UpdateSubCategory = z.infer<typeof updateSubCategory>;

export const DeleteSubCategorySchema = z.object({
  id: z.number(),
});

export type DeleteSubCategory = z.infer<typeof DeleteSubCategorySchema>;
