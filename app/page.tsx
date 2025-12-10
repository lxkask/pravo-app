import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { BookOpen, ClipboardCheck, Settings, ArrowRight, Target, Clock, BookMarked } from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <header className="text-center mb-16 max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="inline-block p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-6">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
            Příprava na zkoušku<br/>
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              z Práva
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            Připrav se na test a zkoušku s interaktivními kvízy a studijními materiály.<br/>
            Vše na jednom místě. Moderní. Efektivní.
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="#midterm"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <Target className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Začít testovat
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/exam-questions"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-semibold text-lg shadow-lg border-2 border-slate-200 dark:border-slate-700"
            >
              <BookMarked className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Otázky ke zkoušce
            </Link>
          </div>
        </header>

        {/* Průběžný test - Hero Card */}
        <div className="max-w-5xl mx-auto mb-16" id="midterm">
          <Link
            href="/midterm-quiz"
            className="block group"
          >
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-10 hover:shadow-3xl transition-all transform hover:-translate-y-2">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-500" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 group-hover:scale-150 transition-transform duration-500" />

              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl group-hover:scale-110 transition-transform">
                    <Target className="w-14 h-14 text-white" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-white mb-3">
                      🎯 Průběžný test
                    </h2>
                    <p className="text-indigo-100 text-lg mb-2">
                      94 otázek • 4 režimy testování
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-semibold">
                        Procvičování
                      </span>
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-semibold">
                        Časované testy
                      </span>
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-semibold">
                        Skip funkce
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-white/80 group-hover:text-white group-hover:translate-x-2 transition-all">
                  <ArrowRight className="w-16 h-16" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            Proč naše aplikace?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Časované testy
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Realistické podmínky s timerem. Připrav se na skutečný test.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
              <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Procvičování
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Všechny otázky bez limitu. Skipuj, vracej se, učíš se svým tempem.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
              <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <BookMarked className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Studijní materiály
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Učebnice s detailními vysvětleními pro hloubkové studium.
              </p>
            </div>
          </div>
        </div>

        {/* Category Quizzes */}
        <div className="max-w-5xl mx-auto" id="kviz">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Kvízy podle kategorií
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Zaměř se na konkrétní oblast práva
            </p>
          </div>

          {categories.length === 0 ? (
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center border border-slate-200 dark:border-slate-700">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ClipboardCheck className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg">
                Zatím nejsou k dispozici žádné kategorie.
              </p>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors font-semibold"
              >
                <Settings className="w-5 h-5" />
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
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-12 rounded-full"
                          style={{ backgroundColor: category.color || '#6366f1' }}
                        />
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {category.name}
                        </h3>
                      </div>
                      <span className="text-sm px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-xl font-bold">
                        {category._count.questions} otázek
                      </span>
                    </div>
                    {category.description && (
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {category.description}
                      </p>
                    )}
                    <div className="mt-4 flex items-center text-indigo-600 dark:text-indigo-400 font-semibold group-hover:gap-2 transition-all">
                      Začít kvíz
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Admin Link */}
          <div className="mt-12 text-center">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors font-semibold border-2 border-slate-300 dark:border-slate-700"
            >
              <Settings className="w-5 h-5" />
              Správa otázek (Admin)
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center text-slate-500 dark:text-slate-500 text-sm">
          <p>Moderní příprava na zkoušku z Práva</p>
        </footer>
      </div>
    </div>
  )
}
