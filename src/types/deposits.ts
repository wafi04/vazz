import { User } from "./schema/user";

export type DepositData = {
  log: string | null;
  id: number;
  createdAt: string | null;
  updatedAt: string | null;
  status: string;
  username: string;
  depositId: string | null;
  metode: string;
  noPembayaran: string;
  jumlah: number;
};
