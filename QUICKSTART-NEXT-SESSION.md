# 🚀 Quick Start - Příští Session

**Last updated:** 2025-12-08 23:15 CET

---

## ⚡ Co udělat HNED na začátku

### 1️⃣ Otevři tento soubor:
```bash
code SESSION-STATUS.md
```
→ Kompletní checklist co dělat

### 2️⃣ Projdi si kde jsme skončili:
```bash
code DECISIONS.md
```
→ Scroll úplně dolů → sekce "Aktuální Implementační Progress"

### 3️⃣ Začni implementovat:

**VARIANTA A: Pokračuj kde jsme skončili**
```bash
# Krok 1: Fix konfliktů (5 min)
code extractions/master-outline-2025-12-08T23-14-59-201Z.json

# Krok 2: Content assembly script (20 min)
code scripts/assemble-lesson-content.ts
# → Viz template níže
```

**VARIANTA B: Rovnou na UI prototyp**
```bash
# Přeskoč content assembly, udělej UI s fake daty
code app/textbook/page.tsx
# → Rychlejší feedback loop
```

---

## 📋 Template pro Content Assembly Script

Vytvoř: `scripts/assemble-lesson-content.ts`

```typescript
import 'dotenv/config'
import Anthropic from '@anthropic-ai/sdk'
import * as fs from 'fs'
import * as path from 'path'
import mammoth from 'mammoth'

// TODO:
// 1. Načti master outline
// 2. Najdi lekci podle názvu
// 3. Pro každý source v lekci:
//    - Načti dokument
//    - Najdi relevantní část (podle str. nebo hledání)
//    - Cituj doslovně
// 4. Poskládej do markdown
// 5. Přidej source tracking
// 6. Ulož do databáze

// Viz scripts/generate-master-outline.ts jako reference
```

---

## 🎨 Template pro UI

Vytvoř: `app/textbook/page.tsx`

```tsx
'use client'

export default function TextbookPage() {
  // TODO:
  // 1. Fetch kapitoly z databáze
  // 2. Zobraz jako cards (title, description, počet lekcí)
  // 3. Link na /textbook/[chapterId]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">
          📚 Moderní Učebnice Práva
        </h1>

        {/* Grid kapitol */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* TODO: map chapters */}
        </div>
      </div>
    </div>
  )
}
```

---

## 🔍 Užitečné příkazy

```bash
# Zkontrolovat master outline
cat extractions/master-outline-*.json | grep -A 5 "title"

# Spustit dev server
npm run dev

# Otevřít databázi
npx prisma studio

# Vygenerovat Prisma client (po změnách schématu)
npx prisma generate

# Zkontrolovat git status
git status
```

---

## 📚 Kde najít info

1. **Celková vize:** `KONCEPT-MODERNICH-UCEBNIC.md`
2. **Aktuální stav:** `SESSION-STATUS.md` ← ZAČNI TADY
3. **Technické detaily:** `CLAUDE.md`
4. **Script návod:** `scripts/README-MODERN-TEXTBOOK.md`

---

## 🎯 Cíl příští session

**MVP Proof of Concept:**
- [ ] 2-3 lekce vygenerované v databázi
- [ ] Základní UI fungující (kapitoly → lekce → detail)
- [ ] Markdown rendering
- [ ] Mobile responsive

**Když to bude fungovat →** ukázat uživateli a získat feedback!

---

**💡 Tip:** Začni tím co tě nejvíc baví - buď AI/data část nebo UI část. Obojí je důležité!
