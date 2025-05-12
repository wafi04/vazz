"use client";

import { useFilterCategoryHome } from "@/hooks/use-filterGame";
import { trpc } from "@/utils/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { HeaderFilterGame } from "./headerFilter";
import { EmptyState } from "@/components/ui/not-found/NotFound";
import { Loader2, ChevronDown } from "lucide-react";
import Link from "next/link";

export function CategoriesAll() {
  const { filter } = useFilterCategoryHome();
  const [page, setPage] = useState(1);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const perPage = 12;

  const { data, isLoading, refetch } = trpc.categories.getAll.useQuery({
    type: filter,
    page,
    perPage,
  });

  // Reset when filter changes
  useEffect(() => {
    setPage(1);
    setAllCategories([]);
    setHasMore(true);
    refetch();
  }, [filter, refetch]);

  useEffect(() => {
    if (data?.data?.data) {
      if (page === 1) {
        setAllCategories(data.data.data);
      } else {
        setAllCategories((prev) => [...prev, ...data.data.data]);
      }

      setHasMore(
        data.data.data.length === perPage &&
          data.data.meta.currentPage < data.data.meta.totalPages
      );
      setIsLoadingMore(false);
    }
  }, [data, page]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      setIsLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  };

  const categories = allCategories || [];

  const getTitle = () => {
    switch (filter) {
      case "gamelainnya":
        return "Top Games";
      case "voucher":
        return "Popular Vouchers";
      case "pulsa":
        return "Mobile Credit";
      default:
        return "PLN Services";
    }
  };

  return (
    <section className="min-h-screen">
      <HeaderFilterGame />

      {/* Title */}
      <div className="px-4 mb-6">
        <motion.h2
          className="text-xl font-bold text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          key={filter}
        >
          {getTitle()}
        </motion.h2>
        <motion.p
          className="text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {data?.data?.meta?.totalItems || 0} {filter.toLowerCase()} tersedia
        </motion.p>
      </div>

      {/* Content */}
      {!isLoading && categories.length > 0 && (
        <div className="px-4 pb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
            >
              {categories.map((category, index) => (
                <Link href={`/order/${category.kode}`} key={category.id}>
                  <motion.div
                    className="cursor-pointer relative overflow-hidden rounded-2xl h-full aspect-square hover:shadow-lg hover:shadow-blue-900/10 hover:border hover:border-blue-900/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: (index % perPage) * 0.05,
                    }}
                    onMouseEnter={() => setHoveredCard(category.id.toString())}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* Hover effect */}
                    {hoveredCard === category.id.toString() && (
                      <motion.div
                        className="absolute inset-0 opacity-30 bg-gradient-to-br from-amber-500/30 to-purple-500/30 blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}

                    {/* Image */}
                    <div className="relative flex items-center justify-center w-full h-full">
                      {category.thumbnail && (
                        <motion.img
                          src={category.thumbnail}
                          alt={category.nama}
                          className="object-cover rounded-xl"
                          initial={{ width: "80%", height: "80%" }}
                          animate={{
                            width:
                              hoveredCard === category.id.toString()
                                ? "100%"
                                : "80%",
                            height:
                              hoveredCard === category.id.toString()
                                ? "100%"
                                : "80%",
                            borderRadius:
                              hoveredCard === category.id.toString()
                                ? "0.5rem"
                                : "0.75rem",
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      )}

                      {/* Logo ring */}
                      {hoveredCard === category.id.toString() && (
                        <motion.div
                          className="absolute inset-0 rounded-full border border-amber-500/30"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{
                            opacity: [0.2, 0.5, 0.2],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </div>

                    {/* Title on hover */}
                    <AnimatePresence>
                      {hoveredCard === category.id.toString() && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 backdrop-blur-sm bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <motion.h3 className="text-center text-sm font-medium text-white mb-1 line-clamp-1">
                            {category.nama}
                          </motion.h3>
                          <motion.p className="text-center text-xs text-blue-300 line-clamp-1">
                            {category.brand || "Brand"}
                          </motion.p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <motion.button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="group relative overflow-hidden px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative z-10 flex items-center gap-2">
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <span>Load More</span>
                      <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
                    </>
                  )}
                </div>
              </motion.button>
            </div>
          )}

          {/* No more items */}
          {!hasMore && (
            <div className="flex justify-center mt-8">
              <motion.p
                className="text-blue-400/70 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                Semua item telah ditampilkan
              </motion.p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
