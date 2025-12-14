'use client'

export function CoffeeAddictAnimation() {
  return (
    <div className="w-full py-12 overflow-hidden bg-gradient-to-b from-amber-700 via-yellow-700 to-orange-800 dark:from-amber-900 dark:via-yellow-900 dark:to-orange-950 rounded-2xl relative">
      {/* Coffee shop vibes */}
      <div className="absolute inset-0 bg-brown-900 opacity-20"></div>

      {/* Steam effects */}
      <div className="absolute top-4 left-12 text-3xl animate-steam-1">💨</div>
      <div className="absolute top-8 right-16 text-2xl animate-steam-2">💨</div>
      <div className="absolute top-6 left-1/2 text-4xl animate-steam-3">💨</div>

      {/* Coffee cups stacked */}
      <div className="absolute bottom-12 right-8 flex flex-col-reverse gap-1 items-center">
        <div className="text-5xl animate-cup-shake">☕</div>
        <div className="text-4xl animate-cup-shake" style={{ animationDelay: '0.1s' }}>☕</div>
        <div className="text-3xl animate-cup-shake" style={{ animationDelay: '0.2s' }}>☕</div>
      </div>

      {/* Hyperactive dog */}
      <div className="relative z-10 mx-auto" style={{ width: '200px' }}>
        <div className="text-center">
          <div className="text-7xl mb-2 animate-caffeine-jitters">🐕</div>
          <div className="text-4xl animate-coffee-hold">☕</div>
        </div>
      </div>

      {/* Success message */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center">
        <div className="text-3xl font-bold text-white mb-2 drop-shadow-lg animate-jittery-text">
          ⭐ Kofeinový Démon! ☕
        </div>
        <div className="text-lg text-white/90 drop-shadow-md">
          Třetí espresso?
        </div>
      </div>

      <style jsx>{`
        @keyframes caffeine-jitters {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          10% {
            transform: translate(-2px, -2px) rotate(-1deg);
          }
          20% {
            transform: translate(2px, 1px) rotate(1deg);
          }
          30% {
            transform: translate(-1px, 2px) rotate(0deg);
          }
          40% {
            transform: translate(1px, -1px) rotate(1deg);
          }
          50% {
            transform: translate(-2px, 2px) rotate(-1deg);
          }
          60% {
            transform: translate(2px, -2px) rotate(0deg);
          }
          70% {
            transform: translate(-1px, 1px) rotate(1deg);
          }
          80% {
            transform: translate(1px, 2px) rotate(-1deg);
          }
          90% {
            transform: translate(-2px, -1px) rotate(1deg);
          }
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
        }

        @keyframes coffee-hold {
          0%, 100% {
            transform: rotate(-10deg) translateY(0);
          }
          50% {
            transform: rotate(10deg) translateY(-5px);
          }
        }

        @keyframes steam-1 {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.7;
          }
          100% {
            transform: translateY(-50px) scale(1.5);
            opacity: 0;
          }
        }

        @keyframes steam-2 {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.6;
          }
          100% {
            transform: translateY(-60px) scale(1.3);
            opacity: 0;
          }
        }

        @keyframes steam-3 {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-70px) scale(1.7);
            opacity: 0;
          }
        }

        @keyframes cup-shake {
          0%, 100% {
            transform: rotate(-2deg);
          }
          50% {
            transform: rotate(2deg);
          }
        }

        @keyframes jittery-text {
          0%, 100% {
            transform: translate(-50%, 0);
          }
          25% {
            transform: translate(-51%, -1px);
          }
          75% {
            transform: translate(-49%, 1px);
          }
        }

        .animate-caffeine-jitters {
          animation: caffeine-jitters 0.3s infinite;
        }

        .animate-coffee-hold {
          animation: coffee-hold 0.4s ease-in-out infinite;
        }

        .animate-steam-1 {
          animation: steam-1 2s ease-out infinite;
        }

        .animate-steam-2 {
          animation: steam-2 2.5s ease-out infinite;
        }

        .animate-steam-3 {
          animation: steam-3 2.2s ease-out infinite;
        }

        .animate-cup-shake {
          animation: cup-shake 0.5s ease-in-out infinite;
        }

        .animate-jittery-text {
          animation: jittery-text 0.2s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-caffeine-jitters,
          .animate-coffee-hold,
          .animate-steam-1,
          .animate-steam-2,
          .animate-steam-3,
          .animate-cup-shake,
          .animate-jittery-text {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
