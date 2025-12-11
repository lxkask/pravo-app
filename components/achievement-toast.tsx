'use client'

import { useEffect, useState } from 'react'
import { Award, X } from 'lucide-react'

interface Achievement {
  id: string
  title: string
  description: string
  icon?: string
}

interface AchievementToastProps {
  achievement: Achievement | null
  onClose: () => void
}

export function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (achievement) {
      setIsVisible(true)

      // Auto-dismiss after 5 seconds
      const timeout = setTimeout(() => {
        handleClose()
      }, 5000)

      return () => clearTimeout(timeout)
    }
  }, [achievement])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Wait for animation to finish
  }

  if (!achievement) return null

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 dark:from-yellow-600 dark:to-orange-600 rounded-xl shadow-2xl p-4 border-2 border-yellow-300 dark:border-yellow-700">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            {achievement.icon ? (
              <span className="text-2xl">{achievement.icon}</span>
            ) : (
              <Award className="w-6 h-6 text-white" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-xs font-semibold text-yellow-100 uppercase tracking-wider mb-1">
                  Achievement Unlocked!
                </div>
                <h3 className="text-white font-bold text-lg leading-tight">
                  {achievement.title}
                </h3>
                <p className="text-yellow-100 text-sm mt-1">
                  {achievement.description}
                </p>
              </div>

              <button
                onClick={handleClose}
                className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Achievement definitions
export const ACHIEVEMENTS = {
  FIRST_QUIZ: {
    id: 'first_quiz',
    title: 'První kroky!',
    description: 'Dokončil jsi svůj první kvíz',
    icon: '🎯'
  },
  PERFECT_SCORE: {
    id: 'perfect_score',
    title: 'Perfekcionista!',
    description: 'Získal jsi 100% v testu',
    icon: '🏆'
  },
  FIVE_DAY_STREAK: {
    id: 'five_day_streak',
    title: 'Týdenní hrdina!',
    description: '5 dní v řadě učení',
    icon: '🔥'
  },
  TEN_QUIZZES: {
    id: 'ten_quizzes',
    title: 'Quiz Master!',
    description: 'Dokončil jsi 10 kvízů',
    icon: '⭐'
  },
  ALL_EXAM_QUESTIONS: {
    id: 'all_exam_questions',
    title: 'Studijní šampion!',
    description: 'Prošel jsi všech 40 zkouškových otázek',
    icon: '📚'
  },
} as const
