'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Home, Clock, Target, AlertCircle } from 'lucide-react'

export default function TestModePage() {
  const router = useRouter()

  const handleStartTest = () => {
    router.push('/exam-questions/quiz?mode=test&shuffle=true&limit=25')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-red-950">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Zkouškový test
            </h1>
            <Link
              href="/exam-questions"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >
              <Home className="w-4 h-4" />
              Zpět
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Test info card */}
        <div className="mb-8 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 dark:from-orange-900/20 dark:via-red-900/20 dark:to-pink-900/20 border-2 border-orange-200/50 dark:border-orange-800/50 rounded-2xl p-8 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Simulace zkoušky
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Otestuj se v reálných podmínkách
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <div className="font-bold text-slate-900 dark:text-white">
                  Časový limit
                </div>
              </div>
              <div className="text-2xl font-black text-orange-600 dark:text-orange-400">
                25 minut
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Jako u skutečné zkoušky
              </div>
            </div>

            <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <div className="font-bold text-slate-900 dark:text-white">
                  Počet otázek
                </div>
              </div>
              <div className="text-2xl font-black text-orange-600 dark:text-orange-400">
                25 otázek
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Náhodně vybraných
              </div>
            </div>
          </div>
        </div>

        {/* Rules card */}
        <div className="mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Pravidla testu
          </h3>

          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mt-0.5">
                <div className="w-2 h-2 rounded-full bg-orange-600 dark:bg-orange-400" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  25 náhodných otázek
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Z celkového počtu 40 zkouškových otázek
                </div>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mt-0.5">
                <div className="w-2 h-2 rounded-full bg-orange-600 dark:bg-orange-400" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  Časový limit 25 minut
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Po uplynutí času se test automaticky ukončí
                </div>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mt-0.5">
                <div className="w-2 h-2 rounded-full bg-orange-600 dark:bg-orange-400" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  Žádné ukládání progressu
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Test je simulace - progres se neuloží
                </div>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mt-0.5">
                <div className="w-2 h-2 rounded-full bg-orange-600 dark:bg-orange-400" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  Zobrazení výsledků
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Po dokončení uvidíš své skóre a správné odpovědi
                </div>
              </div>
            </li>
          </ul>
        </div>

        {/* Warning card */}
        <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-slate-700 dark:text-slate-300">
            <strong>Upozornění:</strong> Jakmile zahájíš test, časomíra se spustí
            a nelze ji zastavit. Ujisti se, že máš dostatek času a klid na
            vypracování testu.
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={handleStartTest}
          className="w-full group relative overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-5 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          <div className="flex items-center justify-center gap-3">
            <Target className="w-6 h-6" />
            <span className="text-lg">Zahájit test</span>
          </div>
        </button>

        {/* Info tip */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            💡 <strong>Tip:</strong> Pokud chceš procvičovat bez časového limitu a
            s uložením progressu, použij{' '}
            <Link
              href="/exam-questions/practice"
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              režim procvičování
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  )
}
