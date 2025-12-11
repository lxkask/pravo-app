import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { BookOpen, Home, ArrowRight, MessageSquare } from 'lucide-react'

export const dynamic = 'force-dynamic'

// Helper function to strip markdown syntax for preview
function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic
    .replace(/>\s/g, '') // Remove blockquotes
    .replace(/^[-*]\s/gm, '') // Remove list markers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
    .replace(/`([^`]+)`/g, '$1') // Remove inline code
    .trim()
}

export default async function ExamQuestionsPage() {
  const questions = await prisma.examQuestion.findMany({
    orderBy: { order: 'asc' },
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  Otázky ke zkoušce
                </h1>
                <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-400">
                  40 otázek k ústní zkoušce
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <Home className="w-4 h-4" />
              Domů
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Mode selection cards */}
        <div className="mb-12 grid md:grid-cols-2 gap-6">
          {/* Practice mode */}
          <Link
            href="/exam-questions/practice"
            className="group relative overflow-hidden bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl p-8 hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-500 rounded-xl shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Procvičování
                </h3>
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                Procházej otázkami postupně nebo náhodně, tvůj progres se automaticky ukládá
              </p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-green-600 dark:text-green-400" />
                  Sekvenční nebo náhodné pořadí
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-green-600 dark:text-green-400" />
                  Ukládání progressu
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-green-600 dark:text-green-400" />
                  Bez časového limitu
                </li>
              </ul>
            </div>
            <div className="absolute top-4 right-4 text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
              <ArrowRight className="w-6 h-6" />
            </div>
          </Link>

          {/* Test mode */}
          <Link
            href="/exam-questions/test"
            className="group relative overflow-hidden bg-gradient-to-br from-orange-500/10 to-red-500/10 dark:from-orange-900/20 dark:to-red-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-2xl p-8 hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Zkouškový test
                </h3>
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                Otestuj se v reálných podmínkách zkoušky s časovým limitem
              </p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  25 náhodných otázek
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  Časový limit 25 minut
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  Simulace zkoušky
                </li>
              </ul>
            </div>
            <div className="absolute top-4 right-4 text-orange-600 dark:text-orange-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
              <ArrowRight className="w-6 h-6" />
            </div>
          </Link>
        </div>

        {/* Intro card */}
        <div className="mb-12 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border-2 border-blue-200/50 dark:border-blue-800/50 rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Jak používat otázky?
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-slate-700 dark:text-slate-300">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white mb-1">📝 Krátká odpověď</p>
              <p className="text-sm">Základní věci, které musíš umět říct k otázce</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white mb-1">📚 Dlouhá odpověď</p>
              <p className="text-sm">Detailní rozpracování pro hloubkové pochopení tématu</p>
            </div>
          </div>
        </div>

        {/* Questions list */}
        <div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Všechny otázky ({questions.length})
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Klikni na otázku pro zobrazení odpovědi
            </p>
          </div>

          <div className="grid gap-4">
            {questions.map((question) => (
              <Link
                key={question.id}
                href={`/exam-questions/${question.order}`}
                className="group"
              >
                <article className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border-2 border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-200 transform hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    {/* Number badge */}
                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                      {question.order}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                        {question.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
                        {stripMarkdown(question.shortAnswer).substring(0, 150)}...
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="flex-shrink-0 text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
