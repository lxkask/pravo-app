'use client'

export function DogCarAnimation() {
  return (
    <div className="w-full py-12 overflow-hidden bg-gradient-to-b from-sky-100 to-sky-200 dark:from-sky-950 dark:to-slate-900 rounded-2xl relative">
      {/* Road */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-slate-700 dark:bg-slate-800"></div>

      {/* Road markings */}
      <div className="absolute bottom-12 left-0 right-0 flex gap-16 animate-road-markings">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="w-12 h-2 bg-yellow-300 dark:bg-yellow-500 rounded-full"></div>
        ))}
      </div>

      {/* Car with dog */}
      <div className="relative z-10 animate-car-drive mx-auto" style={{ width: '200px' }}>
        {/* Car body */}
        <div className="relative">
          {/* Main car body */}
          <div className="relative">
            <div className="w-48 h-24 bg-red-500 dark:bg-red-600 rounded-2xl relative">
              {/* Car windows */}
              <div className="absolute top-2 left-8 w-16 h-12 bg-sky-300 dark:bg-sky-800 rounded-lg"></div>
              <div className="absolute top-2 right-8 w-16 h-12 bg-sky-300 dark:bg-sky-800 rounded-lg"></div>

              {/* Dog in window */}
              <div className="absolute top-4 left-10 text-3xl animate-dog-bounce">
                🐕
              </div>

              {/* Dog tongue wagging */}
              <div className="absolute top-7 left-16 text-xl animate-tongue-wag">
                👅
              </div>
            </div>
          </div>

          {/* Wheels */}
          <div className="absolute -bottom-4 left-6 w-12 h-12 bg-slate-900 dark:bg-slate-950 rounded-full animate-wheel-spin border-4 border-slate-700">
            <div className="absolute inset-2 bg-slate-400 rounded-full"></div>
          </div>
          <div className="absolute -bottom-4 right-6 w-12 h-12 bg-slate-900 dark:bg-slate-950 rounded-full animate-wheel-spin border-4 border-slate-700">
            <div className="absolute inset-2 bg-slate-400 rounded-full"></div>
          </div>
        </div>

        {/* Speed lines */}
        <div className="absolute -left-20 top-8 flex gap-2 animate-speed-lines opacity-70">
          <div className="w-8 h-0.5 bg-slate-400 dark:bg-slate-500"></div>
          <div className="w-6 h-0.5 bg-slate-400 dark:bg-slate-500"></div>
          <div className="w-4 h-0.5 bg-slate-400 dark:bg-slate-500"></div>
        </div>
      </div>

      {/* Success message */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center">
        <div className="text-4xl font-bold text-slate-800 dark:text-white mb-2 animate-bounce-subtle">
          Skvělá práce! 🎉
        </div>
        <div className="text-lg text-slate-600 dark:text-slate-300">
          Máš to za sebou!
        </div>
      </div>

      <style jsx>{`
        @keyframes car-drive {
          0% {
            transform: translateX(-150%);
          }
          100% {
            transform: translateX(calc(100vw + 150%));
          }
        }

        @keyframes wheel-spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes dog-bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes tongue-wag {
          0%, 100% {
            transform: rotate(-5deg);
          }
          50% {
            transform: rotate(5deg);
          }
        }

        @keyframes speed-lines {
          0% {
            opacity: 0.7;
            transform: translateX(0);
          }
          100% {
            opacity: 0;
            transform: translateX(-40px);
          }
        }

        @keyframes road-markings {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100px);
          }
        }

        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-car-drive {
          animation: car-drive 4s ease-in-out infinite;
        }

        .animate-wheel-spin {
          animation: wheel-spin 0.5s linear infinite;
        }

        .animate-dog-bounce {
          animation: dog-bounce 0.6s ease-in-out infinite;
        }

        .animate-tongue-wag {
          animation: tongue-wag 0.3s ease-in-out infinite;
        }

        .animate-speed-lines {
          animation: speed-lines 0.8s ease-out infinite;
        }

        .animate-road-markings {
          animation: road-markings 2s linear infinite;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-car-drive,
          .animate-wheel-spin,
          .animate-dog-bounce,
          .animate-tongue-wag,
          .animate-speed-lines,
          .animate-road-markings,
          .animate-bounce-subtle {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}
