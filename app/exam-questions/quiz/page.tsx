'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Home, ChevronLeft, ChevronRight, Clock, CheckCircle, Circle } from 'lucide-react'
import { FormattedAnswer } from '@/components/formatted-answer'
import { ProgressTracker } from '@/lib/progress-tracker'

interface ExamQuestion {
  id: string
  order: number
  title: string
  shortAnswer: string
  longAnswer: string | null
}

export default function QuizPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const mode = searchParams?.get('mode') || 'practice'
  const shuffle = searchParams?.get('shuffle') === 'true'
  const limit = searchParams?.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
  const startQuestion = searchParams?.get('start') ? parseInt(searchParams.get('start')!) : 1

  const [questions, setQuestions] = useState<ExamQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showLongAnswer, setShowLongAnswer] = useState(false)
  const [timeLeft, setTimeLeft] = useState(mode === 'test' ? 25 * 60 : null) // 25 minutes for test mode
  const [completedQuestions, setCompletedQuestions] = useState<Set<number>>(new Set())

  // Load questions on mount
  useEffect(() => {
    async function loadQuestions() {
      try {
        const params = new URLSearchParams()
        if (shuffle) params.append('shuffle', 'true')
        if (limit) params.append('limit', limit.toString())

        const response = await fetch(`/api/exam-questions?${params}`)
        const data = await response.json()

        setQuestions(data)

        // Find starting index
        if (!shuffle && startQuestion > 1) {
          const startIdx = data.findIndex((q: ExamQuestion) => q.order === startQuestion)
          if (startIdx !== -1) {
            setCurrentIndex(startIdx)
          }
        }

        // Load completed questions from progress tracker
        if (mode === 'practice') {
          const completed = ProgressTracker.getCompletedQuestions()
          setCompletedQuestions(new Set(completed))
        }
      } catch (error) {
        console.error('Failed to load questions:', error)
      } finally {
        setLoading(false)
      }
    }

    loadQuestions()
  }, [shuffle, limit, startQuestion, mode])

  // Timer for test mode
  useEffect(() => {
    if (mode !== 'test' || timeLeft === null) return

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 0) {
          clearInterval(interval)
          // Time's up - show results
          alert('Čas vypršel! Test se ukončil.')
          router.push('/exam-questions')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [mode, timeLeft, router])

  const currentQuestion = questions[currentIndex]

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowLongAnswer(false)

      // Update progress
      if (mode === 'practice' && currentQuestion) {
        ProgressTracker.updateLastPosition(questions[currentIndex + 1].order)
      }
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setShowLongAnswer(false)

      // Update progress
      if (mode === 'practice' && currentQuestion) {
        ProgressTracker.updateLastPosition(questions[currentIndex - 1].order)
      }
    }
  }

  const handleMarkAsCompleted = () => {
    if (!currentQuestion || mode !== 'practice') return

    const newCompleted = new Set(completedQuestions)
    newCompleted.add(currentQuestion.order)
    setCompletedQuestions(newCompleted)

    // Save to LocalStorage
    ProgressTracker.markQuestionAnswered(currentQuestion.order, true)
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Načítání otázek...</p>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400">Žádné otázky k zobrazení</p>
          <Link href="/exam-questions" className="mt-4 text-indigo-600 dark:text-indigo-400 hover:underline">
            Zpět na seznam
          </Link>
        </div>
      </div>
    )
  }

  const isCompleted = mode === 'practice' && completedQuestions.has(currentQuestion.order)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={mode === 'test' ? '/exam-questions/test' : '/exam-questions/practice'}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Home className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </Link>
              <div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {mode === 'test' ? 'Zkouškový test' : 'Procvičování'}
                </div>
                <div className="font-bold text-slate-900 dark:text-white">
                  Otázka {currentIndex + 1} / {questions.length}
                </div>
              </div>
            </div>

            {mode === 'test' && timeLeft !== null && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timeLeft < 300
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                <Clock className="w-4 h-4" />
                <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
              </div>
            )}

            {mode === 'practice' && (
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Dokončeno: {completedQuestions.size} / {40}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Question card */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-6 sm:p-8 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xl shadow-lg">
              {currentQuestion.order}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {currentQuestion.title}
              </h2>
              {mode === 'practice' && (
                <div className="flex items-center gap-2 text-sm">
                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      Dokončeno
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                      <Circle className="w-4 h-4" />
                      Nedokončeno
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Answer toggle */}
          <div className="mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setShowLongAnswer(false)}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  !showLongAnswer
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                Krátká odpověď
              </button>
              <button
                onClick={() => setShowLongAnswer(true)}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  showLongAnswer
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
                disabled={!currentQuestion.longAnswer}
              >
                Dlouhá odpověď {!currentQuestion.longAnswer && '(Nedostupná)'}
              </button>
            </div>
          </div>

          {/* Answer content */}
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <FormattedAnswer
              text={showLongAnswer && currentQuestion.longAnswer
                ? currentQuestion.longAnswer
                : currentQuestion.shortAnswer
              }
            />
          </div>

          {/* Mark as completed button (practice mode only) */}
          {mode === 'practice' && !isCompleted && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={handleMarkAsCompleted}
                className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Označit jako dokončenou
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Předchozí
          </button>

          <div className="text-center text-sm text-slate-600 dark:text-slate-400">
            {currentIndex + 1} / {questions.length}
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Další
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  )
}
