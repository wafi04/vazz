import { Deposits, Pembelian } from "@prisma/client";

export type User = {
  id: number; // Keep as number to match Prisma Int
  name: string | null;
  username: string;
  role: string;
  whatsapp: string | null;
  balance: number;
  apiKey: string | null;
  otp: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};
export type UserProfile = {
  id: number; // Keep as number to match Prisma Int
  name: string | null;
  username: string;
  role: string;
  whatsapp: string | null;
  balance: number;
  apiKey: string | null;
  otp: string | null;
  pembelian: Pembelian[];
  deposits: Deposits[];
  createdAt: string | null;
  updatedAt: string | null;
};

export type Member = {
  name: string;
  id: number;
  createdAt: string | null;
  updatedAt: string | null;
  username: string;
  whatsapp: string | null;
  password: string;
  balance: number;
  role: string;
  otp: string | null;
  apiKey: string | null;
  lastPaymentAt: string | null;
};
