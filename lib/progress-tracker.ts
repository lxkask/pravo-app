/**
 * Progress Tracker for Exam Questions
 * Handles LocalStorage persistence of practice mode progress
 */

import { z } from 'zod';

export interface QuestionProgress {
  answeredAt: string
  wasCorrect: boolean
  timesAnswered: number
}

export interface ExamProgress {
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

const ExamProgressSchema = z.object({
  completedQuestions: z.record(z.string(), QuestionProgressSchema),
  lastPosition: z.number().int().min(0),
  shuffleEnabled: z.boolean(),
  totalQuestions: z.number().int().min(1),
  lastUpdated: z.string()
});

const STORAGE_KEY = 'examQuestions_progress'

export class ProgressTracker {
  /**
   * Get current progress from LocalStorage
   */
  static getProgress(): ExamProgress | null {
    if (typeof window === 'undefined') return null

    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (!data) return null

      const parsed = JSON.parse(data)
      const validated = ExamProgressSchema.safeParse(parsed)

      if (validated.success) {
        return validated.data as ExamProgress
      } else {
        console.error('Invalid exam progress data:', validated.error)
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
  static initializeProgress(totalQuestions: number = 40): ExamProgress {
    const existing = this.getProgress()

    if (existing && existing.totalQuestions === totalQuestions) {
      return existing
    }

    const newProgress: ExamProgress = {
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
  static saveProgress(progress: ExamProgress): void {
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
    questionOrder: number,
    wasCorrect: boolean
  ): void {
    const progress = this.getProgress() || this.initializeProgress()

    const existing = progress.completedQuestions[questionOrder]

    progress.completedQuestions[questionOrder] = {
      answeredAt: new Date().toISOString(),
      wasCorrect,
      timesAnswered: existing ? existing.timesAnswered + 1 : 1,
    }

    progress.lastPosition = questionOrder
    this.saveProgress(progress)
  }

  /**
   * Update last position (for navigation without answering)
   */
  static updateLastPosition(questionOrder: number): void {
    const progress = this.getProgress() || this.initializeProgress()
    progress.lastPosition = questionOrder
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
        totalQuestions: 40,
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
  static isQuestionCompleted(questionOrder: number): boolean {
    const progress = this.getProgress()
    return progress?.completedQuestions[questionOrder] !== undefined
  }

  /**
   * Get list of completed question orders
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
   * Get next unanswered question
   */
  static getNextUnansweredQuestion(): number | null {
    const progress = this.getProgress()
    if (!progress) return 1

    // Find first unanswered question
    for (let i = 1; i <= progress.totalQuestions; i++) {
      if (!progress.completedQuestions[i]) {
        return i
      }
    }

    // All completed
    return null
  }
}
