import { formatDate } from "@/utils/formatPrice";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: true,
    message: "Service Successully Uptime",
    timestamp: formatDate(new Date().toISOString()),
  });
}
