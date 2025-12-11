'use client'

import { useEffect, useState } from 'react'

interface ConfettiProps {
  trigger: boolean
  duration?: number
}

export function ConfettiEffect({ trigger, duration = 3000 }: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([])

  useEffect(() => {
    if (trigger) {
      // Generate random confetti particles
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][Math.floor(Math.random() * 5)]
      }))

      setParticles(newParticles)

      // Clear particles after duration
      const timeout = setTimeout(() => {
        setParticles([])
      }, duration)

      return () => clearTimeout(timeout)
    }
  }, [trigger, duration])

  if (particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full animate-confetti"
          style={{
            left: `${particle.left}%`,
            top: '-10px',
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .animate-confetti {
          animation: confetti 3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
