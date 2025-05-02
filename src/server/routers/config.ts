
import { publicProcedure, router } from '@/server/trpc';
import { configWeb } from '@/types/schema/config_web';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const ConfigWeb = router({
  upsert: publicProcedure.input(configWeb).mutation(async ({ ctx, input }) => {
    try {
      const existingConfig = await ctx.prisma.websiteConfig.findFirst();
      if (existingConfig) {
        return ctx.prisma.websiteConfig.update({
          where: {
            id: existingConfig.id,
          },
          data: {
            ...input,
          },
        });
      } else {
        return ctx.prisma.websiteConfig.create({
          data: {
            ...input,
          },
        });
      }
    } catch (error) {
      if (error instanceof TRPCError) {
        console.error(error.message);
      }
      throw error;
    }
  }),

  getConfig: publicProcedure.query(async ({ ctx }) => {
    try {
      const config = await ctx.prisma.websiteConfig.findFirst();
      if (!config) {
        return null; 
      }
      return config;
    } catch (error) {
      if (error instanceof TRPCError) {
        console.error(error.message);
      }
      throw error;
    }
  }),
  checkNickName: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        serverId: z.string().optional(),
        type: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        // return await CheckNickName({
        //   type: (input.type as GameType) ?? '',
        //   userId: input.userId ?? '',
        //   serverId: input.serverId,
        // });
      } catch (error) {
        if (error instanceof TRPCError) {
          console.error(error.message);
        }
        throw error;
      }
    }),
});
