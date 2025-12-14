'use client'

export function GymBroAnimation() {
  return (
    <div className="w-full py-12 overflow-hidden bg-gradient-to-b from-red-500 to-orange-600 dark:from-red-900 dark:to-orange-900 rounded-2xl relative">
      {/* Gym floor */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-slate-800 opacity-80"></div>

      {/* Weights */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 animate-lift">
        <div className="w-8 h-8 bg-slate-700 rounded-full"></div>
        <div className="w-32 h-4 bg-slate-600 rounded"></div>
        <div className="w-8 h-8 bg-slate-700 rounded-full"></div>
      </div>

      {/* Gym dog */}
      <div className="relative z-10 mx-auto" style={{ width: '200px' }}>
        <div className="text-center">
          <div className="text-7xl mb-2 animate-flex">🐕</div>
          <div className="text-3xl">💪</div>
        </div>
      </div>


      <style jsx>{`
        @keyframes lift {
          0%, 100% {
            transform: translate(-50%, 0);
          }
          50% {
            transform: translate(-50%, -40px);
          }
        }

        @keyframes flex {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1) rotate(5deg);
          }
        }

        .animate-lift {
          animation: lift 1.5s ease-in-out infinite;
        }

        .animate-flex {
          animation: flex 1.5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-lift,
          .animate-flex {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
