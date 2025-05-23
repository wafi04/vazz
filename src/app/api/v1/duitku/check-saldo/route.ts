import { DUITKU_API_KEY, DUITKU_MERCHANT_CODE } from "@/constants";
import { Duitku } from "@/app/api/v1/duitku/duitku/duitku";
import { NextResponse } from "next/server";

export async function GET() {
  const duitku = new Duitku(
    DUITKU_API_KEY as string,
    DUITKU_MERCHANT_CODE as string
  );

  const reqToDuitku = await duitku.GetSaldo();

  console.log(reqToDuitku);

  return NextResponse.json({
    message: "Duitku retreived successfully",
    data: reqToDuitku.data,
  });
}
