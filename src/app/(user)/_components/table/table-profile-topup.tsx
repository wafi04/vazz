import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { FormatPrice, formatDate } from "@/utils/formatPrice";

// Define badge variants based on status
const getStatusVariant = (status: string) => {
  switch (status.toUpperCase()) {
    case "PENDING":
      return "outline";
    case "SUCCESS":
    case "BERHASIL":
      return "default";
    case "FAILED":
    case "GAGAL":
      return "destructive";
    default:
      return "secondary";
  }
};

interface TableProfileTopupProps {
  purchases: Transaksi[];
}

export function TableProfileTopup({ purchases }: TableProfileTopupProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-800">
            <TableHead className="text-left text-sm font-semibold text-white ">
              Tanggal
            </TableHead>
            <TableHead className="text-left text-sm font-semibold text-white ">
              Layanan
            </TableHead>
            <TableHead className="text-left text-sm font-semibold text-white ">
              Jumlah
            </TableHead>
            <TableHead className="text-left text-sm font-semibold text-white ">
              Status
            </TableHead>
            <TableHead className="text-left text-sm font-semibold text-white ">
              Referensi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-6 text-gray-500 dark:text-gray-400"
              >
                Tidak ada data pembelian.
              </TableCell>
            </TableRow>
          ) : (
            purchases.map((purchase) => (
              <TableRow
                key={purchase.id}
                className=" dark:hover:bg-gray-800 transition-colors"
              >
                <TableCell className="text-sm text-white ">
                  {formatDate(purchase.createdAt as string)}
                </TableCell>
                <TableCell className="text-sm text-white ">
                  {purchase.layanan}
                </TableCell>
                <TableCell className="text-sm text-white ">
                  {FormatPrice(purchase.harga)}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(purchase.status)}>
                    {purchase.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-white ">
                  {purchase.orderId || "-"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
