import { NextRequest, NextResponse } from 'next/server'

const SB = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const OR_KEY = process.env.OPENROUTER_API_KEY!
const h = (extra = {}) => ({ 'apikey': KEY, 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json', ...extra })

// GET — fetch related topics for a given topic_id
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const topicId = searchParams.get('topic_id')
  if (!topicId) return NextResponse.json([])

  // Get connections where this topic is the source
  const connections = await fetch(
    `${SB}/rest/v1/topic_connections?from_topic_id=eq.${topicId}&select=*,topics!topic_connections_to_topic_id_fkey(id,title,slug,subject_tag)`,
    { headers: h() }
  ).then(r => r.json())

  return NextResponse.json(Array.isArray(connections) ? connections : [])
}

// POST — AI generates related topic suggestions then saves them
export async function POST(req: NextRequest) {
  const { topic_id, title, overview, subject_tag } = await req.json()

  // Get all existing topics for context
  const allTopics = await fetch(`${SB}/rest/v1/topics?select=id,title,subject_tag&limit=50`, { headers: h() }).then(r => r.json())
  const topicList = (Array.isArray(allTopics) ? allTopics : [])
    .filter((t: { id: string }) => t.id !== topic_id)
    .map((t: { title: string; subject_tag: string }) => `${t.title} (${t.subject_tag})`)
    .join(', ')

  const prompt = `A 10-year-old is learning about "${title}" (${subject_tag}).
Overview: ${overview || 'No overview available'}

Existing modules in their wiki: ${topicList || 'None yet'}

Suggest 3 topics that naturally connect to "${title}" — either from the existing list OR new topics to explore. For each, explain the connection in one sentence (e.g. "Ancient Egypt → The Nile River: The Nile was the lifeblood of Egyptian civilization").

Return ONLY valid JSON array:
[
  {"title": "topic title", "note": "one sentence explaining the connection", "is_existing": false},
  ...
]
Keep it to 3 suggestions. Be specific and curious — show how ideas connect across subjects.`

  const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${OR_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'google/gemini-2.0-flash-001', messages: [{ role: 'user', content: prompt }], temperature: 0.8, max_tokens: 400 }),
  })
  const aiData = await aiRes.json()
  const content = aiData.choices?.[0]?.message?.content || '[]'
  const cleaned = content.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
  const suggestions = JSON.parse(cleaned)

  return NextResponse.json({ suggestions })
}
