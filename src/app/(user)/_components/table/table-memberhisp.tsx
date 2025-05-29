import {
  ErrorState,
  LoadingState,
} from "@/app/dashboard/pesanan-manual/_components/state";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/formatPrice";
import { trpc } from "@/utils/trpc";
import { Loader2, ExternalLink, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function TableMembership() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { data, isLoading, error } = trpc.membership.getMembership.useQuery();

  // Function to detect if payment info is VA number or link
  const detectPaymentType = (paymentInfo: string) => {
    if (!paymentInfo) return null;

    // Regex to detect if it's a number (VA)
    const isVANumber = /^\d+$/.test(paymentInfo.trim());

    // Regex to detect if it's a URL/link
    const isLink = /^https?:\/\//.test(paymentInfo.trim());

    if (isVANumber) return "va";
    if (isLink) return "link";
    return "text"; // fallback for other formats
  };

  // Function to copy VA number to clipboard
  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      toast.success(`Berhasil copy ${text}`);
    } catch (err) {
      toast.error("Gagal Copy Text");
    }
  };

  // Function to open link in new tab
  const openLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Function to render payment info based on type
  const renderPaymentInfo = (paymentInfo: string, depositId: string) => {
    const paymentType = detectPaymentType(paymentInfo);

    switch (paymentType) {
      case "va":
        return (
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm">{paymentInfo}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(paymentInfo, depositId)}
              className="h-8 w-8 p-0"
            >
              {copiedId === depositId ? (
                <span className="text-xs">✓</span>
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        );

      case "link":
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => openLink(paymentInfo)}
            className="flex items-center gap-2"
          >
            <span>Bayar Sekarang</span>
            <ExternalLink className="h-3 w-3" />
          </Button>
        );

      case "text":
      default:
        return <span className="text-sm">{paymentInfo}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin h-8 w-8" />
        <span className="ml-2">Memuat data membership...</span>
      </div>
    );
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="dark:bg-gray-800">
            <TableHead className="text-left text-sm font-semibold">
              Tanggal
            </TableHead>
            <TableHead className="text-left text-sm font-semibold">
              Metode
            </TableHead>
            <TableHead className="text-left text-sm font-semibold">
              Jumlah
            </TableHead>
            <TableHead className="text-left text-sm font-semibold">
              Status
            </TableHead>
            <TableHead className="text-left text-sm font-semibold">
              Pembayaran
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data?.map((deposit) => (
            <TableRow key={deposit.id}>
              <TableCell>
                {formatDate((deposit.createdAt as string) ?? "-", "date-only")}
              </TableCell>
              <TableCell>{deposit.pembayaran?.metode}</TableCell>
              <TableCell>{deposit.pembayaran?.harga}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    deposit.status === "SUCCESS"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : deposit.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : deposit.status === "FAILED"
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                  }`}
                >
                  {deposit.status}
                </span>
              </TableCell>
              <TableCell>
                {deposit.pembayaran?.noPembayaran
                  ? renderPaymentInfo(
                      deposit.pembayaran.noPembayaran,
                      deposit.orderId
                    )
                  : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
