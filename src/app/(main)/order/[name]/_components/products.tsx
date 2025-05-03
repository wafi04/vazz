"use client"
import { useState, useEffect } from "react";
import { Star, Tag, Flame, Clock, Diamond } from "lucide-react";
import { ProductData } from "@/types/product";
import Image from "next/image";
import { FormatPrice } from "@/utils/formatPrice";
import { motion } from "framer-motion";

export function ProductPage({ products }: { products: ProductData[] }) {
  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      {/* Products Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
            
      {products.length === 0 && (
        <div className="text-center py-8">
          <p className="text-lg text-gray-400">No products found matching your criteria</p>
        </div>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: ProductData }) {
  let gameName = product.layanan;
  let diamondInfo = "";
    
  if (product.layanan) {
    // Coba cocokkan angka di akhir teks
    const match = product.layanan.match(/(.*?)(\d+\s*[a-zA-Z]*)$/);
    if (match) {
      gameName = match[1].trim();      // Nama game
      diamondInfo = match[2].trim();   // Angka + satuan (contoh: 2500 UC)
    }
  }
  
  // Animation variants
  const shimmerVariants = {
    initial: {
      backgroundPosition: "-500px 0",
    },
    animate: {
      backgroundPosition: "500px 0",
      transition: {
        repeat: Infinity,
        duration: 2.5,
        ease: "linear",
      },
    }
  };
  
  const pulseVariants = {
    initial: { scale: 1 },
    animate: {
      scale: 1.03,
      transition: {
        duration: 1.2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };
  
  return (
    <motion.div
      className="bg-gradient-to-br from-blue-800 via-blue-900 to-indigo-900 rounded-lg overflow-hidden shadow hover:shadow-blue-500/30 transition-all border border-blue-300/20 p-4 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundImage: "url('data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%234c71ae' fill-opacity='0.08' fill-rule='evenodd'/%3E%3C/svg%3E')",
        backgroundSize: "cover"
      }}
      transition={{ duration: 0.4 }}
      whileHover={{ 
        y: -5, 
        boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)",
        transition: { duration: 0.2 } 
      }}
    >
      {/* Shimmer overlay effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent backdrop-blur-[0.5px] after:content-[''] after:absolute after:inset-0 after:bg-[radial-gradient(ellipse_at_top,_theme(colors.blue.400/10),_transparent_70%)]"
        initial="initial"
        animate="animate"
        variants={shimmerVariants}
      />
      
      {product.isFlashSale && (
        <motion.div
          initial="initial"
          animate="animate"
          variants={pulseVariants}
          className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full flex items-center gap-1 z-10"
        >
          <Flame size={14} />
          <span className="text-xs font-medium">Flash Sale</span>
        </motion.div>
      )}
            
      {/* Nama Game di bagian atas */}
      <h3 className="text-blue-100 font-medium text-sm mb-2 truncate relative z-10">{product.layanan}</h3>
                            
      <div className="grid grid-cols-3 gap-2 relative z-10">
        {/* Image di bawah nama game dan diamond info */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          {product.productLogo ? (
            <Image
              width={50}
              height={50}
              src={product.productLogo}
              alt={product.layanan}
              className="w-3/4 h-3/4 object-cover"
            />
          ) : (
            <Image
              width={50}
              height={50}
              src="/diamond.png"
              alt="Default Diamond"
              className="w-3/4 h-3/4 object-contain"
            />
          )}
        </motion.div>
                
        {/* Harga di samping image */}
        <div className="col-span-2">
          <div className="flex flex-col justify-center h-full">
            {product.harga && (
              <motion.p
                className="font-semibold text-sm text-white"
                initial={{ opacity: 0.8 }}
                whileHover={{ 
                  opacity: 1,
                  textShadow: "0 0 8px rgba(59, 130, 246, 0.7)"
                }}
              >
                {FormatPrice(product.harga)}
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}