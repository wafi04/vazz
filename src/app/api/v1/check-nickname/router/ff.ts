import { HitRapsPoint, ResultFromCoda } from "../utils";

export default async function ff(id: number): Promise<ResultFromCoda> {
  const data = await HitRapsPoint(id.toString());
  return {
    success: true,
    game: "Garena Free Fire",
    id,
    name: data.data.username,
  };
}
