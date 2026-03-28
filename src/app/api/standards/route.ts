import { NextRequest, NextResponse } from 'next/server'

const SB = process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const h = (extra = {}) => ({ 'apikey': KEY, 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json', ...extra })

// 4th grade skill spine — seeded on first call
const GRADE4_SKILLS = [
  // Math
  { subject: 'Math', grade: 4, standard_code: '4.NBT.1', skill_name: 'Place Value', description: 'Understand that a digit is 10x the value of the digit to its right' },
  { subject: 'Math', grade: 4, standard_code: '4.NBT.4', skill_name: 'Multi-digit Addition & Subtraction', description: 'Fluently add and subtract multi-digit whole numbers' },
  { subject: 'Math', grade: 4, standard_code: '4.NBT.5', skill_name: 'Multi-digit Multiplication', description: 'Multiply up to 4-digit by 1-digit, 2-digit by 2-digit' },
  { subject: 'Math', grade: 4, standard_code: '4.NBT.6', skill_name: 'Division with Remainders', description: 'Divide up to 4-digit by 1-digit, find quotients and remainders' },
  { subject: 'Math', grade: 4, standard_code: '4.NF.1', skill_name: 'Equivalent Fractions', description: 'Explain and generate equivalent fractions' },
  { subject: 'Math', grade: 4, standard_code: '4.NF.3', skill_name: 'Add & Subtract Fractions', description: 'Add and subtract fractions with like denominators' },
  { subject: 'Math', grade: 4, standard_code: '4.NF.7', skill_name: 'Compare Decimals', description: 'Compare decimals to hundredths using >, =, and <' },
  { subject: 'Math', grade: 4, standard_code: '4.MD.3', skill_name: 'Area & Perimeter', description: 'Apply area and perimeter formulas for rectangles' },
  { subject: 'Math', grade: 4, standard_code: '4.G.1', skill_name: 'Points, Lines & Angles', description: 'Draw and identify points, lines, line segments, rays, and angles' },
  // ELA
  { subject: 'Reading', grade: 4, standard_code: '4.RL.1', skill_name: 'Text Evidence', description: 'Refer to details and examples when explaining what a text says' },
  { subject: 'Reading', grade: 4, standard_code: '4.RL.3', skill_name: 'Characters & Events', description: 'Describe a character, setting, or event using specific details' },
  { subject: 'Reading', grade: 4, standard_code: '4.RI.5', skill_name: 'Text Structure', description: 'Describe the overall structure of events, ideas, or information' },
  { subject: 'Reading', grade: 4, standard_code: '4.RI.9', skill_name: 'Integrate Multiple Sources', description: 'Integrate information from two texts on the same topic' },
  { subject: 'Writing', grade: 4, standard_code: '4.W.1', skill_name: 'Opinion Writing', description: 'Write opinion pieces supporting a point of view with reasons and information' },
  { subject: 'Writing', grade: 4, standard_code: '4.W.2', skill_name: 'Informative Writing', description: 'Write informative/explanatory texts to examine a topic clearly' },
  { subject: 'Writing', grade: 4, standard_code: '4.W.3', skill_name: 'Narrative Writing', description: 'Write narratives using descriptive details and a clear sequence' },
  { subject: 'Writing', grade: 4, standard_code: '4.L.1', skill_name: 'Grammar & Usage', description: 'Use correct grammar, capitalization, punctuation, and spelling' },
  // Science
  { subject: 'Science', grade: 4, standard_code: '4-ESS1', skill_name: 'Earth\'s History', description: 'Understand patterns of Earth\'s features and how they change over time' },
  { subject: 'Science', grade: 4, standard_code: '4-ESS2', skill_name: 'Earth\'s Systems', description: 'Describe how water and wind shape Earth\'s surface' },
  { subject: 'Science', grade: 4, standard_code: '4-PS3', skill_name: 'Energy', description: 'Understand energy transfer — motion, sound, light, and heat' },
  { subject: 'Science', grade: 4, standard_code: '4-LS1', skill_name: 'Life Science', description: 'Describe how animals and plants use internal and external structures to survive' },
  // Social Studies
  { subject: 'Social Studies', grade: 4, standard_code: '4.SS.1', skill_name: 'U.S. Regions & Geography', description: 'Understand major geographic regions and features of the United States' },
  { subject: 'Social Studies', grade: 4, standard_code: '4.SS.2', skill_name: 'State & Local Government', description: 'Understand roles of state and local governments and civic participation' },
  { subject: 'Social Studies', grade: 4, standard_code: '4.SS.3', skill_name: 'Economics Basics', description: 'Understand goods, services, producers, consumers, and trade' },
  { subject: 'Social Studies', grade: 4, standard_code: '4.SS.4', skill_name: 'Historical Thinking', description: 'Understand chronology, cause/effect, and primary vs secondary sources' },
]

export async function GET() {
  const existing = await fetch(`${SB}/rest/v1/skill_tracking?grade=eq.4&order=subject,standard_code`, { headers: h() }).then(r => r.json())

  // Seed if empty
  if (Array.isArray(existing) && existing.length === 0) {
    const res = await fetch(`${SB}/rest/v1/skill_tracking`, {
      method: 'POST',
      headers: h({ 'Prefer': 'return=representation' }),
      body: JSON.stringify(GRADE4_SKILLS),
    })
    return NextResponse.json(await res.json())
  }

  return NextResponse.json(Array.isArray(existing) ? existing : [])
}

export async function PATCH(req: NextRequest) {
  const { id, status, evidence } = await req.json()
  const body: Record<string, unknown> = { status, updated_at: new Date().toISOString() }
  if (status !== 'not_started') body.last_practiced = new Date().toISOString()
  if (evidence) body.evidence = evidence

  const res = await fetch(`${SB}/rest/v1/skill_tracking?id=eq.${id}`, {
    method: 'PATCH',
    headers: h({ 'Prefer': 'return=representation' }),
    body: JSON.stringify(body),
  })
  const [skill] = await res.json()
  return NextResponse.json({ skill })
}
