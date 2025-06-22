import { formatResponse } from "@/lib/trpc-response";
import { publicProcedure, router } from "@/server/trpc";
import { parseMessageDetails } from "@/types/messages";
import { z } from "zod";

// Schemas
export const createMessages = z.object({
  title: z.string().min(1, "Title is required").max(300, "Title too long"),
  text: z.string().min(1, "Text is required"),
  details: z.any().optional(), // JSON field
});

export const updateMessages = z.object({
  id: z.number(),
  title: z
    .string()
    .min(1, "Title is required")
    .max(300, "Title too long")
    .optional(),
  text: z.string().min(1, "Text is required").optional(),
  details: z.any().optional(), // JSON field
});

export const getMessages = z.object({
  id: z.number(),
});

export const getMessagesWithPagination = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.enum(["id", "title", "createdAt"]).default("id"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const deleteMessages = z.object({
  id: z.number(),
});

// Types
export type createMessagesType = z.infer<typeof createMessages>;
export type updateMessagesType = z.infer<typeof updateMessages>;
export type getMessagesType = z.infer<typeof getMessages>;
export type getMessagesWithPaginationType = z.infer<
  typeof getMessagesWithPagination
>;
export type deleteMessagesType = z.infer<typeof deleteMessages>;

// Router
export const Messages = router({
  // CREATE - Membuat pesan baru
  create: publicProcedure
    .input(createMessages)
    .mutation(async ({ ctx, input }) => {
      try {
        const create = await ctx.prisma.message.create({
          data: {
            title: input.title,
            text: input.text,
            details: input.details || {},
          },
        });

        return formatResponse(create, "Message created successfully");
      } catch (error) {
        console.error("Error creating message:", error);
        return formatResponse(null, "Failed to create message");
      }
    }),

  // READ - Mendapatkan satu pesan berdasarkan ID
  getById: publicProcedure.input(getMessages).query(async ({ ctx, input }) => {
    try {
      const message = await ctx.prisma.message.findUnique({
        where: { id: input.id },
      });

      if (!message) {
        return formatResponse(null, "Message not found");
      }

      return formatResponse(message, "Message retrieved successfully");
    } catch (error) {
      console.error("Error getting message:", error);
      return formatResponse(null, "Failed to retrieve message");
    }
  }),

  // READ - Mendapatkan semua pesan dengan pagination dan search
  getAll: publicProcedure
    .input(getMessagesWithPagination)
    .query(async ({ ctx, input }) => {
      try {
        const { page, limit, search, sortBy, sortOrder } = input;
        const skip = (page - 1) * limit;

        // Build where clause for search
        const whereClause = search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" as const } },
                { text: { contains: search, mode: "insensitive" as const } },
              ],
            }
          : {};

        // Get total count for pagination
        const totalCount = await ctx.prisma.message.count({
          where: whereClause,
        });

        // Get message
        const message = await ctx.prisma.message.findMany({
          where: whereClause,
          skip,
          take: limit,
        });

        const totalPages = Math.ceil(totalCount / limit);

        const result = {
          data: message.map((msg) => ({
            id: msg.id,
            title: msg.title,
            text: msg.text,
            details: parseMessageDetails(msg.details),
          })),
          meta: {
            currentPage: page,
            totalPages,
            totalCount,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          },
        };

        return formatResponse(result, "Messages retrieved successfully");
      } catch (error) {
        console.error("Error getting message:", error);
        return formatResponse(null, "Failed to retrieve message");
      }
    }),

  // READ - Mendapatkan semua pesan tanpa pagination (untuk dropdown, dll)
  getAllSimple: publicProcedure.query(async ({ ctx }) => {
    try {
      const message = await ctx.prisma.message.findMany({
        select: {
          id: true,
          title: true,
        },
        orderBy: { title: "asc" },
      });

      return formatResponse(message, "Messages retrieved successfully");
    } catch (error) {
      console.error("Error getting message:", error);
      return formatResponse(null, "Failed to retrieve message");
    }
  }),

  // UPDATE - Memperbarui pesan
  update: publicProcedure
    .input(updateMessages)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...updateData } = input;

        // Check if message exists
        const existingMessage = await ctx.prisma.message.findUnique({
          where: { id },
        });

        if (!existingMessage) {
          return formatResponse(null, "Message not found");
        }

        // Update message
        const updatedMessage = await ctx.prisma.message.update({
          where: { id },
          data: {
            ...(updateData.title && { title: updateData.title }),
            ...(updateData.text && { text: updateData.text }),
            ...(updateData.details !== undefined && {
              details: updateData.details,
            }),
          },
        });

        return formatResponse(updatedMessage, "Message updated successfully");
      } catch (error) {
        console.error("Error updating message:", error);
        return formatResponse(null, "Failed to update message");
      }
    }),

  // DELETE - Menghapus pesan
  delete: publicProcedure
    .input(deleteMessages)
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if message exists
        const existingMessage = await ctx.prisma.message.findUnique({
          where: { id: input.id },
        });

        if (!existingMessage) {
          return formatResponse(null, "Message not found");
        }

        // Delete message
        await ctx.prisma.message.delete({
          where: { id: input.id },
        });

        return formatResponse({ id: input.id }, "Message deleted successfully");
      } catch (error) {
        console.error("Error deleting message:", error);
        return formatResponse(null, "Failed to delete message");
      }
    }),

  // BULK DELETE - Menghapus multiple pesan
  bulkDelete: publicProcedure
    .input(z.object({ ids: z.array(z.number()) }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { ids } = input;

        if (ids.length === 0) {
          return formatResponse(null, "No IDs provided");
        }

        // Delete message
        const deleteResult = await ctx.prisma.message.deleteMany({
          where: { id: { in: ids } },
        });

        return formatResponse(
          { deletedCount: deleteResult.count },
          `${deleteResult.count} message deleted successfully`
        );
      } catch (error) {
        console.error("Error bulk deleting message:", error);
        return formatResponse(null, "Failed to delete message");
      }
    }),

  // GET COUNT - Mendapatkan jumlah total pesan
  getCount: publicProcedure.query(async ({ ctx }) => {
    try {
      const count = await ctx.prisma.message.count();
      return formatResponse({ count }, "Message count retrieved successfully");
    } catch (error) {
      console.error("Error getting message count:", error);
      return formatResponse(null, "Failed to get message count");
    }
  }),

  // SEARCH - Pencarian advanced
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1, "Search query is required"),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { query, limit } = input;

        const message = await ctx.prisma.message.findMany({
          where: {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { text: { contains: query, mode: "insensitive" } },
            ],
          },
          take: limit,
          orderBy: { id: "desc" },
        });

        return formatResponse(message, "Search completed successfully");
      } catch (error) {
        console.error("Error searching message:", error);
        return formatResponse(null, "Failed to search message");
      }
    }),
});
