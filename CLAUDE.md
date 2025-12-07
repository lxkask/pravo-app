# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Quiz aplikace pro přípravu na zkoušku z Práva - interaktivní platforma s testovacími otázkami, flashcards a studijními materiály. MVP verze s plánovaným rozšířením o AI-powered extrakci obsahu z dokumentů.

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
- Next.js aplikace s SQLite
- Quiz režim s různými typy otázek
- Admin rozhraní pro správu
- LocalStorage progres tracking

### 🚧 Fáze 2: AI Extrakce (V PROCESU)
- ✅ Rozšířené databázové schéma (Lesson, Topic, Section)
- ✅ AI extraction script s Claude API
- ✅ Strukturované prompty pro přesnou extrakci
- ✅ Import pipeline do databáze
- 🔜 UI pro prohlížení lekcí a teorie
- 🔜 Validace a review systém
- 🔜 Automatické generování kvízů z obsahu

### 🔜 Fáze 3: Rozšíření funkcí (PLÁNOVÁNO)
- Flashcards mode
- Přehled teorie
- Praktické případy (kazusy)
- Pokročilé statistiky

### 🔜 Fáze 4: Full-stack upgrade (PLÁNOVÁNO)
- Autentizace (NextAuth.js)
- PostgreSQL/MySQL
- Synchronizace mezi zařízeními

## Important Notes

- SQLite databáze je uložena v `prisma/dev.db`
- Progres uživatele je v LocalStorage pod klíčem 'quizProgress'
- V MVP není autentizace - všichni sdílejí stejnou databázi
- Seed data obsahují 2 kategorie a 6 testovacích otázek

## Future AI Integration Plan

Dokumenty v nadřazeném adresáři obsahují zdrojové materiály:
- `CELÉ PRÁVO DLE NOZ - NIKOLA KUCHAŘÍKOVÁ.docx`
- `gl-obchodnipravo(vseborec.cz-b8227)/` složka
- `Komplet teorie s otázkami ke zkoušce ZP,OP/` složka
- PDF soubory s teorií

Tyto budou zpracovány v Fázi 2 pomocí Claude API pro automatickou extrakci otázek.
