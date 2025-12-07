import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function Home() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { questions: true }
      }
    },
    orderBy: {
      name: 'asc'
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Příprava na zkoušku z Práva
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Připrav se na test a zkoušku s interaktivními kvízy a studijními materiály
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/lessons"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Studijní materiály
            </Link>
            <Link
              href="#kviz"
              className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold border-2 border-gray-300 dark:border-gray-600"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Kvízy
            </Link>
          </div>
        </header>

        <div className="max-w-4xl mx-auto" id="kviz">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            Vyber si kategorii kvízu
          </h2>

          {categories.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Zatím nejsou k dispozici žádné kategorie.
              </p>
              <Link
                href="/admin"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Přidat první kategorii
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/quiz/${category.id}`}
                  className="group"
                >
                  <div
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-xl transition-all transform hover:-translate-y-1"
                    style={{
                      borderLeft: `4px solid ${category.color || '#3B82F6'}`
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {category.name}
                      </h3>
                      <span className="text-sm px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                        {category._count.questions} otázek
                      </span>
                    </div>
                    {category.description && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {category.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/admin"
              className="inline-block px-8 py-3 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors"
            >
              Správa otázek (Admin)
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
