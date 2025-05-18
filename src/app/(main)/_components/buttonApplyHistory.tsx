import { Button } from "@/components/ui/button";
import { Items } from "@/hooks/use-order";
import { Check, ShoppingCart } from "lucide-react";

export function ButtonApplyHistory({
  isApplied,
  onApply,
}: {
  onApply: () => void
  isApplied: boolean;
}) {
  return (
    <Button
      onClick={onApply}
      disabled={isApplied}
      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
        isApplied
          ? "bg-accent/20 text-accent border border-accent/50 cursor-default"
          : "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95"
      }`}
    >
      {isApplied ? (
        <>
          <Check className="h-4 w-4" />
          Berhasil Diterapkan
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          Terapkan ke Pesanan
        </>
      )}
    </Button>
  );
}
