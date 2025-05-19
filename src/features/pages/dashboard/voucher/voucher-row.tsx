import React, { useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  MoreVertical,
  Pencil,
  Trash2,
  Copy,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Voucher } from "@/types/voucher";
import { FormatPrice, formatDate } from "@/utils/formatPrice";
import { VoucherUsageTable } from "./voucherUsageTable";

interface VoucherRowProps {
  voucher: Voucher;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: (voucher: Voucher) => void;
  onDelete: (voucher: Voucher) => void;
}
export const getUsageProgress = (voucher: Voucher): number => {
  if (!voucher.usageLimit || voucher.usageLimit === 0) {
    return 0;
  }
  return (voucher.usageCount / voucher.usageLimit) * 100;
};

export const copyToClipboard = (text: string): void => {
  navigator.clipboard.writeText(text);
};

export const VoucherRow: React.FC<VoucherRowProps> = React.memo(
  ({ voucher, isExpanded, onToggle, onEdit, onDelete }) => {
    const handleCopy = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        copyToClipboard(voucher.code);
      },
      [voucher.code]
    );

    const handleToggle = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggle();
      },
      [onToggle]
    );

    return (
      <>
        <TableRow
          className="hover:bg-muted/30 transition-colors cursor-pointer"
          onClick={onToggle}
        >
          <TableCell>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handleToggle}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </TableCell>
          <TableCell className="font-medium">
            <div className="flex items-center gap-2">
              <span className="font-mono">{voucher.code}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleCopy}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
              {voucher.description}
            </p>
          </TableCell>
          <TableCell>
            {voucher.discountValue}
            {voucher.discountType === "PERCENTAGE" && "%"}
          </TableCell>
          <TableCell>
            <div className="text-xs">
              <div>Start: {formatDate(voucher.startDate, "date-only")}</div>
              <div>End: {formatDate(voucher.expiryDate, "date-only")}</div>
            </div>
          </TableCell>
          <TableCell>{FormatPrice(voucher.minPurchase ?? 0)}</TableCell>
          <TableCell>
            {voucher.usageLimit ? (
              <div className="space-y-1">
                <div className="text-xs">
                  {voucher.usageCount} / {voucher.usageLimit}
                </div>
                <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      voucher.isActive ? "bg-primary" : "bg-muted-foreground/50"
                    }`}
                    style={{ width: `${getUsageProgress(voucher)}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              "Unlimited"
            )}
          </TableCell>
          <TableCell>
            <Badge variant={voucher.isActive ? "default" : "outline"}>
              {voucher.isActive ? "Active" : "Inactive"}
            </Badge>
          </TableCell>
          <TableCell>
            <div className="flex flex-col gap-1">
              <Badge variant="outline" className="capitalize">
                {voucher.discountType.toLowerCase()}
              </Badge>
              {voucher.isForAllCategories && (
                <Badge variant="secondary" className="text-xs">
                  All categories
                </Badge>
              )}
            </div>
          </TableCell>
          <TableCell className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(voucher)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete(voucher)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete voucher
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
        {isExpanded && (
          <TableRow>
            <TableCell colSpan={9} className="bg-muted/20 p-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-card-foreground">
                  Usage Details
                </h4>
                <VoucherUsageTable usage={voucher.usage} />
              </div>
            </TableCell>
          </TableRow>
        )}
      </>
    );
  }
);
