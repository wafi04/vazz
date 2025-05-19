"use client";
import { ExpandedTransactionRow } from "@/app/dashboard/_components/transactions/expandTransactionRow";
import { TransactionRow } from "@/app/dashboard/_components/transactions/transactionDetails";
import { EmptyState } from "@/components/ui/not-found/NotFound";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaction } from "@/types/transaction";
import { Fragment, useState } from "react";

interface RecentTransactionsProps {
  data: Transaction[] | undefined;
}

export function RecentTransactions({ data }: RecentTransactionsProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (transactionId: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(transactionId)) {
      newExpandedRows.delete(transactionId);
    } else {
      newExpandedRows.add(transactionId);
    }
    setExpandedRows(newExpandedRows);
  };

  if (!data?.length) {
    return <EmptyState />;
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-10"></TableHead>
            <TableHead className="font-semibold">Order ID</TableHead>
            <TableHead className="font-semibold">Customer</TableHead>
            <TableHead className="font-semibold">Service</TableHead>
            <TableHead className="font-semibold">Amount</TableHead>
            <TableHead className="font-semibold text-center">Status</TableHead>
            <TableHead className="font-semibold text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((transaction) => (
            <Fragment key={transaction.id}>
              <TransactionRow
                transaction={transaction}
                isExpanded={expandedRows.has(transaction.id)}
                onToggle={() => toggleRow(transaction.id)}
              />
              {expandedRows.has(transaction.id) && (
                <ExpandedTransactionRow transaction={transaction} />
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
