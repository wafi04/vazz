'use client';

import { ParticlesEffect } from '@/components/ui/particlesEffect';
import PopularSkeleton from '@/components/ui/popular-skeleton';
import { trpc } from '@/utils/trpc';
import { useState, useEffect, useCallback } from "react"
import { Flame, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import Link from 'next/link';
import { Category } from '@/types/category';

export function PopularSection() {
    const { data, isLoading } = trpc.categories.getAll.useQuery({
        active: "active",
        isAll: true,
        type: "populer"
    });
    
    // Safely access the data array
    const categoriesData = data?.data.data || [] as Category[]
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    
    // Auto rotate active item
    useEffect(() => {
        if (!categoriesData.length || isPaused) return;

        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % categoriesData.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [categoriesData.length, isPaused]);

    const handleMouseEnter = useCallback(() => {
        setIsPaused(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsPaused(false);
    }, []);

    if (isLoading) {
        return <PopularSkeleton />;
    }


    return (
        <section className="py-8 relative overflow-hidden max-w-screen-2xl mx-auto px-4 sm:px-6">
            {/* Ambient floating particles effect */}
            <ParticlesEffect />
            {/* Header */}
            <motion.div
                className="relative z-10 mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center gap-2">
                    <motion.div
                        animate={{
                            rotate: [0, 15, -15, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse"
                        }}
                    >
                        <Flame className="text-blue-400 h-6 w-6" />
                    </motion.div>
                    <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-wide">POPULER </h2>
                </div>
                <p className="text-blue-200/70 text-xs md:text-sm mt-2 max-w-lg">
                    Beberapa produk paling populer yang dimainkan pengguna saat ini
                </p>
            </motion.div>

            {/* Game grid - horizontal cards with improved responsiveness */}
            <motion.div
                className="relative z-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
            >
                {categoriesData?.map((category : Category, index : number) => (
                    <Link key={category.id} href={`/order/${category.kode}`}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{
                                scale: 1.03,
                                transition: { duration: 0.2 },
                            }}
                            className={cn(
                                "relative overflow-hidden rounded-lg shadow-md",
                                activeIndex === index
                                    ? "ring-2 ring-blue-400 shadow-lg shadow-blue-500/20"
                                    : "ring-1 ring-blue-800/30 hover:ring-blue-700/50"
                            )}
                            onClick={() => setActiveIndex(index)}
                        >
                            {/* Card background gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-[#00102b] pointer-events-none"></div>
                            
                            <div className="relative flex h-24 overflow-hidden">
                                {/* Game logo - left side with fixed width */}
                                <div className="relative w-16 sm:w-20 h-full flex-shrink-0 flex items-center justify-center">
                                    {category.thumbnail ? (
                                        <motion.div
                                            className="w-full h-full p-2"
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <img
                                                src={category.thumbnail}
                                                alt={category.nama}
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                        </motion.div>
                                    ) : (
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-800/50 flex items-center justify-center">
                                            <motion.span
                                                className="text-blue-300 text-xl font-bold"
                                                animate={{ scale: [1, 1.1, 1] }}
                                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                            >
                                                {category.nama.charAt(0)}
                                            </motion.span>
                                        </div>
                                    )}

                                    {/* Glowing edge for active item */}
                                    <AnimatePresence>
                                        {activeIndex === index && (
                                            <motion.div
                                                className="absolute inset-y-0 left-0 w-1 bg-blue-400"
                                                initial={{ scaleY: 0 }}
                                                animate={{ scaleY: 1 }}
                                                exit={{ scaleY: 0 }}
                                                transition={{ duration: 0.2 }}
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Game info - right side with flex-grow to use remaining space */}
                                <div className="flex-grow min-w-0 p-2 sm:p-3 flex flex-col justify-center relative">
                                    <h3 className="font-medium text-white text-xs sm:text-sm line-clamp-1 sm:line-clamp-2">
                                        {category.nama}
                                    </h3>
                                    
                                    <div className="flex items-center mt-1 sm:mt-2">
                                        <div className="flex items-center">
                                            <span className="text-xs text-blue-200/70 line-clamp-1 sm:line-clamp-2">
                                                {category.brand}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Popular indicator */}
                                    {activeIndex === index && (
                                        <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0 }}
                                                className="flex items-center"
                                            >
                                                <Star className="h-3 w-3 text-blue-300 mr-1" fill="currentColor" />
                                            </motion.div>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Shine effect overlay */}
                                <AnimatePresence>
                                    {activeIndex === index && (
                                        <motion.div 
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent"
                                            initial={{ x: "-100%" }}
                                            animate={{ x: "100%" }}
                                            exit={{ x: "200%" }}
                                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                                        />
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </motion.div>
        </section>
    );
}