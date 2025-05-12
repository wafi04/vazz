import {  allowedMethod, timeNow } from './utils'
import { validateApiKey, sanitizeResponse } from '../utils/auth'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { processRequest } from './helpers'

// Simple in-memory cache
const CACHE = new Map<string, {
  data: any,
  timestamp: number,
  etag: string
}>()

// Cache expiration time in milliseconds (e.g., 5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Allow': allowedMethod.join(', '),
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': allowedMethod.join(', '),
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Api-Key, X-Api-Key',
      'Access-Control-Max-Age': '86400',
    },
  })
}

// Handle GET requests
export async function GET(request: NextRequest) {
  return await handleRequest(request)
}

// Handle POST requests if needed
export async function POST(request: NextRequest) {
  return await handleRequest(request)
}

async function handleRequest(request: NextRequest): Promise<NextResponse> {
  const now = timeNow()
  
  // 1. API Key validation
  if (!validateApiKey(request)) {
    return NextResponse.json(
      { 
        data: { 
          success: false, 
          message: 'Unauthorized access' 
        },
        status: 401
      },
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        }
      }
    )
  }
  
  // 2. Method validation
  if (!allowedMethod.includes(request.method)) {
    return NextResponse.json(
      { 
        data: { 
          success: false, 
          message: 'Method not allowed' 
        },
        status: 405
      },
      {
        status: 405,
        headers: {
          'Allow': allowedMethod.join(', '),
          'Content-Type': 'application/json; charset=utf-8',
        }
      }
    )
  }
  
  // 3. Check honeypot parameter
  const url = new URL(request.url)
  if (url.searchParams.has('email') || url.searchParams.has('name')) {
    // Potential bot triggered honeypot
    return NextResponse.json(
      { success: true }, 
      { status: 200 }
    )
  }
  
  const cacheParams = new URLSearchParams()
  for (const [key, value] of url.searchParams.entries()) {
    if (!['t', 'timestamp', 'nocache'].includes(key)) {
      cacheParams.append(key, value)
    }
  }
  const cacheKey = `${url.pathname}?${cacheParams.toString()}`
  
  // 5. ETag support
  const ifNoneMatch = request.headers.get('if-none-match')
  const cachedItem = CACHE.get(cacheKey)
  
  if (cachedItem && (now - cachedItem.timestamp) < CACHE_EXPIRATION) {
    // Cache hit
    if (ifNoneMatch === cachedItem.etag) {
      // Content not modified
      return new NextResponse(null, {
        status: 304,
        headers: {
          'ETag': cachedItem.etag,
          'Cache-Control': 'public, max-age=30, s-maxage=43200, proxy-revalidate',
        }
      })
    }
    
    return NextResponse.json(cachedItem.data, {
      status: 200,
      headers: {
        'ETag': cachedItem.etag,
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=30, s-maxage=43200, proxy-revalidate',
        'X-Response-Time': (timeNow() - now).toString(),
      }
    })
  }
  
  // 6. Process request (cache miss)
  const result = await processRequest(request)
  const responseData = sanitizeResponse(result.data)
  const code = result.status
  
  const etag = crypto
    .createHash('md5')
    .update(JSON.stringify(responseData))
    .digest('hex')
  
  CACHE.set(cacheKey, {
    data: responseData,
    timestamp: now,
    etag
  })
  
  // 7. Create final response
  const response = NextResponse.json(responseData, {
    status: code,
    headers: {
      'Allow': allowedMethod.join(', '),
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': allowedMethod.join(', '),
      'Content-Type': 'application/json; charset=utf-8',
      'X-Powered-By': '@wafiuddin/vazz',
      'Cache-Control': 'public, max-age=30, s-maxage=43200, proxy-revalidate',
      'ETag': etag,
    }
  })
  
  // 8. Add slight delay to reduce scraping efficiency (optional)
  // Uncomment if you want to add delay to all responses
  // await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300))
  
  response.headers.set('X-Response-Time', (timeNow() - now).toString())
  return response
}