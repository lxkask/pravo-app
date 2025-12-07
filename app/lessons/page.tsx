'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Lesson {
  id: string
  title: string
  description: string | null
  order: number
  verified: boolean
  category: {
    id: string
    name: string
    color: string
  }
  topics: any[]
}

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    fetchLessons()
  }, [selectedCategory])

  async function fetchLessons() {
    try {
      const url = selectedCategory
        ? `/api/lessons?categoryId=${selectedCategory}`
        : '/api/lessons'
      const res = await fetch(url)
      const data = await res.json()
      setLessons(data)
    } catch (error) {
      console.error('Error fetching lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Načítám lekce...</p>
        </div>
      </div>
    )
  }

  const categories = Array.from(new Set(lessons.map(l => l.category.name)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-4"
          >
            ← Zpět na hlavní stránku
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            📚 Studijní materiály
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Procházej lekce extrahované z dokumentů pomocí AI
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === null
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Všechny
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Lessons Grid */}
        {lessons.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">Zatím nejsou žádné lekce k dispozici.</p>
            <p className="text-gray-500 dark:text-gray-500 mt-2">Zkontroluj, zda proběhla extrakce dokumentů.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {lessons.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/lessons/${lesson.id}`}
                className="block bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden group"
              >
                <div className="p-6">
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: lesson.category.color + '20',
                        color: lesson.category.color
                      }}
                    >
                      {lesson.category.name}
                    </span>
                    {lesson.verified && (
                      <span className="text-green-600 text-sm">✓ Ověřeno</span>
                    )}
                  </div>

                  {/* Lesson Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {lesson.order}. {lesson.title}
                  </h3>

                  {/* Description */}
                  {lesson.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {lesson.description}
                    </p>
                  )}

                  {/* Topics Count */}
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {lesson.topics.length} {lesson.topics.length === 1 ? 'téma' : 'témata'}
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900 transition-colors">
                  <span className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                    Zobrazit lekci →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
