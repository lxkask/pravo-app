import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { BookOpen, ArrowRight, Target, BookMarked, TrendingUp, Award, Calendar } from 'lucide-react'
import { StudyStreak } from '@/components/study-streak'
import { FadeIn } from '@/components/fade-in'

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

  // Get total counts for stats
  const [midtermCount, examCount] = await Promise.all([
    prisma.quizQuestion.count(),
    prisma.examQuestion.count(),
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-7xl">

        {/* Hero Section - Compact & Focused */}
        <header className="text-center mb-12 md:mb-20">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-full border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Study Hub</span>
            </div>
            <StudyStreak />
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
            Příprava na
            <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Zkoušku z Práva
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Interaktivní kvízy, zkouškové otázky a studijní materiály na jednom místě
          </p>
        </header>

        {/* Quick Stats Dashboard */}
        <FadeIn delay={0.2}>
          <div className="max-w-4xl mx-auto mb-12 md:mb-16">
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              {/* Stat 1 */}
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{midtermCount}</div>
                <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Testových otázek</div>
              </div>

              {/* Stat 2 */}
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <BookMarked className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{examCount}</div>
                <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Zkouškových otázek</div>
              </div>

              {/* Stat 3 */}
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Award className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{categories.length}</div>
                <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Kategorií kvízů</div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Main Study Cards - 3 Column Grid */}
        <FadeIn delay={0.3}>
          <div className="max-w-6xl mx-auto mb-12 md:mb-20">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6 md:mb-8 text-center">
              Začni studovat
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1: Midterm Quiz */}
            <Link href="/midterm-quiz" className="group">
              <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 min-h-[280px] flex flex-col">
                {/* Decorative blob */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />

                <div className="relative flex-1 flex flex-col">
                  <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Target className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-black text-white mb-2">
                    Průběžný test
                  </h3>
                  <p className="text-indigo-100 text-sm mb-4 flex-1">
                    {midtermCount} otázek • Časovaný režim • Progress tracking
                  </p>

                  <div className="flex items-center text-white font-semibold group-hover:gap-2 transition-all">
                    Začít testovat
                    <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Card 2: Exam Questions */}
            <Link href="/exam-questions" className="group">
              <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 min-h-[280px] flex flex-col">
                {/* Decorative blob */}
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16 group-hover:scale-150 transition-transform duration-500" />

                <div className="relative flex-1 flex flex-col">
                  <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <BookMarked className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-black text-white mb-2">
                    Otázky ke zkoušce
                  </h3>
                  <p className="text-purple-100 text-sm mb-4 flex-1">
                    {examCount} otázek • Krátké i dlouhé odpovědi • Offline režim
                  </p>

                  <div className="flex items-center text-white font-semibold group-hover:gap-2 transition-all">
                    Zobrazit otázky
                    <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Card 3: Category Quizzes */}
            <Link href="#categories" className="group">
              <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 min-h-[280px] flex flex-col">
                {/* Decorative blob */}
                <div className="absolute top-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />

                <div className="relative flex-1 flex flex-col">
                  <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-black text-white mb-2">
                    Kvízy podle témat
                  </h3>
                  <p className="text-blue-100 text-sm mb-4 flex-1">
                    {categories.length} kategorií • Zaměřené procvičování • Adaptivní učení
                  </p>

                  <div className="flex items-center text-white font-semibold group-hover:gap-2 transition-all">
                    Procházet kategorie
                    <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
            </div>
          </div>
        </FadeIn>

        {/* Category Quizzes Section */}
        {categories.length > 0 && (
          <FadeIn delay={0.4}>
            <div className="max-w-5xl mx-auto" id="categories">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  Kvízy podle kategorií
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Procvičuj konkrétní oblasti právní nauky
                </p>
              </div>

            <div className="grid gap-6 md:grid-cols-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/quiz/${category.id}`}
                  className="group"
                >
                  <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-slate-200/50 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-500">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className="w-3 h-12 rounded-full flex-shrink-0"
                          style={{ backgroundColor: category.color || '#6366f1' }}
                        />
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {category.name}
                        </h3>
                      </div>
                      <span className="text-xs md:text-sm px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-lg font-bold whitespace-nowrap ml-2">
                        {category._count.questions} otázek
                      </span>
                    </div>
                    {category.description && (
                      <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        {category.description}
                      </p>
                    )}
                    <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-semibold text-sm group-hover:gap-2 transition-all">
                      Začít kvíz
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            </div>
          </FadeIn>
        )}

        {/* Footer */}
        <footer className="mt-16 md:mt-24 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md rounded-full border border-slate-200/50 dark:border-slate-700/50">
            <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Moderní příprava na zkoušku z Práva
            </span>
          </div>
        </footer>
      </div>
    </div>
  )
}
