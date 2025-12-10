# 🔄 TRANSFORMAČNÍ PLÁN: Průběžný Test → Zkouškové Otázky

## 🎯 NOVÁ VIZE

Místo klasické učebnice (kapitoly → lekce) vytvoříme **otázky-centered aplikaci**:

1. **FÁZE 1 (Priorita):** Kvíz na průběžný test
2. **FÁZE 2:** "Učebnice" = Zkouškové otázky s detailním rozpracováním

### Výhody tohoto přístupu:
- ✅ Studium přímo v kontextu zkouškových otázek
- ✅ Dvojí využití: testování (kvíz) + studium (detaily)
- ✅ Lepší zapamatování (active recall)
- ✅ Perfektní příprava na test i zkoušku

---

## 📊 DOSTUPNÉ DOKUMENTY

### Průběžný test:
```
zápočtový test.doc (444 KB)
└─ Otázky + správné odpovědi
```

### Zkouškové otázky + teorie:
```
Komplet teorie s otázkami ke zkoušce ZP,OP/
├── Základy práva.pdf (487 KB)
└── Obchodní právo.pdf (504 KB)
```

### Pomocné dokumenty (pro AI generování odpovědí):
```
CELÉ PRÁVO DLE NOZ - NIKOLA KUCHAŘÍKOVÁ.docx (174 KB)
Základy práva - kompletně vše, co potřebujete.docx (59 KB)
obchodnipravo_zapisky_1-4.docx (81 KB)
gl-obchodnipravo/ (složka)
```

---

## 🗄️ NOVÝ DATOVÝ MODEL

### Přehled struktury:

```
Category (Základy práva / Obchodní právo)
  └── ExamTopic (téma - např. "Právní subjekty")
        ├── ExamQuestion (zkouškové otázky s detailním vysvětlením)
        │     ├── shortSummary (2-3 věty)
        │     ├── detailedAnswer (markdown, 500-2000 slov)
        │     ├── importance (CRITICAL/HIGH/MEDIUM/LOW)
        │     ├── relatedConcepts[]
        │     └── sourceMapping (odkud pochází info)
        │
        └── QuizQuestion (otázky do průběžného testu)
              ├── questionText
              ├── answers[]
              ├── correctAnswers[]
              ├── explanation
              └── relatedExamQuestions[] (propojení na detailní výklad)
```

### Prisma Schema (nový):

```prisma
// Kategorie předmětu
model Category {
  id          String      @id @default(uuid())
  name        String      @unique // "Základy práva", "Obchodní právo"
  description String?
  slug        String      @unique
  color       String?     @default("#3b82f6")

  examTopics  ExamTopic[]
  quizQuestions QuizQuestion[]

  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

// Téma (skupina zkouškových otázek)
model ExamTopic {
  id          String      @id @default(uuid())
  title       String      // "Právní subjekty"
  slug        String      @unique
  description String?
  order       Int         @default(0)

  categoryId  String
  category    Category    @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  examQuestions ExamQuestion[]

  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@index([categoryId])
}

// Zkouškové otázky (s detailním rozpracováním)
model ExamQuestion {
  id                  String      @id @default(uuid())
  question            String      // "Co je to právní subjektivita?"
  slug                String      @unique

  // Dvouúrovňový obsah
  shortSummary        String      // Krátký souhrn (2-3 věty)
  detailedAnswer      String      @db.Text // Markdown (500-2000 slov)

  // Metadata
  importance          Importance  @default(MEDIUM)
  estimatedReadingTime Int?       // minuty
  order               Int         @default(0)

  // Source tracking (JSON)
  sourceMapping       Json?       // Odkud pochází info

  // Ověření expertem
  verified            Boolean     @default(false)
  verifiedBy          String?
  verifiedAt          DateTime?

  // Relace
  topicId             String
  topic               ExamTopic   @relation(fields: [topicId], references: [id], onDelete: Cascade)

  relatedQuizQuestions QuizQuestion[] @relation("ExamToQuiz")
  relatedConcepts     Concept[]

  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt

  @@index([topicId])
  @@index([importance])
}

// Klíčové pojmy (pro flashcards, vyhledávání)
model Concept {
  id              String      @id @default(uuid())
  term            String      // "Svéprávnost"
  definition      String      @db.Text
  importance      Importance  @default(MEDIUM)

  examQuestionId  String
  examQuestion    ExamQuestion @relation(fields: [examQuestionId], references: [id], onDelete: Cascade)

  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  @@index([examQuestionId])
}

// Otázky do průběžného testu (kvíz)
model QuizQuestion {
  id              String      @id @default(uuid())
  questionText    String      @db.Text
  explanation     String?     @db.Text // Vysvětlení správné odpovědi

  type            QuestionType @default(SINGLE_CHOICE)
  difficulty      Difficulty   @default(MEDIUM)

  // Relace
  categoryId      String
  category        Category    @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  relatedExamQuestions ExamQuestion[] @relation("ExamToQuiz")

  answers         QuizAnswer[]

  // Metadata
  aiGenerated     Boolean     @default(false)
  verified        Boolean     @default(false)

  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  @@index([categoryId])
  @@index([type])
  @@index([difficulty])
}

// Odpovědi na kvízové otázky
model QuizAnswer {
  id              String      @id @default(uuid())
  text            String      @db.Text
  isCorrect       Boolean     @default(false)
  order           Int         @default(0)

  questionId      String
  question        QuizQuestion @relation(fields: [questionId], references: [id], onDelete: Cascade)

  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  @@index([questionId])
}

// Enums
enum Importance {
  LOW       // Doplňující info
  MEDIUM    // Standardní obsah
  HIGH      // Důležité pro zkoušku
  CRITICAL  // Absolutně nutné znát
}

enum QuestionType {
  SINGLE_CHOICE    // Jedna správná odpověď
  MULTIPLE_CHOICE  // Více správných odpovědí
  TRUE_FALSE       // Pravda/Nepravda
}

enum Difficulty {
  EASY
  MEDIUM
  HARD
}
```

### Změny oproti starému schématu:

| Starý model | Nový model | Změna |
|-------------|------------|-------|
| `Chapter` | `ExamTopic` | Témata místo kapitol |
| `Lesson` | `ExamQuestion` | Otázky místo lekcí |
| `Topic` (deprecated) | - | Odstraněno |
| `Question` | `QuizQuestion` | Přejmenováno pro jasnost |
| `Answer` | `QuizAnswer` | Přejmenováno |

---

## 🎨 NOVÁ UI STRUKTURA

### Hlavní navigace:

```
┌─────────────────────────────────────┐
│  Pravo App                    [≡]   │ ← Header
├─────────────────────────────────────┤
│                                     │
│  🎯 Průběžný test (kvíz)           │ ← Priorita #1
│  📚 Zkouškové otázky (studium)     │ ← Priorita #2
│  ⚙️  Admin                          │
│                                     │
└─────────────────────────────────────┘
```

### FÁZE 1: Průběžný test (kvíz)

**Route:** `/midterm-quiz` nebo `/quiz/midterm`

**Funkce:**
- ✅ Náhodné pořadí otázek
- ✅ Tracking skóre
- ✅ Vysvětlení správných odpovědí po odeslání
- ✅ Progress bar (otázka X z Y)
- ✅ Možnost opakovat test

**UI podobné existujícímu `/quiz/[categoryId]`, ale:**
- Všechny otázky z průběžného testu (ne kategorie)
- Možnost filtrovat podle předmětu (ZP / OP)

### FÁZE 2: Zkouškové otázky (studium)

#### 2.1 Seznam otázek: `/questions` nebo `/exam`

```
┌─────────────────────────────────────────────┐
│  Zkouškové otázky                     [🔍]  │
├─────────────────────────────────────────────┤
│  Filtr: [Všechny ▼] [Základy práva ▼]      │
│  Řazení: [Důležitost ▼]                     │
├─────────────────────────────────────────────┤
│                                             │
│  ⭐ KRITICKÉ (12 otázek)                    │
│  ┌───────────────────────────────────────┐ │
│  │ 1. Co je to právní subjektivita?      │ │
│  │    Krátký popis...                    │ │
│  │    [📖 Studovat]  ⏱ 8 min            │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  🔴 VYSOKÁ (28 otázek)                      │
│  🟡 STŘEDNÍ (45 otázek)                     │
│  ⚪ NÍZKÁ (15 otázek)                       │
│                                             │
└─────────────────────────────────────────────┘
```

**Funkce:**
- Filtrování podle kategorie (ZP / OP)
- Filtrování podle důležitosti
- Vyhledávání
- Řazení (důležitost, název, délka čtení)
- Progress tracking (které otázky už jsem prostudoval)

#### 2.2 Detail otázky: `/questions/[slug]`

```
┌──────────────────────────────────────────────┐
│  [←] Zpět na seznam                    [⋮]  │
├──────────────────────────────────────────────┤
│                                              │
│  🔴 VYSOKÁ DŮLEŽITOST                        │
│  Téma: Právní subjekty                       │
│                                              │
│  # Co je to právní subjektivita?             │
│                                              │
│  ⏱ 8 minut čtení                             │
│                                              │
│  ## 📝 Stručně                               │
│  Právní subjektivita je způsobilost mít      │
│  práva a povinnosti. Vzniká narozením...     │
│                                              │
│  ## 📚 Detailně                              │
│  [Rozsáhlý markdown text s formátováním]     │
│  - Definice                                  │
│  - Vznik a zánik                             │
│  - Druhy subjektů                            │
│  - Právní úkony                              │
│  ...                                         │
│                                              │
│  ## 📎 Zdroje                                │
│  📄 CELÉ PRÁVO DLE NOZ (str. 12-15)          │
│  📄 Základy práva (str. 8-10)                │
│                                              │
│  ## 🔗 Související                           │
│  • Právní způsobilost                        │
│  • Svéprávnost                               │
│  • Právní úkony                              │
│                                              │
│  ## ✓ Otázky v průběžném testu               │
│  [3 propojené kvízové otázky]                │
│  [Vyzkoušet nyní →]                          │
│                                              │
└──────────────────────────────────────────────┘
```

**Funkce:**
- **Dvouúrovňový obsah:**
  - Stručný souhrn (rychlé opakování)
  - Detailní vysvětlení (hloubkové studium)
- **Markdown rendering** (react-markdown)
- **Source tracking** (viditelné zdroje)
- **Progress tracking** (označit jako prostudované)
- **Související otázky** (navigace mezi tématy)
- **Propojení na kvíz** (rychlý test znalostí)
- **Sidebar TOC** (navigace v dlouhých odpovědích)

---

## 🛠️ IMPLEMENTAČNÍ KROKY

### FÁZE 1: Průběžný test (Priorita) - 2-3 hodiny

#### Krok 1.1: Extrakce otázek z průběžného testu (30 min)

**Script:** `scripts/extract-midterm-quiz.ts`

```typescript
// Pseudokód
1. Parse "zápočtový test.doc" (mammoth)
2. Identifikovat strukturu:
   - Otázka
   - A) odpověď 1
   - B) odpověď 2
   - C) odpověď 3
   - D) odpověď 4
   - Správná odpověď: X
3. Extrahovat do JSON:
   {
     "questions": [
       {
         "question": "...",
         "answers": [...],
         "correctAnswer": "B",
         "category": "ZP" // detekce z kontextu
       }
     ]
   }
4. Validace (kontrola úplnosti)
5. Export do JSON souboru
```

**Output:** `extractions/midterm-quiz-YYYY-MM-DD.json`

#### Krok 1.2: Aktualizace databázového schématu (20 min)

```bash
# Vytvořit migraci pro nové schema
npx prisma migrate dev --name add_exam_questions_model
```

**Změny:**
- Přidat modely: `ExamTopic`, `ExamQuestion`, `QuizQuestion`, `QuizAnswer`
- Odebrat/deprecate: staré `Question`, `Answer`, `Topic`, `Lesson`, `Chapter`
- Zachovat zpětnou kompatibilitu (pokud existují stará data)

#### Krok 1.3: Import otázek do databáze (20 min)

**Script:** `scripts/import-midterm-quiz.ts`

```typescript
// Pseudokód
1. Načíst JSON z Kroku 1.1
2. Pro každou otázku:
   - Vytvořit QuizQuestion
   - Vytvořit QuizAnswers (4 odpovědi)
   - Nastavit correctAnswer
3. Commit do databáze
4. Validace (počet importovaných záznamů)
```

#### Krok 1.4: Aktualizovat UI pro kvíz (60 min)

**Úpravy:**

1. **Nový route:** `/midterm-quiz/page.tsx`
   - Klon stávajícího `/quiz/[categoryId]/page.tsx`
   - Upravit query: načíst všechny `QuizQuestion` (ne podle kategorie)

2. **Upravit API:** `/api/quiz-questions/route.ts`
   - GET: všechny otázky nebo filtr podle kategorie
   - Náhodné pořadí

3. **Homepage:** Přidat tlačítko "🎯 Průběžný test"

4. **Testing:** Ověřit funkčnost kvízu

#### Krok 1.5: Testování a bug fixing (30 min)

- [ ] Kvíz se načte
- [ ] Otázky jsou náhodně seřazeny
- [ ] Správné odpovědi fungují
- [ ] Skóre se zobrazuje
- [ ] Vysvětlení funguje

---

### FÁZE 2: Zkouškové otázky (studium) - 4-6 hodin

#### Krok 2.1: Extrakce zkouškových otázek z PDF (60 min)

**Script:** `scripts/extract-exam-questions.ts`

```typescript
// Pseudokód
1. Parse "Základy práva.pdf" a "Obchodní právo.pdf" (pdf-parse)
2. Identifikovat seznam otázek:
   - Často formát: "1. Otázka?"
   - Nebo sekce "Zkouškové otázky:"
3. Extrahovat seznam otázek
4. Kategorizovat podle tématu (heuristika nebo AI)
5. Export do JSON:
   {
     "topics": [
       {
         "name": "Právní subjekty",
         "questions": [
           "Co je to právní subjektivita?",
           "Jaké jsou druhy právních subjektů?"
         ]
       }
     ]
   }
```

**Output:** `extractions/exam-questions-YYYY-MM-DD.json`

#### Krok 2.2: AI generování detailních odpovědí (120 min)

**Script:** `scripts/generate-detailed-answers.ts`

**Workflow:**

```
Pro každou zkouškovou otázku:

1. Najdi relevantní sekce v dokumentech:
   - CELÉ PRÁVO DLE NOZ - NIKOLA KUCHAŘÍKOVÁ.docx
   - Základy práva - kompletně vše, co potřebujete.docx
   - obchodnipravo_zapisky_1-4.docx
   - Základy práva.pdf
   - Obchodní právo.pdf

2. AI prompt:
   """
   Otázka: {question}

   Dostupné dokumenty:
   {relevant_sections}

   Vygeneruj:
   1. SHORT SUMMARY (2-3 věty, jasná odpověď na otázku)
   2. DETAILED ANSWER (500-2000 slov, strukturovaný markdown):
      - Definice
      - Vysvětlení s příklady
      - Zákonné ustanovení (pokud relevantní)
      - Praktické důsledky
   3. KEY CONCEPTS (seznam klíčových pojmů)
   4. SOURCE MAPPING (které části dokumentů použity)

   KRITICKÉ: Použij POUZE informace z dokumentů. Zero hallucinations.
   """

3. Validace:
   - Kontrola source mappingu
   - Lidská kontrola (preview)
   - Schválení

4. Export do JSON
```

**Output:** `extractions/exam-answers-YYYY-MM-DD.json`

#### Krok 2.3: Import zkouškových otázek do DB (30 min)

**Script:** `scripts/import-exam-questions.ts`

```typescript
// Pseudokód
1. Načíst JSON z Kroku 2.2
2. Pro každé téma:
   - Vytvořit ExamTopic
   - Pro každou otázku:
     - Vytvořit ExamQuestion
     - Nastavit shortSummary, detailedAnswer
     - Vytvořit Concepts
     - Uložit sourceMapping
3. Commit do databáze
4. Validace
```

#### Krok 2.4: UI pro seznam otázek (60 min)

**Nový route:** `/questions/page.tsx`

**Funkce:**
- Načíst všechny `ExamQuestion` (seskupit podle `ExamTopic`)
- Filtrování podle kategorie
- Filtrování podle důležitosti
- Vyhledávání (fulltext)
- Řazení

**Komponenty:**
```tsx
<QuestionsList>
  <FilterBar />
  <SearchBox />
  <QuestionsByImportance>
    <QuestionCard
      title="..."
      summary="..."
      readingTime={8}
      importance="HIGH"
    />
  </QuestionsByImportance>
</QuestionsList>
```

#### Krok 2.5: UI pro detail otázky (90 min)

**Nový route:** `/questions/[slug]/page.tsx`

**Funkce:**
- Načíst `ExamQuestion` podle slug
- Markdown rendering (react-markdown)
- Dvouúrovňový layout:
  1. **Stručně** (collapsible)
  2. **Detailně** (hlavní obsah)
- Sidebar TOC (pro dlouhé odpovědi)
- Source tracking (odkazy na dokumenty)
- Související otázky (navigace)
- Propojení na kvízové otázky

**Komponenty:**
```tsx
<QuestionDetail>
  <QuestionHeader
    title="..."
    topic="..."
    importance="HIGH"
    readingTime={8}
  />

  <ShortSummary>
    {shortSummary}
  </ShortSummary>

  <DetailedAnswer markdown={detailedAnswer} />

  <SourceReferences sources={sourceMapping} />

  <RelatedQuestions questions={related} />

  <RelatedQuizQuestions questions={quizQuestions} />
</QuestionDetail>
```

#### Krok 2.6: Propojení s průběžným testem (30 min)

**Logika:**

1. Při importu kvízových otázek:
   - Detekovat klíčová slova v otázce
   - Najít související `ExamQuestion`
   - Vytvořit relaci `QuizQuestion.relatedExamQuestions`

2. V UI detail otázky:
   - Zobrazit související kvízové otázky
   - Tlačítko "Vyzkoušet znalosti" → redirect na mini-kvíz

3. V UI průběžného testu:
   - Po zodpovězení otázky:
   - Link "📖 Studovat toto téma" → redirect na související `ExamQuestion`

#### Krok 2.7: Progress tracking (60 min)

**Funkce:**
- Označit otázku jako "prostudovanou"
- Uložit do localStorage (nebo DB pokud auth)
- Progress bar (X z Y otázek prostudováno)
- Filtr "Neprostudované"

**DB model (optional):**
```prisma
model UserProgress {
  id              String      @id @default(uuid())
  userId          String      // Pokud auth, jinak clientId
  examQuestionId  String
  completed       Boolean     @default(false)
  lastStudied     DateTime?

  @@unique([userId, examQuestionId])
}
```

---

## 📋 PRIORITIZOVANÝ CHECKLIST

### SPRINT 1: Průběžný test (MVP) - 1 den

- [ ] **1.1** Extrakce otázek z "zápočtový test.doc" → JSON
- [ ] **1.2** Nové Prisma schema (ExamTopic, ExamQuestion, QuizQuestion)
- [ ] **1.3** Migrace databáze
- [ ] **1.4** Import script (JSON → DB)
- [ ] **1.5** UI route `/midterm-quiz`
- [ ] **1.6** API endpoint `/api/quiz-questions`
- [ ] **1.7** Testing & bug fixing
- [ ] **1.8** Deploy (Vercel)

**Výstup:** Funkční kvíz na průběžný test ✅

---

### SPRINT 2: Zkouškové otázky (seznam) - 1 den

- [ ] **2.1** Extrakce seznamu otázek z PDFek → JSON
- [ ] **2.2** Kategorizace otázek podle témat (AI nebo manuál)
- [ ] **2.3** AI generování odpovědí (short + detailed) pro 5-10 ukázkových otázek
- [ ] **2.4** Import script (JSON → DB)
- [ ] **2.5** UI route `/questions` (seznam otázek)
- [ ] **2.6** Filtrování a vyhledávání
- [ ] **2.7** Testing

**Výstup:** Seznam zkouškových otázek s dummy detaily ✅

---

### SPRINT 3: Detaily otázek (studium) - 1-2 dny

- [ ] **3.1** UI route `/questions/[slug]` (detail otázky)
- [ ] **3.2** Markdown rendering
- [ ] **3.3** Dvouúrovňový layout (stručně / detailně)
- [ ] **3.4** Source tracking zobrazení
- [ ] **3.5** Související otázky navigace
- [ ] **3.6** Propojení s kvízem
- [ ] **3.7** Progress tracking (localStorage)
- [ ] **3.8** Testing

**Výstup:** Funkční studijní režim ✅

---

### SPRINT 4: AI generování všech odpovědí - 2-3 dny

- [ ] **4.1** Dokončit AI script pro všechny otázky (batch processing)
- [ ] **4.2** Lidská validace (preview + schválení)
- [ ] **4.3** Import všech otázek do DB
- [ ] **4.4** Kontrola kvality
- [ ] **4.5** Opravy a iterace

**Výstup:** Kompletní obsah pro všechny zkouškové otázky ✅

---

### SPRINT 5: Propojení a vylepšení - 1-2 dny

- [ ] **5.1** Automatické propojení kvízových a zkouškových otázek
- [ ] **5.2** Mini-kvízy v detailu otázky
- [ ] **5.3** Sidebar TOC pro dlouhé odpovědi
- [ ] **5.4** Reading progress tracking
- [ ] **5.5** Bookmark funkce
- [ ] **5.6** Export poznámek (optional)
- [ ] **5.7** Mobile optimalizace
- [ ] **5.8** Testing

**Výstup:** Kompletní aplikace připravená na produkci ✅

---

## 🎨 MOCKUPY UI

### Homepage (upravený):

```
┌─────────────────────────────────────┐
│  Pravo App                          │
├─────────────────────────────────────┤
│                                     │
│  Připravte se na zkoušku!           │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 🎯 Průběžný test               │ │
│  │ Procvičte si otázky z testu   │ │
│  │ [Začít kvíz →]                │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 📚 Zkouškové otázky            │ │
│  │ Detailní odpovědi na otázky   │ │
│  │ [Studovat →]                  │ │
│  └───────────────────────────────┘ │
│                                     │
│  Progress:                          │
│  ■■■■■□□□□□ 50% (50/100 otázek)    │
│                                     │
└─────────────────────────────────────┘
```

### Seznam zkouškových otázek:

```
┌─────────────────────────────────────────┐
│  Zkouškové otázky              [🔍]     │
├─────────────────────────────────────────┤
│  [Všechny ▼] [ZP ▼] [Řazení ▼]         │
├─────────────────────────────────────────┤
│                                         │
│  ⭐ KRITICKÉ (12)                       │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Co je to právní subjektivita?   │   │
│  │ Stručně: Způsobilost mít...     │   │
│  │ [📖 Studovat] ⏱ 8 min  ✓       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Jaké jsou druhy právních...     │   │
│  │ Stručně: Existují fyzické...    │   │
│  │ [📖 Studovat] ⏱ 12 min          │   │
│  └─────────────────────────────────┘   │
│                                         │
│  🔴 VYSOKÁ (28)                         │
│  🟡 STŘEDNÍ (45)                        │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🚀 TECHNICKÉ POZNÁMKY

### Document Parsing

**DOCX (mammoth):**
```typescript
import mammoth from 'mammoth';

const result = await mammoth.extractRawText({ path: 'document.docx' });
const text = result.value;
```

**PDF (pdf-parse):**
```typescript
import pdf from 'pdf-parse';
import fs from 'fs';

const dataBuffer = fs.readFileSync('document.pdf');
const data = await pdf(dataBuffer);
const text = data.text;
```

### AI Prompt Template

```typescript
const prompt = `
Zkouškové otázka: ${question}

Dostupné dokumenty:
${relevantSections.join('\n\n---\n\n')}

Vytvoř odpověď ve formátu:

## SHORT_SUMMARY
[2-3 věty, jasná odpověď]

## DETAILED_ANSWER
[500-2000 slov, strukturovaný markdown]

### Definice
...

### Vysvětlení
...

### Příklady
...

### Zákonná úprava
...

## KEY_CONCEPTS
- Pojem 1: Definice
- Pojem 2: Definice

## SOURCE_MAPPING
{
  "paragraphs": [
    {"startLine": X, "endLine": Y, "source": "...", "confidence": "high"}
  ]
}

KRITICKÉ: Použij POUZE informace z dokumentů. Žádné vymýšlení.
`;
```

### Source Mapping formát

```json
{
  "paragraphs": [
    {
      "startLine": 10,
      "endLine": 25,
      "source": "CELÉ PRÁVO DLE NOZ",
      "page": 23,
      "confidence": "high",
      "excerpt": "První věta citace..."
    }
  ],
  "conflicts": [
    {
      "issue": "Rozdílné definice",
      "sources": ["doc1", "doc2"],
      "resolution": "Použita definice z doc1 (aktuálnější)"
    }
  ]
}
```

---

## ⚠️ KRITICKÉ BODY

### 1. Zero AI Hallucinations
- ✅ AI POUZE sestavuje text z dokumentů
- ✅ Každý paragraph má source mapping
- ✅ Lidská validace před publikací
- ❌ Žádné vymýšlení textu mimo sources

### 2. Source Tracking
- Každá odpověď musí mít zdroje
- Viditelné v UI (footer odpovědi)
- Možnost prokliknout na originální dokument

### 3. Human Validation Workflow
```
AI generování → Preview → Kontrola experta → Schválení → Publikace
                   ↓                            ↓
              Oprava AI                    verified = true
```

### 4. Performance
- Batch processing pro AI generování (ne 100 requestů najednou)
- Caching (Redis nebo Next.js cache)
- Lazy loading pro seznam otázek

### 5. Mobile Optimalizace
- Touch-friendly UI
- Responsive typography
- Offline mode (service worker - optional)

---

## 📊 OČEKÁVANÉ VÝSTUPY

### Po SPRINT 1:
- ✅ Funkční kvíz na průběžný test
- ✅ X otázek importováno
- ✅ Deployed na Vercel

### Po SPRINT 3:
- ✅ Seznam zkouškových otázek
- ✅ 5-10 detailně rozpracovaných otázek
- ✅ Funkční studijní režim

### Po SPRINT 5:
- ✅ Kompletní aplikace
- ✅ Všechny zkouškové otázky s odpověďmi
- ✅ Propojení kvíz ↔ studium
- ✅ Progress tracking
- ✅ Připraveno na produkci

---

## 🎯 METRIKY ÚSPĚCHU

- **Průběžný test:** 100% otázek importováno a funkčních
- **Zkouškové otázky:** 80+ otázek s detailními odpověďmi
- **Source tracking:** 100% odpovědí má zdroje
- **Mobile UX:** Čitelné na telefonu (testováno)
- **Performance:** < 3s load time
- **Validace:** 100% odpovědí zkontrolováno expertem

---

## 📝 NEXT STEPS

**START:** Sprint 1.1 - Extrakce otázek z průběžného testu

```bash
# Vytvořit script
touch scripts/extract-midterm-quiz.ts

# Otevřít a začít implementovat
code scripts/extract-midterm-quiz.ts
```

**Chceš začít hned? Řekni mi a spustíme Sprint 1! 🚀**
