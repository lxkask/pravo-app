import Link from 'next/link'
import { notFound } from 'next/navigation'
import { mockChapters, getMockLessonsByChapterId, getMockChapterById } from '@/lib/mock-textbook-data'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ChapterPage({ params }: PageProps) {
  const { slug } = await params

  // Find chapter by slug
  const chapter = mockChapters.find(ch => ch.slug === slug)

  if (!chapter) {
    notFound()
  }

  const lessons = getMockLessonsByChapterId(chapter.id)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm mb-4">
            <Link
              href="/textbook"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Učebnice
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 dark:text-white font-medium">
              {chapter.title}
            </span>
          </nav>

          {/* Chapter header */}
          <div className="flex items-start">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 font-bold text-lg mr-4 flex-shrink-0">
              {chapter.order}
            </span>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {chapter.title}
              </h1>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                {chapter.description}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Lessons list */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Lekce v této kapitole
            </h2>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {lessons.length} {lessons.length === 1 ? 'lekce' : lessons.length < 5 ? 'lekce' : 'lekcí'}
            </span>
          </div>

          {lessons.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                V této kapitole zatím nejsou žádné lekce.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <Link
                  key={lesson.id}
                  href={`/textbook/lesson/${lesson.slug}`}
                  className="group block"
                >
                  <article className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200">
                    <div className="flex items-start">
                      {/* Lesson number */}
                      <div className="flex-shrink-0 mr-4">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold">
                          {lesson.order}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {lesson.title}
                        </h3>

                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                          {lesson.description}
                        </p>

                        {/* Meta info */}
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-500">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {lesson.estimatedReadingTime} min
                          </span>

                          {lesson.verified && (
                            <span className="flex items-center text-green-600 dark:text-green-400">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Ověřeno
                            </span>
                          )}

                          {!lesson.verified && (
                            <span className="flex items-center text-yellow-600 dark:text-yellow-400">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              Proof of concept
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex-shrink-0 ml-4">
                        <svg
                          className="w-6 h-6 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/textbook"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Zpět na seznam kapitol
          </Link>
        </div>
      </main>
    </div>
  )
}

// Generate static params for all chapters
export async function generateStaticParams() {
  return mockChapters.map((chapter) => ({
    slug: chapter.slug,
  }))
}
