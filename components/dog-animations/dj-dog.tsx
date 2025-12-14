'use client'

export function DjDogAnimation() {
  return (
    <div className="w-full py-12 overflow-hidden bg-gradient-to-b from-purple-900 via-pink-800 to-blue-900 rounded-2xl relative">
      {/* Laser lights */}
      <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-green-400 to-transparent animate-laser-1"></div>
      <div className="absolute top-0 left-2/4 w-1 h-full bg-gradient-to-b from-blue-400 to-transparent animate-laser-2"></div>
      <div className="absolute top-0 left-3/4 w-1 h-full bg-gradient-to-b from-red-400 to-transparent animate-laser-3"></div>

      {/* Music notes */}
      <div className="absolute top-8 left-8 text-3xl animate-float-note-1">🎵</div>
      <div className="absolute top-16 right-12 text-4xl animate-float-note-2">🎶</div>
      <div className="absolute bottom-20 left-12 text-3xl animate-float-note-3">🎵</div>

      {/* DJ decks */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-56 h-20 bg-slate-900 rounded-lg border-4 border-slate-700">
        <div className="flex gap-4 p-2">
          <div className="flex-1 h-12 bg-slate-800 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 opacity-50 animate-vinyl-spin"></div>
          </div>
          <div className="flex-1 h-12 bg-slate-800 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-50 animate-vinyl-spin" style={{ animationDirection: 'reverse' }}></div>
          </div>
        </div>
      </div>

      {/* DJ dog */}
      <div className="relative z-10 mx-auto mt-8" style={{ width: '200px' }}>
        <div className="text-center">
          <div className="text-6xl mb-2 animate-dj-bounce">🐕</div>
          <div className="text-4xl">🎧</div>
        </div>
      </div>

      {/* Success message */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center">
        <div className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
          DJ Woofmaster! 🎵
        </div>
        <div className="text-lg text-white/90 drop-shadow-md">
          Drop the bass!
        </div>
      </div>

      <style jsx>{`
        @keyframes laser-1 {
          0%, 100% {
            transform: rotate(-10deg);
            opacity: 0.7;
          }
          50% {
            transform: rotate(10deg);
            opacity: 0.3;
          }
        }

        @keyframes laser-2 {
          0%, 100% {
            transform: rotate(5deg);
            opacity: 0.8;
          }
          50% {
            transform: rotate(-5deg);
            opacity: 0.4;
          }
        }

        @keyframes laser-3 {
          0%, 100% {
            transform: rotate(15deg);
            opacity: 0.6;
          }
          50% {
            transform: rotate(-15deg);
            opacity: 0.9;
          }
        }

        @keyframes float-note-1 {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(15deg);
          }
        }

        @keyframes float-note-2 {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(-15deg);
          }
        }

        @keyframes float-note-3 {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(10deg);
          }
        }

        @keyframes dj-bounce {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          25% {
            transform: translateY(-10px) scale(1.05);
          }
          75% {
            transform: translateY(-5px) scale(0.98);
          }
        }

        @keyframes vinyl-spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .animate-laser-1 {
          animation: laser-1 1.5s ease-in-out infinite;
        }

        .animate-laser-2 {
          animation: laser-2 2s ease-in-out infinite;
        }

        .animate-laser-3 {
          animation: laser-3 1.8s ease-in-out infinite;
        }

        .animate-float-note-1 {
          animation: float-note-1 3s ease-in-out infinite;
        }

        .animate-float-note-2 {
          animation: float-note-2 3.5s ease-in-out infinite;
        }

        .animate-float-note-3 {
          animation: float-note-3 2.8s ease-in-out infinite;
        }

        .animate-dj-bounce {
          animation: dj-bounce 0.6s ease-in-out infinite;
        }

        .animate-vinyl-spin {
          animation: vinyl-spin 2s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-laser-1,
          .animate-laser-2,
          .animate-laser-3,
          .animate-float-note-1,
          .animate-float-note-2,
          .animate-float-note-3,
          .animate-dj-bounce,
          .animate-vinyl-spin {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
