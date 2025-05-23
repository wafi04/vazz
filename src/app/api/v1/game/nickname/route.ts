import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const gameId = req.nextUrl.searchParams.get("game_id");
  const serverId = req.nextUrl.searchParams.get("zone");

  const body = {
    game_id: gameId,
    zone: serverId,
  };
  const request = await axios.post(
    "https://hub.rapspoint.com/api/top-up/mobile-legends/get-username",
    body,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = request.data.data;

  return NextResponse.json({
    message: request.data.message,
    data,
  });
}
