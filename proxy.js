import { NextResponse } from "next/server"


export default function proxy(request) {
  return request.headers.get('authorization') === `Bearer ${process.env.CRON_KEY}`
    ? NextResponse.next()
    : NextResponse.redirect(new URL('/api/unauthenticated', request.url))
}

export const config = {
  matcher: '/api/cron/:path*'
}
