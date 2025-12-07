'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

type Answer = {
  id: string
  text: string
  isCorrect: boolean
}

type Question = {
  id: string
  text: string
  explanation: string | null
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE'
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  answers: Answer[]
  category: {
    id: string
    name: string
    color: string | null
  }
}

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.categoryId as string

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Set<string>>(new Set())
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [quizCompleted, setQuizCompleted] = useState(false)

  useEffect(() => {
    fetchQuestions()
  }, [categoryId])

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`/api/questions/random?categoryId=${categoryId}&limit=10`)
      const data = await response.json()
      setQuestions(data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching questions:', error)
      setIsLoading(false)
    }
  }

  const currentQuestion = questions[currentIndex]

  const handleAnswerSelect = (answerId: string) => {
    if (showExplanation) return

    if (currentQuestion?.type === 'SINGLE_CHOICE' || currentQuestion?.type === 'TRUE_FALSE') {
      setSelectedAnswers(new Set([answerId]))
    } else {
      const newSelected = new Set(selectedAnswers)
      if (newSelected.has(answerId)) {
        newSelected.delete(answerId)
      } else {
        newSelected.add(answerId)
      }
      setSelectedAnswers(newSelected)
    }
  }

  const handleSubmit = () => {
    if (selectedAnswers.size === 0) return

    const correctAnswers = new Set(
      currentQuestion.answers.filter(a => a.isCorrect).map(a => a.id)
    )

    const isCorrect =
      correctAnswers.size === selectedAnswers.size &&
      [...correctAnswers].every(id => selectedAnswers.has(id))

    if (isCorrect) {
      setScore(score + 1)
    }

    setShowExplanation(true)
    setAnsweredQuestions(answeredQuestions + 1)

    // Save progress to localStorage
    const progress = JSON.parse(localStorage.getItem('quizProgress') || '{}')
    progress[categoryId] = {
      score: isCorrect ? score + 1 : score,
      total: answeredQuestions + 1,
      lastUpdated: new Date().toISOString()
    }
    localStorage.setItem('quizProgress', JSON.stringify(progress))
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswers(new Set())
      setShowExplanation(false)
    } else {
      setQuizCompleted(true)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-2xl text-gray-700 dark:text-gray-300">Načítám otázky...</div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Žádné otázky
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            V této kategorii zatím nejsou žádné otázky.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Zpět na hlavní stránku
          </Link>
        </div>
      </div>
    )
  }

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Kvíz dokončen!
          </h2>
          <div className="mb-6">
            <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {percentage}%
            </div>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              {score} z {questions.length} správně
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setCurrentIndex(0)
                setSelectedAnswers(new Set())
                setShowExplanation(false)
                setScore(0)
                setAnsweredQuestions(0)
                setQuizCompleted(false)
                fetchQuestions()
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Zkusit znovu
            </button>
            <Link
              href="/"
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Zpět na hlavní stránku
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← Zpět
            </Link>
            <div className="text-gray-700 dark:text-gray-300">
              Otázka {currentIndex + 1} z {questions.length}
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              Skóre: {score}/{answeredQuestions}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: currentQuestion.category.color || '#3B82F6',
                    color: 'white'
                  }}
                >
                  {currentQuestion.category.name}
                </span>
                <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm">
                  {currentQuestion.difficulty === 'EASY' && 'Lehká'}
                  {currentQuestion.difficulty === 'MEDIUM' && 'Střední'}
                  {currentQuestion.difficulty === 'HARD' && 'Těžká'}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentQuestion.text}
              </h2>
            </div>

            <div className="space-y-3 mb-6">
              {currentQuestion.answers.map((answer) => {
                const isSelected = selectedAnswers.has(answer.id)
                const showCorrect = showExplanation && answer.isCorrect
                const showIncorrect = showExplanation && isSelected && !answer.isCorrect

                return (
                  <button
                    key={answer.id}
                    onClick={() => handleAnswerSelect(answer.id)}
                    disabled={showExplanation}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      showCorrect
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : showIncorrect
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 dark:text-white">{answer.text}</span>
                      {showCorrect && <span className="text-green-600">✓</span>}
                      {showIncorrect && <span className="text-red-600">✗</span>}
                    </div>
                  </button>
                )
              })}
            </div>

            {showExplanation && currentQuestion.explanation && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Vysvětlení:</h3>
                <p className="text-gray-700 dark:text-gray-300">{currentQuestion.explanation}</p>
              </div>
            )}

            <div className="flex justify-end">
              {!showExplanation ? (
                <button
                  onClick={handleSubmit}
                  disabled={selectedAnswers.size === 0}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Zkontrolovat
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {currentIndex < questions.length - 1 ? 'Další otázka' : 'Dokončit kvíz'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
