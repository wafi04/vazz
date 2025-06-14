"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getPaymentStatusVariant,
  getStatusVariant,
} from "@/components/ui/statusHelpers";
import { TableCell, TableRow } from "@/components/ui/table";
import { Transaction } from "@/types/transaction";
import { FormatPrice, formatDate } from "@/utils/formatPrice";
import { ChevronDown, ChevronRight, FileText } from "lucide-react";
import { ButtonReOrder } from "../buttonReOrder";

interface TransactionRowProps {
  transaction: Transaction;
  isExpanded: boolean;
  onToggle: () => void;
}

export function TransactionRow({
  transaction,
  isExpanded,
  onToggle,
}: TransactionRowProps) {
  return (
    <TableRow
      className="hover:bg-muted/30 transition-colors cursor-pointer"
      onClick={onToggle}
    >
      <TableCell className="w-10">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </TableCell>

      <TableCell className="font-medium text-primary">
        {transaction.orderId}
      </TableCell>

      <TableCell>
        <div className="space-y-1">
          <div className="font-medium">
            {transaction.username || transaction.nickname || "Anonymous"}
          </div>
          {transaction.zone ? (
            <div className="text-sm text-muted-foreground">
              {transaction.userId}-{transaction.zone}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              {transaction.userId}
            </div>
          )}
        </div>
      </TableCell>

      <TableCell>
        <div className="font-medium">{transaction.layanan}</div>
      </TableCell>

      <TableCell>
        <span className="font-semibold text-accent">
          {FormatPrice(transaction.harga)}
        </span>
      </TableCell>
      <TableCell>
        <span className="font-semibold text-accent">
          {FormatPrice(transaction.pembayaran?.totalAmount ?? 0)}
        </span>
      </TableCell>

      <TableCell className="text-center">
        <div className="space-y-1">
          <Badge variant={getStatusVariant(transaction.status)}>
            {transaction.status}
          </Badge>
          {transaction.pembayaran?.status && (
            <div>
              <Badge
                variant={getPaymentStatusVariant(transaction.pembayaran.status)}
                className="text-xs"
              >
                {transaction.pembayaran.status}
              </Badge>
            </div>
          )}
        </div>
      </TableCell>

      <TableCell className="text-right text-muted-foreground">
        {formatDate(transaction.createdAt as string)}
      </TableCell>
    </TableRow>
  );
}

interface TransactionDetailsProps {
  transaction: Transaction;
}

export function TransactionDetails({ transaction }: TransactionDetailsProps) {
  return (
    <div className="space-y-3 bg-muted/20 rounded-md">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-card-foreground flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          Transaction Details
        </h4>
        <ButtonReOrder orderId={transaction.orderId} />
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Transaction ID:</span>
          <span className="font-medium">{transaction.orderId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Harga Beli:</span>
          <span className="font-medium text-secondary">
            {transaction.priceBuy}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Discount:</span>
          <span className="font-medium text-secondary">
            {transaction.discount ?? 0}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Profit:</span>
          <span className="font-medium text-secondary">
            {transaction.profit}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Profit Rupiah:</span>
          <span className="font-medium text-secondary">
            {transaction.profitRupiah}
          </span>
        </div>
        {transaction.successReportSended !== undefined && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Report Sent:</span>
            <Badge
              variant={
                transaction.successReportSended ? "default" : "secondary"
              }
            >
              {transaction.successReportSended ? "Yes" : "No"}
            </Badge>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Order ulang:</span>
          <Badge variant={transaction.isReorder ? "default" : "secondary"}>
            {transaction.isReorder ? "Yes" : "No"}
          </Badge>
        </div>
        {transaction.updatedAt && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Updated:</span>
            <span className="font-medium">
              {formatDate(transaction.updatedAt)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
