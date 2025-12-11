'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Home, Shuffle, List, Play, RotateCcw, CheckCircle } from 'lucide-react'
import { ProgressTracker } from '@/lib/progress-tracker'

export default function PracticeModePage() {
  const router = useRouter()
  const [shuffleEnabled, setShuffleEnabled] = useState(false)
  const [stats, setStats] = useState({
    totalQuestions: 40,
    completedQuestions: 0,
    percentage: 0,
    lastPosition: 0,
  })

  useEffect(() => {
    // Load stats on mount
    const currentStats = ProgressTracker.getStats()
    setStats(currentStats)

    // Load shuffle setting
    const progress = ProgressTracker.getProgress()
    if (progress) {
      setShuffleEnabled(progress.shuffleEnabled)
    }
  }, [])

  const handleShuffleToggle = () => {
    const newValue = !shuffleEnabled
    setShuffleEnabled(newValue)
    ProgressTracker.setShuffleEnabled(newValue)
  }

  const handleStart = () => {
    // Save shuffle setting and redirect to quiz
    ProgressTracker.setShuffleEnabled(shuffleEnabled)
    router.push(`/exam-questions/quiz?shuffle=${shuffleEnabled}`)
  }

  const handleContinue = () => {
    // Continue from last position
    const nextQuestion = ProgressTracker.getNextUnansweredQuestion()
    if (nextQuestion) {
      router.push(`/exam-questions/quiz?shuffle=${shuffleEnabled}&start=${nextQuestion}`)
    } else {
      // All completed, start from beginning
      handleStart()
    }
  }

  const handleReset = () => {
    if (confirm('Opravdu chcete resetovat veškerý progres? Tato akce je nevratná.')) {
      ProgressTracker.resetProgress()
      setStats({
        totalQuestions: 40,
        completedQuestions: 0,
        percentage: 0,
        lastPosition: 0,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Procvičování
            </h1>
            <Link
              href="/exam-questions"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <Home className="w-4 h-4" />
              Zpět
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Progress card */}
        <div className="mb-8 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 border-2 border-green-200/50 dark:border-green-800/50 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-500 rounded-xl shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Tvůj progres
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Sleduj kolik otázek jsi už dokončil
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                {stats.completedQuestions}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Dokončeno
              </div>
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                {stats.totalQuestions}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Celkem
              </div>
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-black text-green-600 dark:text-green-400">
                {stats.percentage}%
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Hotovo
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </div>

        {/* Settings card */}
        <div className="mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Nastavení procvičování
          </h2>

          {/* Shuffle toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
            <div className="flex items-center gap-3">
              {shuffleEnabled ? (
                <Shuffle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              ) : (
                <List className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              )}
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {shuffleEnabled ? 'Náhodné pořadí' : 'Sekvenční pořadí'}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {shuffleEnabled
                    ? 'Otázky budou zamíchané'
                    : 'Otázky půjdou za sebou (1→2→3...)'}
                </div>
              </div>
            </div>
            <button
              onClick={handleShuffleToggle}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                shuffleEnabled
                  ? 'bg-purple-600'
                  : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  shuffleEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid gap-4">
          {/* Start/Continue button */}
          {stats.completedQuestions > 0 && stats.completedQuestions < stats.totalQuestions ? (
            <button
              onClick={handleContinue}
              className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <div className="flex items-center justify-center gap-3">
                <Play className="w-5 h-5" />
                <span>Pokračovat v procvičování</span>
              </div>
              <div className="text-xs opacity-80 mt-1">
                Začneš u otázky {ProgressTracker.getNextUnansweredQuestion() || 1}
              </div>
            </button>
          ) : (
            <button
              onClick={handleStart}
              className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <div className="flex items-center justify-center gap-3">
                <Play className="w-5 h-5" />
                <span>
                  {stats.completedQuestions === 0
                    ? 'Zahájit procvičování'
                    : 'Začít znovu'}
                </span>
              </div>
            </button>
          )}

          {/* Reset progress button */}
          {stats.completedQuestions > 0 && (
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl border-2 border-red-200 dark:border-red-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Resetovat progres
            </button>
          )}
        </div>

        {/* Info card */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            💡 <strong>Tip:</strong> Tvůj progres se automaticky ukládá po každé
            zodpovězené otázce. Můžeš kdykoliv zavřít prohlížeč a pokračovat později.
          </p>
        </div>
      </main>
    </div>
  )
}
