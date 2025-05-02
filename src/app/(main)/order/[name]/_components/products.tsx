
"use client"
import { useState } from "react";
import { Star, Tag, Flame, Clock, Diamond } from "lucide-react";
import { ProductData } from "@/types/product";

export function ProductPage({ products }: { products: ProductData[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get unique categories
  const categories = Array.from(new Set(products.map(product => product.kategoriId)));
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.layanan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.provider.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-7xl mx-auto">
        {/* Search Input */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-lg text-gray-400">No products found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: ProductData }) {
  // Extract the diamond amount if the product name follows a pattern like "MOBILELEGEND - 10 Diamond"
  const match = product.layanan.match(/(\d+)\s*Diamond/i);
  const diamondAmount = match ? match[1] : null;
  
  // Split product name into game name and diamond amount for better display
  let gameName = product.layanan;
  let diamondInfo = "";
  
  if (product.layanan.includes("-")) {
    const parts = product.layanan.split("-");
    gameName = parts[0].trim();
    diamondInfo = parts[1].trim();
  }

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow hover:shadow-primary/20 transition-all hover:-translate-y-1 border border-primary/10 p-3 relative">
      {/* Flash Sale Badge */}
      {product.isFlashSale && (
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full flex items-center gap-1">
          <Flame size={14} />
          <span className="text-xs font-medium">Flash Sale</span>
        </div>
      )}
      
      <div className="grid grid-cols-5 gap-2">
        {/* Product Icon - smaller and more proportional */}
        <div className="bg-gradient-to-br from-primary/10 to-blue-800/30 rounded-md w-10 h-10 flex items-center justify-center">
          {product.productLogo ? (
            <img
              src={product.productLogo}
              alt={product.layanan}
              className="w-3/4 h-3/4 object-contain"
            />
          ) : (
            <Diamond className="w-6 h-6 text-blue-400" />
          )}
        </div>
        
        {/* Product Info - taking more space for long names */}
        <div className="col-span-4">
          <div className="flex flex-col">
            {/* Game name */}
            <h3 className="font-bold text-sm line-clamp-1">{gameName}</h3>
            
            {/* Diamond amount with nicer display */}
            {diamondInfo && (
              <div className="flex items-center mt-1">
                <Diamond className="w-3 h-3 text-blue-400 mr-1" />
                <span className="text-xs font-medium text-blue-500">{diamondInfo}</span>
              </div>
            )}
            
            {/* Provider Name */}
            <p className="text-xs text-gray-500 mt-1">{product.provider}</p>
            
            {/* Price */}
            {product.harga && (
              <p className="font-semibold text-sm mt-1 text-green-600">{product.harga}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}