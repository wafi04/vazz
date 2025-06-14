import { Transaction } from "@/types/transaction";
import { Eye } from "lucide-react";

interface AdditionalInfoProps {
  transaction: Transaction;
}

export function AdditionalInfo({ transaction }: AdditionalInfoProps) {
  return (
    <div className=" rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 ">
        <Eye className="w-4 h-4 text-blue-600" />
        <h3 className="text-sm font-medium text-foreground">
          Informasi Tambahan
        </h3>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {transaction.nickname && (
          <div className="space-y-1">
            <label className="text-xs font-medium  uppercase tracking-wide">
              Nickname:
            </label>
            <p className="text-sm px-3 py-2 rounded border">
              {transaction.nickname}
            </p>
          </div>
        )}

        {transaction.log && (
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wide">
              Log:
            </label>
            <pre className="text-xs text-foreground rounded p-3 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
              {JSON.stringify(transaction.log, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
