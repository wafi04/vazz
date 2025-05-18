import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { trpc } from "@/utils/trpc";
import { DepositData } from "@/types/deposits";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function TableDeposit() {
  const { data, isLoading, error } = trpc.deposits.getAll.useQuery(
    {
      page: 1,
      perPage: 10,
    },
    {
      staleTime: 1000 * 60 * 60 * 60,
      cacheTime: 10000 * 60 * 60 * 60,
    }
  );

  // Fungsi untuk menentukan tampilan nomor pembayaran
  const renderPaymentReference = (deposit: DepositData) => {
    const { noPembayaran, metode, depositId } = deposit;

    if (!noPembayaran && !depositId) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>-</span>
            </TooltipTrigger>
            <TooltipContent>
              Tidak ada nomor pembayaran tersedia.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    const normalizedMethod = metode.toLowerCase();

    // Daftar metode Virtual Account
    const vaMethods = [
      "bni virtual account",
      "permata virtual account",
      "mandiri virtual account",
      "bri virtual account",
      "cimb virtual account",
      "maybank",
    ];

    // Kasus 1: Virtual Account
    if (vaMethods.some((va) => normalizedMethod.includes(va.toLowerCase()))) {
      const vaNumber = noPembayaran || depositId;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>{vaNumber}</span>
            </TooltipTrigger>
            <TooltipContent>
              Gunakan nomor VA <strong>{vaNumber}</strong> untuk melakukan
              pembayaran melalui {metode}.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    const paymentLink = noPembayaran || depositId;
    if (paymentLink?.startsWith("http")) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={paymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Link Pembayaran
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              Klik tautan ini untuk melanjutkan pembayaran melalui {metode}.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>{paymentLink}</span>
          </TooltipTrigger>
          <TooltipContent>
            Gunakan informasi ini untuk pembayaran melalui {metode}.
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  if (isLoading) return <Loader2 className="size-10 animate-spin" />;
  if (error) return <div>Error: {error.message}</div>;

  const latestDeposit = data?.data?.[0];

  return (
    <div>
      {latestDeposit && (
        <div className="mb-4 rounded-lg bg-blue-800 p-4 ">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Pembayaran Terakhir
          </h2>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Tanggal:{" "}
                {latestDeposit.createdAt
                  ? new Date(latestDeposit.createdAt).toLocaleDateString(
                      "id-ID",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )
                  : "-"}
              </p>
              <p className="text-sm text-gray-900">
                Metode: {latestDeposit.metode}
              </p>
              {renderPaymentReference(latestDeposit)}
              <p className="text-sm text-gray-900">
                Jumlah:{" "}
                {latestDeposit.jumlah.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                latestDeposit.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100"
                  : "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"
              }`}
            >
              {latestDeposit.status}
            </span>
          </div>
        </div>
      )}

      {/* Tabel Deposit */}
      <Table>
        <TableHeader>
          <TableRow className="dark:bg-gray-800">
            <TableHead className="text-left text-sm font-semibold text-white">
              Tanggal
            </TableHead>
            <TableHead className="text-left text-sm font-semibold text-white">
              Metode
            </TableHead>
            <TableHead className="text-left text-sm font-semibold text-white">
              Jumlah
            </TableHead>
            <TableHead className="text-left text-sm font-semibold text-white">
              Status
            </TableHead>
            <TableHead className="text-left text-sm font-semibold text-white">
              Nomor Pembayaran
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data?.map((deposit) => (
            <TableRow key={deposit.id}>
              <TableCell>
                {deposit.createdAt
                  ? new Date(deposit.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "-"}
              </TableCell>
              <TableCell>{deposit.metode}</TableCell>
              <TableCell>
                {deposit.jumlah.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </TableCell>
              <TableCell>{deposit.status}</TableCell>
              <TableCell className="cursor-pointer">
                {renderPaymentReference(deposit)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
