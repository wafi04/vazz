import { hitCoda, ResultFromCoda } from "../utils";

export default async function ml(
  id: number,
  zone: number
): Promise<ResultFromCoda> {
  const body = `voucherPricePoint.id=4150&voucherPricePoint.price=1579&voucherPricePoint.variablePrice=0&user.userId=${id}&user.zoneId=${zone}&voucherTypeName=MOBILE_LEGENDS&shopLang=id_ID`;
  const data = await hitCoda(body);
  return {
    success: true,
    game: "Mobile Legends: Bang Bang",
    id,
    server: zone,
    region: data.confirmationFields.country,
    name: data.confirmationFields.username,
  };
}
