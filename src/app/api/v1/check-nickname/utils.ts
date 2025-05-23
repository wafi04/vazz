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
  return await response.json();
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
