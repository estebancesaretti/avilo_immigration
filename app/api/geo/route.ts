import { NextResponse } from 'next/server'

// Visitor's country (ISO alpha-2) from Vercel's edge header; null locally.
// Called from the client so the Hero itself stays static.
export async function GET(request: Request) {
  const header = request.headers.get('x-vercel-ip-country')
  const country = header && /^[A-Z]{2}$/.test(header) ? header : null
  return NextResponse.json({ country }, { headers: { 'Cache-Control': 'private, no-store' } })
}
