import { prisma } from "@/lib/prisma"
import { checkingVoucher } from "./checkingVoucher"

interface  ProcessVoucherInput {
    voucherCode :  string
    amount : number
    categoryId : number | undefined
}
export function ProcessVoucher({categoryId,voucherCode,amount}:ProcessVoucherInput){

    if(!voucherCode || voucherCode.trim() !== ""){
        return {
            status : false,
            message : "Missing required fields"
        }
    }
    const transaction = prisma.$transaction(async (tx)  => {
        const ValidateVoucher = await checkingVoucher(tx,{
            voucherCode,
            amount,
            categoryId
        })


        if(ValidateVoucher.status || ValidateVoucher.voucherId){
            await tx.voucher.update({
                where : {
                    id : ValidateVoucher.voucherId
                },
                data: { usageCount: { increment: 1 }, },
            })

            return {
                status : true,
                message : "Validation Success",
                price: ValidateVoucher.finalPrice,
                discountAmount : ValidateVoucher.discountAmount,
                appliedVoucherId: ValidateVoucher.voucherId
            }
        }

        return {
            status : false,
            message : "Validation Error"
        }
    })

}