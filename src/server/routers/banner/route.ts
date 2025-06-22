import { publicProcedure, router } from "@/server/trpc";
import { z } from "zod";

// Schema validasi untuk input
const createBeritaSchema = z.object({
  path: z.string().min(1, "Path tidak boleh kosong"),
  type: z.string().min(1, "Tipe tidak boleh kosong"),
  description: z.string().min(1, "Deskripsi tidak boleh kosong"),
});

const updateBeritaSchema = z.object({
  id: z.number().int().positive(),
  path: z.string().min(1, "Path tidak boleh kosong").optional(),
  tipe: z.string().min(1, "Tipe tidak boleh kosong").optional(),
  deskripsi: z.string().min(1, "Deskripsi tidak boleh kosong").optional(),
});

const deleteBeritaSchema = z.object({
  id: z.number().int().positive(),
});

const getBeritaByIdSchema = z.object({
  id: z.number().int().positive(),
});

const getBeritaByTipeSchema = z.object({
  tipe: z.string().min(1),
});

const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  type: z.string().optional(),
});

export const beritaRouter = router({
  // CREATE - Membuat news baru
  create: publicProcedure
    .input(createBeritaSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const news = await ctx.prisma.news.create({
          data: {
            path: input.path,
            type: input.type,
            description: input.description,
          },
        });
        return {
          success: true,
          data: news,
          message: "Berita berhasil dibuat",
        };
      } catch (error) {
        throw new Error("Gagal membuat news");
      }
    }),

  // READ - Mendapatkan semua news dengan pagination
  getAll: publicProcedure
    .input(paginationSchema)
    .query(async ({ input, ctx }) => {
      try {
        const { page, limit, type } = input;
        const skip = (page - 1) * limit;

        const whereClause = type ? { type } : {};

        const [beritas, total] = await Promise.all([
          ctx.prisma.news.findMany({
            where: whereClause,
            skip,
            take: limit,
            orderBy: {
              createdAt: "desc",
            },
          }),
          ctx.prisma.news.count({
            where: whereClause,
          }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
          success: true,
          data: beritas,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          },
        };
      } catch (error) {
        throw new Error("Gagal mengambil data news");
      }
    }),

  // READ - Mendapatkan news berdasarkan ID
  getById: publicProcedure
    .input(getBeritaByIdSchema)
    .query(async ({ input, ctx }) => {
      try {
        const news = await ctx.prisma.news.findUnique({
          where: {
            id: input.id,
          },
        });

        if (!news) {
          throw new Error("Berita tidak ditemukan");
        }

        return {
          success: true,
          data: news,
        };
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Gagal mengambil news"
        );
      }
    }),

  // READ - Mendapatkan news berdasarkan tipe
  getByTipe: publicProcedure
    .input(getBeritaByTipeSchema)
    .query(async ({ input, ctx }) => {
      try {
        const beritas = await ctx.prisma.news.findMany({
          where: {
            type: input.tipe,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        return {
          success: true,
          data: beritas,
          count: beritas.length,
        };
      } catch (error) {
        throw new Error("Gagal mengambil news berdasarkan tipe");
      }
    }),

  // READ - Mendapatkan semua tipe news yang unik
  getAllTipes: publicProcedure.query(async ({ ctx }) => {
    try {
      const tipes = await ctx.prisma.news.findMany({
        select: {
          type: true,
        },
        distinct: ["type"],
        orderBy: {
          type: "asc",
        },
      });

      return {
        success: true,
        data: tipes.map((item) => item.type),
      };
    } catch (error) {
      throw new Error("Gagal mengambil daftar tipe news");
    }
  }),

  // UPDATE - Memperbarui news
  update: publicProcedure
    .input(updateBeritaSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { id, ...updateData } = input;

        // Cek apakah news exists
        const existingBerita = await ctx.prisma.news.findUnique({
          where: { id },
        });

        if (!existingBerita) {
          throw new Error("Berita tidak ditemukan");
        }

        // Update news
        const updatedBerita = await ctx.prisma.news.update({
          where: { id },
          data: {
            ...updateData,
            updatedAt: new Date(),
          },
        });

        return {
          success: true,
          data: updatedBerita,
          message: "Berita berhasil diperbarui",
        };
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Gagal memperbarui news"
        );
      }
    }),

  // DELETE - Menghapus news
  delete: publicProcedure
    .input(deleteBeritaSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Cek apakah news exists
        const existingBerita = await ctx.prisma.news.findUnique({
          where: { id: input.id },
        });

        if (!existingBerita) {
          throw new Error("Berita tidak ditemukan");
        }

        // Hapus news
        await ctx.prisma.news.delete({
          where: { id: input.id },
        });

        return {
          success: true,
          message: "Berita berhasil dihapus",
        };
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Gagal menghapus news"
        );
      }
    }),

  // DELETE - Menghapus news berdasarkan tipe
  deleteByTipe: publicProcedure
    .input(getBeritaByTipeSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await ctx.prisma.news.deleteMany({
          where: {
            type: input.tipe,
          },
        });

        return {
          success: true,
          message: `${result.count} news dengan tipe "${input.tipe}" berhasil dihapus`,
          deletedCount: result.count,
        };
      } catch (error) {
        throw new Error("Gagal menghapus news berdasarkan tipe");
      }
    }),

  // UTILITY - Menghitung total news
  getCount: publicProcedure
    .input(
      z.object({
        type: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const whereClause = input.type ? { type: input.type } : {};

        const count = await ctx.prisma.news.count({
          where: whereClause,
        });

        return {
          success: true,
          count,
        };
      } catch (error) {
        throw new Error("Gagal menghitung total news");
      }
    }),
});
