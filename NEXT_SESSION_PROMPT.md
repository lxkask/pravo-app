# Prompt pro Příští Session

## Kontext
Navazuji na session ze dne 2025-12-14. **Přečti si `SESSION_SUMMARY.md` pro kompletní kontext.**

V minulé session byla implementována funkcionalita "Sběr Hundů" (dog collection gamification) s 10 unikátními animacemi, collection gallery, a LocalStorage persistence. Následně proběhl comprehensive audit třemi AI agenty (UX/UI, Frontend Code Quality, Security).

## 🔴 CRITICAL ÚKOLY (URGENT - Dělat PRVNÍ!)

### 1. SECURITY: Rotovat Všechny Exposed Credentials
**Problém:** `.env` soubory jsou v git historii s citlivými daty:
- Database credentials (Neon)
- Anthropic API key
- Vercel OIDC tokens

**Akce:**
```bash
# 1. Vygenerovat nové credentials na těchto platformách:
# - Neon Database (nový password)
# - Anthropic API (nový klíč)
# - Vercel (nové tokeny)

# 2. Přidat .env* do .gitignore (pokud tam ještě není)
echo ".env*" >> .gitignore
echo "!.env.example" >> .gitignore

# 3. Vytvořit .env.example s placeholder hodnotami
# 4. Odstranit .env z git historie (BFG nebo git-filter-repo)

# 5. Commitnout změny
git add .gitignore .env.example
git commit -m "Security: Remove .env from tracking, add .env.example"
```

**Soubory:**
- `.env`
- `.env.local`
- Vytvořit `.env.example`

---

### 2. SECURITY: Implementovat Zod Validaci pro LocalStorage
**Problém:** `JSON.parse()` bez validace = XSS zranitelnost

**Akce:**
```bash
npm install zod
```

**Soubor:** `hooks/use-dog-collection.ts:24-31`

**Změna:**
```typescript
import { z } from 'zod'

const DogCollectionSchema = z.object({
  unlockedDogs: z.array(z.string()),
  lastSeenDog: z.string().nullable(),
  totalSeen: z.number()
})

// Load from localStorage on mount
useEffect(() => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const validated = DogCollectionSchema.safeParse(parsed);

      if (validated.success) {
        setState(validated.data);
      } else {
        console.error('Invalid dog collection data:', validated.error);
        // Reset to defaults
      }
    } catch (e) {
      console.error('Failed to parse dog collection state:', e);
    }
  }
  setIsLoaded(true);
}, []);
```

**Podobně oprav:**
- `app/midterm-quiz/page.tsx` - úspěšnost v localStorage
- Všechny ostatní místa s `JSON.parse(localStorage.getItem(...))`

---

### 3. SECURITY: Přidat ErrorBoundary
**Problém:** Jedna chyba crashne celou aplikaci, uživatel ztratí progress

**Akce:**
Vytvořit `components/error-boundary.tsx`:
```typescript
'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Něco se pokazilo</h1>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              Obnovit stránku
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

**Soubor:** `app/layout.tsx`
```typescript
import { ErrorBoundary } from '@/components/error-boundary'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs"> {/* OPRAVENO z "en" */}
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
```

---

### 4. UX: Opravit Metadata
**Problém:** Stále "Create Next App", nesprávný jazyk

**Soubor:** `app/layout.tsx:6-10`

**Změna:**
```typescript
export const metadata: Metadata = {
  title: 'Pravo Quiz - Průběžný test z práva',
  description: 'Interaktivní aplikace pro procvičování právních otázek z občanského, trestního a správního práva. Sbírej hundy a staň se právním expertem!',
  keywords: ['právo', 'quiz', 'test', 'NOZ', 'trestní právo', 'správní právo'],
  authors: [{ name: 'Pravo Quiz Team' }],
  openGraph: {
    title: 'Pravo Quiz',
    description: 'Procvič si právo zábavnou formou!',
    locale: 'cs_CZ',
  },
}
```

A oprav HTML lang:
```typescript
<html lang="cs"> {/* BYLO: "en" */}
```

---

### 5. UX: Opravit Dog Animation Overflow
**Problém:** Animace stále mohou vytvořit horizontal scroll

**Soubor:** `components/dog-car-animation.tsx:18`

**Změna:**
```typescript
// PŘEDTÍM: Viewport units překračují container
animation: car-drive 4s ease-in-out infinite;

@keyframes car-drive {
  0% {
    left: -150px;
  }
  100% {
    left: calc(100vw + 150px); // ❌ PROBLÉM - vw překračuje container
  }
}

// PO OPRAVĚ: Container-relative units
@keyframes car-drive {
  0% {
    transform: translateX(-150%);
  }
  100% {
    transform: translateX(calc(100% + 150px));
  }
}
```

**Také zkontroluj všech 10 dog animations** v `components/dog-animations/` - ujisti se že všechny používají `transform` místo `left/right` s viewport units.

---

## ⚠️ HIGH PRIORITY ÚKOLY (Po Critical Issues)

### 6. Refaktorovat `app/midterm-quiz/page.tsx`
**Problém:** 1062 lines, mělo být <200

**Rozdělit na:**
```
app/midterm-quiz/
├── page.tsx (hlavní orchestrace, ~150 lines)
├── components/
│   ├── quiz-header.tsx (timer, progress bar)
│   ├── question-card.tsx (otázka + odpovědi)
│   ├── answer-button.tsx (jednotlivé tlačítko odpovědi)
│   ├── explanation-panel.tsx (vysvětlení po odpovědi)
│   ├── completion-screen.tsx (gratulace + statistiky)
│   ├── review-mode.tsx (review všech otázek)
│   └── quiz-settings.tsx (nastavení před startem)
```

### 7. Přidat API Authentication
**Soubory:**
- `app/api/midterm-questions/route.ts`
- `app/api/exam-questions/route.ts`

**Implementovat:**
- Rate limiting (next-rate-limit)
- API key pro POST/PUT/DELETE operace
- CORS headers

### 8. Vytvořit SafeStorage Wrapper
**Problém:** Quota exceeded není ošetřen = data loss

```typescript
// lib/safe-storage.ts
export class SafeStorage {
  static setItem(key: string, value: any): boolean {
    try {
      const serialized = JSON.stringify(value)
      localStorage.setItem(key, serialized)
      return true
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        console.error('LocalStorage quota exceeded')
        // Možnost: vyčistit staré záznamy, notifikovat uživatele
        return false
      }
      throw e
    }
  }

  static getItem<T>(key: string, schema: z.ZodSchema<T>): T | null {
    try {
      const item = localStorage.getItem(key)
      if (!item) return null

      const parsed = JSON.parse(item)
      const validated = schema.safeParse(parsed)

      return validated.success ? validated.data : null
    } catch (e) {
      console.error('SafeStorage getItem failed:', e)
      return null
    }
  }
}
```

### 9. Fix Keyboard Handler Performance
**Soubor:** `app/midterm-quiz/page.tsx:185-214`

**Problém:** Handler se vytváří při každém renderu

**Oprava:**
```typescript
const handleKeyPress = useCallback((e: KeyboardEvent) => {
  // ... existing logic
}, [currentQuestionIndex, hasAnswered, isReviewMode, /* další dependencies */])

useEffect(() => {
  window.addEventListener('keydown', handleKeyPress)
  return () => window.removeEventListener('keydown', handleKeyPress)
}, [handleKeyPress]) // Stabilní dependency díky useCallback
```

### 10. Přidat ARIA Labels
**Soubory:** Všechny interaktivní komponenty

**Příklady:**
```typescript
// Tlačítka odpovědí
<button
  aria-label={`Odpověď ${String.fromCharCode(65 + index)}: ${answer.text}`}
  aria-pressed={selectedAnswer === index}
  // ...
>

// Timer
<div aria-live="polite" aria-atomic="true">
  <span className="sr-only">Zbývající čas:</span>
  {formatTime(timeRemaining)}
</div>

// Progress bar
<div
  role="progressbar"
  aria-valuenow={currentQuestionIndex + 1}
  aria-valuemin={1}
  aria-valuemax={questions.length}
  aria-label="Postup v testu"
>
```

---

## 📋 MEDIUM PRIORITY ÚKOLY

### 11. Redukovat Dog Animation Duplication
**Problém:** 90% kódu duplicitního napříč 10 soubory

**Vytvořit:** `components/dog-animations/base-dog-animation.tsx`

```typescript
interface BaseDogAnimationProps {
  emoji: string
  gradientFrom: string
  gradientTo: string
  title: string
  subtitle: string
  children?: ReactNode // Specifické animační prvky
  animations: Record<string, Keyframes>
}

export function BaseDogAnimation({
  emoji,
  gradientFrom,
  gradientTo,
  title,
  subtitle,
  children,
  animations
}: BaseDogAnimationProps) {
  return (
    <div className={`w-full py-12 overflow-hidden bg-gradient-to-b ${gradientFrom} ${gradientTo} rounded-2xl relative`}>
      {children}

      <div className="relative z-10 mx-auto" style={{ width: '200px' }}>
        <div className="text-center">
          <div className="text-7xl mb-2">{emoji}</div>
        </div>
      </div>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center">
        <div className="text-2xl font-bold text-white mb-1 drop-shadow-lg">
          {title}
        </div>
        <div className="text-sm text-white/90 drop-shadow-md">
          {subtitle}
        </div>
      </div>

      <style jsx>{animations}</style>
    </div>
  )
}
```

### 12. Data Migration Strategy
**Vytvořit:** `lib/migrations.ts`

```typescript
const MIGRATION_VERSION = 1

export function runMigrations() {
  const currentVersion = localStorage.getItem('app-version')

  if (!currentVersion || parseInt(currentVersion) < MIGRATION_VERSION) {
    // Migration logic
    migrateToV1()
    localStorage.setItem('app-version', MIGRATION_VERSION.toString())
  }
}

function migrateToV1() {
  // Example: Rename old keys
  const oldData = localStorage.getItem('old-key')
  if (oldData) {
    localStorage.setItem('new-key', oldData)
    localStorage.removeItem('old-key')
  }
}
```

### 13. Loading Skeleton States
**Vytvořit:** `components/ui/skeleton.tsx`

**Použít v:**
- Quiz loading
- Questions loading
- Dog collection loading

### 14. Fix Mobile Touch Targets
**Problém:** Tlačítka menší než 44x44px

**Opravit v:**
- Answer buttons
- Navigation buttons
- Settings icons

**Minimum:**
```typescript
className="min-h-[44px] min-w-[44px] p-3"
```

### 15. Design System Documentation
**Vytvořit:** `docs/design-system.md`

**Obsahovat:**
- Color palette (indigo-600, purple-600, atd.)
- Typography scale (text-sm, text-base, text-lg)
- Spacing scale (gap-4, p-6, mb-8)
- Component patterns
- Animation guidelines

---

## ✅ Nice to Have (Nižší Priorita)

- Nastavit Vitest pro testování
- Přidat dark mode toggle (nyní jen system)
- Implementovat quiz pause feature
- Přidat search/filter k exam questions
- Sound notifications pro dog unlocks
- PWA manifest pro install
- Service worker pro offline mode

---

## 📊 Kontext z Auditu

**UX/UI Issues:** 62 celkem (5 critical, 17 high, 23 medium, 17 low)
**Frontend Issues:** 25 celkem (2 critical, 3 high, 12 medium, 8 low)
**Security Issues:** 13 celkem (3 critical, 3 high, 4 medium, 3 low)

**Estimated Fix Time:**
- Critical issues: ~8 hours
- High priority: ~35 hours
- Medium priority: ~25 hours

---

## 🎯 Doporučené Pořadí

1. **Den 1:** Critical issues 1-3 (Security)
2. **Den 2:** Critical issues 4-5 (UX metadata + overflow)
3. **Den 3-4:** High priority 6-7 (Refactor + API auth)
4. **Den 5:** High priority 8-10 (SafeStorage + performance)
5. **Týden 2:** Medium priority issues

---

## 📁 Klíčové Soubory k Review

- `SESSION_SUMMARY.md` - Kompletní dokumentace session
- `app/midterm-quiz/page.tsx` - Největší soubor, potřebuje refactor
- `hooks/use-dog-collection.ts` - Potřebuje Zod validaci
- `components/dog-animations/` - 90% code duplication
- `app/layout.tsx` - Metadata + lang + ErrorBoundary
- `.env*` - ROTOVAT CREDENTIALS!

---

## 🚀 Po Dokončení Critical + High Issues

1. Spustit build a zkontrolovat warnings
2. Testovat na mobile (Chrome DevTools)
3. Lighthouse audit (target >90)
4. Accessibility audit (axe DevTools)
5. Deploy na Vercel
6. Update `SESSION_SUMMARY.md` s progress

---

**Začni s Critical Issue #1 (Rotate credentials) a postupuj pořadě. Ptej se, pokud narazíš na nejasnosti!**
