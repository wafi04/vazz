import { Transaction } from "@/types/transaction";
import { Eye } from "lucide-react";

interface AdditionalInfoProps {
  transaction: Transaction;
}

export function AdditionalInfo({ transaction }: AdditionalInfoProps) {
  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-card-foreground flex items-center gap-2">
        <Eye className="w-4 h-4 text-primary" />
        Additional Information
      </h4>
      <div className="space-y-2 text-sm">
        {transaction.nickname && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nickname:</span>
            <span className="font-medium">{transaction.nickname}</span>
          </div>
        )}
        {transaction.log && (
          <div className="space-y-1">
            <span className="text-muted-foreground">Log:</span>
            <div className="bg-background p-2 rounded border border-border">
              <code className="text-xs text-foreground whitespace-pre-wrap">
                {transaction.log}
              </code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
