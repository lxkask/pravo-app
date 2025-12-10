# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Moderní digitální učebnice práva** - AI-powered studijní platforma pro přípravu na zkoušku z Práva.

**Hlavní koncept:** Zpracovat všechny dostupné studijní materiály pomocí AI do moderní, čitelné učebnice s garantovanou důvěryhodností obsahu (zero hallucinations, 100% source tracking).

**Viz kompletní koncept:** `KONCEPT-MODERNICH-UCEBNIC.md`

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS
- **Storage**: LocalStorage pro progres tracking (MVP fáze)

## Development Commands

### Database

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name <migration_name>

# Seed database with test data
npm run db:seed

# Open Prisma Studio (database GUI)
npx prisma studio
```

### Application

```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture

### Database Schema

**Category** - Kategorie otázek (např. Základy práva, Obchodní právo)
- Relace: 1:N s Question
- Pole: name (unique), description, color (pro UI odlišení)

**Question** - Otázky s různými typy (SINGLE_CHOICE, MULTIPLE_CHOICE, TRUE_FALSE)
- Relace: N:1 s Category, 1:N s Answer
- Pole: text, explanation, type (enum), difficulty (EASY/MEDIUM/HARD)

**Answer** - Odpovědi na otázky
- Relace: N:1 s Question
- Pole: text, isCorrect (boolean)

### API Routes

- `/api/categories` - GET všech kategorií, POST nové kategorie
- `/api/questions` - GET otázek (s filter ?categoryId=...), POST nové otázky
- `/api/questions/random` - GET náhodných otázek (?categoryId=...&limit=10)

### Page Routes

- `/` - Hlavní stránka s výběrem kategorií
- `/quiz/[categoryId]` - Quiz rozhraní pro specifickou kategorii
- `/admin` - Admin rozhraní pro správu kategorií a otázek

### Key Components Structure

**Quiz Flow:**
1. Uživatel vybere kategorii na homepage
2. Načtou se náhodné otázky z API
3. Pro každou otázku: zobrazení → výběr odpovědi → kontrola → vysvětlení → další
4. Po dokončení: výsledky (skóre, procenta) + možnost opakování
5. Progres se ukládá do LocalStorage

**Admin Flow:**
1. Vytvoření kategorie (název, popis, barva)
2. Přidání otázky (text, typ, obtížnost, kategorie, odpovědi)
3. Označení správných odpovědí (checkbox)

## Prisma Client Import

Always use: `import { PrismaClient } from '@prisma/client'`

For server-side database access, import the singleton instance:
```typescript
import { prisma } from '@/lib/prisma'
```

### AI Content Extraction (Fáze 2)

```bash
# Extract content from .docx file
tsx scripts/extract-documents.ts "../path/to/document.docx"

# List available extractions
tsx scripts/import-to-database.ts --list

# Import extraction to database
tsx scripts/import-to-database.ts ./extractions/file.json "Category Name"
```

Requires `ANTHROPIC_API_KEY` environment variable.

See `scripts/README.md` for detailed documentation.

## Development Phases

### ✅ Fáze 1: MVP Core (DOKONČENO)
- Next.js aplikace s PostgreSQL
- Quiz režim s různými typy otázek
- Admin rozhraní pro správu
- LocalStorage progres tracking

### 🔄 Fáze 2: PIVOT - Moderní Učebnice (CURRENT)

**Důvod změny směru:** Původní přístup (Lesson → Topic → Section s collapsible UI) byl příliš fragmentovaný a nepřirozený pro učení. Nový koncept se zaměřuje na plynulé čtení jako v moderní učebnici.

**NOVÝ PŘÍSTUP:**
- ✅ Koncept schválen (viz KONCEPT-MODERNICH-UCEBNIC.md)
- 🔜 Redesign databázového schématu (Chapter → Lesson structure)
- 🔜 AI pipeline pro master osnovu ze VŠECH dokumentů
- 🔜 Source tracking system (zero hallucinations)
- 🔜 Conflict detection mezi dokumenty
- 🔜 Human validation workflow
- 🔜 Nové UI: Moderní učebnice (desktop + mobile optimized)
- 🔜 Reading progress, bookmarks, notes

**Zpracování dokumentů:**
- 🔜 CELÉ PRÁVO DLE NOZ - NIKOLA KUCHAŘÍKOVÁ.docx
- 🔜 Základy práva - kompletně vše, co potřebujete.docx
- 🔜 obchodnipravo_zapisky_1-4.docx
- 🔜 zápočtový test.doc
- 🔜 gl-obchodnipravo/ (složka)
- 🔜 Komplet teorie s otázkami ke zkoušce ZP,OP/ (složka)

### 🔜 Fáze 3: Quiz generování z učebnice (PLÁNOVÁNO)
- Automatické generování kvízů z ověřeného obsahu lekcí
- Propojení konceptů z učebnice s testovými otázkami
- Adaptivní obtížnost na základě čtení

### 🔜 Fáze 4: Full-stack upgrade (PLÁNOVÁNO)
- Autentizace (NextAuth.js)
- Synchronizace mezi zařízeními
- Pokročilé statistiky a analytics

## Important Notes

- **Database:** PostgreSQL (Prisma) - production ready
- **Progres:** LocalStorage pro MVP, později server-side tracking
- **Autentizace:** V MVP není autentizace - všichni sdílejí stejnou databázi
- **AI Safety:** KRITICKÉ - AI nesmí nic vymýšlet, pouze citovat z dokumentů!

## Core Principles (MUST FOLLOW)

### 1. Content Integrity (Nejvyšší priorita)
- ✅ **ZERO AI HALLUCINATIONS** - AI pouze zpracovává existující dokumenty
- ✅ **100% SOURCE TRACKING** - každý kus textu má odkaz na zdroj
- ✅ **MULTI-SOURCE VALIDATION** - když se něco opakuje → důležité
- ✅ **CONFLICT DETECTION** - rozpory mezi dokumenty → oznámit
- ✅ **HUMAN VALIDATION** - obsah musí být schválen před publikací

### 2. UX Principles
- ✅ **MOBILE FIRST** - primární optimalizace pro mobil
- ✅ **HIGH READABILITY** - velké písmo, vysoký kontrast, dark mode
- ✅ **CONTINUOUS READING** - ne fragmentované klikání
- ✅ **FLEXIBLE NAVIGATION** - čti jako knihu NEBO skoč na téma

### 3. Reading Experience
- Typography: 16-18px base, line-height 1.75
- Max content width: 800px (čitelnost)
- Sections: přehledné, ale ne přetížené
- Dark mode: deep dark s high contrast
- No visual noise: minimální boxy, ikony, badges

## AI Workflow Guidelines

Když pracuješ s extrakcí obsahu:

1. **NIKDY nevymýšlej text** - pouze cituj z dokumentů
2. **VŽDY trackuj zdroj** - každý odstavec = odkaz na původní soubor + stránka
3. **Označ konflikty** - když se dokumenty liší
4. **99% doslovné citace** - jen minimální úpravy pro plynulost
5. **Validace před uložením** - nejdřív preview, pak schválení

Viz `KONCEPT-MODERNICH-UCEBNIC.md` pro detailní AI workflow.
