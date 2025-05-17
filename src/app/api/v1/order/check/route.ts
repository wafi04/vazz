import { getProfile } from "@/app/(auth)/auth/components/server";
import { ValidationMethodPayment } from "@/features/transaction/method/validation";
import { checkingVoucher } from "@/features/transaction/voucher/checkingVoucher";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { voucherCode, productCode, methodCode } = body;

  // Validate required input
  if (!voucherCode) {
    return NextResponse.json(
      {
        message: "Voucher Code is Required",
        code: 400,
        status: false,
      },
      {
        status: 400,
      }
    );
  }

  try {
    // Get user profile
    const user = await getProfile();

    // Perform transaction with proper response handling
    const result = await prisma.$transaction(async (tx) => {
      // Find product
      const product = await tx.layanan.findFirst({
        where: {
          providerId: productCode,
        },
      });

      if (!product) {
        // This will throw an error to exit the transaction
        throw new Error("Product Not Found");
      }

      // Set price based on user role
      let price;
      if (user && user.session.role === "Platinum") {
        price = product.hargaPlatinum;
      } else if (user?.session.role === "Reseller") {
        price = product.hargaReseller;
      } else {
        price = product.harga;
      }

      // Validate payment method
      const method = await ValidationMethodPayment({
        amount: price,
        paymentCode: methodCode,
        tx,
      });

      price = method.totalAmount;

      // Check voucher
      const validationVoucher = await checkingVoucher(tx, {
        amount: price,
        voucherCode,
        categoryId: product.kategoriId,
      });

      // Return data for use outside the transaction
      return {
        message: validationVoucher.message,
        data: validationVoucher,
        code: 200,
        status: validationVoucher.status,
      };
    });

    // Return the actual API response from outside the transaction
    return NextResponse.json(result);
  } catch (error) {
    // Handle errors
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";

    return NextResponse.json(
      {
        message: errorMessage,
        code: 400,
        status: false,
      },
      {
        status: 400,
      }
    );
  }
}
