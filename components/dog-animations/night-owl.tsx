'use client'

export function NightOwlAnimation() {
  return (
    <div className="w-full py-12 overflow-hidden bg-gradient-to-b from-indigo-950 via-purple-950 to-pink-950 rounded-2xl relative">
      {/* Strobe lights */}
      <div className="absolute inset-0 animate-strobe opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-pink-500"></div>
      </div>
      <div className="absolute inset-0 animate-strobe-2 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-blue-500"></div>
      </div>

      {/* Moon */}
      <div className="absolute top-4 right-8 text-5xl">🌙</div>

      {/* Club floor */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-r from-purple-900 to-pink-900 opacity-80"></div>

      {/* Dancing dog */}
      <div className="relative z-10 mx-auto" style={{ width: '200px' }}>
        <div className="text-center animate-club-dance">
          <div className="text-7xl mb-2">🐕</div>
          <div className="text-3xl">🕺</div>
        </div>
      </div>


      <style jsx>{`
        @keyframes strobe {
          0%, 49%, 51%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
        }

        @keyframes strobe-2 {
          0%, 74%, 76%, 100% {
            opacity: 0;
          }
          75% {
            opacity: 0.3;
          }
        }

        @keyframes club-dance {
          0% {
            transform: translateX(-10px) rotate(-10deg);
          }
          25% {
            transform: translateX(10px) rotate(10deg);
          }
          50% {
            transform: translateX(-5px) rotate(-5deg);
          }
          75% {
            transform: translateX(5px) rotate(5deg);
          }
          100% {
            transform: translateX(-10px) rotate(-10deg);
          }
        }

        .animate-strobe {
          animation: strobe 0.5s linear infinite;
        }

        .animate-strobe-2 {
          animation: strobe-2 0.7s linear infinite;
        }

        .animate-club-dance {
          animation: club-dance 0.6s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-strobe,
          .animate-strobe-2,
          .animate-club-dance {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
