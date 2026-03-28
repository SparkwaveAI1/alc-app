import { NextRequest, NextResponse } from 'next/server'

const SB = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const h = (extra: Record<string, string> = {}) => ({
  'apikey': KEY, 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json', ...extra
})

function detectType(url: string): string {
  if (/youtube\.com|youtu\.be/.test(url)) return 'youtube'
  if (/vimeo\.com/.test(url)) return 'video'
  return 'link'
}

export async function GET(req: NextRequest) {
  const topicId = req.nextUrl.searchParams.get('topic_id')
  if (!topicId) return NextResponse.json([])

  try {
    // Get links for this topic
    const links = await fetch(`${SB}/rest/v1/resource_topic_links?topic_id=eq.${topicId}`, {
      headers: h()
    }).then(r => r.json())

    if (!Array.isArray(links) || links.length === 0) return NextResponse.json([])

    const ids = links.map((l: { resource_id: string }) => l.resource_id)
    const resources = await fetch(`${SB}/rest/v1/resources?id=in.(${ids.join(',')})`, {
      headers: h()
    }).then(r => r.json())

    return NextResponse.json(Array.isArray(resources) ? resources : [])
  } catch (e) {
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  try {
    const { topic_id, url, title, type } = await req.json()
    if (!url || !topic_id) return NextResponse.json({ error: 'url and topic_id required' }, { status: 400 })

    const resourceType = type || detectType(url)

    // Create resource
    const [resource] = await fetch(`${SB}/rest/v1/resources`, {
      method: 'POST',
      headers: h({ 'Prefer': 'return=representation' }),
      body: JSON.stringify({ title: title || url, url, resource_type: resourceType }),
    }).then(r => r.json())

    if (!resource?.id) return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 })

    // Link to topic
    await fetch(`${SB}/rest/v1/resource_topic_links`, {
      method: 'POST',
      headers: h({ 'Prefer': 'return=representation' }),
      body: JSON.stringify({ resource_id: resource.id, topic_id }),
    })

    return NextResponse.json({ resource })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
