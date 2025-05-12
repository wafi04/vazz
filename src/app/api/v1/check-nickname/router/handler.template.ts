import { hitCoda, ResultFromCoda } from '../utils'

export default async function gameName(id: string): Promise<ResultFromCoda> {
  const body = `` 
  const data = await hitCoda(body)
  return {
    success: true,
    game: '',
    id,
    name: data.confirmationFields.username
  }
}
