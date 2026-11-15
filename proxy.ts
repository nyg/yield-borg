import { type NextRequest, NextResponse } from 'next/server'

export default function proxy(request: NextRequest) {
   const cronKey = process.env.CRON_KEY
   console.log('proxy: CRON_KEY is', cronKey ? 'set' : 'NOT set')

   const isAuthorized = Boolean(cronKey)
      && request.headers.get('authorization') === `Bearer ${cronKey}`

   return isAuthorized
      ? NextResponse.next()
      : NextResponse.redirect(new URL('/api/unauthenticated', request.url))
}

export const config = {
   matcher: '/api/cron/:path*',
}
