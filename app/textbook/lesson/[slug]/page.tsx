import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { mockLessons, getMockLessonById } from '@/lib/mock-textbook-data'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function LessonPage({ params }: PageProps) {
  const { slug } = await params

  // Find lesson by slug
  const lesson = mockLessons.find(l => l.slug === slug)

  if (!lesson) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f1419]">
      {/* Sticky header */}
      <header className="sticky top-0 z-10 bg-white/95 dark:bg-[#0f1419]/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center justify-between">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm flex-1 min-w-0">
              <Link
                href="/textbook"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors truncate"
              >
                Učebnice
              </Link>
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <Link
                href={`/textbook/chapter/${lesson.chapterId}`}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors truncate"
              >
                {lesson.chapterTitle}
              </Link>
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-900 dark:text-white font-medium truncate hidden sm:block">
                Lekce {lesson.order}
              </span>
            </div>

            {/* Reading time badge */}
            <div className="ml-4 flex items-center text-xs text-gray-600 dark:text-gray-400 flex-shrink-0">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="hidden sm:inline">{lesson.estimatedReadingTime} min</span>
              <span className="sm:hidden">{lesson.estimatedReadingTime}'</span>
            </div>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="py-8 sm:py-12">
          {/* Lesson header */}
          <header className="mb-8 sm:mb-12">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <span>Lekce {lesson.order}</span>
              <span>•</span>
              <span>{lesson.chapterTitle}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {lesson.title}
            </h1>

            {lesson.description && (
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                {lesson.description}
              </p>
            )}

            {/* Status badge */}
            <div className="mt-6 flex items-center space-x-3">
              {!lesson.verified && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Proof of Concept
                </span>
              )}
              {lesson.verified && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-300 dark:border-green-700">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Ověřeno
                </span>
              )}
            </div>
          </header>

          {/* Lesson content - Markdown with custom styling */}
          <div className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:font-semibold
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-gray-900 dark:prose-h2:text-white
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-gray-900 dark:prose-h3:text-white
            prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
            prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r
            prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
            prose-table:border-collapse prose-table:w-full
            prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-semibold prose-th:text-gray-900 dark:prose-th:text-white prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-700
            prose-td:px-4 prose-td:py-3 prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-700 prose-td:text-gray-700 dark:prose-td:text-gray-300
            prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
            prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
            prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:my-2
          ">
            <ReactMarkdown
              components={{
                // Custom heading renderer to add anchor links
                h2: ({ children, ...props }) => (
                  <h2 id={String(children).toLowerCase().replace(/\s+/g, '-')} {...props}>
                    {children}
                  </h2>
                ),
                h3: ({ children, ...props }) => (
                  <h3 id={String(children).toLowerCase().replace(/\s+/g, '-')} {...props}>
                    {children}
                  </h3>
                ),
              }}
            >
              {lesson.content}
            </ReactMarkdown>
          </div>

          {/* Source tracking info */}
          <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="font-medium text-gray-900 dark:text-white mb-1">
                  Důvěryhodnost obsahu
                </p>
                <p>
                  Tento obsah je zpracován ze zdrojových studijních materiálů s důrazem na přesnost.
                  Každý odstavec má vazbu na původní zdroj (zatím v proof of concept verzi).
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Navigation - Next/Previous lessons */}
        <nav className="border-t border-gray-200 dark:border-gray-800 py-8 mb-12">
          <div className="flex items-center justify-between">
            <Link
              href={`/textbook/chapter/${lesson.chapterId}`}
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">Zpět na kapitolu</span>
              <span className="sm:hidden">Zpět</span>
            </Link>

            {/* Placeholder for next lesson - will be implemented with real data */}
            <div className="text-sm text-gray-500 dark:text-gray-500">
              Konec lekce
            </div>
          </div>
        </nav>
      </main>
    </div>
  )
}

// Generate static params for all lessons
export async function generateStaticParams() {
  return mockLessons.map((lesson) => ({
    slug: lesson.slug,
  }))
}
