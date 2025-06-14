import { publicProcedure, router } from "@/server/trpc";
import { z } from "zod";

// Schema validasi untuk input
const createBeritaSchema = z.object({
  path: z.string().min(1, "Path tidak boleh kosong"),
  tipe: z.string().min(1, "Tipe tidak boleh kosong"),
  deskripsi: z.string().min(1, "Deskripsi tidak boleh kosong"),
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
  tipe: z.string().optional(),
});

export const beritaRouter = router({
  // CREATE - Membuat berita baru
  create: publicProcedure
    .input(createBeritaSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const berita = await ctx.prisma.berita.create({
          data: {
            path: input.path,
            tipe: input.tipe,
            deskripsi: input.deskripsi,
          },
        });
        return {
          success: true,
          data: berita,
          message: "Berita berhasil dibuat",
        };
      } catch (error) {
        throw new Error("Gagal membuat berita");
      }
    }),

  // READ - Mendapatkan semua berita dengan pagination
  getAll: publicProcedure
    .input(paginationSchema)
    .query(async ({ input, ctx }) => {
      try {
        const { page, limit, tipe } = input;
        const skip = (page - 1) * limit;

        const whereClause = tipe ? { tipe } : {};

        const [beritas, total] = await Promise.all([
          ctx.prisma.berita.findMany({
            where: whereClause,
            skip,
            take: limit,
            orderBy: {
              createdAt: "desc",
            },
          }),
          ctx.prisma.berita.count({
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
        throw new Error("Gagal mengambil data berita");
      }
    }),

  // READ - Mendapatkan berita berdasarkan ID
  getById: publicProcedure
    .input(getBeritaByIdSchema)
    .query(async ({ input, ctx }) => {
      try {
        const berita = await ctx.prisma.berita.findUnique({
          where: {
            id: input.id,
          },
        });

        if (!berita) {
          throw new Error("Berita tidak ditemukan");
        }

        return {
          success: true,
          data: berita,
        };
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Gagal mengambil berita"
        );
      }
    }),

  // READ - Mendapatkan berita berdasarkan tipe
  getByTipe: publicProcedure
    .input(getBeritaByTipeSchema)
    .query(async ({ input, ctx }) => {
      try {
        const beritas = await ctx.prisma.berita.findMany({
          where: {
            tipe: input.tipe,
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
        throw new Error("Gagal mengambil berita berdasarkan tipe");
      }
    }),

  // READ - Mendapatkan semua tipe berita yang unik
  getAllTipes: publicProcedure.query(async ({ ctx }) => {
    try {
      const tipes = await ctx.prisma.berita.findMany({
        select: {
          tipe: true,
        },
        distinct: ["tipe"],
        orderBy: {
          tipe: "asc",
        },
      });

      return {
        success: true,
        data: tipes.map((item) => item.tipe),
      };
    } catch (error) {
      throw new Error("Gagal mengambil daftar tipe berita");
    }
  }),

  // UPDATE - Memperbarui berita
  update: publicProcedure
    .input(updateBeritaSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { id, ...updateData } = input;

        // Cek apakah berita exists
        const existingBerita = await ctx.prisma.berita.findUnique({
          where: { id },
        });

        if (!existingBerita) {
          throw new Error("Berita tidak ditemukan");
        }

        // Update berita
        const updatedBerita = await ctx.prisma.berita.update({
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
          error instanceof Error ? error.message : "Gagal memperbarui berita"
        );
      }
    }),

  // DELETE - Menghapus berita
  delete: publicProcedure
    .input(deleteBeritaSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Cek apakah berita exists
        const existingBerita = await ctx.prisma.berita.findUnique({
          where: { id: input.id },
        });

        if (!existingBerita) {
          throw new Error("Berita tidak ditemukan");
        }

        // Hapus berita
        await ctx.prisma.berita.delete({
          where: { id: input.id },
        });

        return {
          success: true,
          message: "Berita berhasil dihapus",
        };
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Gagal menghapus berita"
        );
      }
    }),

  // DELETE - Menghapus berita berdasarkan tipe
  deleteByTipe: publicProcedure
    .input(getBeritaByTipeSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await ctx.prisma.berita.deleteMany({
          where: {
            tipe: input.tipe,
          },
        });

        return {
          success: true,
          message: `${result.count} berita dengan tipe "${input.tipe}" berhasil dihapus`,
          deletedCount: result.count,
        };
      } catch (error) {
        throw new Error("Gagal menghapus berita berdasarkan tipe");
      }
    }),

  // UTILITY - Menghitung total berita
  getCount: publicProcedure
    .input(
      z.object({
        tipe: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const whereClause = input.tipe ? { tipe: input.tipe } : {};

        const count = await ctx.prisma.berita.count({
          where: whereClause,
        });

        return {
          success: true,
          count,
        };
      } catch (error) {
        throw new Error("Gagal menghitung total berita");
      }
    }),
});
