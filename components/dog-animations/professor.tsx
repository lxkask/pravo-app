'use client'

export function ProfessorAnimation() {
  return (
    <div className="w-full py-12 overflow-hidden bg-gradient-to-b from-amber-700 via-yellow-800 to-orange-900 dark:from-amber-900 dark:via-yellow-950 dark:to-orange-950 rounded-2xl relative">
      {/* Chalkboard */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-64 h-32 bg-slate-800 rounded-lg border-4 border-amber-900">
        <div className="p-4 text-white text-sm font-mono">
          <div className="animate-write">§ 1 NOZ</div>
          <div className="animate-write" style={{ animationDelay: '0.5s' }}>§ 2 OZ</div>
          <div className="animate-write" style={{ animationDelay: '1s' }}>§ 3 TrZ</div>
        </div>
      </div>

      {/* Podium */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-32 h-24 bg-amber-800 rounded-t-lg border-4 border-amber-900"></div>

      {/* Professor dog */}
      <div className="relative mx-auto mt-32" style={{ width: '200px' }}>
        <div className="text-center">
          <div className="text-7xl mb-2 animate-teach">🐕</div>
          <div className="text-4xl">🎓</div>
          <div className="text-3xl mt-2 animate-point">👉</div>
        </div>
      </div>


      <style jsx>{`
        @keyframes teach {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes point {
          0%, 100% {
            transform: rotate(-20deg);
          }
          50% {
            transform: rotate(20deg);
          }
        }

        @keyframes write {
          0% {
            opacity: 0;
            transform: translateX(-10px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-teach {
          animation: teach 2s ease-in-out infinite;
        }

        .animate-point {
          animation: point 1s ease-in-out infinite;
        }

        .animate-write {
          animation: write 1s ease-out forwards;
          opacity: 0;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-teach,
          .animate-point,
          .animate-write {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
