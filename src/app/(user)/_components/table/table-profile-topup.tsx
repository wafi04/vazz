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
import Link from "next/link";
import { usePathname } from "next/navigation";

const getStatusVariant = (status: string) => {
  switch (status.toUpperCase()) {
    case "PENDING":
      return "outline";
    case "SUCCESS":
      return "default";
    case "FAILED":
      return "destructive";
    default:
      return "secondary";
  }
};

interface TableProfileTopupProps {
  purchases: any[];
}

export function TableProfileTopup({ purchases }: TableProfileTopupProps) {
  const pathname = usePathname();
  return (
    <div className="overflow-x-auto rounded-lg border border-primary/20 bg-card shadow-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-card hover:bg-card border-b border-primary/20">
            <TableHead className="text-left text-sm font-semibold text-foreground px-4 py-3">
              Tanggal
            </TableHead>
            <TableHead className="text-left text-sm font-semibold text-foreground px-4 py-3">
              Layanan
            </TableHead>
            <TableHead className="text-left text-sm font-semibold text-foreground px-4 py-3">
              Jumlah
            </TableHead>
            <TableHead className="text-left text-sm font-semibold text-foreground px-4 py-3">
              Status
            </TableHead>
            <TableHead className="text-left text-sm font-semibold text-foreground px-4 py-3">
              Referensi
            </TableHead>
            <TableHead className="text-left text-sm font-semibold text-foreground px-4 py-3">
              invoice
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-muted-foreground bg-background/50"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium">
                    Tidak ada data pembelian
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Riwayat transaksi Anda akan muncul di sini
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            purchases.map((purchase, index) => (
              <TableRow
                key={purchase.id}
                className={`
                  hover:bg-primary/5 transition-colors border-b border-primary/10 last:border-b-0
                  ${index % 2 === 0 ? "bg-background" : "bg-background/50"}
                `}
              >
                <TableCell className="text-sm text-foreground px-4 py-3 font-medium">
                  {formatDate(purchase.createdAt as string)}
                </TableCell>
                <TableCell className="text-sm text-foreground px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-medium">{purchase.layanan}</span>
                    {purchase.target && (
                      <span className="text-xs text-muted-foreground mt-1">
                        {purchase.target}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-foreground px-4 py-3 font-semibold">
                  <span className="text-primary">
                    {FormatPrice(purchase.harga)}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3">
                  <Badge
                    variant={getStatusVariant(purchase.status)}
                    className="text-xs font-medium"
                  >
                    {purchase.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground px-4 py-3 font-mono">
                  {purchase.orderId ? (
                    <span className="bg-muted/20 px-2 py-1 rounded text-xs">
                      {purchase.orderId}
                    </span>
                  ) : (
                    <span className="text-muted-foreground/50">-</span>
                  )}
                </TableCell>
                <TableCell className="py-3">
                  <Link
                    href={`/invoice?invoice=${purchase.orderId}`}
                    className="text-xs font-medium bg-blue-900 p-2 rounded-full"
                  >
                    Check Invoice
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
