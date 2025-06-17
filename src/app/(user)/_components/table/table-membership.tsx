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
import { Loader2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export function TableMembership() {
  const { data, isLoading, error } = trpc.membership.getMembership.useQuery();

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
                <Button>
                  <Link href={`/invoice?invoice=${deposit.orderId}`}>
                    Link Pemabayaran
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
