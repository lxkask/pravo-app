/**
 * Fisher-Yates shuffle algorithm for randomizing arrays
 * Time complexity: O(n)
 * Space complexity: O(1) - modifies array in place
 */

export function shuffleArray<T>(array: T[]): T[] {
  // Create a copy to avoid mutating the original
  const shuffled = [...array]

  for (let i = shuffled.length - 1; i > 0; i--) {
    // Generate random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1))

    // Swap elements at i and j
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled
}

/**
 * Shuffle an array of numbers (e.g., question orders)
 */
export function shuffleNumbers(numbers: number[]): number[] {
  return shuffleArray(numbers)
}

/**
 * Generate shuffled sequence from 1 to n
 */
export function generateShuffledSequence(n: number): number[] {
  const sequence = Array.from({ length: n }, (_, i) => i + 1)
  return shuffleArray(sequence)
}

/**
 * Seeded random number generator for reproducible shuffles
 * Useful for consistent shuffle across page reloads during a session
 */
class SeededRandom {
  private seed: number

  constructor(seed: number) {
    this.seed = seed
  }

  next(): number {
    // Linear congruential generator
    const x = Math.sin(this.seed++) * 10000
    return x - Math.floor(x)
  }
}

/**
 * Shuffle array with a seed for reproducibility
 */
export function shuffleArraySeeded<T>(array: T[], seed: number): T[] {
  const shuffled = [...array]
  const rng = new SeededRandom(seed)

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled
}
