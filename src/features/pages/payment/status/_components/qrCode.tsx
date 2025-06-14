import { QrCode } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function QrCodeMethod({ noPembayaran }: { noPembayaran: string }) {
  return (
    <div className="mt-4 mb-4">
      <div className="text-sm text-muted-foreground mb-2">QRIS Code:</div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full justify-start gap-2">
            <QrCode className="h-4 w-4" />
            Tampilkan QR Code QRIS
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              Scan QR Code QRIS
            </DialogTitle>
          </DialogHeader>

          {/* QR Code Image - Ukuran diperkecil dan styling disesuaikan */}
          <div className="flex flex-col items-center ">
            <div className="p-3 rounded-lg bg-background border border-border mb-3">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  noPembayaran
                )}`}
                alt="QRIS QR Code"
                className="w-32 h-32 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  target.nextElementSibling!.classList.remove("hidden");
                }}
              />
              <div className="hidden text-center p-6 text-muted-foreground">
                <QrCode className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">QR Code tidak dapat dimuat</p>
              </div>
            </div>
          </div>
          {/* Instruksi dengan warna yang disesuaikan */}
          <div className="mt-3 p-3 bg-primary/10 border border-primary/20 rounded-md">
            <div className="text-xs text-primary">
              <strong className="text-primary">Cara Pembayaran:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1 text-card-foreground/80">
                <li>Buka aplikasi mobile banking atau e-wallet</li>
                <li>Pilih menu QRIS atau Scan QR</li>
                <li>Scan QR Code di atas atau paste QRIS code</li>
                <li>Konfirmasi pembayaran</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
