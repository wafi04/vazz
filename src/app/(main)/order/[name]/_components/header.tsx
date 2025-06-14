"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useFilterProduct } from "@/hooks/use-filterProduct";
import { useState } from "react";

export function HeaderFilterProduct({
  subCategories,
}: {
  subCategories?: {
    id: number;
    name: string;
  }[];
}) {
  const { setFilter } = useFilterProduct();
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (id: number) => {
    setSelected(id);
    setFilter(id);
  };

  return (
    <div className="p-5">
      <div className="overflow-x-auto custom-scrollbar pb-2 -mx-1 px-1">
        <div className="flex flex-nowrap gap-3 min-w-full">
          {subCategories?.map((subCategory, idx) => (
            <motion.div
              key={subCategory.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.07 }}
              className="flex-shrink-0"
            >
              <Button
                variant="outline"
                onClick={() => handleSelect(subCategory.id)}
                className={`whitespace-nowrap min-w-[140px] justify-start px-5 py-3 rounded-xl transition-all
                  ${
                    selected === subCategory.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card hover:bg-primary/10 hover:text-primary"
                  }
                `}
              >
                {subCategory.name}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
