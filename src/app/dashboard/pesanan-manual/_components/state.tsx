import { Loader2, Package, XCircle } from "lucide-react";
import { HeaderOrderManual } from "./header-order-manual";
import { ReactNode } from "react";

export const LoadingState = ({
  children,
  text = "Memuat data pesanan...",
}: {
  children?: ReactNode;
  text?: string;
}) => (
  <main className="min-h-screen p-8 space-y-6 bg-background">
    {children && <HeaderOrderManual />}
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center space-x-2 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span>{text}</span>
      </div>
    </div>
  </main>
);

// Error Component
export const ErrorState = ({ error }: { error: { message: string } }) => (
  <main className="min-h-screen p-8 space-y-6 bg-background">
    <HeaderOrderManual />
    <div className="bg-chart-5/10 border border-chart-5/30 rounded-xl p-6">
      <div className="flex items-center space-x-2 text-chart-5">
        <XCircle className="w-5 h-5" />
        <span className="font-medium">Gagal memuat data</span>
      </div>
      <p className="text-chart-5/80 mt-2">{error.message}</p>
    </div>
  </main>
);

// Empty State Component
export const EmptyState = () => (
  <div className="p-12 text-center">
    <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
      <Package className="w-12 h-12 text-primary" />
    </div>
    <h3 className="text-lg font-medium text-foreground mb-2">
      Belum ada pesanan
    </h3>
    <p className="text-muted-foreground">
      Pesanan manual akan muncul di sini setelah dibuat
    </p>
  </div>
);
