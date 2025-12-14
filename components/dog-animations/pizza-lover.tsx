'use client'

export function PizzaLoverAnimation() {
  return (
    <div className="w-full py-12 overflow-hidden bg-gradient-to-b from-orange-400 to-red-500 dark:from-orange-800 dark:to-red-900 rounded-2xl relative">
      {/* Pizza slices floating */}
      <div className="absolute top-4 left-8 text-4xl animate-float-1">🍕</div>
      <div className="absolute top-12 right-12 text-3xl animate-float-2">🍕</div>
      <div className="absolute bottom-16 left-16 text-5xl animate-float-3">🍕</div>

      {/* Pizza box */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-32 h-6 bg-brown-600 rounded"></div>

      {/* Dog eating pizza */}
      <div className="relative z-10 mx-auto" style={{ width: '200px' }}>
        <div className="text-center">
          <div className="text-7xl mb-2 animate-nom">🐕</div>
          <div className="text-4xl">🍕</div>
        </div>
      </div>


      <style jsx>{`
        @keyframes float-1 {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes float-2 {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(-180deg);
          }
        }

        @keyframes float-3 {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(90deg);
          }
        }

        @keyframes nom {
          0%, 100% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.05) rotate(-3deg);
          }
          75% {
            transform: scale(1.05) rotate(3deg);
          }
        }

        .animate-float-1 {
          animation: float-1 3s ease-in-out infinite;
        }

        .animate-float-2 {
          animation: float-2 4s ease-in-out infinite;
        }

        .animate-float-3 {
          animation: float-3 3.5s ease-in-out infinite;
        }

        .animate-nom {
          animation: nom 0.6s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-float-1,
          .animate-float-2,
          .animate-float-3,
          .animate-nom {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
