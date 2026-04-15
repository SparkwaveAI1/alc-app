import { NextRequest, NextResponse } from 'next/server'
import { chatComplete, parseAIJSON } from '@/lib/ai'

const SB = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const h = (extra: Record<string, string> = {}) => ({ 'apikey': KEY, 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json', ...extra })

// GET — fetch persisted connections for a topic
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const topicId = searchParams.get('topic_id')
  if (!topicId) return NextResponse.json([])

  // Get connections where this topic is one side
  const [fromConns, toConns] = await Promise.all([
    fetch(`${SB}/rest/v1/topic_connections?from_topic_id=eq.${topicId}&select=*`, { headers: h() }).then(r => r.json()),
    fetch(`${SB}/rest/v1/topic_connections?to_topic_id=eq.${topicId}&select=*`, { headers: h() }).then(r => r.json()),
  ])

  // Fetch topic details for both sides of each connection
  const enrich = async (conns: any[]) => {
    if (!Array.isArray(conns)) return []
    return Promise.all(conns.map(async c => {
      const otherId = c.from_topic_id === topicId ? c.to_topic_id : c.from_topic_id
      const [topic] = await fetch(
        `${SB}/rest/v1/topics?id=eq.${otherId}&select=id,title,slug,subject_tag&limit=1`,
        { headers: h() }
      ).then(r => r.json())
      return { ...c, topic }
    }))
  }

  return NextResponse.json([...await enrich(fromConns), ...await enrich(toConns)])
}

// POST — AI generates related topic suggestions then persists real connections
export async function POST(req: NextRequest) {
  const { topic_id, title, overview, subject_tag } = await req.json()

  // Get all existing topics for context
  const allTopics = await fetch(
    `${SB}/rest/v1/topics?select=id,title,subject_tag,overview&limit=50`,
    { headers: h() }
  ).then(r => r.json())
  const topicList = (Array.isArray(allTopics) ? allTopics : [])
    .filter((t: { id: string }) => t.id !== topic_id)
    .map((t: { title: string; subject_tag: string }) => `${t.title} (${t.subject_tag})`)
    .join(', ')

  const prompt = `A curious young learner is starting a new module about "${title}" (${subject_tag}).
Overview: ${overview || 'No overview yet'}

Their existing modules in their wiki: ${topicList || 'None yet — this is their very first module!'}

Your job: Find 1-3 topics from the existing list that genuinely connect to the new topic. Think about: shared themes, cause-and-effect links, similar time periods, same geographic region, same scientific domain, same creative field, parallel historical events.

For each existing topic that connects, explain WHY in one specific sentence — what makes the connection real and interesting for a curious child.

Return ONLY valid JSON array (max 3 items, only include existing topics):
[
  {"title": "exact title from the existing list above", "note": "one sentence explaining the connection — make it specific and curious", "is_existing": true},
  ...
]

If nothing in the existing list connects, return: []`

  const { content } = await chatComplete(prompt, { temperature: 0.8, maxTokens: 500 })
  let suggestions: any[] = []
  try {
    suggestions = parseAIJSON(content)
  } catch {
    suggestions = []
  }

  // Persist real connections for each match
  for (const s of suggestions) {
    if (!s.is_existing) continue
    // Find the matching topic by title (case-insensitive)
    const matchRes = await fetch(
      `${SB}/rest/v1/topics?title=ilike.*${encodeURIComponent(s.title)}*&select=id&limit=1`,
      { headers: h() }
    ).then(r => r.json())
    const match = Array.isArray(matchRes) ? matchRes[0] : null
    if (match?.id && match.id !== topic_id) {
      await fetch(`${SB}/rest/v1/topic_connections`, {
        method: 'POST',
        headers: h({ 'Prefer': 'return=minimal,resolution=ignore-duplicates' }),
        body: JSON.stringify({
          topic_id_a: topic_id,
          topic_id_b: match.id,
          connection_note: s.note || null,
        }),
      }).catch(() => {}) // non-critical
    }
  }

  // Return with topic details for each suggestion
  const enriched = await Promise.all(suggestions.map(async (s: any) => {
    if (!s.is_existing) return s
    const matchRes = await fetch(
      `${SB}/rest/v1/topics?title=ilike.*${encodeURIComponent(s.title)}*&select=id,title,slug,subject_tag&limit=1`,
      { headers: h() }
    ).then(r => r.json())
    const topic = Array.isArray(matchRes) ? matchRes[0] : null
    return { ...s, topic }
  }))

  return NextResponse.json({ suggestions: enriched })
}
