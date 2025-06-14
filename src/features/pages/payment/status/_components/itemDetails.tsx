import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function DetailItem({
  label,
  value,
  valueClassName = "",
}: {
  label: string;
  value: string | ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={cn("text-sm", valueClassName)}>{value}</span>
    </div>
  );
}
