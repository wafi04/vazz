import { getProfile } from "@/app/(auth)/auth/components/server";
import { DIGI_KEY, DIGI_USERNAME } from "@/constants";
import { Digiflazz } from "@/lib/digiflazz";

export async function GET() {
    const user = await getProfile()
    if(!user) {
        return Response.json({
            code: 401,
            message: 'Unauthorized'
        })
    }
    if(user && user.session.role !== 'Admin') {
        return Response.json({
            code: 403,
            message: 'Forbidden'
        })
    }
    const digiflazz = new Digiflazz(DIGI_USERNAME, DIGI_KEY)
    const data = await digiflazz.checkDeposit()
    return Response.json({
        code: 200,
        data: data.data,
        message: 'Success'
    })
}