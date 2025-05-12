"use client";
import { Flame } from "lucide-react";
import { ProductData } from "@/types/product";
import Image from "next/image";
import { FormatPrice } from "@/utils/formatPrice";
import { motion } from "framer-motion";
import { SvgProduct } from "./svg";
import { useOrderStore } from "@/hooks/use-order";

export function ProductPage({ products }: { products: ProductData[] }) {
  return (
    <div className="max-h-[80vh] custom-scrollbar overflow-y-auto bg-background text-foreground p-4">
      {/* Products Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-8">
          <p className="text-lg text-gray-400">
            No products found matching your criteria
          </p>
        </div>
      )}
    </div>
  );
}
function ProductCard({ product }: { product: ProductData }) {
  let gameName = product.layanan;
  let diamondInfo = "";

  if (product.layanan) {
    const match = product.layanan.match(/(.*?)(\d+\s*[a-zA-Z]*)$/);
    if (match) {
      gameName = match[1].trim().replace("-", " ");
      diamondInfo = match[2].trim();
    }
  }
  const { setProduct, productDetails, setPrice } = useOrderStore();
  const isSelected = product.providerId === productDetails.code;
  return (
    <motion.div
      onClick={() => {
        setProduct({
          code: product.providerId,
          name: product.layanan,
          price: product.harga,
        });
        setPrice(product.harga);
      }}
      className="relative rounded-xl cursor-pointer overflow-hidden shadow-lg hover:shadow-xl transition-all bg-blue-900/20 border border-border flex flex-col justify-between"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
    >
      {/* Product Content */}
      <div className="px-2 py-5 flex-grow">
        <div className="flex items-center justify-between ">
          <div className="flex-shrink-0">
            {product.productLogo ? (
              <Image
                width={50}
                height={50}
                src={product.productLogo}
                alt={product.layanan}
                className="w-12 h-12 object-contain rounded-md"
              />
            ) : (
              <Image
                width={40}
                height={40}
                src="/diamond.png"
                alt="Default Diamond"
                className="object-cover"
              />
            )}
          </div>
          {isSelected && (
            <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs rounded-full py-0.5 px-1.5">
              ✓
            </div>
          )}

          <div className="ml-3 flex-grow">
            <div className="flex items-center">
              <span className="text-sm font-normal text-white">
                {product.layanan}
              </span>
            </div>
            {product.harga && (
              <p className="font-semibold text-foreground">
                {FormatPrice(product.harga)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom area with svg */}
      <div className="bg-blue-300 px-4 flex justify-end items-center">
        <SvgProduct className="h-8 w-14" />
      </div>

      {/* Flash Sale Badge */}
      {product.isFlashSale && (
        <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 rounded-full flex items-center gap-1">
          <Flame size={14} />
          <span className="text-xs font-medium">Flash Sale</span>
        </div>
      )}
    </motion.div>
  );
}
