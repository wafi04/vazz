import { hitCoda, ResultFromCoda } from '../utils'

export default async function ff(id: number): Promise<ResultFromCoda> {
  const body = `voucherPricePoint.id=8050&voucherPricePoint.price=1000&voucherPricePoint.variablePrice=0&user.userId=${id}&voucherTypeName=FREEFIRE&shopLang=id_ID`
  const data = await hitCoda(body)
  return {
    success: true,
    game: 'Garena Free Fire',
    id,
    name: data.confirmationFields.roles[0].role
  }
}