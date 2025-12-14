'use client'

export function StudentAnimation() {
  return (
    <div className="w-full py-12 overflow-hidden bg-gradient-to-b from-indigo-950 via-blue-950 to-slate-950 rounded-2xl relative">
      {/* Night sky stars */}
      <div className="absolute top-4 left-8 text-2xl animate-twinkle">⭐</div>
      <div className="absolute top-12 right-12 text-xl animate-twinkle" style={{ animationDelay: '0.5s' }}>⭐</div>
      <div className="absolute top-6 right-24 text-3xl animate-twinkle" style={{ animationDelay: '1s' }}>⭐</div>

      {/* Desk lamp */}
      <div className="absolute top-8 right-8">
        <div className="text-5xl animate-lamp-swing">💡</div>
        <div className="absolute top-12 right-0 w-32 h-32 bg-yellow-400 rounded-full opacity-20 blur-2xl"></div>
      </div>

      {/* Books stacked */}
      <div className="absolute bottom-16 left-8 flex flex-col gap-1">
        <div className="w-24 h-4 bg-red-700 rounded"></div>
        <div className="w-24 h-4 bg-blue-700 rounded"></div>
        <div className="w-24 h-4 bg-green-700 rounded"></div>
      </div>

      {/* Studying dog */}
      <div className="relative z-10 mx-auto" style={{ width: '200px' }}>
        <div className="text-center">
          <div className="text-6xl mb-2 animate-tired">🐕</div>
          <div className="text-4xl">📚</div>
          <div className="text-3xl mt-2 animate-coffee-sip">☕</div>
        </div>
      </div>

      {/* Success message */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center">
        <div className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
          Studijní Guru! 📚
        </div>
        <div className="text-lg text-white/90 drop-shadow-md">
          NOZ pod polštářem!
        </div>
      </div>

      <style jsx>{`
        @keyframes tired {
          0%, 100% {
            transform: translateY(0) rotate(-2deg);
          }
          50% {
            transform: translateY(-5px) rotate(2deg);
          }
        }

        @keyframes coffee-sip {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          90% {
            transform: translateY(-10px);
          }
        }

        @keyframes lamp-swing {
          0%, 100% {
            transform: rotate(-5deg);
          }
          50% {
            transform: rotate(5deg);
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }

        .animate-tired {
          animation: tired 3s ease-in-out infinite;
        }

        .animate-coffee-sip {
          animation: coffee-sip 4s ease-in-out infinite;
        }

        .animate-lamp-swing {
          animation: lamp-swing 2s ease-in-out infinite;
        }

        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-tired,
          .animate-coffee-sip,
          .animate-lamp-swing,
          .animate-twinkle {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
