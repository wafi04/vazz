import { publicProcedure, router } from "@/server/trpc";
import { z } from "zod";

export const filterMethods = z.object({
    isActive: z.boolean().optional(),
    page: z.number().optional(),
    limit: z.number().optional(),
    search: z.string().optional(),
    isAll: z.boolean().optional(), 
});

export const Methods = router({
    getAll: publicProcedure.input(filterMethods).query(async ({ ctx, input }) => {
        const { prisma } = ctx;
        const { isActive, page = 1, limit, search, isAll = false } = input;
        
        const where = {
            ...(isActive !== undefined && { isActive }),
            ...(search && {
                name: {
                    contains: search,
                }
            })
        };
        
        if (isAll) {
            const methods = await prisma.method.findMany({
                where,
                orderBy: {
                    createdAt: 'desc'
                }
            });
            
            const total = methods.length;
            
            return {
                data: methods,
                total,
                pagination: {
                    page: 1,
                    limit: total,
                    totalPages: 1
                }
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
                    createdAt: 'desc'
                }
            });
            
            const total = await prisma.method.count({ where });
            const totalPages = Math.ceil(total / limit);
            
            return {
                data: methods,
                total,
                pagination: {
                    page,
                    limit,
                    totalPages
                }
            };
        }
        
        const methods = await prisma.method.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            }
        });
        
        const total = methods.length;
        
        return {
            data: methods,
            total,
            pagination: {
                page: 1,
                limit: total,
                totalPages: 1
            }
        };
    })
});