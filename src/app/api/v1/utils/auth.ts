import { NextRequest } from 'next/server'

const API_KEYS = new Set([
  'NAAKAAAVAHvafdCGFCWT7828728272',
])

export function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('Api-Key') || request.headers.get('X-Api-Key')
  
  if (!apiKey) {
    const url = new URL(request.url)
    const queryApiKey = url.searchParams.get('apiKey')
    if (queryApiKey && API_KEYS.has(queryApiKey)) {
      return true
    }
    return false
  }
  
  return API_KEYS.has(apiKey)
}

export function sanitizeResponse(data: any): any {
  if (!data) return data
  
  const cloned = JSON.parse(JSON.stringify(data))
  
  if (cloned.apiKey) delete cloned.apiKey
  if (cloned.API_KEY) delete cloned.API_KEY
  if (cloned.api_key) delete cloned.api_key
  if (cloned.token) delete cloned.token
  
  return cloned
}