import { PembelianManualData } from "@/types/transaction";
import { Package, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { ReactNode, Dispatch, SetStateAction } from "react";

interface StatsCardProps {
  categoryData: PembelianManualData[]; // Replace with proper type based on your data structure
  selectedFilter: string;
  setSelectedFilter: Dispatch<SetStateAction<string>>;
}

export const StatsCards = ({
  categoryData,
  selectedFilter,
  setSelectedFilter,
}: StatsCardProps) => {
  const statsCards = [
    {
      text: "Total Pesanan",
      status: "total",
      count: categoryData?.length || 0,
      icon: <Package className="w-8 h-8 text-primary" />,
      iconBg: "bg-primary/20",
    },
    {
      text: "Berhasil",
      status: "SUCCESS",
      count:
        categoryData?.filter((item) => item.status === "SUCCESS").length || 0,
      icon: <CheckCircle className="w-8 h-8 text-chart-2" />,
      iconBg: "bg-chart-2/20",
    },
    {
      text: "Gagal",
      status: "FAILED",
      count:
        categoryData?.filter((item) => item.status === "FAILED").length || 0,
      icon: <XCircle className="w-8 h-8 text-chart-5" />,
      iconBg: "bg-chart-5/20",
    },
    {
      text: "Pending",
      status: "PAID",
      count: categoryData?.filter((item) => item.status === "PAID").length || 0,
      icon: <AlertCircle className="w-8 h-8 text-accent" />,
      iconBg: "bg-accent/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((card) => (
        <button
          key={card.status}
          className={`bg-card rounded-xl shadow-lg border border-border p-6 hover:shadow-xl transition-all duration-300 w-full ${
            selectedFilter === card.status ? "border-primary border-2" : ""
          }`}
          onClick={() => setSelectedFilter(card.status)}
          aria-pressed={selectedFilter === card.status}
          aria-label={`Filter by ${card.text}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {card.text}
              </p>
              <p
                className={`text-2xl font-bold ${
                  card.status === "total"
                    ? "text-foreground"
                    : card.status === "SUCCESS"
                    ? "text-chart-2"
                    : card.status === "FAILED"
                    ? "text-chart-5"
                    : "text-accent"
                }`}
              >
                {card.count ?? 0}
              </p>
            </div>
            <div className={`p-3 ${card.iconBg} rounded-xl`}>{card.icon}</div>
          </div>
        </button>
      ))}
    </div>
  );
};
