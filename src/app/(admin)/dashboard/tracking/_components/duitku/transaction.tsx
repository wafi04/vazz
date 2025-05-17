"use client";
import { motion } from "framer-motion";
import { useCheckTransactionDuitku } from "./useHooks";
import { useDebouncedValue } from "@/hooks/useDebounced";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import type { ResponseFromDuitkuCheckTransaction } from "@/lib/duitku/duitku";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { FormatPrice } from "@/utils/formatPrice";

export const TransactionContent = (): JSX.Element => {
  const [search, setSearch] = useState<string>("");
  const debounced = useDebouncedValue(search);
  const [data, setData] = useState<ResponseFromDuitkuCheckTransaction | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const fetchTransaction = async () => {
    if (!debounced) return;

    setLoading(true);
    try {
      const response = await useCheckTransactionDuitku({
        OrderId: debounced,
      });
      setData(response);
    } catch (err) {
      toast.error("Error fetching transaction:", {
        description: err as string,
      });
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, [debounced]);

  const transaction = data?.data;

  const getStatusColor = (status?: string) => {
    if (!status) return "text-secondary";

    const statusLower = status.toLowerCase();
    if (statusLower.includes("success") || statusLower.includes("berhasil")) {
      return "text-green-400";
    } else if (
      statusLower.includes("pending") ||
      statusLower.includes("menunggu")
    ) {
      return "text-accent";
    } else if (
      statusLower.includes("failed") ||
      statusLower.includes("gagal")
    ) {
      return "text-destructive";
    }
    return "text-secondary";
  };

  const getStatusIcon = (status?: string) => {
    if (!status) return <AlertCircle className="w-4 h-4 text-secondary" />;

    const statusLower = status.toLowerCase();
    if (statusLower.includes("success") || statusLower.includes("berhasil")) {
      return <CheckCircle2 className="w-4 h-4 text-green-400" />;
    } else if (
      statusLower.includes("pending") ||
      statusLower.includes("menunggu")
    ) {
      return <Clock className="w-4 h-4 text-accent" />;
    } else {
      return <AlertCircle className="w-4 h-4 text-destructive" />;
    }
  };

  return (
    <div className="bg-card rounded-xl p-4 shadow-lg mt-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 rounded-lg bg-background/50  shadow-sm"
      >
        <h3 className="text-sm font-medium mb-3 text-primary">
          Masukkan Order ID Transaksi
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              placeholder="Order ID transaksi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className=" focus-visible:ring-primary/70 bg-background/80 text-sm h-10"
            />
          </div>
          <Button
            className="bg-primary hover:bg-primary/80 text-primary-foreground h-10"
            size="sm"
            onClick={() => {
              if (search) {
                fetchTransaction();
              }
            }}
          >
            <Search className="w-4 h-4 mr-2" />
            Cari
          </Button>
        </div>
      </motion.div>

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50"
        >
          <div className=" p-4 rounded-lg shadow-lg flex items-center space-x-3">
            <div className="w-5 h-5 rounded-full animate-spin"></div>
            <p className="text-sm font-medium">Memuat...</p>
          </div>
        </motion.div>
      )}

      {!loading && !transaction && search && debounced && (
        <div className="bg-background/50 rounded-lg p-6  flex flex-col items-center justify-center">
          <AlertCircle className="h-12 w-12 text-accent mb-3" />
          <h4 className="text-base font-medium text-foreground mb-1">
            Transaksi Tidak Ditemukan
          </h4>
          <p className="text-sm text-muted-foreground text-center">
            Tidak ada data transaksi untuk Order ID tersebut
          </p>
        </div>
      )}

      {transaction && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-primary">
              Transaction Details
            </h3>
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-1 rounded-full text-sm",
                getStatusColor(transaction.statusMessage)
              )}
            >
              {getStatusIcon(transaction.statusMessage)}
              <span className="font-medium">
                {transaction.statusMessage || "Unknown"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Order ID */}
            <div className="rounded-lg p-4 bg-background/50  shadow-sm">
              <h4 className="text-xs font-medium text-primary/80 mb-1">
                Order ID
              </h4>
              <p className="text-sm font-semibold truncate text-foreground">
                {transaction.merchantOrderId || "N/A"}
              </p>
            </div>

            {/* Reference */}
            <div className="rounded-lg p-4 bg-background/50  shadow-sm">
              <h4 className="text-xs font-medium text-accent mb-1">
                Reference
              </h4>
              <p className="text-sm font-semibold truncate text-foreground">
                {transaction.reference || "N/A"}
              </p>
            </div>

            {/* Amount */}
            <div className="rounded-lg p-4 bg-background/50  shadow-sm">
              <h4 className="text-xs font-medium text-secondary mb-1">
                Amount
              </h4>
              <p className="text-sm font-semibold truncate text-foreground">
                {FormatPrice(parseInt(transaction.amount))}
              </p>
            </div>

            {/* Fee */}
            <div className="rounded-lg p-4 bg-background/50  shadow-sm">
              <h4 className="text-xs font-medium text-chart-5 mb-1">
                Fee Pembayaran
              </h4>
              <p className="text-sm font-semibold truncate text-foreground">
                {FormatPrice(parseInt(transaction.fee))}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
