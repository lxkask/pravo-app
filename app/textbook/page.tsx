import Link from 'next/link'
import { mockChapters } from '@/lib/mock-textbook-data'
import { BookOpen, Home, CheckCircle, ArrowRight, Clock, BookMarked } from 'lucide-react'

export default function TextbookPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  Moderní Učebnice
                </h1>
                <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-400">
                  Zpracováno ze šesti studijních materiálů
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
        {/* Intro card */}
        <div className="mb-12 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border-2 border-blue-200/50 dark:border-blue-800/50 rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <BookMarked className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Jak používat učebnici?
          </h2>
          <div className="grid md:grid-cols-3 gap-4 text-slate-700 dark:text-slate-300">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white mb-1">Čti plynule</p>
                <p className="text-sm">Každá lekce 15-30 minut souvislého čtení</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white mb-1">Skoč na téma</p>
                <p className="text-sm">Přímý přístup k tomu, co potřebuješ</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white mb-1">Mobile-friendly</p>
                <p className="text-sm">Optimalizováno pro všechna zařízení</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chapters grid */}
        <div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Kapitoly
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Vyberte si kapitolu a začněte studovat
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockChapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/textbook/chapter/${chapter.slug}`}
                className="group"
              >
                <article className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-6 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-200 h-full transform hover:-translate-y-2">
                  {/* Gradient decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />

                  <div className="relative">
                    {/* Chapter number badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                        {chapter.order}
                      </div>
                      <div className="flex items-center gap-2 text-sm px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-xl font-semibold">
                        <Clock className="w-4 h-4" />
                        {chapter.lessonsCount} {chapter.lessonsCount === 1 ? 'lekce' : chapter.lessonsCount < 5 ? 'lekce' : 'lekcí'}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                      {chapter.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                      {chapter.description}
                    </p>

                    {/* Read more link */}
                    <div className="flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-semibold group-hover:gap-2 transition-all">
                      Zobrazit lekce
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>

        {/* Coming soon placeholder */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl px-8 py-6 border-2 border-yellow-200 dark:border-yellow-800 shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-3xl">🚧</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                Proof of Concept
              </p>
            </div>
            <p className="text-slate-600 dark:text-slate-400 max-w-md">
              Zatím jsou k dispozici pouze ukázkové kapitoly. Další obsah bude doplněn po AI extrakci ze zdrojových dokumentů.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
