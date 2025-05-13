"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { CLIENT_DIGI_USERNAME, CLIENT_DIGI_KEY } from "@/constants";
import { Digiflazz } from "@/lib/digiflazz";
import {
  Wallet,
  ListChecks,
  Search,
  ArrowRight,
  RefreshCw,
  Copy,
} from "lucide-react";

export function DigiflazzPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [dialogContent, setDialogContent] = useState<{
    title: string;
    content: any;
  } | null>(null);

  const digiflazz = new Digiflazz(CLIENT_DIGI_USERNAME, CLIENT_DIGI_KEY);

  const options = [
    {
      name: "Cek Saldo",
      icon: Wallet,
      description: "Periksa saldo akun Digiflazz Anda",
      action: async () => {
        try {
          const data = await digiflazz.checkDeposit();
          setDialogContent({
            title: "Informasi Saldo",
            content: (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Saldo Tersedia:</span>
                  <span className="text-primary font-bold">
                    Rp {data.deposit.toLocaleString("id-ID")}
                  </span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(data.deposit.toString());
                    toast.success("Saldo disalin");
                  }}
                  className="w-full"
                >
                  <Copy className="mr-2 h-4 w-4" /> Salin Saldo
                </Button>
              </div>
            ),
          });
        } catch (error) {
          toast.error("Gagal mengambil saldo");
        }
      },
    },
    {
      name: "Cek Transaksi",
      icon: ListChecks,
      description: "Lihat riwayat transaksi terakhir",
      action: async () => {
        try {
          // Placeholder for transaction check
          setDialogContent({
            title: "Riwayat Transaksi",
            content: (
              <div className="text-center">
                <p>Fitur dalam pengembangan</p>
              </div>
            ),
          });
        } catch (error) {
          toast.error("Gagal mengambil riwayat transaksi");
        }
      },
    },
    {
      name: "Cek Status",
      icon: Search,
      description: "Periksa status transaksi spesifik",
      action: async () => {
        try {
          // Placeholder for status check
          setDialogContent({
            title: "Cek Status Transaksi",
            content: (
              <div className="text-center">
                <p>Fitur dalam pengembangan</p>
              </div>
            ),
          });
        } catch (error) {
          toast.error("Gagal memeriksa status");
        }
      },
    },
  ];

  const handleClick = async (option: {
    name: string;
    action: () => Promise<void>;
  }) => {
    setIsLoading(true);
    try {
      await option.action();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full mt-4">
      <h1 className="text-2xl font-bold text-white mb-6">
        Pilih Menu Digiflazz
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {options.map((item, index) => {
          const Icon = item.icon;
          return (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <Card
                  className="hover:shadow-lg transition-all cursor-pointer 
                    border-2 border-transparent hover:border-primary 
                    bg-card text-card-foreground"
                  onClick={() => handleClick(item)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className="w-6 h-6 text-primary" />
                        <span>{item.name}</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{dialogContent?.title}</DialogTitle>
                </DialogHeader>
                {dialogContent?.content}
              </DialogContent>
            </Dialog>
          );
        })}
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <RefreshCw className="animate-spin w-10 h-10 text-white" />
        </div>
      )}
    </section>
  );
}
