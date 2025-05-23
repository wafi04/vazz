import { NicknameResult } from "@/app/(main)/order/[name]/_components/placeholder";
import { API_KEY } from "@/constants";
import { CheckNickNameReq, validateCheckNickNameReq } from "@/data/check-code";
import axios from "axios";

export async function CheckNickName(
  request: CheckNickNameReq
): Promise<NicknameResult> {
  if (!validateCheckNickNameReq(request)) {
    throw new Error("Invalid request data");
  }

  let url = `/api/v1/check-nickname/default?id=${request.userId}`;

  // Kasus khusus untuk Mobile Legends
  if (request.type === "mobile-legend") {
    url = `/api/v1/check-nickname?game=ml&id=${parseInt(request.userId)}&zone=${
      request.serverId
    }`;
  } else if (request.type === "genshin-impact") {
    url = `/api/v1/check-nickname?game=gi&id=${request.userId}`;
  } else if (request.type === "honkai-star-rail") {
    url = `/api/v1/check-nickname?game=hsr&id=${parseInt(request.userId)}`;
  } else if (request.type === "free-fire") {
    url = `/api/v1/check-nickname?game=ff&id=${parseInt(request.userId)}`;
  } else if (request.type === "valorant") {
    url = `/api/v1/check-nickname?game=valo&id=${encodeURIComponent(
      parseInt(request.userId)
    )}`;
  } else if (request.type === "arena-of-valor") {
    url = `/api/v1/check-nickname?game=aov&id=${encodeURIComponent(
      parseInt(request.userId)
    )}`;
  } else if (request.type === "call-of-duty-mobile") {
    url = `/api/v1/check-nickname?game=cod&id=${encodeURIComponent(
      parseInt(request.userId)
    )}`;
  } else if (request.type === "aether-gazer") {
    url = `/api/v1/check-nickname?game=ag&id=${encodeURIComponent(
      parseInt(request.userId)
    )}`;
  } else if (request.type === "punishing-gray-raven") {
    url = `/api/v1/check-nickname?game=ag&id=${encodeURIComponent(
      parseInt(request.userId)
    )}`;
  } else if (request.type === "point-blank") {
    url = `/api/v1/check-nickname?game=pb&id=${encodeURIComponent(
      parseInt(request.userId)
    )}`;
  }

  try {
    const response = await axios.get(`${url}&decode=true&apiKey=${API_KEY}`, {
      method: "GET",
    });
    const data = await response.data;
    return {
      success: data.success || false,
      game: request.type,
      id: parseInt(request.userId),
      server: data.server || null,
      name: data.name || null,
      region: data.region || null,
      message: data.message || null,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error checking nickname: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
