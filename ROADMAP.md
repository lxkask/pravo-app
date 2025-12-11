# 🗺️ ROADMAP: Dotažení Pravo-Quiz-App do Dokonalosti

**Cíl:** Vytvořit efektivní učební nástroj pro přípravu na zkoušku z Práva

**Status:** Sprint 0 dokončen (Základní funkcionalita + Midterm-quiz improvements)

---

## 📊 Současný stav

### ✅ Co funguje
- **Midterm-quiz**: 94 otázek, 2 módy (Practice/Test), progress tracking v LocalStorage
- **Exam-questions**: 40 otázek s krátkými odpověďmi, 10/40 má dlouhé odpovědi
- **Lessons**: Základní implementace s markdown renderingem
- **Textbook**: Koncept připraven (KONCEPT-MODERNICH-UCEBNIC.md)
- **Design**: Moderní UI, dark mode, responsive, mobile-friendly
- **Tech stack**: Next.js 16, PostgreSQL, Prisma, TypeScript, Vercel

### ⚠️ Co chybí
- **30 z 40 zkouškových otázek nemá longAnswer** (CRITICAL)
- Žádný progress tracking v exam-questions
- Není flashcard mód pro aktivní recall
- Chybí PWA funkcionalita (offline)
- Žádné vyhledávání/filtrování
- Není onboarding pro nové uživatele

---

## 🎯 PRIORITIZOVANÝ AKČNÍ PLÁN

### SPRINT 1: Quick Wins & Critical Fixes (1-2 týdny)
**Cíl:** Dokončit základní funkcionalitu a opravit kritické nedostatky

#### Week 1
- [ ] **[DAY 1-2] [CRITICAL]** Dokončit long answers (30/40 otázek)
  - Spustit `process-exam-answers-batched.ts` script
  - Review a commit do databáze
  - Human validace českých znaků

- [ ] **[DAY 3] [HIGH]** Progress tracking pro exam-questions
  - Vytvořit `lib/exam-progress-tracker.ts` (pattern z midterm)
  - LocalStorage: `{ questionId: { learned: bool, confidence: 1-5, lastReviewed: date } }`
  - UI: Checkbox "Naučil jsem se" pod každou otázkou
  - Progress bar na exam-questions homepage

- [ ] **[DAY 4] [HIGH]** Study Hub homepage
  - Dashboard s overview: "Midterm: X/94", "Exam: X/40 naučeno"
  - Quick resume buttons
  - Study streak tracking: "7 dní v řadě 🔥"

#### Week 2
- [ ] **[DAY 5] [HIGH]** Loading states & Error handling
  - Skeleton UI pro exam-questions list
  - Error boundaries pro každou page
  - Retry buttons na error screens

- [ ] **[DAY 6-7] [HIGH]** Human validace obsahu
  - Checklist pro review všech 40 odpovědí
  - Zkontrolovat české znaky (čřšž)
  - Ověřit markdown formátování

**Výstup Sprint 1:** Kompletní aplikace s 40 otázkami, progress tracking, stabilní UX

---

### SPRINT 2: Study Features (1-2 týdny)
**Cíl:** Přidat features co skutečně pomohou při učení

#### Features
- [ ] **[DAY 1-3] [HIGH]** Flashcard mód
  - Route: `/exam-questions/flashcards`
  - UI: Karta s otázkou → "Ukázat odpověď" → "Znám ✓" / "Neznám ✗"
  - Adaptivní: Častěji ukazovat "Neznám" otázky
  - Session statistiky: 15 správně, 3 špatně

- [ ] **[DAY 4] [HIGH]** Bookmarks & Favorites
  - Star ikona u každé otázky
  - "Oblíbené otázky" sekce
  - "Těžké otázky" auto-bookmark (když 2x+ špatně)

- [ ] **[DAY 5] [HIGH]** Search funkce
  - Search bar na exam-questions page
  - Full-text search v otázkách i odpovědích
  - Instant results (client-side)
  - Keyboard shortcut: Cmd+K / Ctrl+K

- [ ] **[DAY 6-7] [HIGH]** PWA implementace
  - Service Worker pro offline caching
  - Manifest.json pro "Add to Home Screen"
  - Offline fallback page
  - Cache exam questions pro offline study

**Výstup Sprint 2:** Efektivní study tool s flashcards, offline support

---

### SPRINT 3: Polish & Optimization (1 týden)
**Cíl:** Vylepšit UX a performance

- [ ] **[DAY 1-2] [MEDIUM]** Mobile optimizations
  - Swipe gestures (left/right navigace)
  - Typography audit (readability)
  - Touch target sizes (min 44x44px)

- [ ] **[DAY 3] [MEDIUM]** Onboarding flow
  - Modal: "Vítej! Jak chceš začít?"
  - Tooltip hints na hlavních features
  - "Doporučený study path" guide

- [ ] **[DAY 4] [MEDIUM]** Table of Contents
  - Auto-generate TOC z markdown headers
  - Sticky TOC sidebar (desktop)
  - Smooth scroll k sekcím

- [ ] **[DAY 5] [MEDIUM]** Performance audit
  - Bundle size optimization
  - Lazy load markdown renderer
  - Image optimization

- [ ] **[DAY 6-7] [MEDIUM]** Metadata pro otázky
  - Kategorie/témata ("Právní subjekty", "Smlouvy")
  - Důležitost (HIGH/MEDIUM/LOW)
  - Filter podle kategorií

**Výstup Sprint 3:** Polished, rychlá, mobile-first aplikace

---

### SPRINT 4: Advanced Features (budoucnost)
**Cíl:** Pokročilé study features

- [ ] **Spaced Repetition System (SRS)**
  - Algoritmus: Opakování po 1, 3, 7, 14, 30 dnech
  - "Dnes k opakování: 5 otázek" notifikace
  - Dashboard widget

- [ ] **Study timer & Pomodoro**
  - Session timer: "Studoval jsi 45 minut dnes"
  - Pomodoro mode: 25 min studium, 5 min pauza
  - Daily study goal

- [ ] **Smart recommendations**
  - "Doporučujeme ti tyto otázky"
  - "Podobné otázky" link
  - "Nejčastěji špatně zodpovězené"

- [ ] **Propojení midterm ↔ exam**
  - Mapování podobných témat
  - "Další studium k této otázce" link
  - "Procvičit toto téma v testu"

- [ ] **Master outline učebnice**
  - 12 kapitol, 44 lekcí
  - Multi-source consolidation
  - Source tracking system

**Výstup Sprint 4:** Profesionální study platform

---

## 📋 DETAILNÍ OBLASTI

### 1. OBSAH & DATA KVALITA

**Akce:**
- [x] Midterm-quiz kompletní (94 otázek)
- [x] Exam-questions základní (40 otázek, krátké odpovědi)
- [ ] Dokončit longAnswer pro 30 otázek (CRITICAL)
- [ ] Validovat správnost všech odpovědí
- [ ] Přidat metadata (kategorie, důležitost)
- [ ] Propojit midterm ↔ exam otázky
- [ ] Master outline učebnice (dlouhodobý projekt)

**Soubory:**
- `scripts/process-exam-answers-batched.ts` - Extraction script
- `prisma/schema.prisma` - Schema pro metadata
- `app/api/exam-questions/route.ts` - API

---

### 2. UX/UI OPTIMALIZACE

**Akce:**
- [ ] Study Hub homepage (dashboard s overview)
- [ ] Onboarding flow pro nové uživatele
- [ ] Global progress indicator v headeru
- [ ] Breadcrumbs navigace
- [ ] Dark mode toggle v UI
- [ ] Micro-interactions (confetti, sounds)

**Soubory:**
- `app/page.tsx` - Homepage → Study Hub
- `app/exam-questions/page.tsx` - Search, filtering, progress
- `components/` - Nové UI komponenty

---

### 3. STUDY FEATURES

**Akce:**
- [ ] Progress tracking exam-questions (MUST HAVE)
- [ ] Flashcard mód (biggest learning impact)
- [ ] Bookmarks & Favorites
- [ ] Study timer & Pomodoro
- [ ] Spaced Repetition System
- [ ] Poznámky k otázkám
- [ ] Smart recommendations

**Soubory:**
- `lib/exam-progress-tracker.ts` - Nový tracker
- `app/exam-questions/flashcards/page.tsx` - Flashcard mode
- `lib/spaced-repetition.ts` - SRS algoritmus

---

### 4. PERFORMANCE & CODE QUALITY

**Akce:**
- [ ] Loading states & Skeletons
- [ ] Error boundaries
- [ ] Optimalizace rychlosti (bundle, lazy load)
- [ ] Database cleanup (deprecated models)
- [ ] Unit testy (Vitest)
- [ ] E2E testy (Playwright)
- [ ] Analytics & Monitoring

**Soubory:**
- `components/loading-skeleton.tsx` - Loading UI
- `app/error.tsx` - Error boundaries
- `tests/` - Test suite

---

### 5. MOBILE EXPERIENCE

**Akce:**
- [ ] PWA implementace (offline, install)
- [ ] Mobile typography audit
- [ ] Swipe gestures (navigace)
- [ ] Share button (Web Share API)
- [ ] iOS/Android optimizations

**Soubory:**
- `public/manifest.json` - PWA manifest
- `public/service-worker.js` - Service Worker
- `app/layout.tsx` - PWA meta tags

---

### 6. CONTENT DISCOVERY & SEARCH

**Akce:**
- [ ] Search funkcionalita (Cmd+K)
- [ ] Filtering podle kategorií
- [ ] Sorting (číslo, důležitost)
- [ ] Table of Contents pro dlouhé odpovědi
- [ ] Tags systém

**Soubory:**
- `components/search-bar.tsx` - Search UI
- `components/table-of-contents.tsx` - TOC component
- `lib/search.ts` - Search logic

---

### 7. COLLABORATION & SHARING

**Akce:**
- [ ] Share funkce (Web Share API)
- [ ] Export (progress JSON, PDF)
- [ ] User accounts (NextAuth.js)
- [ ] Study groups (budoucnost)

**Soubory:**
- `app/api/auth/[...nextauth]/route.ts` - NextAuth
- `lib/export.ts` - Export logic

---

### 8. TECHNICAL DEBT & MAINTENANCE

**Akce:**
- [ ] Aktualizovat dokumentaci
- [ ] Database migration (remove deprecated)
- [ ] Staging environment
- [ ] Changelog & Versioning

**Soubory:**
- `README.md` - Refresh
- `CLAUDE.md` - Update
- `CHANGELOG.md` - Nový soubor

---

## 🎯 METRIKY ÚSPĚCHU

### User Experience
- [ ] Onboarding completion rate > 80%
- [ ] Daily active usage > 15 min
- [ ] Mobile usage > 60%
- [ ] Progress tracking engagement > 70%

### Learning Effectiveness
- [ ] Test score improvement: +20% po 2 týdnech
- [ ] Flashcard retention rate > 75%
- [ ] All 40 questions reviewed min 1x
- [ ] Study streak: 7+ dní u aktivních uživatelů

### Technical
- [ ] Page load time < 2s (desktop), < 3s (mobile)
- [ ] Zero critical bugs
- [ ] 100% uptime (Vercel)
- [ ] PWA install rate > 30%

### Content Quality
- [ ] 40/40 otázek s long answers
- [ ] 100% human-validated obsah
- [ ] Nula AI halucinací
- [ ] Správné české znaky všude

---

## 🔧 KRITICKÉ SOUBORY

### Data & Content
- `scripts/process-exam-answers-batched.ts` - Long answers extraction
- `prisma/schema.prisma` - Database schema
- `app/api/exam-questions/route.ts` - API

### Progress Tracking
- `lib/midterm-progress-tracker.ts` - Pattern reference
- `lib/exam-progress-tracker.ts` - NEW: Exam tracker

### UI Components
- `app/page.tsx` - Homepage → Study Hub
- `app/exam-questions/page.tsx` - List s progress
- `app/exam-questions/[id]/page.tsx` - Detail s controls
- `app/exam-questions/flashcards/page.tsx` - NEW: Flashcards

### PWA
- `public/manifest.json` - NEW: PWA manifest
- `public/service-worker.js` - NEW: Service Worker

### Performance
- `components/formatted-answer.tsx` - Optimize rendering

---

## 📝 POZNÁMKY

### Co je MUST HAVE pro v1.0?
1. ✅ Midterm-quiz (DONE)
2. [ ] Všech 40 long answers (CRITICAL)
3. [ ] Progress tracking v exam-questions
4. [ ] Flashcard mód
5. [ ] PWA (offline)
6. [ ] Search

### Co je nice-to-have?
- Spaced repetition
- Study timer
- User accounts
- Study groups
- Master outline učebnice

### Odhad práce
- **Sprint 1+2**: ~60-80 hodin → Production-ready app
- **Sprint 3**: ~20-30 hodin → Polished experience
- **Sprint 4**: ~40-60 hodin → Advanced platform

---

**Last updated:** 2025-12-11
**Version:** 1.0-draft
