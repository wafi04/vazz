import { DUITKU_API_KEY, DUITKU_MERCHANT_CODE } from "@/constants";
import { Duitku } from "@/app/api/v1/duitku/duitku/duitku";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const ApiKey = req.nextUrl.searchParams.get("ApiKey");
  const merchantOrderId = req.nextUrl.searchParams.get("OrderId");
  const duitku = new Duitku(
    DUITKU_API_KEY as string,
    DUITKU_MERCHANT_CODE as string
  );
  if (!ApiKey || !merchantOrderId) {
    return NextResponse.json(
      {
        status: 500,
        message: "Unauthorized",
      },
      {
        status: 500,
      }
    );
  }

  const reqtoDuitku = await duitku.GetTransaction({
    merchantOrderId,
  });

  return NextResponse.json(
    {
      status: true,
      code: 200,
      message: "Data Recieved Successfully",
      data: reqtoDuitku,
    },
    {
      status: 200,
    }
  );
}
