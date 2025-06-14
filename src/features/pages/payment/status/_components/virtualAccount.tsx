import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle, Copy } from "lucide-react";

export function VirtualAccount({
  copied,
  noPembayaran,
  copy,
}: {
  copied: { id: string; value: boolean };
  noPembayaran: string;
  copy: (noPembayaran: string, id: string) => void;
}) {
  return (
    <div className="mt-2 mb-3">
      <div className="text-sm text-muted-foreground mb-1">
        No. Virtual Account:
      </div>
      <div className="flex items-center justify-between bg-blue-600 p-2 rounded-md">
        <span className="font-mono text-base font-medium text-white">
          {noPembayaran}
        </span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copy(noPembayaran || "", "id")}
                className="h-8 w-8 p-0 text-white hover:bg-blue-700"
              >
                {copied.id === "va" && copied.value ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy nomor Virtual Account</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
