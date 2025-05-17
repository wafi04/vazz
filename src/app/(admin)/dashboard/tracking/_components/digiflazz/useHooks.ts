import axios from "axios";
export type DataResponseFromCekSaldo = {
  code: number;
  data: {
    deposit: number;
  };
  message: string;
};
export async function useCheckSaldoDIgiflazz() {
  const request = await axios.get<DataResponseFromCekSaldo>(
    "/api/v1/digiflazz/cek-saldo"
  );
  console.log(request.data);
  return request.data;
}
