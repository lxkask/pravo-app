'use client'

export function PartyAnimalAnimation() {
  return (
    <div className="w-full py-12 overflow-hidden bg-gradient-to-b from-purple-600 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 rounded-2xl relative">
      {/* Disco floor */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-r from-purple-800 to-pink-800 opacity-80"></div>

      {/* Disco lights */}
      <div className="absolute inset-0 animate-disco-lights">
        <div className="absolute top-4 left-4 w-16 h-16 bg-yellow-400 rounded-full opacity-60 blur-xl animate-pulse"></div>
        <div className="absolute top-8 right-8 w-20 h-20 bg-blue-400 rounded-full opacity-60 blur-xl animate-pulse" style={{ animationDelay: '0.3s' }}></div>
        <div className="absolute bottom-12 left-12 w-12 h-12 bg-green-400 rounded-full opacity-60 blur-xl animate-pulse" style={{ animationDelay: '0.6s' }}></div>
      </div>

      {/* Party dog */}
      <div className="relative z-10 mx-auto" style={{ width: '200px' }}>
        <div className="text-center animate-dance">
          <div className="text-7xl mb-2">🐕</div>
          <div className="text-4xl animate-beer-sway">🍺</div>
        </div>
      </div>

      {/* Success message */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center">
        <div className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
          Párty Šampion! 🎉
        </div>
        <div className="text-lg text-white/90 drop-shadow-md">
          Pivko v tlapě, zábava zaručena!
        </div>
      </div>

      <style jsx>{`
        @keyframes dance {
          0%, 100% {
            transform: translateY(0) rotate(-5deg);
          }
          25% {
            transform: translateY(-20px) rotate(5deg);
          }
          50% {
            transform: translateY(0) rotate(-5deg);
          }
          75% {
            transform: translateY(-10px) rotate(5deg);
          }
        }

        @keyframes beer-sway {
          0%, 100% {
            transform: rotate(-15deg);
          }
          50% {
            transform: rotate(15deg);
          }
        }

        @keyframes disco-lights {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }

        .animate-dance {
          animation: dance 1s ease-in-out infinite;
        }

        .animate-beer-sway {
          animation: beer-sway 0.8s ease-in-out infinite;
        }

        .animate-disco-lights {
          animation: disco-lights 2s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-dance,
          .animate-beer-sway,
          .animate-disco-lights {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
