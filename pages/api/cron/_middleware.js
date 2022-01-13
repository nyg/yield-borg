import { NextResponse } from "next/server"


export default function authMiddleware(req) {
  return req.headers.get('authorization') === `Bearer ${process.env.CRON_KEY}`
    ? NextResponse.next()
    : new NextResponse('Authorization required!', { status: 403 })
}
