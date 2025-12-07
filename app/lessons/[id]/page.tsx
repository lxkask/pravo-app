'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

interface Section {
  id: string
  title: string | null
  content: string
  type: string
  order: number
  legalReference: string | null
  importance: string
}

interface Topic {
  id: string
  title: string
  order: number
  sections: Section[]
}

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
  topics: Topic[]
}

export default function LessonDetailPage() {
  const params = useParams()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (params.id) {
      fetchLesson(params.id as string)
    }
  }, [params.id])

  async function fetchLesson(id: string) {
    try {
      const res = await fetch(`/api/lessons/${id}`)
      const data = await res.json()
      setLesson(data)
      // Expand first topic by default
      if (data.topics.length > 0) {
        setExpandedTopics(new Set([data.topics[0].id]))
      }
    } catch (error) {
      console.error('Error fetching lesson:', error)
    } finally {
      setLoading(false)
    }
  }

  function toggleTopic(topicId: string) {
    setExpandedTopics(prev => {
      const newSet = new Set(prev)
      if (newSet.has(topicId)) {
        newSet.delete(topicId)
      } else {
        newSet.add(topicId)
      }
      return newSet
    })
  }

  function getSectionIcon(type: string) {
    switch (type) {
      case 'DEFINITION': return '📖'
      case 'LAW_QUOTE': return '⚖️'
      case 'EXAMPLE': return '💡'
      case 'CASE_STUDY': return '📋'
      case 'IMPORTANT': return '⚠️'
      default: return '📝'
    }
  }

  function getSectionColor(type: string) {
    switch (type) {
      case 'DEFINITION': return 'bg-blue-50 border-blue-200'
      case 'LAW_QUOTE': return 'bg-purple-50 border-purple-200'
      case 'EXAMPLE': return 'bg-green-50 border-green-200'
      case 'CASE_STUDY': return 'bg-orange-50 border-orange-200'
      case 'IMPORTANT': return 'bg-red-50 border-red-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  function getImportanceBadge(importance: string) {
    switch (importance) {
      case 'CRITICAL': return { text: 'Kritické', color: 'bg-red-100 text-red-800' }
      case 'HIGH': return { text: 'Vysoká', color: 'bg-orange-100 text-orange-800' }
      case 'MEDIUM': return { text: 'Střední', color: 'bg-yellow-100 text-yellow-800' }
      case 'LOW': return { text: 'Nízká', color: 'bg-green-100 text-green-800' }
      default: return { text: importance, color: 'bg-gray-100 text-gray-800' }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Načítám lekci...</p>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Lekce nenalezena</p>
          <Link href="/lessons" className="text-indigo-600 hover:underline">
            ← Zpět na lekce
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/lessons"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4"
          >
            ← Zpět na seznam lekcí
          </Link>

          {/* Category Badge */}
          <div className="mb-3">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold"
              style={{
                backgroundColor: lesson.category.color + '20',
                color: lesson.category.color
              }}
            >
              {lesson.category.name}
            </span>
            {lesson.verified && (
              <span className="ml-3 text-green-600 text-sm">✓ Ověřeno</span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {lesson.order}. {lesson.title}
          </h1>

          {/* Description */}
          {lesson.description && (
            <p className="text-lg text-gray-600">
              {lesson.description}
            </p>
          )}

          {/* Stats */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {lesson.topics.length} {lesson.topics.length === 1 ? 'téma' : 'témata'}
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              {lesson.topics.reduce((sum, t) => sum + t.sections.length, 0)} sekcí
            </div>
          </div>
        </div>

        {/* Topics */}
        <div className="space-y-4">
          {lesson.topics.map((topic) => {
            const isExpanded = expandedTopics.has(topic.id)
            return (
              <div key={topic.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Topic Header */}
                <button
                  onClick={() => toggleTopic(topic.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{isExpanded ? '📂' : '📁'}</span>
                    <h2 className="text-xl font-bold text-gray-900">
                      {topic.title}
                    </h2>
                    <span className="ml-3 text-sm text-gray-500">
                      ({topic.sections.length} {topic.sections.length === 1 ? 'sekce' : 'sekcí'})
                    </span>
                  </div>
                  <svg
                    className={`w-6 h-6 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Sections */}
                {isExpanded && (
                  <div className="px-6 pb-6 space-y-4">
                    {topic.sections.map((section) => {
                      const importance = getImportanceBadge(section.importance)
                      return (
                        <div
                          key={section.id}
                          className={`p-5 rounded-lg border-2 ${getSectionColor(section.type)}`}
                        >
                          {/* Section Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-2xl">{getSectionIcon(section.type)}</span>
                              {section.title && (
                                <h3 className="font-semibold text-gray-900">{section.title}</h3>
                              )}
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${importance.color}`}>
                              {importance.text}
                            </span>
                          </div>

                          {/* Section Content */}
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown>{section.content}</ReactMarkdown>
                          </div>

                          {/* Legal Reference */}
                          {section.legalReference && (
                            <div className="mt-3 pt-3 border-t border-gray-300">
                              <p className="text-sm text-gray-600">
                                <span className="font-semibold">Právní odkaz:</span> {section.legalReference}
                              </p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom Navigation */}
        <div className="mt-8 text-center">
          <Link
            href="/lessons"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            ← Zpět na seznam lekcí
          </Link>
        </div>
      </div>
    </div>
  )
}
