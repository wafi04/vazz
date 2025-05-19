import { TableCell, TableRow } from "@/components/ui/table";
import { Transaction } from "@/types/transaction";
import { AdditionalInfo } from "./additionalInfo";
import { TransactionDetails } from "./transactionDetails";
import { PaymentDetails } from "./paymentDetails";

interface ExpandedTransactionRowProps {
  transaction: Transaction;
}
export function ExpandedTransactionRow({
  transaction,
}: ExpandedTransactionRowProps) {
  return (
    <TableRow>
      <TableCell colSpan={7} className="p-0">
        <div className="bg-muted/20 p-6 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TransactionDetails transaction={transaction} />
            {transaction.pembayaran && (
              <PaymentDetails payment={transaction.pembayaran} />
            )}
            <AdditionalInfo transaction={transaction} />
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}
