import { NextResponse } from 'next/server'

export async function GET() {
  const sbUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'MISSING'
  const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING'
  const orKey = process.env.OPENROUTER_API_KEY ? 'SET' : 'MISSING'

  // Test Supabase connection
  let sbStatus = 'untested'
  try {
    const res = await fetch(`${sbUrl}/rest/v1/topics?select=id&limit=1`, {
      headers: { 'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!, 'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}` }
    })
    sbStatus = `HTTP ${res.status}`
  } catch (e: unknown) { sbStatus = `error: ${e instanceof Error ? e.message : String(e)}` }

  return NextResponse.json({ sbUrl: sbUrl.slice(0,40), sbKey, orKey, sbStatus })
}
