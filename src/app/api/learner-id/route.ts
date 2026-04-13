import { NextResponse } from 'next/server'
import { getLearnerContext } from '@/lib/profile'

export async function GET() {
  const learner = await getLearnerContext()
  if (!learner) {
    return NextResponse.json({ id: null, error: 'No learner found' }, { status: 404 })
  }
  return NextResponse.json({ id: learner.id, name: learner.name })
}
