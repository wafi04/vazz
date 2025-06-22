export type message = "PENDING" | "PAID" | "FAILED" | "SUCCESS";
export function messageLogs(message: message, ket?: string): string {
  switch (message) {
    case "PENDING":
      return "Pembelian Masih Pending";
    case "FAILED":
      return `Transaksi Gagal,${
        ket ? ket : "Saldo telah otomatis Jadi Saldo Akun"
      }`;
    case "PAID":
      return "Transaksi Telah Dibayar";
    case "SUCCESS":
      return `Transaksi Berhasil ${ket}`;
  }
}
