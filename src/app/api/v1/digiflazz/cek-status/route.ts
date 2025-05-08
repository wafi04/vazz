import { CLIENT_DIGI_KEY, CLIENT_DIGI_USERNAME } from "@/constants";
import { Digiflazz } from "@/lib/digiflazz";

export async function GET() {
  try {
    const digiflazz = new Digiflazz(CLIENT_DIGI_USERNAME, CLIENT_DIGI_KEY);
    
    const data = await digiflazz.CheckStatus(
      "CHECKIDS", // ini pastikan buyer_sku_code valid
      "df0zoaqm0iovi344",
      "1396007302706"
    );

    console.log("Data sukses:", data.data);

    return Response.json({
      code: 200,
      data: data.data,
      message: 'Success'
    });

  } catch (error) {
    console.error("Error caught in GET:", error);

    return Response.json({
      code: 500,
      data: null,
      message: 'Something went wrong',
      error: (error instanceof Error) ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
