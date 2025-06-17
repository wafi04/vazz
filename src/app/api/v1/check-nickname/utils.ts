import axios from "axios";

export const allowedMethod = ["GET", "HEAD"];

export function getUrl(request: Request): URL {
  return new URL(request.url);
}

export function timeNow(): number {
  return Date.now();
}

export async function hitCoda(body: string): Promise<any> {
  const response = await fetch(
    "https://order-sg.codashop.com/initPayment.action",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    }
  );
  const data = await response.json();
  return data;
}

export async function HitRapsPoint(userId: string) {
  const response = await axios.post(
    "https://hub.rapspoint.com/api/top-up/free-fire/get-username",
    {
      game_id: userId,
      product_id: 28,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Origin: "https://hub.rapspoint.com",
        Referer: "https://hub.rapspoint.com/",
      },
    }
  );
  const data = await response.data;
  return data;
}

export interface ResultFromCoda {
  success: boolean;
  game?: string;
  id?: number | string;
  server?: string | number;
  name?: string;
  region?: string;
  message?: string;
}
