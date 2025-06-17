import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { trpc } from "@/utils/trpc";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/formatPrice";

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

  if (isLoading) return <Loader2 className="size-10 animate-spin" />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="dark:bg-gray-800">
            <TableHead className="text-left text-sm font-semibold ">
              Tanggal
            </TableHead>
            <TableHead className="text-left text-sm font-semibold ">
              Metode
            </TableHead>
            <TableHead className="text-left text-sm font-semibold ">
              Jumlah
            </TableHead>
            <TableHead className="text-left text-sm font-semibold ">
              Status
            </TableHead>
            <TableHead className="text-left text-sm font-semibold ">
              Nomor Pembayaran
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data?.map((deposit) => (
            <TableRow key={deposit.id}>
              <TableCell>
                {deposit.createdAt
                  ? formatDate(deposit.createdAt, "full")
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
                <Button>
                  <Link href={`/invoice?invoice=${deposit.depositId}`}>
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
