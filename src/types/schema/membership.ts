import { z } from "zod";

export const membershipCreate = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  benefit: z.string(),
});

export const membershipUpdate = z.object({
  id: z.number(),
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  benefit: z.string().optional(),
});

export const membershipById = z.object({
  id: z.number(),
});
