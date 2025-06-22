import { prisma } from "@/lib/prisma";

export type RefundSaldoInput = {
  username: string;
  amount: number;
};
export type RefundSaldoOutput = {
  success: boolean;
  message?: string;
};
export async function RefundSaldo({
  username,
  amount,
}: RefundSaldoInput): Promise<RefundSaldoOutput> {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return {
      success: false,
      message: "User Not found",
    };
  }

  await prisma.user.update({
    where: {
      username,
    },
    data: {
      balance: {
        increment: amount,
      },
    },
  });

  return {
    success: true,
    message: "Refund Succesfully",
  };
}
