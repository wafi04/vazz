"use client"

import type React from "react"
import { useFilterCategoryHome, type FilterProduct } from "@/hooks/use-filterGame"
import { motion } from "framer-motion"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { filterOptions } from "@/data/data-headerFilter"
import { ParticlesEffect } from "@/components/ui/particlesEffect"

export function HeaderFilterGame() {
  const { filter, setFilter } = useFilterCategoryHome()
  const [hoveredFilter, setHoveredFilter] = useState<FilterProduct | null>(null)

  
  return (
    <div className="py-6 px-4 relative">
      {/* Background with stars effect */}
     <ParticlesEffect />

      {/* Filter buttons container */}
      <div className="relative z-10">
        <motion.div
          className="flex justify-center gap-2 md:gap-4 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {filterOptions.map((option) => (
            <motion.button
              key={option.value}
              onClick={() => setFilter(option.value)}
              onMouseEnter={() => setHoveredFilter(option.value)}
              onMouseLeave={() => setHoveredFilter(null)}
              className={cn(
                "relative group flex items-center gap-2 px-4 py-2.5 rounded-full",
                "transition-all duration-300 overflow-hidden",
                filter === option.value
                  ? "text-white"
                  : "text-gray-400 hover:text-white bg-blue-950/50 hover:bg-blue-900/50",
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Background gradient for active or hovered button */}
              {(filter === option.value || hoveredFilter === option.value) && (
                <motion.div
                  className={cn("absolute inset-0 bg-gradient-to-r", option.gradient)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layoutId="activeFilterBackground"
                  transition={{ duration: 0.2 }}
                />
              )}

              {/* Glow effect */}
              {filter === option.value && (
                <motion.div
                  className="absolute inset-0 -z-10 blur-md opacity-30 bg-gradient-to-r"
                  style={{
                    backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                />
              )}

              {/* Icon with animation */}
              <motion.span
                className="relative z-10"
                animate={
                  filter === option.value
                    ? {
                        rotate: [0, -10, 10, 0],
                        scale: [1, 1.1, 1],
                      }
                    : {}
                }
                transition={{
                  duration: 0.5,
                  repeat: filter === option.value ? Number.POSITIVE_INFINITY : 0,
                  repeatType: "reverse",
                  repeatDelay: 5,
                }}
              >
                {option.icon}
              </motion.span>

              {/* Label */}
              <span className="relative z-10 font-medium md:flex hidden">{option.label}</span>
              {filter === option.value && (
               <ParticlesEffect />
              )}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  )
}