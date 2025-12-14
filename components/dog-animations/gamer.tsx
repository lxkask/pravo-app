'use client'

export function GamerAnimation() {
  return (
    <div className="w-full py-12 overflow-hidden bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 rounded-2xl relative">
      {/* RGB lights */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 animate-rgb-scroll"></div>
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-green-500 to-red-500 animate-rgb-scroll"></div>

      {/* Monitor/Screen glow */}
      <div className="absolute inset-0 bg-blue-500 opacity-10 animate-pulse"></div>

      {/* PC setup */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <div className="w-48 h-32 bg-slate-800 rounded-lg border-4 border-slate-600 relative">
          <div className="absolute inset-2 bg-gradient-to-br from-blue-400 to-purple-600 opacity-50"></div>
        </div>
      </div>

      {/* Gamer dog */}
      <div className="relative z-10 mx-auto mt-8" style={{ width: '200px' }}>
        <div className="text-center">
          <div className="text-6xl mb-2 animate-gaming">🐕</div>
          <div className="text-3xl">🎮</div>
        </div>
      </div>


      <style jsx>{`
        @keyframes rgb-scroll {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }

        @keyframes gaming {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-rgb-scroll {
          background-size: 200% 200%;
          animation: rgb-scroll 3s linear infinite;
        }

        .animate-gaming {
          animation: gaming 0.2s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-rgb-scroll,
          .animate-gaming {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
