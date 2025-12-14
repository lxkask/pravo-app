'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Clock, CheckCircle2, XCircle, SkipForward, Home, RotateCcw, Play, RefreshCcw, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import { MidtermProgressTracker } from '@/lib/midterm-progress-tracker'
import { updateStudyStreak } from '@/components/study-streak'
import { ConfettiEffect } from '@/components/confetti-effect'
import { AchievementToast, ACHIEVEMENTS } from '@/components/achievement-toast'
import { FormattedAnswer } from '@/components/formatted-answer'
import { DogCarAnimation } from '@/components/dog-car-animation'
import { useDogCollection } from '@/hooks/use-dog-collection'
import { DogAnimations } from '@/components/dog-animations'
import { DogUnlockNotification } from '@/components/dog-unlock-notification'
import { getDogById, type Dog } from '@/lib/dogs-collection'

type QuizAnswer = {
  id: string
  text: string
  isCorrect: boolean
  order: number
}

type QuizQuestion = {
  id: string
  questionText: string
  explanation: string | null
  explanationConfidence: string | null
  originalId: number | null
  category: string | null
  answers: QuizAnswer[]
}

type QuizMode = 'practice' | 'test'

const MODE_CONFIG = {
  'practice': { name: 'Procvičování', questions: 94, time: null, desc: 'Všechny otázky, žádný časový limit', shuffle: false },
  'test': { name: 'Zkouškový test', questions: 25, time: 25, desc: '25 náhodných otázek za 25 minut', shuffle: true },
}

export default function MidtermQuizPage() {
  const [mode, setMode] = useState<QuizMode | null>(null)
  const [shuffleEnabled, setShuffleEnabled] = useState(false)
  const [progressStats, setProgressStats] = useState({ totalQuestions: 94, completedQuestions: 0, percentage: 0, lastPosition: 0 })
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set())
  const [skippedQuestions, setSkippedQuestions] = useState<Set<number>>(new Set())
  const [answers, setAnswers] = useState<Map<number, { questionId: string, answerId: string, correct: boolean }>>(new Map())
  const [showResult, setShowResult] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [unlockedDog, setUnlockedDog] = useState<Dog | null>(null)
  const [showDogNotification, setShowDogNotification] = useState(false)
  const [isNewDogUnlock, setIsNewDogUnlock] = useState(false)
  const dogCollection = useDogCollection()
  const [timerActive, setTimerActive] = useState(false)
  const [focusedAnswerIndex, setFocusedAnswerIndex] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [achievement, setAchievement] = useState<typeof ACHIEVEMENTS[keyof typeof ACHIEVEMENTS] | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [reviewMode, setReviewMode] = useState(false)

  // Load progress stats on mount
  useEffect(() => {
    const stats = MidtermProgressTracker.getStats()
    setProgressStats(stats)
  }, [])

  useEffect(() => {
    if (mode && questions.length === 0) {
      fetchQuestions()
    }
  }, [mode])

  // Timer
  useEffect(() => {
    if (!timerActive || timeLeft === null || timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          setTimerActive(false)
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timerActive, timeLeft])

  const fetchQuestions = async () => {
    if (!mode) return

    setIsLoading(true)
    try {
      const config = MODE_CONFIG[mode]
      const shouldShuffle = mode === 'test' ? true : shuffleEnabled
      const response = await fetch(`/api/midterm-quiz?limit=${config.questions}&shuffle=${shouldShuffle}`)
      const data = await response.json()
      setQuestions(data.questions)

      // In practice mode, start from next unanswered question
      if (mode === 'practice' && !shouldShuffle) {
        const nextUnanswered = MidtermProgressTracker.getNextUnansweredQuestion(data.questions.length)
        if (nextUnanswered !== null) {
          setCurrentIndex(nextUnanswered)
        }
      }

      if (config.time) {
        setTimeLeft(config.time * 60) // Convert to seconds
        setTimerActive(true)
      }

      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching questions:', error)
      setIsLoading(false)
    }
  }

  const handleTimeUp = () => {
    setQuizCompleted(true)
    updateStudyStreak() // Update streak when quiz is completed
    checkAchievements()
  }

  const checkAchievements = () => {
    const percentage = Math.round((score / questions.length) * 100)

    // Perfect score achievement
    if (percentage === 100) {
      setShowConfetti(true)
      setAchievement(ACHIEVEMENTS.PERFECT_SCORE)
    } else if (percentage >= 80) {
      setShowConfetti(true)
    }

    // First quiz achievement
    const completedQuizzesStr = localStorage.getItem('completed-quizzes') || '0'
    const completedQuizzes = Math.max(0, parseInt(completedQuizzesStr, 10) || 0)
    if (completedQuizzes === 0) {
      setTimeout(() => {
        setAchievement(ACHIEVEMENTS.FIRST_QUIZ)
      }, 1000)
    }

    // Update quiz counter
    localStorage.setItem('completed-quizzes', String(completedQuizzes + 1))

    // Check for 10 quizzes
    if (completedQuizzes + 1 === 10) {
      setTimeout(() => {
        setAchievement(ACHIEVEMENTS.TEN_QUIZZES)
      }, 2000)
    }

    // Unlock a random dog
    const { dog, isNew } = dogCollection.unlockRandomDog()
    setUnlockedDog(dog)
    setIsNewDogUnlock(isNew)

    // Show notification
    setTimeout(() => {
      setShowDogNotification(true)
    }, 1500) // Show after confetti
  }

  const currentQuestion = questions[currentIndex]

  const handleAnswerSelect = (answerId: string) => {
    if (showResult) return
    setSelectedAnswer(answerId)
  }

  const handleSubmit = () => {
    if (!selectedAnswer || !currentQuestion) return

    const correctAnswer = currentQuestion.answers.find(a => a.isCorrect)
    const isCorrect = selectedAnswer === correctAnswer?.id

    // Save answer
    const newAnswers = new Map(answers)
    newAnswers.set(currentIndex, {
      questionId: currentQuestion.id,
      answerId: selectedAnswer,
      correct: isCorrect
    })
    setAnswers(newAnswers)

    const newAnswered = new Set(answeredQuestions)
    newAnswered.add(currentIndex)
    setAnsweredQuestions(newAnswered)

    // Remove from skipped if it was skipped
    if (skippedQuestions.has(currentIndex)) {
      const newSkipped = new Set(skippedQuestions)
      newSkipped.delete(currentIndex)
      setSkippedQuestions(newSkipped)
    }

    // Track progress in practice mode
    if (mode === 'practice') {
      MidtermProgressTracker.markQuestionAnswered(currentIndex, isCorrect)
      const stats = MidtermProgressTracker.getStats()
      setProgressStats(stats)
    }

    setShowResult(true)
  }

  const handleNext = () => {
    // Reset explanation state
    setShowExplanation(false)

    // Find next unanswered question
    let nextIndex = currentIndex + 1

    // If we're at the end, check if there are skipped questions
    if (nextIndex >= questions.length) {
      const skippedArray = Array.from(skippedQuestions)
      if (skippedArray.length > 0) {
        nextIndex = skippedArray[0]
      } else {
        setQuizCompleted(true)
        setTimerActive(false)
        updateStudyStreak() // Update streak when all questions answered
        checkAchievements()
        return
      }
    }

    setCurrentIndex(nextIndex)

    // Load existing answer if going back to answered question
    const existingAnswer = answers.get(nextIndex)
    if (existingAnswer) {
      setSelectedAnswer(existingAnswer.answerId)
      setShowResult(true)
    } else {
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  const handleSkip = () => {
    const newSkipped = new Set(skippedQuestions)
    newSkipped.add(currentIndex)
    setSkippedQuestions(newSkipped)

    handleNext()
  }

  const handleJumpTo = (index: number) => {
    setCurrentIndex(index)

    const existingAnswer = answers.get(index)
    if (existingAnswer) {
      setSelectedAnswer(existingAnswer.answerId)
      setShowResult(true)
    } else {
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  const handleRestart = () => {
    setMode(null)
    setQuestions([])
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setAnsweredQuestions(new Set())
    setSkippedQuestions(new Set())
    setAnswers(new Map())
    setShowResult(false)
    setQuizCompleted(false)
    setTimeLeft(null)
    setTimerActive(false)
    setReviewMode(false)
    setShowExplanation(false)
  }

  const handleStartReview = () => {
    setReviewMode(true)
    setQuizCompleted(false)
    setCurrentIndex(0)
    setShowResult(true)
    setShowExplanation(true)
    // Set the selected answer for first question
    const firstAnswer = answers.get(0)
    if (firstAnswer) {
      setSelectedAnswer(firstAnswer.answerId)
    }
  }

  const handleReviewNavigation = (direction: 'prev' | 'next') => {
    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1

    // Boundary checks
    if (nextIndex < 0) nextIndex = 0
    if (nextIndex >= questions.length) {
      // End of review
      setReviewMode(false)
      setQuizCompleted(true)
      return
    }

    setCurrentIndex(nextIndex)

    // Load answer for the question
    const answer = answers.get(nextIndex)
    if (answer) {
      setSelectedAnswer(answer.answerId)
    } else {
      setSelectedAnswer(null)
    }
  }

  const handleExitReview = () => {
    setReviewMode(false)
    setQuizCompleted(true)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const score = Array.from(answers.values()).filter(a => a.correct).length
  const totalAnswered = answers.size

  // Keyboard navigation (optimized with useCallback)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!currentQuestion || quizCompleted) return

    const answersCount = currentQuestion.answers.length

    // Arrow Up/Down - navigate between answers
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!showResult) {
        setFocusedAnswerIndex(prev => (prev + 1) % answersCount)
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!showResult) {
        setFocusedAnswerIndex(prev => (prev - 1 + answersCount) % answersCount)
      }
    }
    // Space - select focused answer
    else if (e.key === ' ') {
      e.preventDefault()
      if (!showResult) {
        const focusedAnswer = currentQuestion.answers[focusedAnswerIndex]
        handleAnswerSelect(focusedAnswer.id)
      }
    }
    // Enter - confirm answer, go to next, or skip
    else if (e.key === 'Enter') {
      e.preventDefault()
      if (showResult) {
        handleNext()
      } else if (selectedAnswer) {
        handleSubmit()
      } else {
        // Skip if no answer selected
        handleSkip()
      }
    }
    // Numbers 1-9 - select answer by number
    else if (['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
      const answerIndex = parseInt(e.key) - 1
      if (!showResult && answerIndex < answersCount) {
        setFocusedAnswerIndex(answerIndex)
        const answer = currentQuestion.answers[answerIndex]
        handleAnswerSelect(answer.id)
      }
    }
    // S key - skip question
    else if (e.key === 's' || e.key === 'S') {
      if (!showResult) {
        handleSkip()
      }
    }
  }, [currentQuestion, showResult, focusedAnswerIndex, selectedAnswer, quizCompleted, handleAnswerSelect, handleNext, handleSubmit, handleSkip])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Reset focused answer when question changes
  useEffect(() => {
    setFocusedAnswerIndex(0)
  }, [currentIndex])

  // Mode selection screen
  if (!mode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-4">
        <div className="max-w-5xl mx-auto py-12">
          <div className="text-center mb-12">
            <Link href="/" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-6 transition-colors">
              <Home className="w-4 h-4 mr-2" />
              Zpět na hlavní stránku
            </Link>
            <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Průběžný test
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Vyber si režim testování
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Practice Mode */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {MODE_CONFIG['practice'].name}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {MODE_CONFIG['practice'].desc}
              </p>
              <div className="flex items-center justify-between text-sm mb-6">
                <span className="text-slate-500 dark:text-slate-500">{MODE_CONFIG['practice'].questions} otázek</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Bez limitu ⏳</span>
              </div>

              {/* Progress display */}
              {progressStats.completedQuestions > 0 && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-green-900 dark:text-green-200">Progres</span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">{progressStats.percentage}%</span>
                  </div>
                  <div className="mb-2 bg-green-200 dark:bg-green-900/50 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-green-600 dark:bg-green-400 h-2 rounded-full transition-all"
                      style={{ width: `${progressStats.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    Dokončeno {progressStats.completedQuestions} z {progressStats.totalQuestions} otázek
                  </p>
                </div>
              )}

              {/* Shuffle toggle */}
              <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white mb-1">Náhodné pořadí</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Zamíchat otázky namísto sekvenčního pořadí</div>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={shuffleEnabled}
                      onChange={(e) => setShuffleEnabled(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-14 h-8 rounded-full transition-colors ${
                      shuffleEnabled ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}>
                      <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                        shuffleEnabled ? 'translate-x-6' : ''
                      }`}></div>
                    </div>
                  </div>
                </label>
              </div>

              <div className="flex gap-3">
                {progressStats.completedQuestions > 0 && progressStats.completedQuestions < progressStats.totalQuestions && (
                  <button
                    onClick={() => {
                      setMode('practice')
                      // Will start from next unanswered question
                    }}
                    className="flex-1 bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white py-4 rounded-xl transition-all font-bold text-lg shadow-lg flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Pokračovat
                  </button>
                )}
                <button
                  onClick={() => {
                    if (progressStats.completedQuestions > 0) {
                      if (confirm('Začít znovu? Současný progres bude resetován.')) {
                        MidtermProgressTracker.resetProgress()
                        setProgressStats({ totalQuestions: 94, completedQuestions: 0, percentage: 0, lastPosition: 0 })
                        setMode('practice')
                      }
                    } else {
                      setMode('practice')
                    }
                  }}
                  className={`${
                    progressStats.completedQuestions > 0 && progressStats.completedQuestions < progressStats.totalQuestions
                      ? 'flex-1'
                      : 'w-full'
                  } bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white py-4 rounded-xl transition-all font-bold text-lg shadow-lg flex items-center justify-center gap-2`}
                >
                  {progressStats.completedQuestions > 0 ? (
                    <>
                      <RefreshCcw className="w-5 h-5" />
                      Začít znovu
                    </>
                  ) : (
                    'Začít procvičování'
                  )}
                </button>
              </div>
            </div>

            {/* Test Mode */}
            <button
              onClick={() => setMode('test')}
              className="group relative overflow-hidden bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-slate-200 dark:border-slate-700"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
              <div className="relative">
                <div className="text-4xl mb-4">⏱️</div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {MODE_CONFIG['test'].name}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {MODE_CONFIG['test'].desc}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-500">{MODE_CONFIG['test'].questions} otázek</span>
                  <span className="text-orange-600 dark:text-orange-400 font-semibold">{MODE_CONFIG['test'].time} minut ⏰</span>
                </div>
              </div>
            </button>
          </div>

          {/* Dog Collection Card */}
          <Link
            href="/hundy"
            className="group relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border-2 border-amber-300 dark:border-amber-700 block"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-400/20 to-orange-400/20 dark:from-amber-500/30 dark:to-orange-500/30 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-400/10 to-amber-400/10 dark:from-orange-500/20 dark:to-amber-500/20 rounded-full -ml-16 -mb-16 group-hover:scale-150 transition-transform" />

            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="text-6xl group-hover:scale-110 transition-transform">🐕</div>
                <div className="px-4 py-2 bg-amber-200 dark:bg-amber-900/50 rounded-full">
                  <span className="text-sm font-bold text-amber-900 dark:text-amber-200">
                    {dogCollection.isLoaded ? `${dogCollection.getUnlockedCount()}/${dogCollection.getTotalCount()}` : '...'} odemčeno
                  </span>
                </div>
              </div>

              <h3 className="text-3xl font-bold text-amber-900 dark:text-amber-100 mb-3">
                Sbírka Hundů
              </h3>
              <p className="text-amber-800 dark:text-amber-200 mb-4 text-lg">
                Sbírej roztomilé pejsky za správné odpovědi! Každý dokončený test ti odemkne nového kamaráda.
              </p>

              {/* Progress bar */}
              {dogCollection.isLoaded && (
                <div className="mb-4">
                  <div className="mb-2 bg-amber-200 dark:bg-amber-900/50 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-400 dark:to-orange-400 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(dogCollection.getUnlockedCount() / dogCollection.getTotalCount()) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                    {dogCollection.isCollectionComplete()
                      ? '🎉 Kompletní sbírka! Máš všechny psy!'
                      : `Ještě ${dogCollection.getTotalCount() - dogCollection.getUnlockedCount()} ${dogCollection.getTotalCount() - dogCollection.getUnlockedCount() === 1 ? 'pes' : dogCollection.getTotalCount() - dogCollection.getUnlockedCount() < 5 ? 'psi' : 'psů'} čeká na odemčení`}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-amber-300 dark:border-amber-700">
                <span className="text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Prohlédnout sbírku
                </span>
                <ChevronRight className="w-6 h-6 text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg">Načítání otázek...</p>
        </div>
      </div>
    )
  }

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100)
    const config = MODE_CONFIG[mode]

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full p-12 border border-slate-200 dark:border-slate-700">
          <div className="text-center">
            {/* Dog Animation - Properly Contained */}
            <div className="mb-12 overflow-hidden rounded-2xl h-48 relative">
              <div className="absolute inset-0 flex items-center justify-center scale-75">
                {unlockedDog ? (() => {
                  const DogComponent = DogAnimations[unlockedDog.id as keyof typeof DogAnimations]
                  return DogComponent ? <DogComponent /> : <DogCarAnimation />
                })() : <DogCarAnimation />}
              </div>
            </div>

            <div className="text-6xl mb-6">
              {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪'}
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Test dokončen!
            </h1>

            <div className="my-10">
              <div className={`text-7xl font-black mb-3 ${
                percentage >= 80 ? 'text-green-600 dark:text-green-400' :
                percentage >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                'text-red-600 dark:text-red-400'
              }`}>
                {percentage}%
              </div>
              <p className="text-2xl text-slate-600 dark:text-slate-400 mb-2">
                {score} z {questions.length} správně
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                {config.name} • {totalAnswered} odpovězeno
              </p>
            </div>

            <div className="mb-10">
              {percentage >= 80 && (
                <p className="text-green-600 dark:text-green-400 text-xl font-semibold">
                  Výborně! Jste velmi dobře připraveni! 🎉
                </p>
              )}
              {percentage >= 60 && percentage < 80 && (
                <p className="text-yellow-600 dark:text-yellow-400 text-xl font-semibold">
                  Dobře! Ještě trochu procvičit a budete připraveni. 📚
                </p>
              )}
              {percentage < 60 && (
                <p className="text-red-600 dark:text-red-400 text-xl font-semibold">
                  Doporučujeme více se učit. Zkuste to znovu! 💪
                </p>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <Link
                href="/hundy"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 hover:from-purple-700 hover:to-pink-700 dark:hover:from-purple-600 dark:hover:to-pink-600 text-white px-8 py-4 rounded-xl transition-all font-semibold text-lg shadow-lg transform hover:scale-105"
              >
                🐕 Sbírka Hundů ({dogCollection.getUnlockedCount()}/10)
              </Link>
              <button
                onClick={handleStartReview}
                className="flex items-center justify-center gap-2 bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white px-8 py-4 rounded-xl transition-colors font-semibold text-lg shadow-lg"
              >
                <BookOpen className="w-5 h-5" />
                📖 Projít odpovědi
              </button>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleRestart}
                  className="flex items-center gap-2 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white px-8 py-4 rounded-xl transition-colors font-semibold text-lg shadow-lg"
                >
                  <RotateCcw className="w-5 h-5" />
                  Nový test
                </button>
                <Link
                  href="/"
                  className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white px-8 py-4 rounded-xl transition-colors font-semibold text-lg"
                >
                  <Home className="w-5 h-5" />
                  Domů
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const correctAnswer = currentQuestion?.answers.find(a => a.isCorrect)
  const isAnswerCorrect = selectedAnswer === correctAnswer?.id
  const config = MODE_CONFIG[mode]

  return (
    <>
      <ConfettiEffect trigger={showConfetti} />
      <AchievementToast achievement={achievement} onClose={() => setAchievement(null)} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-4">
      <div className="max-w-5xl mx-auto py-6">
        {/* Header */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={reviewMode ? handleExitReview : handleRestart}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold flex items-center gap-2 transition-colors"
            >
              <Home className="w-4 h-4" />
              {reviewMode ? 'Ukončit review' : 'Změnit režim'}
            </button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {reviewMode ? '📖 Review režim' : config.name}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Otázka {currentIndex + 1} z {questions.length}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Skóre</div>
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {score}/{totalAnswered}
              </div>
            </div>
          </div>

          {/* Timer */}
          {config.time && timeLeft !== null && (
            <div
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl ${
                timeLeft < 60 ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                timeLeft < 300 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
              }`}
              role="timer"
              aria-live="polite"
              aria-atomic="true"
              aria-label={`Zbývající čas: ${formatTime(timeLeft)}`}
            >
              <Clock className="w-5 h-5" aria-hidden="true" />
              <span className="font-mono text-xl font-bold">{formatTime(timeLeft)}</span>
            </div>
          )}

          {/* Progress bar */}
          <div
            className="mt-4 bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden"
            role="progressbar"
            aria-valuenow={answeredQuestions.size}
            aria-valuemin={0}
            aria-valuemax={questions.length}
            aria-label={`Postup v testu: ${answeredQuestions.size} z ${questions.length} otázek zodpovězeno`}
          >
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(answeredQuestions.size / questions.length) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span>{answeredQuestions.size} odpovězeno</span>
            <span>{skippedQuestions.size} přeskočeno</span>
          </div>
        </div>

        {/* Question navigator */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 mb-6 border border-slate-200 dark:border-slate-700">
          <div className="flex flex-wrap gap-2">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleJumpTo(idx)}
                className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                  idx === currentIndex
                    ? 'bg-indigo-600 dark:bg-indigo-500 text-white scale-110 shadow-lg'
                    : answeredQuestions.has(idx)
                    ? answers.get(idx)?.correct
                      ? 'bg-green-200 dark:bg-green-900/50 text-green-800 dark:text-green-200'
                      : 'bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-200'
                    : skippedQuestions.has(idx)
                    ? 'bg-yellow-200 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⌨️</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">Klávesové zkratky:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 text-xs text-blue-800 dark:text-blue-300">
                <div><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded border border-blue-300 dark:border-blue-600 font-mono">↑↓</kbd> navigace</div>
                <div><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded border border-blue-300 dark:border-blue-600 font-mono">1-9</kbd> výběr</div>
                <div><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded border border-blue-300 dark:border-blue-600 font-mono">Enter</kbd> potvrdit/skip</div>
                <div><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded border border-blue-300 dark:border-blue-600 font-mono">S</kbd> přeskočit</div>
              </div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 mb-6 border border-slate-200 dark:border-slate-700">
          <div className="mb-4 flex gap-2">
            {currentQuestion?.category && (
              <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-lg text-sm font-semibold">
                {currentQuestion.category}
              </span>
            )}
            {skippedQuestions.has(currentIndex) && (
              <span className="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-lg text-sm font-semibold">
                Přeskočeno
              </span>
            )}
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 leading-relaxed">
            {currentQuestion?.questionText}
          </h2>

          {/* Answers */}
          <div
            className="space-y-3"
            role="radiogroup"
            aria-label="Možné odpovědi"
          >
            {currentQuestion?.answers.map((answer, idx) => {
              const isSelected = selectedAnswer === answer.id
              const isFocused = focusedAnswerIndex === idx && !showResult
              const showCorrect = showResult && answer.isCorrect
              const showIncorrect = showResult && isSelected && !answer.isCorrect

              return (
                <button
                  key={answer.id}
                  onClick={() => handleAnswerSelect(answer.id)}
                  disabled={showResult}
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`Odpověď ${idx + 1}: ${answer.text}${showCorrect ? ' (správná odpověď)' : ''}${showIncorrect ? ' (špatná odpověď)' : ''}`}
                  tabIndex={isFocused ? 0 : -1}
                  className={`w-full p-5 text-left rounded-xl border-2 transition-all ${
                    showCorrect
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-400'
                      : showIncorrect
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-400'
                      : isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 dark:border-indigo-400'
                      : isFocused
                      ? 'bg-slate-100 dark:bg-slate-800 border-indigo-400 dark:border-indigo-500 shadow-md ring-2 ring-indigo-400 dark:ring-indigo-500 ring-opacity-50'
                      : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500'
                  } ${showResult ? 'cursor-default' : 'cursor-pointer hover:shadow-md'}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex items-center gap-3">
                      {/* Number indicator */}
                      <span className={`text-sm font-semibold ${
                        showCorrect ? 'text-green-600 dark:text-green-400' :
                        showIncorrect ? 'text-red-600 dark:text-red-400' :
                        isSelected ? 'text-indigo-600 dark:text-indigo-400' :
                        isFocused ? 'text-indigo-600 dark:text-indigo-400' :
                        'text-slate-400 dark:text-slate-500'
                      }`}>
                        {idx + 1}.
                      </span>
                      <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        showCorrect
                          ? 'bg-green-500 dark:bg-green-400 border-green-500 dark:border-green-400'
                          : showIncorrect
                          ? 'bg-red-500 dark:bg-red-400 border-red-500 dark:border-red-400'
                          : isSelected
                          ? 'bg-indigo-500 dark:bg-indigo-400 border-indigo-500 dark:border-indigo-400'
                          : isFocused
                          ? 'border-indigo-400 dark:border-indigo-500'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {showCorrect && <CheckCircle2 className="w-4 h-4 text-white" />}
                        {showIncorrect && <XCircle className="w-4 h-4 text-white" />}
                        {isSelected && !showResult && <div className="w-3 h-3 bg-white rounded-full" />}
                      </div>
                    </div>
                    <span className="flex-1 text-slate-700 dark:text-slate-300 leading-relaxed">
                      {answer.text}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Result feedback */}
          {showResult && (
            <div className={`mt-6 p-5 rounded-xl border-2 ${
              isAnswerCorrect
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            }`}>
              <p className={`font-bold text-lg flex items-center gap-2 ${
                isAnswerCorrect ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
              }`}>
                {isAnswerCorrect ? (
                  <><CheckCircle2 className="w-5 h-5" /> Správně!</>
                ) : (
                  <><XCircle className="w-5 h-5" /> Špatně</>
                )}
              </p>
              {!isAnswerCorrect && (
                <p className="text-slate-700 dark:text-slate-300 mt-2">
                  Správná odpověď je označena zeleně.
                </p>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-8 flex gap-3">
            {reviewMode ? (
              // Review mode navigation
              <>
                <button
                  onClick={() => handleReviewNavigation('prev')}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-2 bg-slate-600 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl transition-all font-bold text-lg shadow-lg disabled:shadow-none"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Předchozí
                </button>
                <button
                  onClick={handleExitReview}
                  className="flex-1 bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-600 text-white px-6 py-4 rounded-xl transition-all font-bold text-lg shadow-lg"
                >
                  Ukončit review
                </button>
                <button
                  onClick={() => handleReviewNavigation('next')}
                  className="flex items-center gap-2 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white px-6 py-4 rounded-xl transition-all font-bold text-lg shadow-lg"
                >
                  {currentIndex < questions.length - 1 ? 'Další' : 'Dokončit'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            ) : !showResult ? (
              // Normal quiz mode - selecting answer
              <>
                <button
                  onClick={handleSubmit}
                  disabled={!selectedAnswer}
                  className="flex-1 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl transition-all font-bold text-lg shadow-lg disabled:shadow-none"
                >
                  Potvrdit odpověď
                </button>
                <button
                  onClick={handleSkip}
                  className="bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-600 dark:hover:bg-yellow-700 text-white px-6 py-4 rounded-xl transition-all font-semibold flex items-center gap-2 shadow-lg"
                >
                  <SkipForward className="w-5 h-5" />
                  Skip
                </button>
              </>
            ) : (
              // Normal quiz mode - after answering
              <>
                {currentQuestion.explanation && (
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="flex-1 bg-slate-600 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white px-6 py-4 rounded-xl transition-all font-bold text-lg shadow-lg"
                  >
                    {showExplanation ? '✕ Skrýt vysvětlení' : '💡 Zobrazit vysvětlení'}
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="flex-1 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white px-6 py-4 rounded-xl transition-all font-bold text-lg shadow-lg"
                >
                  {currentIndex < questions.length - 1 || skippedQuestions.size > 0
                    ? 'Další otázka →'
                    : 'Dokončit test'}
                </button>
              </>
            )}
          </div>

          {/* AI Explanation Section */}
          {showResult && showExplanation && currentQuestion.explanation && (
            <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-indigo-200 dark:border-indigo-700">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🧠</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI Vysvětlení</h3>

                {/* Confidence Badge */}
                {currentQuestion.explanationConfidence && (
                  <div className="ml-auto flex items-center gap-2 group relative">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      currentQuestion.explanationConfidence === 'high'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700'
                        : currentQuestion.explanationConfidence === 'medium'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700'
                        : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-300 dark:border-orange-700'
                    }`}>
                      {currentQuestion.explanationConfidence === 'high' ? 'Vysoká důvěra' :
                       currentQuestion.explanationConfidence === 'medium' ? 'Střední důvěra' :
                       'Nízká důvěra'}
                    </span>

                    {/* Info Icon with Tooltip */}
                    <div className="relative">
                      <div className="w-5 h-5 rounded-full bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-bold cursor-help">
                        ℹ️
                      </div>

                      {/* Tooltip */}
                      <div className="absolute right-0 top-8 w-80 p-4 bg-white dark:bg-slate-700 rounded-lg shadow-xl border border-slate-200 dark:border-slate-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-sm">
                        <p className="font-semibold text-slate-900 dark:text-white mb-2">Co znamená důvěra AI?</p>
                        <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                          <li className="flex gap-2">
                            <span className="text-green-600 dark:text-green-400 font-bold">Vysoká:</span>
                            <span>AI našla relevantní kontext ze zkouškových otázek</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-yellow-600 dark:text-yellow-400 font-bold">Střední:</span>
                            <span>Obecné vysvětlení založené na právních principech</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-orange-600 dark:text-orange-400 font-bold">Nízká:</span>
                            <span>Doporučujeme zkontrolovat v učebnici</span>
                          </li>
                        </ul>
                        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 italic border-t border-slate-200 dark:border-slate-600 pt-2">
                          Nízká důvěra neznamená, že vysvětlení je špatně - pouze že AI měla méně zdrojového kontextu.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <FormattedAnswer text={currentQuestion.explanation} />
              </div>
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Confetti and Achievement notifications */}
      {showConfetti && <ConfettiEffect trigger={showConfetti} />}
      {achievement && (
        <AchievementToast
          achievement={achievement}
          onClose={() => setAchievement(null)}
        />
      )}

      {/* Dog unlock notification */}
      {showDogNotification && unlockedDog && (
        <DogUnlockNotification
          dog={unlockedDog}
          isNewUnlock={isNewDogUnlock}
          onClose={() => setShowDogNotification(false)}
        />
      )}
    </>
  )
}
