import { NextRequest, NextResponse } from 'next/server'

const SB_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function supaFetch(path: string, method: string = 'GET', body?: any) {
  const res = await fetch(`${SB_URL}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: KEY, Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      ...(method === 'POST' && { 'Prefer': 'return=representation' })
    },
    body: body ? JSON.stringify(body) : undefined
  })
  return res.json()
}

export async function GET(req: NextRequest) {
  const topicId = req.nextUrl.searchParams.get('topic_id')
  if (!topicId) return NextResponse.json([])
  try {
    const links = await supaFetch(`resource_topic_links?topic_id=eq.${topicId}`)
    if (!Array.isArray(links) || links.length === 0) return NextResponse.json([])
    const resourceIds = links.map(l => l.resource_id)
    const resources = await supaFetch(`resources?id=in.(${resourceIds.join(',')})`)
    return NextResponse.json(Array.isArray(resources) ? resources : [])
  } catch (e) {
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, url, topic_id } = await req.json()
    if (!title || !topic_id) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const resource = await supaFetch('resources', 'POST', { title, url, resource_type: 'link' })
    if (!resource[0]) throw new Error('Failed to create resource')

    await supaFetch('resource_topic_links', 'POST', {
      resource_id: resource[0].id,
      topic_id
    })

    return NextResponse.json({ resource: resource[0] })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
