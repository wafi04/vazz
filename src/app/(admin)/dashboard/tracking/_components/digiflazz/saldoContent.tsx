import { Button } from "@/components/ui/button";
import { FormatPrice } from "@/utils/formatPrice";
import { Copy, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { ContentData } from "./digiflazz";

// Content renderers
export const SaldoContent: React.FC<{ contentData: ContentData | null }> = ({
    contentData,
  }) => (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center p-6 rounded-lg">
        <CreditCard className="w-12 h-12 text-blue-500 mb-2" />
        <h3 className="text-xl font-medium text-center mb-1">Saldo Tersedia</h3>
        {contentData && (
          <div className="text-3xl font-bold text-primary">
            {FormatPrice(contentData.data ?? 0)}
          </div>
        )}
      </div>
      <Button
        variant="default"
        onClick={() => {
          if (contentData) {
            navigator.clipboard.writeText(contentData.message);
            toast.success("Saldo disalin");
          }
        }}
        className="w-full"
      >
        <Copy className="mr-2 h-4 w-4" /> Salin Saldo
      </Button>
    </div>
  );