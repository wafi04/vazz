// components/vouchers/VoucherUsageTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VoucherUsage } from "@/types/voucher";
import { FormatPrice, formatDate } from "@/utils/formatPrice";

interface VoucherUsageTableProps {
  usage: VoucherUsage[];
}

export const VoucherUsageTable: React.FC<VoucherUsageTableProps> = ({
  usage,
}) => {
  if (usage.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No usage data available.</p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>WhatsApp</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Expires At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {usage.map((usage) => (
          <TableRow key={usage.id}>
            <TableCell>{usage.orderId}</TableCell>
            <TableCell>{usage.username || "Anonymous"}</TableCell>
            <TableCell>{usage.whatsapp || "-"}</TableCell>
            <TableCell>{FormatPrice(usage.amount)}</TableCell>
            <TableCell>{formatDate(usage.createdAt, "date-only")}</TableCell>
            <TableCell>
              {usage.expiresAt ? formatDate(usage.expiresAt, "date-only") : "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
