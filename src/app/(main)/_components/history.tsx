import { useState } from "react";
import { Items, useOrderStore } from "@/hooks/use-order";
import { FormatPrice } from "@/utils/formatPrice";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ButtonApplyHistory } from "./buttonApplyHistory";
import { toast } from "sonner";

export function CardHistory() {
  const { history, applyHistoryToOrder } = useOrderStore();
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [appliedItems, setAppliedItems] = useState<Set<number>>(new Set());

  const toggleExpand = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };
  const handleApplyToOrder = (item: Items, index: number) => {
    applyHistoryToOrder(item);
    setAppliedItems((prev) => new Set(prev).add(index));
    toast.success(`${item.product.name} berhasil diterapkan ke pesanan!`);

    setTimeout(() => {
      setAppliedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }, 3000);
  };

  if (history.length === 0) {
    return (
      <section className="flex flex-col p-4">
        <div className="text-center text-muted-foreground">
          <p>Belum ada riwayat pesanan</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col space-y-2 mt-2">
      <h2 className="text-xl font-semibold text-foreground">Riwayat Pesanan</h2>
      {history.map((item, index) => {
        const isExpanded = expandedItems.has(index);
        const isApplied = appliedItems.has(index);
        return (
          <div
            key={index}
            className="bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            <ButtonApplyHistory
              isApplied={isApplied}
              onApply={() => handleApplyToOrder(item, index)}
            />
            {/* Header - Always Visible */}
            <div
              className="p-4 cursor-pointer hover:bg-card/80 transition-colors"
              onClick={() => toggleExpand(index)}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm text-card-foreground">
                      {item.product.name}
                    </h3>
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              } overflow-hidden`}
            >
              <div className="px-4 pb-4 ">
                {/* Product Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-4">
                  <div className="space-y-2">
                    <p className="text-sm text-card-foreground">
                      <span className="font-medium text-muted-foreground">
                        WhatsApp:
                      </span>{" "}
                      <span className="text-secondary">
                        {item.whatsAppNumber}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
