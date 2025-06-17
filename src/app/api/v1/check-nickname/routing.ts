// routing.ts
import { NextRequest } from "next/server";
import { ResultFromCoda } from "./utils";
import * as router from "./router";

export default async function callAPI(
  request: NextRequest
): Promise<ResultFromCoda> {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const game = searchParams.get("game");
  const id = searchParams.get("userId") || searchParams.get("id");
  const server =
    searchParams.get("serverId") ||
    searchParams.get("zone") ||
    searchParams.get("server");

  if (!id) {
    return {
      success: false,
      message: "Bad request",
    };
  }

  try {
    switch (true) {
      case game === "ag":
        return await router.ag(Number(id));
      case game === "aov":
        return await router.aov(Number(id));
      case game === "cod":
        return await router.cod(Number(id));
      case game === "ff":
        return await router.ff(Number(id));
      case game === "gi":
        return await router.gi(Number(id));
      case game === "hi":
        return await router.hi(Number(id));
      case game === "hsr":
        return await router.hsr(Number(id));
      case game === "la":
        return await router.la(Number(id), server as string);
      case game === "ld":
        return await router.lad(Number(id));
      case game === "mcgg":
        return await router.mcgg(Number(id), Number(server));
      case game === "ml":
        return await router.ml(Number(id), Number(server));
      case game === "pb":
        return await router.pb(id as string);
      case game === "pgr":
        return await router.pgr(Number(id), server as string);
      case game === "sm":
        return await router.sm(id as string);
      case game === "sus":
        return await router.sus(Number(id));
      case game === "valo":
        return await router.valo(parseInt(id));
      case game === "zzz":
        return await router.zzz(Number(id));
      default:
        return {
          success: false,
          message: "Bad request",
        };
    }
  } catch (error) {
    return {
      success: false,
      message: "Not found",
    };
  }
}
