'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Nav from '@/components/Nav'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

type Question = {
  type: 'multiple_choice' | 'true_false' | 'fill_in'
  question: string
  options?: string[]
  correct: string
  explanation: string
}

type Answer = {
  value: string
  submitted: boolean
  correct: boolean
}

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [topic, setTopic] = useState<any>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<number, Answer>>({})
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [savingCard, setSavingCard] = useState<number | null>(null)
  const [savedCards, setSavedCards] = useState<Set<number>>(new Set())
  const [currentQ, setCurrentQ] = useState(0)
  const [quizDone, setQuizDone] = useState(false)

  useEffect(() => {
    async function load() {
      const res = await fetch(
        `${SB_URL}/rest/v1/topics?slug=eq.${slug}&limit=1`,
        { headers: { apikey: SB_ANON!, Authorization: `Bearer ${SB_ANON}` } }
      ).then(r => r.json())
      if (Array.isArray(res) && res[0]) {
        setTopic(res[0])
        await generateQuiz(res[0])
      }
      setLoading(false)
    }
    load()
  }, [slug])

  const generateQuiz = async (t: any) => {
    setGenerating(true)
    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic_title: t.title,
          overview: t.overview,
          subtopics: t.subtopics,
          key_vocabulary: t.key_vocabulary,
          subject_tag: t.subject_tag,
        }),
      })
      const data = await res.json()
      if (data.questions?.length) {
        setQuestions(data.questions)
        setAnswers({})
        setCurrentQ(0)
        setQuizDone(false)
        setSavedCards(new Set())
      }
    } catch (e) {
      console.error(e)
    }
    setGenerating(false)
  }

  const handleAnswer = (qIndex: number, value: string) => {
    if (answers[qIndex]?.submitted) return
    setAnswers(prev => ({ ...prev, [qIndex]: { value, submitted: false, correct: false } }))
  }

  const handleSubmit = (qIndex: number) => {
    const question = questions[qIndex]
    const answer = answers[qIndex]
    if (!answer || answer.submitted) return

    const correct = answer.value.trim().toLowerCase() === question.correct.trim().toLowerCase()
    setAnswers(prev => ({ ...prev, [qIndex]: { ...prev[qIndex], submitted: true, correct } }))
  }

  const handleSaveFlashcard = async (qIndex: number) => {
    if (!topic || savedCards.has(qIndex)) return
    setSavingCard(qIndex)
    const question = questions[qIndex]
    try {
      await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic_id: topic.id,
          front: question.question.replace('___', '______'),
          back: question.correct,
        }),
      })
      setSavedCards(prev => new Set([...prev, qIndex]))
    } catch (e) {
      console.error(e)
    }
    setSavingCard(null)
  }

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1)
    } else {
      setQuizDone(true)
    }
  }

  const score = Object.values(answers).filter(a => a.submitted && a.correct).length
  const submitted = Object.values(answers).filter(a => a.submitted).length

  if (loading || generating) return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🧠</div>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, color: '#7C5CBF', fontSize: 18 }}>
          {loading ? 'Loading...' : 'Generating your quiz...'}
        </div>
        <p style={{ color: '#6B6560', fontSize: 14, marginTop: 8 }}>Making questions just for you</p>
      </div>
    </div>
  )

  if (!topic || questions.length === 0) return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>😕</div>
        <div style={{ fontWeight: 700, color: '#2D2A26', marginBottom: 8 }}>Couldn't generate quiz</div>
        <button onClick={() => router.back()} style={{ background: '#7C5CBF', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 20px', fontWeight: 700, cursor: 'pointer' }}>
          Go back
        </button>
      </div>
    </div>
  )

  // Quiz complete screen
  if (quizDone) return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7', fontFamily: "'DM Sans', sans-serif", paddingBottom: 90 }}>
      <div style={{ background: 'linear-gradient(135deg, #4CAF7C, #68D391)', padding: '48px 20px 28px', borderRadius: '0 0 28px 28px' }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#fff', fontFamily: "'Nunito', sans-serif" }}>
          Quiz complete! 🎉
        </h1>
      </div>
      <div style={{ padding: '32px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>
          {score === questions.length ? '🏆' : score >= questions.length / 2 ? '⭐' : '💪'}
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#2D2A26', fontFamily: "'Nunito', sans-serif", marginBottom: 8 }}>
          {score} / {questions.length}
        </div>
        <p style={{ fontSize: 16, color: '#6B6560', marginBottom: 32 }}>
          {score === questions.length
            ? 'Perfect score! You really know this topic.'
            : score >= questions.length / 2
            ? 'Nice work! Keep exploring to strengthen what you know.'
            : 'Good effort! Review the module and try again.'}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={() => generateQuiz(topic)}
            style={{ background: '#7C5CBF', color: '#fff', border: 'none', borderRadius: 14, padding: '14px', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
          >
            Try again with new questions ✨
          </button>
          <button
            onClick={() => router.push(`/topic/${slug}`)}
            style={{ background: '#F3F4F6', color: '#6B7280', border: 'none', borderRadius: 14, padding: '14px', fontWeight: 600, fontSize: 15, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
          >
            Back to module
          </button>
        </div>
      </div>
      <Nav active="explore" />
    </div>
  )

  const question = questions[currentQ]
  const currentAnswer = answers[currentQ]
  const isSubmitted = currentAnswer?.submitted
  const isCorrect = currentAnswer?.correct
  const progressWidth = ((currentQ + 1) / questions.length) * 100

  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7', fontFamily: "'DM Sans', sans-serif", paddingBottom: 90 }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #7C5CBF, #9C7DD4)', padding: '48px 20px 24px', borderRadius: '0 0 28px 28px' }}>
        <button
          onClick={() => router.push(`/topic/${slug}`)}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.85)', fontSize: 13, cursor: 'pointer', padding: 0, marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}
        >
          ← Back to module
        </button>
        <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: '#fff', fontFamily: "'Nunito', sans-serif" }}>
          Quiz: {topic.title}
        </h1>
        <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>
          Question {currentQ + 1} of {questions.length}
        </p>

        {/* Progress bar */}
        <div style={{ marginTop: 12, background: 'rgba(255,255,255,0.2)', borderRadius: 4, height: 4 }}>
          <div style={{ background: '#fff', borderRadius: 4, height: 4, width: `${progressWidth}%`, transition: 'width 0.3s' }} />
        </div>
      </div>

      <div style={{ padding: '24px 16px', maxWidth: 500, margin: '0 auto' }}>

        {/* Question */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '20px', marginBottom: 16, boxShadow: '0 2px 12px rgba(45,42,38,0.06)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#7C5CBF', letterSpacing: '0.8px', marginBottom: 12 }}>
            {question.type === 'multiple_choice' ? 'MULTIPLE CHOICE' : question.type === 'true_false' ? 'TRUE OR FALSE' : 'FILL IN THE BLANK'}
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#2D2A26', lineHeight: 1.5 }}>
            {question.question}
          </div>
        </div>

        {/* Multiple choice options */}
        {question.type === 'multiple_choice' && question.options && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {question.options.map((option, i) => {
              const optionLetter = option.split('.')[0].trim()
              const isSelected = currentAnswer?.value === optionLetter
              const isCorrectOption = question.correct === optionLetter

              let bg = '#fff'
              let border = '1.5px solid #E8E2D9'
              let textColor = '#2D2A26'

              if (isSubmitted) {
                if (isCorrectOption) { bg = '#E8F5EF'; border = '1.5px solid #4CAF7C'; textColor = '#2D7A4F' }
                else if (isSelected && !isCorrectOption) { bg = '#FCEAEA'; border = '1.5px solid #E05555'; textColor = '#B91C1C' }
              } else if (isSelected) {
                bg = '#EDE8F9'; border = '1.5px solid #7C5CBF'
              }

              return (
                <div
                  key={i}
                  onClick={() => !isSubmitted && handleAnswer(currentQ, optionLetter)}
                  style={{ background: bg, border, borderRadius: 14, padding: '14px 16px', cursor: isSubmitted ? 'default' : 'pointer', color: textColor, fontSize: 14, fontWeight: isSelected ? 600 : 400, transition: 'all 0.15s' }}
                >
                  {option}
                </div>
              )
            })}
          </div>
        )}

        {/* True/false */}
        {question.type === 'true_false' && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            {['true', 'false'].map(val => {
              const isSelected = currentAnswer?.value === val
              const isCorrectOption = question.correct.toLowerCase() === val

              let bg = '#fff'
              let border = '1.5px solid #E8E2D9'
              let textColor = '#2D2A26'

              if (isSubmitted) {
                if (isCorrectOption) { bg = '#E8F5EF'; border = '1.5px solid #4CAF7C'; textColor = '#2D7A4F' }
                else if (isSelected && !isCorrectOption) { bg = '#FCEAEA'; border = '1.5px solid #E05555'; textColor = '#B91C1C' }
              } else if (isSelected) {
                bg = '#EDE8F9'; border = '1.5px solid #7C5CBF'
              }

              return (
                <div
                  key={val}
                  onClick={() => !isSubmitted && handleAnswer(currentQ, val)}
                  style={{ flex: 1, background: bg, border, borderRadius: 14, padding: '16px', cursor: isSubmitted ? 'default' : 'pointer', textAlign: 'center', fontWeight: 700, fontSize: 16, color: textColor, transition: 'all 0.15s' }}
                >
                  {val === 'true' ? '✓ True' : '✗ False'}
                </div>
              )
            })}
          </div>
        )}

        {/* Fill in the blank */}
        {question.type === 'fill_in' && (
          <div style={{ marginBottom: 16 }}>
            <input
              value={currentAnswer?.value || ''}
              onChange={e => !isSubmitted && handleAnswer(currentQ, e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !isSubmitted && currentAnswer?.value && handleSubmit(currentQ)}
              placeholder="Type your answer..."
              disabled={isSubmitted}
              style={{
                width: '100%', borderRadius: 14,
                border: isSubmitted
                  ? `1.5px solid ${isCorrect ? '#4CAF7C' : '#E05555'}`
                  : '1.5px solid #E8E2D9',
                padding: '14px 16px', fontSize: 15,
                background: isSubmitted
                  ? (isCorrect ? '#E8F5EF' : '#FCEAEA')
                  : '#FFF7ED',
                color: '#2D2A26', outline: 'none',
                fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box',
              }}
            />
          </div>
        )}

        {/* Submit button */}
        {!isSubmitted && (
          <button
            onClick={() => handleSubmit(currentQ)}
            disabled={!currentAnswer?.value}
            style={{
              width: '100%', background: currentAnswer?.value ? '#7C5CBF' : '#E5E7EB',
              color: currentAnswer?.value ? '#fff' : '#9E9792', border: 'none',
              borderRadius: 14, padding: '14px', fontWeight: 700, fontSize: 15,
              cursor: currentAnswer?.value ? 'pointer' : 'default',
              fontFamily: "'DM Sans', sans-serif", marginBottom: 12,
            }}
          >
            Check answer
          </button>
        )}

        {/* Result + explanation */}
        {isSubmitted && (
          <div style={{
            background: isCorrect ? '#E8F5EF' : '#FCEAEA',
            borderRadius: 16, padding: '16px', marginBottom: 12,
          }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: isCorrect ? '#2D7A4F' : '#B91C1C', marginBottom: 6 }}>
              {isCorrect ? '✓ Correct!' : `✗ Not quite — the answer is "${question.correct}"`}
            </div>
            <div style={{ fontSize: 13, color: isCorrect ? '#2D7A4F' : '#B91C1C', lineHeight: 1.5 }}>
              {question.explanation}
            </div>

            {/* Save as flashcard if wrong */}
            {!isCorrect && (
              <button
                onClick={() => handleSaveFlashcard(currentQ)}
                disabled={savingCard === currentQ || savedCards.has(currentQ)}
                style={{
                  marginTop: 10, background: savedCards.has(currentQ) ? '#E5E7EB' : '#fff',
                  color: savedCards.has(currentQ) ? '#9E9792' : '#E05555',
                  border: `1.5px solid ${savedCards.has(currentQ) ? '#E5E7EB' : '#E05555'}`,
                  borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 700,
                  cursor: savedCards.has(currentQ) ? 'default' : 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {savedCards.has(currentQ) ? '✓ Saved as flashcard' : '+ Save as flashcard'}
              </button>
            )}
          </div>
        )}

        {/* Next button */}
        {isSubmitted && (
          <button
            onClick={handleNext}
            style={{
              width: '100%', background: '#7C5CBF', color: '#fff', border: 'none',
              borderRadius: 14, padding: '14px', fontWeight: 700, fontSize: 15,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {currentQ < questions.length - 1 ? 'Next question →' : 'See results 🎉'}
          </button>
        )}
      </div>

      <Nav active="explore" />
    </div>
  )
}
