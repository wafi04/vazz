import axios from "axios";

export function useCheckSaldoDuitku() {}

export async function useCheckTransactionDuitku({
  OrderId,
}: {
  OrderId: string;
}) {
  const req = await axios.get(
    `/api/v1/duitku/check-transaction?ApiKey=72822272sbshsb&OrderId=${OrderId}`
  );
  return req.data;
}
