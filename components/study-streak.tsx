'use client'

import { Flame } from 'lucide-react'
import { useEffect, useState } from 'react'
import { z } from 'zod'

interface StudyStreakProps {
  className?: string
}

// Zod schema for streak data validation
const StreakDataSchema = z.object({
  streak: z.number().int().min(0),
  lastStudyDate: z.string()
})

export function StudyStreak({ className = '' }: StudyStreakProps) {
  const [streak, setStreak] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load streak from localStorage
    const loadStreak = () => {
      try {
        const streakData = localStorage.getItem('study-streak')
        if (streakData) {
          const parsed = JSON.parse(streakData)
          const validated = StreakDataSchema.safeParse(parsed)

          if (!validated.success) {
            console.error('Invalid streak data:', validated.error)
            setStreak(0)
            setIsLoading(false)
            return
          }

          const { streak: savedStreak, lastStudyDate } = validated.data
          const today = new Date().toDateString()
          const lastDate = new Date(lastStudyDate).toDateString()

          // Check if user studied today or yesterday
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayStr = yesterday.toDateString()

          if (lastDate === today) {
            // Already studied today
            setStreak(savedStreak)
          } else if (lastDate === yesterdayStr) {
            // Studied yesterday, continue streak
            setStreak(savedStreak)
          } else {
            // Streak broken, reset to 0
            setStreak(0)
            localStorage.setItem('study-streak', JSON.stringify({
              streak: 0,
              lastStudyDate: new Date().toISOString()
            }))
          }
        } else {
          // No streak data, initialize
          setStreak(0)
        }
      } catch (error) {
        console.error('Error loading streak:', error)
        setStreak(0)
      } finally {
        setIsLoading(false)
      }
    }

    loadStreak()

    // Update streak when user completes a quiz
    const handleStorageChange = () => {
      loadStreak()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  if (isLoading) {
    return null
  }

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20 border border-orange-200 dark:border-orange-800 rounded-xl ${className}`}>
      <Flame className={`w-5 h-5 ${streak > 0 ? 'text-orange-500 dark:text-orange-400' : 'text-slate-400 dark:text-slate-500'}`} />
      <div className="text-left">
        <div className="text-sm font-black text-slate-900 dark:text-white">
          {streak} {streak === 1 ? 'den' : streak >= 2 && streak <= 4 ? 'dny' : 'dní'}
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-400">
          {streak > 0 ? 'Study streak!' : 'Začni sérii'}
        </div>
      </div>
    </div>
  )
}

// Helper function to update streak (call this when user completes quiz)
export function updateStudyStreak() {
  try {
    const streakData = localStorage.getItem('study-streak')
    const today = new Date().toDateString()

    if (streakData) {
      const parsed = JSON.parse(streakData)
      const validated = StreakDataSchema.safeParse(parsed)

      if (!validated.success) {
        console.error('Invalid streak data:', validated.error)
        // Reset to defaults
        localStorage.setItem('study-streak', JSON.stringify({
          streak: 1,
          lastStudyDate: new Date().toISOString()
        }))
        window.dispatchEvent(new Event('storage'))
        return
      }

      const { streak, lastStudyDate } = validated.data
      const lastDate = new Date(lastStudyDate).toDateString()

      if (lastDate !== today) {
        // New day, increment streak
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toDateString()

        const newStreak = lastDate === yesterdayStr ? streak + 1 : 1

        localStorage.setItem('study-streak', JSON.stringify({
          streak: newStreak,
          lastStudyDate: new Date().toISOString()
        }))

        // Dispatch event to update UI
        window.dispatchEvent(new Event('storage'))
      }
    } else {
      // First study session
      localStorage.setItem('study-streak', JSON.stringify({
        streak: 1,
        lastStudyDate: new Date().toISOString()
      }))

      window.dispatchEvent(new Event('storage'))
    }
  } catch (error) {
    console.error('Error updating streak:', error)
  }
}
