/**
 * Progress Tracker for Midterm Quiz
 * Handles LocalStorage persistence of practice mode progress
 */

import { z } from 'zod';

export interface QuestionProgress {
  answeredAt: string
  wasCorrect: boolean
  timesAnswered: number
}

export interface MidtermProgress {
  completedQuestions: Record<number, QuestionProgress>
  lastPosition: number
  shuffleEnabled: boolean
  totalQuestions: number
  lastUpdated: string
}

// Zod schemas for validation
const QuestionProgressSchema = z.object({
  answeredAt: z.string(),
  wasCorrect: z.boolean(),
  timesAnswered: z.number().int().min(1)
});

const MidtermProgressSchema = z.object({
  completedQuestions: z.record(z.string(), QuestionProgressSchema),
  lastPosition: z.number().int().min(0),
  shuffleEnabled: z.boolean(),
  totalQuestions: z.number().int().min(1),
  lastUpdated: z.string()
});

const STORAGE_KEY = 'midtermQuiz_progress'

export class MidtermProgressTracker {
  /**
   * Get current progress from LocalStorage
   */
  static getProgress(): MidtermProgress | null {
    if (typeof window === 'undefined') return null

    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (!data) return null

      const parsed = JSON.parse(data)
      const validated = MidtermProgressSchema.safeParse(parsed)

      if (validated.success) {
        return validated.data as MidtermProgress
      } else {
        console.error('Invalid midterm progress data:', validated.error)
        return null
      }
    } catch (error) {
      console.error('Failed to load progress:', error)
      return null
    }
  }

  /**
   * Initialize new progress or get existing
   */
  static initializeProgress(totalQuestions: number = 94): MidtermProgress {
    const existing = this.getProgress()

    if (existing && existing.totalQuestions === totalQuestions) {
      return existing
    }

    const newProgress: MidtermProgress = {
      completedQuestions: {},
      lastPosition: 0,
      shuffleEnabled: false,
      totalQuestions,
      lastUpdated: new Date().toISOString(),
    }

    this.saveProgress(newProgress)
    return newProgress
  }

  /**
   * Save progress to LocalStorage
   */
  static saveProgress(progress: MidtermProgress): void {
    if (typeof window === 'undefined') return

    try {
      progress.lastUpdated = new Date().toISOString()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch (error) {
      console.error('Failed to save progress:', error)
    }
  }

  /**
   * Mark a question as answered
   */
  static markQuestionAnswered(
    questionIndex: number,
    wasCorrect: boolean
  ): void {
    const progress = this.getProgress() || this.initializeProgress()

    const existing = progress.completedQuestions[questionIndex]

    progress.completedQuestions[questionIndex] = {
      answeredAt: new Date().toISOString(),
      wasCorrect,
      timesAnswered: existing ? existing.timesAnswered + 1 : 1,
    }

    progress.lastPosition = questionIndex
    this.saveProgress(progress)
  }

  /**
   * Update last position (for navigation without answering)
   */
  static updateLastPosition(questionIndex: number): void {
    const progress = this.getProgress() || this.initializeProgress()
    progress.lastPosition = questionIndex
    this.saveProgress(progress)
  }

  /**
   * Toggle shuffle setting
   */
  static setShuffleEnabled(enabled: boolean): void {
    const progress = this.getProgress() || this.initializeProgress()
    progress.shuffleEnabled = enabled
    this.saveProgress(progress)
  }

  /**
   * Get completion statistics
   */
  static getStats(): {
    totalQuestions: number
    completedQuestions: number
    percentage: number
    lastPosition: number
  } {
    const progress = this.getProgress()

    if (!progress) {
      return {
        totalQuestions: 94,
        completedQuestions: 0,
        percentage: 0,
        lastPosition: 0,
      }
    }

    const completedCount = Object.keys(progress.completedQuestions).length

    return {
      totalQuestions: progress.totalQuestions,
      completedQuestions: completedCount,
      percentage: Math.round((completedCount / progress.totalQuestions) * 100),
      lastPosition: progress.lastPosition,
    }
  }

  /**
   * Check if a question has been completed
   */
  static isQuestionCompleted(questionIndex: number): boolean {
    const progress = this.getProgress()
    return progress?.completedQuestions[questionIndex] !== undefined
  }

  /**
   * Get list of completed question indices
   */
  static getCompletedQuestions(): number[] {
    const progress = this.getProgress()
    if (!progress) return []

    return Object.keys(progress.completedQuestions)
      .map(Number)
      .sort((a, b) => a - b)
  }

  /**
   * Reset all progress
   */
  static resetProgress(): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Failed to reset progress:', error)
    }
  }

  /**
   * Get next unanswered question index
   */
  static getNextUnansweredQuestion(totalQuestions: number = 94): number | null {
    const progress = this.getProgress()
    if (!progress) return 0

    // Find first unanswered question
    for (let i = 0; i < totalQuestions; i++) {
      if (!progress.completedQuestions[i]) {
        return i
      }
    }

    // All completed
    return null
  }
}
