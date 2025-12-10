'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, BookOpen, FileText, ChevronLeft, ChevronRight } from 'lucide-react'
import { FormattedAnswer } from '@/components/formatted-answer'

interface ExamQuestion {
  id: string
  order: number
  title: string
  shortAnswer: string
  longAnswer: string | null
}

export default function ExamQuestionDetailPage() {
  const params = useParams()
  const id = params.id as string
  const questionNumber = parseInt(id)

  const [question, setQuestion] = useState<ExamQuestion | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'short' | 'long'>('short')

  useEffect(() => {
    async function fetchQuestion() {
      try {
        const res = await fetch(`/api/exam-questions/${id}`)
        if (res.ok) {
          const data = await res.json()
          setQuestion(data)
        }
      } catch (error) {
        console.error('Error fetching question:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestion()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Načítám...</div>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Otázka nenalezena
          </h1>
          <Link
            href="/exam-questions"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            ← Zpět na seznam
          </Link>
        </div>
      </div>
    )
  }

  const hasLongAnswer = !!question.longAnswer

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/exam-questions"
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Všechny otázky
            </Link>

            <div className="flex items-center gap-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-lg font-semibold text-sm">
              <span>Otázka {question.order}</span>
              <span className="text-indigo-400 dark:text-indigo-600">/</span>
              <span>40</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Question title */}
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-2xl shadow-lg">
              {question.order}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight flex-1">
              {question.title}
            </h1>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="mb-6 flex items-center gap-2 p-1 bg-slate-200 dark:bg-slate-800 rounded-xl w-fit">
          <button
            onClick={() => setViewMode('short')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              viewMode === 'short'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            Krátká odpověď
          </button>
          <button
            onClick={() => setViewMode('long')}
            disabled={!hasLongAnswer}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              viewMode === 'long' && hasLongAnswer
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md'
                : hasLongAnswer
                ? 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                : 'text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Dlouhá odpověď
            {!hasLongAnswer && (
              <span className="text-xs">(brzy)</span>
            )}
          </button>
        </div>

        {/* Answer content */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-8 shadow-xl">
          <FormattedAnswer
            text={viewMode === 'short'
              ? question.shortAnswer
              : question.longAnswer || 'Dlouhá odpověď zatím není k dispozici.'}
            questionTitle={question.title}
          />
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          {questionNumber > 1 ? (
            <Link
              href={`/exam-questions/${questionNumber - 1}`}
              className="group inline-flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl hover:shadow-lg transition-all border-2 border-slate-200 dark:border-slate-700 font-semibold"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Předchozí
            </Link>
          ) : (
            <div />
          )}

          {questionNumber < 40 ? (
            <Link
              href={`/exam-questions/${questionNumber + 1}`}
              className="group inline-flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
            >
              Další
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </main>
    </div>
  )
}
