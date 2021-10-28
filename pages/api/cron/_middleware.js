import { NextResponse } from "next/server"

export default (req, event) =>
  req.headers.get('authorization') === `Bearer ${process.env.CRON_KEY}`
    ? NextResponse.next()
    : new NextResponse('Authorization required!', { status: 403 })
