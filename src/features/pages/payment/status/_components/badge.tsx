import { getStatusConfig } from "../utils";

export type BadgeProps = {
  status: string;
};

export function Badge({ status }: BadgeProps) {
  const { color, textColor, bgColor, borderColor } = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor} border ${borderColor}`}
    >
      <span className={`w-2 h-2 rounded-full mr-2 ${color}`}></span>
      {status}
    </span>
  );
}
