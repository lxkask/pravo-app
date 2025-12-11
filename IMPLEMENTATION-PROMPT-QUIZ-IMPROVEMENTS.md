# Implementation Prompt: Quiz/Test Mode Improvements

## Executive Summary

This document provides a comprehensive implementation guide for improving the Czech legal exam prep app's quiz/test functionality. The goal is to split the current test mode into two distinct modes: **Procvičování (Practice mode)** for sequential learning with progress tracking, and **Test mode** for timed assessments.

---

## 1. Current Implementation Analysis

### 1.1 Existing Code Structure

**Location**: `C:\Users\lukol\Downloads\pravo-app\pravo-quiz-app\app\midterm-quiz\page.tsx`

**Current Features**:
- 4 quiz modes: 'practice', 'timed-10', 'timed-20', 'timed-40'
- All modes currently shuffle questions randomly via API (`shuffle=true`)
- Timer functionality for timed modes
- Progress tracking within a single session (not persisted)
- Question navigation with visual progress indicators
- Skip functionality
- Keyboard shortcuts for navigation

**Database Schema** (from `schema.prisma`):
```prisma
model QuizQuestion {
  id           String       @id @default(uuid())
  questionText String       @db.Text
  explanation  String?      @db.Text
  originalId   Int?         // Original question number
  source       String       @default("http://beta2.naxera.eu/")
  category     String?      // ZP, OP, or MIXED
  answers      QuizAnswer[]
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
}
```

**ExamQuestion Schema**:
```prisma
model ExamQuestion {
  id           String   @id @default(uuid())
  order        Int      @unique  // Sequential order (1-40)
  title        String   @db.Text
  shortAnswer  String   @db.Text
  longAnswer   String?  @db.Text
  source       String   @default("Patocka_Ustni_2024-1.pdf")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

**Key Observations**:
- ExamQuestion already has an `order` field (1-40) perfect for sequential mode
- QuizQuestion has 94 questions without inherent ordering
- Current LocalStorage usage is limited to category progress tracking
- No persistent progress tracking across sessions

### 1.2 What Needs to Change

1. **Mode Differentiation**: Split "practice" mode into two distinct modes
2. **Question Ordering**: Add sequential ordering option (default) with optional shuffle
3. **Progress Persistence**: Track completed questions in LocalStorage across sessions
4. **Progress Visualization**: Show "Dokončeno X/40" style indicators
5. **API Enhancement**: Support both sequential and shuffled fetching

---

## 2. Feature Specification

### 2.1 Two Distinct Modes

#### Mode 1: Procvičování (Practice Mode)
**Purpose**: Sequential learning with progress tracking

**Characteristics**:
- Default: Questions displayed in sequential order (1→2→3→4...)
- Toggle option: "Zamíchat pořadí" to randomize
- No time limit
- Progress persists across sessions
- Visual indicators: "Dokončeno 15/40"
- Can retake completed questions
- Resume from last position option

**UX Flow**:
```
1. User selects "Procvičování" from main menu
2. Show options screen:
   - [x] Sekvenční pořadí (default checked)
   - [ ] Zamíchat pořadí
   - Button: "Zahájit procvičování"
   - Progress indicator: "Dokončeno 15/40 (38%)"
   - Link: "Pokračovat odkud jsem skončil"
3. Load questions (sequential or shuffled based on toggle)
4. Display questions with progress tracking
5. Save progress after each answered question
6. On completion: Show stats + option to reset progress
```

#### Mode 2: Test (Timed Test Mode)
**Purpose**: Exam simulation with time pressure

**Characteristics**:
- 25 random questions (not all 94)
- 25 minute timer (strict)
- No progress tracking (fresh each time)
- Questions shuffled randomly
- Auto-submit when time expires
- Final score at completion

**UX Flow**:
```
1. User selects "Test" from main menu
2. Show warning screen:
   - "Test na 25 minut"
   - "25 náhodných otázek"
   - "Čas běží okamžitě po spuštění"
   - Button: "Zahájit test"
3. Start timer immediately
4. Display questions with timer
5. Auto-complete when timer expires
6. Show final score (no progress saved)
```

### 2.2 Progress Tracking Strategy

#### LocalStorage Schema

**Key**: `examQuestions_progress`

**Structure**:
```typescript
interface ExamQuestionProgress {
  completedQuestions: {
    [questionOrder: number]: {
      answeredAt: string; // ISO timestamp
      wasCorrect: boolean; // If applicable
      timesAnswered: number; // Track multiple attempts
    }
  };
  lastPosition: number; // Last question order viewed
  shuffleEnabled: boolean; // User's shuffle preference
  totalQuestions: number; // Total count (40)
  lastUpdated: string; // ISO timestamp
}

// Example:
{
  "completedQuestions": {
    "1": { "answeredAt": "2025-12-11T10:30:00Z", "wasCorrect": true, "timesAnswered": 1 },
    "2": { "answeredAt": "2025-12-11T10:35:00Z", "wasCorrect": true, "timesAnswered": 1 },
    "5": { "answeredAt": "2025-12-11T10:40:00Z", "wasCorrect": false, "timesAnswered": 2 }
  },
  "lastPosition": 5,
  "shuffleEnabled": false,
  "totalQuestions": 40,
  "lastUpdated": "2025-12-11T10:40:00Z"
}
```

**Key**: `midtermQuiz_progress` (for midterm quiz - 94 questions)

Same structure but for QuizQuestion instead of ExamQuestion.

### 2.3 Shuffle Algorithm

**Approach**: Fisher-Yates shuffle algorithm for uniform randomization

**Implementation**:
```typescript
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]; // Create copy
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
```

**When to Shuffle**:
- Practice mode: Only if "Zamíchat pořadí" toggle is enabled
- Test mode: Always shuffle (25 random questions from 40)

---

## 3. Implementation Plan

### 3.1 Step-by-Step Tasks

#### Phase 1: Update Database & API Layer

**Task 1.1**: Create new API endpoint for ExamQuestions with ordering support

**File**: `C:\Users\lukol\Downloads\pravo-app\pravo-quiz-app\app\api\exam-questions\route.ts` (NEW)

```typescript
// GET /api/exam-questions
// Query params:
//   - shuffle: boolean (default: false)
//   - limit: number (default: 40, max: 40)
//   - mode: 'practice' | 'test'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shuffle = searchParams.get('shuffle') === 'true';
  const limit = parseInt(searchParams.get('limit') || '40');
  const mode = searchParams.get('mode') || 'practice';

  // Fetch questions ordered by 'order' field
  let questions = await prisma.examQuestion.findMany({
    orderBy: { order: 'asc' },
    take: Math.min(limit, 40),
  });

  // For test mode, take 25 random questions
  if (mode === 'test') {
    questions = shuffleArray(questions).slice(0, 25);
  } else if (shuffle) {
    // Practice mode with shuffle enabled
    questions = shuffleArray(questions);
  }
  // Otherwise return sequential order

  return NextResponse.json({ questions, total: questions.length });
}
```

**Task 1.2**: Update midterm-quiz API for consistent behavior

**File**: `C:\Users\lukol\Downloads\pravo-app\pravo-quiz-app\app\api\midterm-quiz\route.ts`

Change line 40 from:
```typescript
resultQuestions = questions.sort(() => Math.random() - 0.5);
```

To:
```typescript
resultQuestions = shuffleArray(questions);
```

Add the Fisher-Yates shuffle helper function at the top of the file.

#### Phase 2: Create Utility Functions

**Task 2.1**: Create progress tracking utilities

**File**: `C:\Users\lukol\Downloads\pravo-app\pravo-quiz-app\lib\progress-tracker.ts` (NEW)

```typescript
export interface QuestionProgress {
  answeredAt: string;
  wasCorrect: boolean;
  timesAnswered: number;
}

export interface ProgressData {
  completedQuestions: Record<number, QuestionProgress>;
  lastPosition: number;
  shuffleEnabled: boolean;
  totalQuestions: number;
  lastUpdated: string;
}

const STORAGE_KEY_EXAM = 'examQuestions_progress';
const STORAGE_KEY_MIDTERM = 'midtermQuiz_progress';

export class ProgressTracker {
  private storageKey: string;

  constructor(type: 'exam' | 'midterm') {
    this.storageKey = type === 'exam' ? STORAGE_KEY_EXAM : STORAGE_KEY_MIDTERM;
  }

  // Load progress from LocalStorage
  load(): ProgressData {
    if (typeof window === 'undefined') return this.getEmptyProgress();

    const stored = localStorage.getItem(this.storageKey);
    if (!stored) return this.getEmptyProgress();

    try {
      return JSON.parse(stored);
    } catch {
      return this.getEmptyProgress();
    }
  }

  // Save progress to LocalStorage
  save(progress: ProgressData): void {
    if (typeof window === 'undefined') return;

    progress.lastUpdated = new Date().toISOString();
    localStorage.setItem(this.storageKey, JSON.stringify(progress));
  }

  // Mark question as completed
  markCompleted(
    questionOrder: number,
    wasCorrect: boolean = true
  ): void {
    const progress = this.load();

    const existing = progress.completedQuestions[questionOrder];
    progress.completedQuestions[questionOrder] = {
      answeredAt: new Date().toISOString(),
      wasCorrect,
      timesAnswered: existing ? existing.timesAnswered + 1 : 1,
    };

    progress.lastPosition = questionOrder;
    this.save(progress);
  }

  // Update last position
  updatePosition(questionOrder: number): void {
    const progress = this.load();
    progress.lastPosition = questionOrder;
    this.save(progress);
  }

  // Get completion percentage
  getCompletionPercentage(): number {
    const progress = this.load();
    const completed = Object.keys(progress.completedQuestions).length;
    return Math.round((completed / progress.totalQuestions) * 100);
  }

  // Get completed count
  getCompletedCount(): number {
    const progress = this.load();
    return Object.keys(progress.completedQuestions).length;
  }

  // Check if question is completed
  isCompleted(questionOrder: number): boolean {
    const progress = this.load();
    return !!progress.completedQuestions[questionOrder];
  }

  // Reset all progress
  reset(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.storageKey);
  }

  // Update shuffle preference
  setShufflePreference(enabled: boolean): void {
    const progress = this.load();
    progress.shuffleEnabled = enabled;
    this.save(progress);
  }

  private getEmptyProgress(): ProgressData {
    return {
      completedQuestions: {},
      lastPosition: 0,
      shuffleEnabled: false,
      totalQuestions: 40, // Default for exam questions
      lastUpdated: new Date().toISOString(),
    };
  }
}
```

**Task 2.2**: Create shuffle utility

**File**: `C:\Users\lukol\Downloads\pravo-app\pravo-quiz-app\lib\shuffle.ts` (NEW)

```typescript
/**
 * Fisher-Yates shuffle algorithm
 * Provides uniform random distribution
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]; // Create copy to avoid mutation

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
```

#### Phase 3: Update UI Components

**Task 3.1**: Create mode selection screen for exam questions

**File**: `C:\Users\lukol\Downloads\pravo-app\pravo-quiz-app\app\exam-questions\practice\page.tsx` (NEW)

This will be the new practice mode entry point. Structure:

```typescript
'use client'

import { useState, useEffect } from 'react'
import { ProgressTracker } from '@/lib/progress-tracker'
import Link from 'next/link'

export default function ExamPracticePage() {
  const [shuffleEnabled, setShuffleEnabled] = useState(false)
  const [progress, setProgress] = useState({ completed: 0, total: 40 })

  useEffect(() => {
    const tracker = new ProgressTracker('exam')
    const data = tracker.load()
    setShuffleEnabled(data.shuffleEnabled)
    setProgress({
      completed: tracker.getCompletedCount(),
      total: data.totalQuestions
    })
  }, [])

  const handleStart = () => {
    const tracker = new ProgressTracker('exam')
    tracker.setShufflePreference(shuffleEnabled)
    // Navigate to quiz with mode=practice
    window.location.href = `/exam-questions/quiz?mode=practice&shuffle=${shuffleEnabled}`
  }

  const handleContinue = () => {
    const tracker = new ProgressTracker('exam')
    const data = tracker.load()
    // Navigate to last position
    window.location.href = `/exam-questions/quiz?mode=practice&start=${data.lastPosition + 1}`
  }

  const handleReset = () => {
    if (confirm('Opravdu chcete resetovat veškerý progres?')) {
      const tracker = new ProgressTracker('exam')
      tracker.reset()
      window.location.reload()
    }
  }

  const percentage = Math.round((progress.completed / progress.total) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-4">
      <div className="max-w-3xl mx-auto py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Procvičování
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            40 otázek ke zkoušce
          </p>
        </div>

        {/* Progress Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl mb-8 border border-slate-200 dark:border-slate-700">
          <div className="mb-6">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Váš progres</span>
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{percentage}%</span>
            </div>
            <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-center mt-2 text-slate-700 dark:text-slate-300 font-semibold">
              Dokončeno {progress.completed}/{progress.total}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-6">
            <label className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <input
                type="checkbox"
                checked={shuffleEnabled}
                onChange={(e) => setShuffleEnabled(e.target.checked)}
                className="w-5 h-5 text-indigo-600 rounded"
              />
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">Zamíchat pořadí</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Otázky budou zobrazeny v náhodném pořadí
                </div>
              </div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {progress.completed > 0 && (
              <button
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Pokračovat odkud jsem skončil →
              </button>
            )}
            <button
              onClick={handleStart}
              className="w-full bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
            >
              Začít {progress.completed > 0 ? 'znovu' : 'procvičování'}
            </button>
            {progress.completed > 0 && (
              <button
                onClick={handleReset}
                className="w-full bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-6 py-3 rounded-xl font-semibold hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
              >
                Resetovat progres
              </button>
            )}
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/exam-questions"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            ← Zpět na seznam otázek
          </Link>
        </div>
      </div>
    </div>
  )
}
```

**Task 3.2**: Create test mode entry screen

**File**: `C:\Users\lukol\Downloads\pravo-app\pravo-quiz-app\app\exam-questions\test\page.tsx` (NEW)

Similar structure but for test mode:

```typescript
'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Clock, AlertTriangle } from 'lucide-react'

export default function ExamTestPage() {
  const router = useRouter()

  const handleStart = () => {
    router.push('/exam-questions/quiz?mode=test')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-4">
      <div className="max-w-2xl mx-auto py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mb-6">
            <Clock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Test
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Zkouškový test na čas
          </p>
        </div>

        {/* Warning Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl mb-8 border-2 border-orange-300 dark:border-orange-700">
          <div className="flex items-start gap-4 mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
            <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-orange-900 dark:text-orange-200 mb-1">Důležité upozornění</h3>
              <p className="text-sm text-orange-800 dark:text-orange-300">
                Čas začne běžet okamžitě po spuštění testu. Test nelze pozastavit.
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
                <span className="text-xl">📝</span>
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">25 náhodných otázek</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Z celkových 40 zkouškových otázek</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">25 minut časový limit</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Test se automaticky ukončí po vypršení času</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                <span className="text-xl">🎯</span>
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">Hodnocení po dokončení</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Výsledky se neukládají do progresu</div>
              </div>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Zahájit test →
          </button>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/exam-questions"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            ← Zpět na seznam otázek
          </Link>
        </div>
      </div>
    </div>
  )
}
```

**Task 3.3**: Create unified quiz component

**File**: `C:\Users\lukol\Downloads\pravo-app\pravo-quiz-app\app\exam-questions\quiz\page.tsx` (NEW)

This component handles both practice and test modes based on URL params.

Key features:
- Read `mode`, `shuffle`, `start` from URL search params
- Load questions from API with appropriate parameters
- Track progress for practice mode only
- Display timer for test mode only
- Show different completion screens based on mode

Structure similar to current `midterm-quiz/page.tsx` but with:
1. Mode detection from URL params
2. Conditional progress tracking (practice only)
3. Conditional timer (test only)
4. Progress visualization in practice mode
5. Integration with ProgressTracker utility

**Task 3.4**: Update main exam questions page

**File**: `C:\Users\lukol\Downloads\pravo-app\pravo-quiz-app\app\exam-questions\page.tsx`

Add two prominent buttons at the top:
- "Procvičování" → `/exam-questions/practice`
- "Test na čas" → `/exam-questions/test`

Keep existing list of questions below for reference.

#### Phase 4: Update Midterm Quiz (Similar Changes)

Apply similar pattern to midterm quiz:
- Create `/midterm-quiz/practice` page
- Create `/midterm-quiz/test` pages
- Update main `/midterm-quiz` page with mode selection
- Use 94 questions for midterm (instead of 40)
- Test mode: 25 questions, 25 minutes (keep existing config)

---

## 4. Technical Details

### 4.1 Progress Calculation Logic

```typescript
// Calculate completion percentage
const completedCount = Object.keys(progress.completedQuestions).length
const totalQuestions = 40 // or 94 for midterm
const percentage = Math.round((completedCount / totalQuestions) * 100)

// Format progress string
const progressText = `Dokončeno ${completedCount}/${totalQuestions}`

// Check if user can continue
const canContinue = completedCount > 0 && completedCount < totalQuestions
```

### 4.2 Sequential vs Shuffled Question Loading

**Practice Mode (Sequential - Default)**:
```typescript
// API call
const response = await fetch('/api/exam-questions?mode=practice&shuffle=false')
const data = await response.json()
// Returns questions ordered by 'order' field (1, 2, 3, ...)
```

**Practice Mode (Shuffled)**:
```typescript
// API call
const response = await fetch('/api/exam-questions?mode=practice&shuffle=true')
const data = await response.json()
// Returns shuffled questions
```

**Test Mode (Always Random)**:
```typescript
// API call
const response = await fetch('/api/exam-questions?mode=test')
const data = await response.json()
// Returns 25 random questions, always shuffled
```

### 4.3 Resume Functionality

**Implementation**:
```typescript
// On "Pokračovat odkud jsem skončil" click:
const tracker = new ProgressTracker('exam')
const progress = tracker.load()
const lastPosition = progress.lastPosition

// Navigate to quiz starting from next uncompleted question
let startPosition = lastPosition + 1

// If last position is completed, find next incomplete
if (progress.completedQuestions[lastPosition]) {
  for (let i = 1; i <= 40; i++) {
    if (!progress.completedQuestions[i]) {
      startPosition = i
      break
    }
  }
}

// Navigate with start parameter
router.push(`/exam-questions/quiz?mode=practice&start=${startPosition}`)
```

### 4.4 Visual Progress Indicators

**Completed Question Badge** (in question navigator):
```typescript
// Green badge for completed
{isCompleted(questionOrder) && (
  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white">
    <CheckCircle2 className="w-3 h-3 text-white" />
  </div>
)}
```

**Progress Bar Component**:
```typescript
<div className="bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
  <div
    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-4 rounded-full transition-all duration-500"
    style={{ width: `${percentage}%` }}
  />
</div>
<p className="text-center mt-2 text-slate-700 dark:text-slate-300 font-semibold">
  Dokončeno {completed}/{total} ({percentage}%)
</p>
```

### 4.5 LocalStorage Persistence Strategy

**Save Frequency**: After each question is answered (not skipped)

**Save Trigger**:
```typescript
const handleSubmit = () => {
  // ... existing answer checking logic ...

  // Only save in practice mode
  if (mode === 'practice') {
    const tracker = new ProgressTracker('exam')
    tracker.markCompleted(currentQuestion.order, isAnswerCorrect)
  }

  setShowResult(true)
}
```

**Load on Mount**:
```typescript
useEffect(() => {
  if (mode === 'practice') {
    const tracker = new ProgressTracker('exam')
    const progress = tracker.load()

    // Highlight completed questions in navigator
    setCompletedQuestions(new Set(
      Object.keys(progress.completedQuestions).map(Number)
    ))
  }
}, [mode])
```

---

## 5. Success Criteria

### 5.1 Functional Requirements

**Must Have**:
- ✅ Two distinct modes: Procvičování and Test
- ✅ Practice mode: Sequential by default, optional shuffle
- ✅ Practice mode: Progress persists across sessions
- ✅ Practice mode: Visual progress "Dokončeno X/40"
- ✅ Test mode: 25 random questions, 25 minute timer
- ✅ Test mode: No progress tracking
- ✅ Resume functionality works correctly
- ✅ Reset progress clears all LocalStorage data

**Should Have**:
- ✅ Keyboard shortcuts still work in both modes
- ✅ Dark mode works correctly
- ✅ Mobile responsive design
- ✅ Loading states while fetching questions

**Nice to Have**:
- Statistics: accuracy rate, time spent per question
- Export progress as JSON
- Multiple difficulty levels

### 5.2 Testing Checklist

#### Practice Mode Tests
- [ ] Default loads questions in order 1, 2, 3, 4...
- [ ] Shuffle toggle randomizes question order
- [ ] Shuffle preference persists after reload
- [ ] Answering a question updates progress in LocalStorage
- [ ] Progress percentage calculates correctly
- [ ] "Dokončeno X/40" displays correct count
- [ ] "Pokračovat odkud jsem skončil" resumes at correct position
- [ ] Completed questions show visual indicator in navigator
- [ ] Reset progress confirmation works
- [ ] Reset progress actually clears LocalStorage
- [ ] Can retake completed questions
- [ ] Progress persists after browser close/reopen
- [ ] Multiple attempts increment `timesAnswered` counter

#### Test Mode Tests
- [ ] Always loads 25 random questions
- [ ] Questions are shuffled every test
- [ ] Timer starts immediately at 25:00
- [ ] Timer counts down correctly
- [ ] Auto-submit when timer reaches 0:00
- [ ] No progress saved to LocalStorage
- [ ] Final score displays correctly
- [ ] "Nový test" button generates new random set
- [ ] Warning screen shows before test starts
- [ ] Can't pause or stop timer

#### Edge Cases
- [ ] Handle empty LocalStorage gracefully
- [ ] Handle corrupted LocalStorage data
- [ ] Handle API errors during question fetch
- [ ] Handle case where all 40 questions completed
- [ ] Handle navigation during timer countdown
- [ ] Handle browser tab visibility change during test
- [ ] Handle rapid clicking on answer buttons

### 5.3 Performance Requirements

- API response time: < 500ms for question fetch
- LocalStorage operations: < 50ms
- UI updates: < 100ms after user action
- Page load: < 2s on 3G connection
- No memory leaks during long sessions

---

## 6. Migration & Rollout Plan

### 6.1 Phase 1: Development (Week 1)
1. Create API endpoints
2. Implement utility functions
3. Build practice mode UI
4. Build test mode UI
5. Unit tests for utilities

### 6.2 Phase 2: Testing (Week 2)
1. Manual testing of all features
2. Test on multiple browsers (Chrome, Firefox, Safari)
3. Test on mobile devices (iOS, Android)
4. Test edge cases and error scenarios
5. Performance testing

### 6.3 Phase 3: Beta Release (Week 3)
1. Deploy to staging environment
2. Invite 5-10 beta testers
3. Collect feedback
4. Fix critical bugs
5. Polish UI/UX based on feedback

### 6.4 Phase 4: Production (Week 4)
1. Deploy to production
2. Monitor error logs
3. Monitor user analytics
4. Gather user feedback
5. Plan iteration improvements

### 6.5 Rollback Plan

If issues occur:
1. Keep old `/midterm-quiz` page as fallback
2. Can disable new modes via feature flag
3. LocalStorage is non-destructive (old data preserved)
4. Database schema unchanged (no migration needed)

---

## 7. Future Enhancements

### 7.1 Short-term (Next Sprint)
- **Smart resume**: Resume from first incorrect answer, not just last position
- **Streak tracking**: Track consecutive correct answers
- **Daily goal**: "Complete 5 questions today"
- **Question bookmarks**: Mark difficult questions for review

### 7.2 Medium-term (Next Quarter)
- **Spaced repetition**: Show questions based on forgetting curve
- **Performance analytics**: Chart progress over time
- **Weak areas detection**: Identify topics needing more practice
- **Study sessions**: Track time spent learning

### 7.3 Long-term (Roadmap)
- **Server-side progress sync**: Replace LocalStorage with database
- **Multi-device sync**: Continue on phone where you left off on laptop
- **Social features**: Compare progress with friends
- **AI tutor**: Personalized explanations for wrong answers

---

## 8. Code Review Checklist

Before merging:
- [ ] All TypeScript types defined
- [ ] No `any` types used
- [ ] Error handling implemented
- [ ] Loading states implemented
- [ ] Dark mode tested
- [ ] Mobile responsive
- [ ] Accessibility (keyboard nav, screen readers)
- [ ] No console.log statements
- [ ] Comments for complex logic
- [ ] Performance optimized (no unnecessary re-renders)
- [ ] LocalStorage fallbacks for SSR
- [ ] API error responses handled gracefully

---

## 9. Resources & References

### Documentation
- Next.js 14 App Router: https://nextjs.org/docs/app
- Prisma Client: https://www.prisma.io/docs/orm/prisma-client
- LocalStorage API: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

### Design References
- Current midterm quiz: `/midterm-quiz`
- Current exam questions: `/exam-questions`
- Tailwind UI components: https://tailwindui.com/

### Fisher-Yates Algorithm
- Wikipedia: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
- Visualization: https://bost.ocks.org/mike/shuffle/

---

## 10. Questions & Clarifications

**Q: Should progress track which answer was selected, or just correct/incorrect?**
A: Current spec only tracks correct/incorrect boolean. Could extend to store full answer history if needed.

**Q: What happens if user changes shuffle preference mid-session?**
A: Preference applies on next session start. Current session continues with existing order.

**Q: Should test mode show explanations after wrong answers?**
A: Yes, follow same pattern as practice mode for consistency.

**Q: How to handle QuizQuestion (94 questions) vs ExamQuestion (40 questions)?**
A: Create separate ProgressTracker instances with different storage keys and total counts.

**Q: Should "Dokončeno" include questions attempted multiple times?**
A: Yes, a question is "dokončeno" after first attempt, but `timesAnswered` counter tracks multiple attempts.

---

## Appendix A: File Structure

```
pravo-quiz-app/
├── app/
│   ├── api/
│   │   ├── exam-questions/
│   │   │   ├── route.ts (NEW)
│   │   │   └── [id]/
│   │   │       └── route.ts (existing)
│   │   └── midterm-quiz/
│   │       └── route.ts (UPDATE)
│   ├── exam-questions/
│   │   ├── page.tsx (UPDATE)
│   │   ├── practice/
│   │   │   └── page.tsx (NEW)
│   │   ├── test/
│   │   │   └── page.tsx (NEW)
│   │   ├── quiz/
│   │   │   └── page.tsx (NEW)
│   │   └── [id]/
│   │       └── page.tsx (existing)
│   └── midterm-quiz/
│       ├── page.tsx (UPDATE - split into mode selection)
│       ├── practice/
│       │   └── page.tsx (NEW)
│       ├── test/
│       │   └── page.tsx (NEW)
│       └── quiz/
│           └── page.tsx (NEW)
├── lib/
│   ├── progress-tracker.ts (NEW)
│   └── shuffle.ts (NEW)
└── prisma/
    └── schema.prisma (no changes needed)
```

## Appendix B: TypeScript Interfaces

```typescript
// Mode types
type QuizMode = 'practice' | 'test'

// Question with order
interface OrderedQuestion {
  id: string
  order: number
  title: string
  shortAnswer: string
  longAnswer?: string
}

// Progress data structure
interface QuestionProgress {
  answeredAt: string
  wasCorrect: boolean
  timesAnswered: number
}

interface ProgressData {
  completedQuestions: Record<number, QuestionProgress>
  lastPosition: number
  shuffleEnabled: boolean
  totalQuestions: number
  lastUpdated: string
}

// API response
interface QuizAPIResponse {
  questions: OrderedQuestion[]
  total: number
}
```

---

**End of Implementation Prompt**

**Version**: 1.0
**Last Updated**: 2025-12-11
**Author**: Claude (Sonnet 4.5)
**Status**: Ready for Implementation
