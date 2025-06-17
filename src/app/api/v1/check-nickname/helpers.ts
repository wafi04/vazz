import { NextRequest } from "next/server";
import { ResultFromCoda } from "./utils";
import callAPI from "./routing";

export async function processRequest(
  request: NextRequest
): Promise<{ data: ResultFromCoda; status: number }> {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const dc = searchParams.get("decode");

  let code = 200;

  let result: ResultFromCoda = await callAPI(request);

  if (result.name) {
    result.name = result.name.replace(/\u002B/g, "%20");
    if (dc === null || dc === "true" || dc !== "false") {
      result.name = decodeURIComponent(result.name);
    }
  }

  if (result.message === "Bad request") {
    code = 400;
  }

  if (result.message === "Not found") {
    code = 404;
  }

  const responseData = {
    data: result,
    status: code,
  };

  return responseData;
}
