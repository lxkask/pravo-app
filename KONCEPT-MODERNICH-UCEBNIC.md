# 📖 Koncept: Moderní Digitální Učebnice Práva

## 🎯 Vize

Vytvořit **moderní, AI-zpracovanou digitální učebnici práva**, která:
- Slouží jako primární zdroj pro přípravu na test a zkoušku
- Je postavená na **100% důvěryhodném obsahu** z existujících studijních materiálů
- Poskytuje plynulé, příjemné čtení jak na mobilu, tak na desktopu
- Umožňuje jak "knihovní" čtení (plynule od začátku), tak "referenční" přístup (skok na konkrétní téma)

## 🚫 Co NECHCEME (problémy starého přístupu)

### Technické problémy:
- ❌ Fragmentace: Lesson → Topic → Section (příliš vnořené)
- ❌ Collapsible UI: Neustálé klikání na otevření/zavření
- ❌ Vizuální noise: Každá sekce v barevném boxu s ikonami a badges
- ❌ Špatný kontrast textu (dark mode problémy)
- ❌ "Reference dokumentace" místo učebnice

### Obsahové problémy:
- ❌ Zpracován pouze 1 dokument z 5-6 dostupných
- ❌ Riziko, že AI si něco vymyslí mimo dokumenty
- ❌ Žádná kontrola zdrojů
- ❌ Žádná validace správnosti obsahu

## ✅ Co CHCEME (nový přístup)

### Čtení a UX:
- ✅ **Delší souvislé čtení** - ne 5 minut a přepínání
- ✅ **Přehledné sekce** - strukturované, ale ne fragmentované
- ✅ **Flexibilní navigace:**
  - Možnost A: Číst jako knihu (plynule od začátku)
  - Možnost B: Skočit přímo na konkrétní lekci/téma
- ✅ **Perfektní mobilní optimalizace** (priorita #1)
- ✅ **Perfektní desktop experience** (priorita #2)
- ✅ **Vysoký kontrast, čitelnost, dark mode**

### Obsah a AI zpracování:
- ✅ **Zero hallucinations** - AI POUZE zpracovává existující dokumenty
- ✅ **Source tracking** - každý kus textu má odkaz na původní dokument
- ✅ **Multi-source consolidation** - když se něco opakuje ve více dokumentech → důležité
- ✅ **Conflict detection** - když se dokumenty liší → oznámit na kontrolu
- ✅ **Human validation** - možnost zkontrolovat a schválit před publikací

## 📚 Dostupné Studijní Materiály

```
/pravo-app/
├── CELÉ PRÁVO DLE NOZ - NIKOLA KUCHAŘÍKOVÁ.docx (174 KB)
├── Základy práva - kompletně vše, co potřebujete.docx (59 KB)
├── obchodnipravo_zapisky_1-4.docx (81 KB)
├── zápočtový test.doc (444 KB)
├── gl-obchodnipravo/ (složka)
└── Komplet teorie s otázkami ke zkoušce ZP,OP/ (složka)
```

**Celkem:** ~6 hlavních zdrojů (kombinace .docx, .doc, složky s PDF/dalšími soubory)

## 🏗️ Architektura Řešení

### 1. Databázová Struktura (NOVÁ)

```
Category (Kategorie předmětu)
  └─ Chapter (Kapitola - např. "Právní subjekty")
      └─ Lesson (Lekce - dlouhý markdown článek)
          ├─ content (markdown text)
          ├─ sourceMapping (JSON: které části pocházejí odkud)
          └─ Concept[] (klíčové pojmy pro budoucí kvízy)
```

**Klíčové změny:**
- Odstranění Topic a Section modelů
- Lesson = jeden souvislý markdown dokument
- SourceMapping = transparentnost odkud text pochází

### 2. AI Workflow (3 fáze)

#### **Fáze 1: Master Osnova (Syllabus Generation)**

**Input:** Všechny dostupné dokumenty

**AI úkol:**
1. Přečti VŠECHNY dokumenty
2. Vytvoř kompletní osnovu celého předmětu Právo
3. Identifikuj hlavní kapitoly (Chapters)
4. Pro každou kapitolu navrhni podlekce (Lessons)
5. Označ překryvy mezi dokumenty
6. **NEVYMÝŠLEJ** - pouze strukturuj co je v dokumentech

**Output:**
```json
{
  "chapters": [
    {
      "title": "Úvod do práva",
      "order": 1,
      "lessons": [
        {
          "title": "Co je právo",
          "sources": ["CELÉ PRÁVO DLE NOZ str. 1-3", "Základy práva str. 1-2"],
          "estimatedLength": "medium"
        }
      ]
    }
  ],
  "conflicts": [
    {
      "topic": "Definice právní subjektivity",
      "issue": "CELÉ PRÁVO říká X, Základy práva říká Y",
      "needsReview": true
    }
  ]
}
```

#### **Fáze 2: Konsolidace Obsahu (Content Assembly)**

**Pro každou Lesson:**

**AI úkol:**
1. Najdi všechny relevantní části ze VŠECH dokumentů
2. Uspořádej je do logického pořadí
3. **99% citace** - zkopíruj text doslovně z dokumentů
4. Pouze minimální úpravy pro plynulost (spojky, přechody)
5. Každý odstavec označ zdrojem: `<!-- SOURCE: CELÉ PRÁVO, str. 5 -->`
6. Při rozporech: označ `<!-- CONFLICT: zkontrolovat -->`

**Output:**
```markdown
# Právní subjekty - Fyzické osoby

<!-- SOURCE: CELÉ PRÁVO DLE NOZ, str. 23 -->
Fyzická osoba je člověk. Každý člověk má od narození přirozená práva...

## Způsobilost k právním úkonům

<!-- SOURCE: Základy práva, str. 15 -->
**Způsobilost k právním úkonům** (svéprávnost) je schopnost vlastními úkony...

<!-- SOURCE: CELÉ PRÁVO DLE NOZ, str. 24 -->
> § 15 NOZ: Plně svéprávný je ten, kdo nabyl zletilosti. Zletilosti se nabývá...

<!-- SOURCES: Základy práva str. 16, obchodnipravo_zapisky str. 3 -->
### Praktický příklad
Když si 16letý student chce koupit auto, nemůže samostatně podepsat...
```

#### **Fáze 3: Validace a Schválení**

**Workflow:**
1. AI vygeneruje preview lekce
2. Zobrazí se ti s:
   - ✅ Source tracking viditelný
   - ⚠️ Označené konflikty
   - 📊 Statistiky (kolik % z jakého dokumentu)
3. Ty:
   - Zkontro luješ obsah
   - Opravíš chyby/konflikty
   - Označíš jako "Schváleno"
4. Po schválení → `verified: true` v databázi

### 3. UI/UX Design

#### **Desktop Experience**

```
┌─────────────────────────────────────────────────────┐
│ [Logo] Právo - Moderní učebnice        [🌙] [User] │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ OBSAH    │  # Právní subjekty - Fyzické osoby      │
│          │                                          │
│ 📖 Úvod  │  Fyzická osoba je člověk. Každý člověk  │
│   • Co   │  má od narození přirozená práva...      │
│   • Jak  │                                          │
│          │  ## Způsobilost k právním úkonům        │
│ 👤 Subjek│                                          │
│   • Fyzi │  **Způsobilost k právním úkonům** je... │
│   • Práv │                                          │
│          │  [... souvislý text ...]                │
│ [70%]    │                                          │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
   Sidebar      Main Content (scrollable)
   (sticky)
```

**Featury:**
- Sticky sidebar s Table of Contents
- Automatické zvýraznění aktuální sekce při scrollu
- Progress bar (kolik % kapitoly jsi přečetl)
- Smooth scroll mezi sekcemi
- Typography: velké řádkování, vysoký kontrast

#### **Mobile Experience**

```
┌──────────────────────┐
│ [≡] Právní subjekty  │ ← Sticky header
├──────────────────────┤
│                      │
│ # Právní subjekty -  │
│   Fyzické osoby      │
│                      │
│ Fyzická osoba je     │
│ člověk. Každý člo-   │
│ věk má od narození   │
│ přirozená práva...   │
│                      │
│ ## Způsobilost k     │
│    právním úkonům    │
│                      │
│ **Způsobilost k...** │
│                      │
│ [... scroll ...]     │
│                      │
│ [━━━━━━░░░░] 70%     │ ← Floating progress
└──────────────────────┘
```

**Featury:**
- Hamburger menu s TOC
- Floating progress bar (dole)
- Velké písmo (min 16px base)
- Dostatečné padding
- Žádné collapsible - čistý scroll

#### **Reading Modes**

**Mode 1: Book Mode (Čti jako knihu)**
- Tlačítko "Další lekce" na konci každé lekce
- Plynulý přechod
- Ukládá pozici čtení
- "Pokračovat kde jsi skončil"

**Mode 2: Reference Mode (Skoč na téma)**
- Sidebar nebo menu s celým obsahem
- Vyhledávání
- Direct links na sekce

### 4. Source Tracking System

**V databázi:**
```typescript
interface Lesson {
  id: string
  title: string
  content: string // markdown
  sourceMapping: {
    paragraphs: [
      {
        startLine: 10,
        endLine: 15,
        source: "CELÉ PRÁVO DLE NOZ",
        page: 23,
        confidence: "high" // high = doslovná citace, medium = parafrázováno
      }
    ],
    conflicts: [
      {
        line: 42,
        issue: "Rozdílná definice svéprávnosti",
        sources: ["doc1", "doc2"],
        resolved: false
      }
    ]
  }
  verified: boolean
}
```

**V UI (volitelně zobrazitelné):**
- Tlačítko "Zobrazit zdroje"
- Každý odstavec má hover tooltip: "Zdroj: CELÉ PRÁVO str. 23"
- Pro konflikty: ⚠️ ikona s vysvětlením

## 🛠️ Implementační Plán

### Sprint 1: Příprava a Analýza
- [ ] Vytvořit nové Prisma schéma (Chapter, Lesson s sourceMapping)
- [ ] Připravit AI prompt pro Fázi 1 (Master Osnova)
- [ ] Zpracovat všechny dokumenty → vygenerovat master osnovu
- [ ] Lidská validace osnovy

### Sprint 2: Content Generation Pipeline
- [ ] AI prompt pro Fázi 2 (Konsolidace obsahu)
- [ ] Script pro batch processing všech lekcí
- [ ] Source tracking implementace
- [ ] Conflict detection

### Sprint 3: UI/UX Implementation
- [ ] Nový layout: Sidebar + Main content
- [ ] Mobile-first responsive design
- [ ] Reading progress tracking
- [ ] Dark mode s vysokým kontrastem
- [ ] Typography optimalizace

### Sprint 4: Validační Workflow
- [ ] Admin UI pro review lekcí
- [ ] Source viewer
- [ ] Conflict resolver
- [ ] Schvalovací proces

### Sprint 5: Pokročilé Featury
- [ ] Vyhledávání v obsahu
- [ ] Bookmarks (záložky)
- [ ] Notes (poznámky)
- [ ] Highlight (zvýraznění textu)

## 🎨 Design Principles

### Typography
- **Desktop:** Base font size 18px
- **Mobile:** Base font size 16px
- **Line height:** 1.75 (vysoké řádkování pro čitelnost)
- **Font:** System fonts (San Francisco, Segoe UI, Roboto)
- **Headings:**
  - H1: 2.5em, bold
  - H2: 2em, semibold
  - H3: 1.5em, semibold

### Colors (Dark Mode)
- **Background:** `#0f1419` (deep dark blue)
- **Text:** `#e6edf3` (off-white, vysoký kontrast)
- **Headings:** `#ffffff` (pure white)
- **Links:** `#58a6ff` (bright blue)
- **Borders:** `#30363d` (subtle gray)

### Colors (Light Mode)
- **Background:** `#ffffff`
- **Text:** `#1f2937` (near black)
- **Headings:** `#111827` (pure black)
- **Links:** `#2563eb` (blue)

### Spacing
- **Section gap:** 3rem (48px)
- **Paragraph gap:** 1.5rem (24px)
- **Mobile padding:** 1.5rem (24px)
- **Desktop max-width:** 800px (pro čitelnost)

### Special Elements

**Definice:**
```markdown
> **Právní subjekt** je nositel práv a povinností.
```
→ Rendered jako blockquote s bold term

**Citace zákona:**
```markdown
> § 15 NOZ: Plně svéprávný je ten, kdo nabyl zletilosti...
```
→ Styled jako zákonný paragraf (fialový accent)

**Příklad:**
```markdown
### 💡 Praktický příklad
Text příkladu...
```
→ Light background, emoji ikona

**Důležité upozornění:**
```markdown
> ⚠️ **Pozor:** Toto je kriticky důležité pro zkoušku...
```
→ Yellow/orange accent

## 📊 Success Metrics

### Kvalita obsahu:
- ✅ 100% obsahu má source tracking
- ✅ 0 AI halucinací (vše citováno z dokumentů)
- ✅ Všechny lekce human-verified

### UX Metrics:
- ✅ Průměrná doba čtení > 10 minut (engagement)
- ✅ Mobile reading score > 90/100
- ✅ Desktop reading score > 95/100
- ✅ Accessibility score > 95/100

### Coverage:
- ✅ Všech 6 zdrojových dokumentů zpracováno
- ✅ Kompletní osnova předmětu Právo
- ✅ Min. 20 kvalitních lekcí

## 🔄 Migrace ze Starého Systému

**Co se stane s existujícími daty:**
1. Stávající quiz otázky zůstávají (Category, Question, Answer)
2. Starý Lesson/Topic/Section se označí jako deprecated
3. Nový systém Chapter/Lesson se vytvoří paralelně
4. Po validaci: migrace UI na nový systém
5. Starý systém lze smazat

## 🚀 Next Steps

1. **Validace konceptu s uživatelem** ✅
2. Implementace nového DB schématu
3. AI prompt engineering pro master osnovu
4. Zpracování prvních 2-3 kapitol jako proof of concept
5. Iterace na základě feedbacku

---

**Poslední update:** 2025-12-08
**Status:** ✅ Koncept schválen, ready for implementation
