import { Button } from "@/components/ui/button";
import { SubCategories } from "@/types/category";
import { motion } from "framer-motion";
import { useFilterProduct } from "@/hooks/use-filterProduct";
import { useState } from "react";

export function HeaderFilterProduct({ subCategories }: { subCategories?: SubCategories[] }) {
  const { setFilter } = useFilterProduct();
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (code: string) => {
    setSelected(code);
    setFilter(code);
  };

  return (
    <div className="p-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {subCategories?.map((subCategory, idx) => (
          <motion.div
            key={subCategory.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.07 }}
          >
            <Button
              variant="outline"
              onClick={() => handleSelect(subCategory.code)}
              className={`w-full justify-start px-5 py-3 rounded-xl transition-all
                ${selected === subCategory.code
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
  );
}
