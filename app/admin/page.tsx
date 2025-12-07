'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Category = {
  id: string
  name: string
  description: string | null
  color: string | null
  _count: {
    questions: number
  }
}

type Answer = {
  text: string
  isCorrect: boolean
}

export default function AdminPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [showQuestionForm, setShowQuestionForm] = useState(false)

  // Category form state
  const [categoryName, setCategoryName] = useState('')
  const [categoryDescription, setCategoryDescription] = useState('')
  const [categoryColor, setCategoryColor] = useState('#3B82F6')

  // Question form state
  const [questionText, setQuestionText] = useState('')
  const [questionExplanation, setQuestionExplanation] = useState('')
  const [questionType, setQuestionType] = useState<'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE'>('SINGLE_CHOICE')
  const [questionDifficulty, setQuestionDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [answers, setAnswers] = useState<Answer[]>([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false }
  ])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const response = await fetch('/api/categories')
    const data = await response.json()
    setCategories(data)
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: categoryName,
          description: categoryDescription,
          color: categoryColor
        })
      })
      setCategoryName('')
      setCategoryDescription('')
      setCategoryColor('#3B82F6')
      setShowCategoryForm(false)
      fetchCategories()
    } catch (error) {
      console.error('Error adding category:', error)
    }
  }

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: questionText,
          explanation: questionExplanation,
          type: questionType,
          difficulty: questionDifficulty,
          categoryId: selectedCategoryId,
          answers: answers.filter(a => a.text.trim() !== '')
        })
      })
      setQuestionText('')
      setQuestionExplanation('')
      setAnswers([
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ])
      setShowQuestionForm(false)
      fetchCategories()
    } catch (error) {
      console.error('Error adding question:', error)
    }
  }

  const addAnswer = () => {
    setAnswers([...answers, { text: '', isCorrect: false }])
  }

  const removeAnswer = (index: number) => {
    setAnswers(answers.filter((_, i) => i !== index))
  }

  const updateAnswer = (index: number, field: 'text' | 'isCorrect', value: string | boolean) => {
    const newAnswers = [...answers]
    newAnswers[index] = { ...newAnswers[index], [field]: value }
    setAnswers(newAnswers)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Správa otázek
            </h1>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Zpět na hlavní stránku
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Kategorie
              </h2>
              <button
                onClick={() => setShowCategoryForm(!showCategoryForm)}
                className="w-full mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showCategoryForm ? 'Zrušit' : '+ Přidat kategorii'}
              </button>

              {showCategoryForm && (
                <form onSubmit={handleAddCategory} className="mb-4 space-y-3">
                  <input
                    type="text"
                    placeholder="Název kategorie"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <textarea
                    placeholder="Popis (volitelné)"
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    rows={2}
                  />
                  <div className="flex items-center gap-2">
                    <label className="text-gray-700 dark:text-gray-300">Barva:</label>
                    <input
                      type="color"
                      value={categoryColor}
                      onChange={(e) => setCategoryColor(e.target.value)}
                      className="h-10 w-20"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Uložit kategorii
                  </button>
                </form>
              )}

              <div className="space-y-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-between"
                    style={{ borderLeft: `4px solid ${category.color || '#3B82F6'}` }}
                  >
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {category.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {category._count.questions} otázek
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Otázky
              </h2>
              <button
                onClick={() => setShowQuestionForm(!showQuestionForm)}
                disabled={categories.length === 0}
                className="w-full mb-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
              >
                {showQuestionForm ? 'Zrušit' : '+ Přidat otázku'}
              </button>

              {categories.length === 0 && (
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Nejprve vytvořte alespoň jednu kategorii
                </p>
              )}
            </div>
          </div>

          {showQuestionForm && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Nová otázka
              </h3>
              <form onSubmit={handleAddQuestion} className="space-y-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Kategorie
                  </label>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Vyberte kategorii</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Text otázky
                  </label>
                  <textarea
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      Typ otázky
                    </label>
                    <select
                      value={questionType}
                      onChange={(e) => setQuestionType(e.target.value as any)}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="SINGLE_CHOICE">Jedna správná</option>
                      <option value="MULTIPLE_CHOICE">Více správných</option>
                      <option value="TRUE_FALSE">Pravda/Nepravda</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      Obtížnost
                    </label>
                    <select
                      value={questionDifficulty}
                      onChange={(e) => setQuestionDifficulty(e.target.value as any)}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="EASY">Lehká</option>
                      <option value="MEDIUM">Střední</option>
                      <option value="HARD">Těžká</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Vysvětlení (volitelné)
                  </label>
                  <textarea
                    value={questionExplanation}
                    onChange={(e) => setQuestionExplanation(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    rows={2}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-gray-700 dark:text-gray-300">
                      Odpovědi
                    </label>
                    <button
                      type="button"
                      onClick={addAnswer}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      + Přidat odpověď
                    </button>
                  </div>
                  <div className="space-y-2">
                    {answers.map((answer, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Text odpovědi"
                          value={answer.text}
                          onChange={(e) => updateAnswer(index, 'text', e.target.value)}
                          className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <input
                            type="checkbox"
                            checked={answer.isCorrect}
                            onChange={(e) => updateAnswer(index, 'isCorrect', e.target.checked)}
                            className="w-5 h-5"
                          />
                          Správná
                        </label>
                        {answers.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeAnswer(index)}
                            className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Uložit otázku
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
