# 🎯 Klíčová Rozhodnutí a Směr Projektu

**Datum:** 2025-12-08
**Status:** 🔄 Implementace v procesu (Proof of Concept)
**Poslední update:** 2025-12-08 23:15 CET

---

## 📌 Executive Summary

Projekt pivotuje z **fragmentované quiz aplikace** na **moderní digitální učebnici práva** s důrazem na:
1. **Důvěryhodnost obsahu** (zero AI hallucinations, 100% source tracking)
2. **Plynulé čtení** (ne klikací UI, ale souvislé scrollování)
3. **Mobile-first UX** (perfektní čitelnost na mobilu i desktopu)

**🎯 Aktuální fáze:** Proof of Concept (Varianta A)
**📊 Progress:** Master outline dokončena → nyní generování ukázkových lekcí

---

## 🔄 Co se mění (PIVOT)

### ❌ STARÝ přístup (Fáze 2 v1 - DEPRECATED)
- Databáze: `Lesson → Topic → Section` (příliš vnořené)
- UI: Collapsible topics, každá sekce v barevném boxu
- Extrakce: Pouze 1 dokument zpracován
- UX: Fragmentované, hodně klikání
- Problém: Špatný kontrast, přetížené vizuály, nepřirozené pro učení

### ✅ NOVÝ přístup (Fáze 2 v2 - CURRENT)
- Databáze: `Chapter → Lesson` (simplified, lessons jako markdown články)
- UI: Plynulé scrollování, sidebar TOC, minimální vizuální noise
- Extrakce: VŠECH 6 dokumentů → master osnova → konsolidovaný obsah
- UX: Čti jako knihu NEBO skoč na téma
- Řešení: Vysoký kontrast, čisté UI, moderní učebnice

---

## 🎯 Klíčové Požadavky Uživatele

### 1. Formát Učení
> "Mně by se líbila možnost delšího čtení, ale rozděleného přehledně. Ať to není jako souvislá změť textu, ale ať to není tak že čtu 5 minut a musím hned přepínat."

**Řešení:**
- Kapitoly (Chapters) s vícero lekcemi (Lessons)
- Každá lekce = 15-30 minut čtení (ne 5 minut fragmenty)
- Přehledné H2/H3 nadpisy pro strukturu
- Sidebar navigace pro skoky mezi sekcemi
- "Další lekce" tlačítko pro plynulé pokračování

### 2. Navigace
> "Mně by se líbilo mít to nějak v přehledných sekcích, do těch by se šlo nakliknout z nějaké navigace, ale bylo by zde více možností. Buďto skočit přímo do chtěné lekce, nebo číst jako knížku více."

**Řešení:**
- **Mode A (Book Mode):** Plynulé čtení od začátku, "Další lekce" na konci
- **Mode B (Reference Mode):** Sidebar/menu s TOC, direct links na sekce
- Vyhledávání v obsahu
- Ukládání pozice čtení ("Pokračovat kde jsi skončil")

### 3. Mobile Optimalizace
> "Mobilní čtení - chci aby to bylo perfektně přizpůsobeno mobilu. Samozřejmě často se budu učit hlavně z desktopu, pro ten to musí být taky perfektní, ale ten mobil je za mě taky důležitý."

**Řešení:**
- **Mobile First approach** - primární design pro mobil
- Base font size: 16px (mobile), 18px (desktop)
- Line height: 1.75 (vysoké řádkování pro čitelnost)
- Max content width: 800px (optimální řádek)
- Hamburger menu pro TOC na mobilu
- Floating progress bar
- Žádné collapsible - čistý scroll

### 4. Důvěryhodnost AI
> "Důvěra AI - zde se bojím fakt hodně, já ideálně chci, aby AI vůbec nevymýšlelo mimo dokumenty. Aby to nějak hledalo souvislosti, když se něco opakuje v každém dokumentu tak je to asi správně a je to důležité, pokud je v tomto dokumentu něco takhle a v tomto něco takhle tak to třeba dát na kontrolu."

**Řešení:**
- ✅ **ZERO HALLUCINATIONS** - AI POUZE cituje z dokumentů
- ✅ **Source tracking** - každý odstavec má `<!-- SOURCE: doc, str. X -->`
- ✅ **Multi-source validation** - opakování napříč dokumenty = důležité
- ✅ **Conflict detection** - když se dokumenty liší → `<!-- CONFLICT -->`
- ✅ **Human validation** - preview → kontrola → schválení → publikace
- ✅ **99% doslovné citace** - jen minimální úpravy pro plynulost

---

## 📚 Dostupné Materiály (6 zdrojů)

```
/pravo-app/
├── CELÉ PRÁVO DLE NOZ - NIKOLA KUCHAŘÍKOVÁ.docx (174 KB)
├── Základy práva - kompletně vše, co potřebujete.docx (59 KB)
├── obchodnipravo_zapisky_1-4.docx (81 KB)
├── zápočtový test.doc (444 KB)
├── gl-obchodnipravo/ (složka s obsahem)
└── Komplet teorie s otázkami ke zkoušce ZP,OP/ (složka s obsahem)
```

**Celkem:** ~760+ KB textových dat

---

## 🏗️ Implementační Strategie

### Fáze 2.1: Příprava (Sprint 1)
1. ✅ Zdokumentovat koncept (KONCEPT-MODERNICH-UCEBNIC.md)
2. 🔜 Redesign Prisma schématu (Chapter, Lesson, SourceMapping)
3. 🔜 Vytvořit AI prompty pro extrakci

### Fáze 2.2: Master Osnova (Sprint 2)
1. 🔜 AI přečte VŠECHNY dokumenty
2. 🔜 Vygeneruje master osnovu celého předmětu
3. 🔜 Identifikuje překryvy a konflikty
4. 🔜 Lidská validace osnovy

### Fáze 2.3: Content Assembly (Sprint 3)
1. 🔜 Pro každou lekci: shromáždění textu ze všech relevantních dokumentů
2. 🔜 99% citace, minimální úpravy
3. 🔜 Source tracking u každého odstavce
4. 🔜 Conflict marking

### Fáze 2.4: UI Implementation (Sprint 4)
1. 🔜 Nový layout: Sidebar + Main content
2. 🔜 Mobile-first responsive design
3. 🔜 Typography optimalizace (16-18px, line-height 1.75)
4. 🔜 Dark mode s vysokým kontrastem

### Fáze 2.5: Validation Workflow (Sprint 5)
1. 🔜 Admin UI pro review lekcí
2. 🔜 Source viewer
3. 🔜 Conflict resolver
4. 🔜 Schvalovací proces (verify flag)

---

## 🎨 Design Decisions

### Typography
- **Font:** System fonts (San Francisco, Segoe UI, Roboto)
- **Base size:** 16px (mobile), 18px (desktop)
- **Line height:** 1.75
- **Max width:** 800px (content column)
- **Headings:**
  - H1: 2.5em, bold (title lekce)
  - H2: 2em, semibold (hlavní sekce)
  - H3: 1.5em, semibold (podsekce)

### Colors
**Dark Mode (default):**
- Background: `#0f1419` (deep dark blue)
- Text: `#e6edf3` (off-white, high contrast)
- Headings: `#ffffff` (pure white)
- Links: `#58a6ff` (bright blue)

**Light Mode:**
- Background: `#ffffff`
- Text: `#1f2937` (near black)
- Headings: `#111827` (pure black)
- Links: `#2563eb` (blue)

### Special Elements
- **Definice:** Blockquote s bold term
- **Citace zákona:** Blockquote s fialovým accentem
- **Příklad:** Light background, emoji ikona
- **Důležité:** Yellow/orange accent

### Layout
**Desktop:**
```
[Sidebar TOC - sticky]  [Main Content - max 800px - centered]
     (250px)                    (scrollable)
```

**Mobile:**
```
[Sticky header with hamburger menu]
[Main Content - full width - scrollable]
[Floating progress bar - bottom]
```

---

## 🚫 Anti-patterns (AVOID)

### Content
- ❌ AI vymýšlí text mimo dokumenty
- ❌ Žádný source tracking
- ❌ Ignorování konfliktů mezi dokumenty
- ❌ Publikování neověřeného obsahu

### UX
- ❌ Collapsible sekce (fragmentace)
- ❌ Krátké 5-minutové lekce
- ❌ Barevné boxy všude (visual noise)
- ❌ Špatný kontrast textu
- ❌ Malé písmo na mobilu
- ❌ Nadměrné ikony, badges, emoji v obsahu

---

## ✅ Success Criteria

### Content Quality
- [ ] 100% obsahu má source tracking
- [ ] 0 AI halucinací (vše citováno)
- [ ] Všechny lekce human-verified
- [ ] Všech 6 zdrojů zpracováno

### UX Metrics
- [ ] Mobile reading score > 90/100
- [ ] Desktop reading score > 95/100
- [ ] Accessibility score > 95/100
- [ ] Průměrná doba čtení > 10 minut (engagement)

### Coverage
- [ ] Kompletní osnova předmětu Právo
- [ ] Min. 20 kvalitních lekcí
- [ ] Všechny konfllikty vyřešeny

---

## 📖 Reference Dokumenty

1. **[KONCEPT-MODERNICH-UCEBNIC.md](./KONCEPT-MODERNICH-UCEBNIC.md)** - Kompletní koncept
2. **[CLAUDE.md](./CLAUDE.md)** - Technická dokumentace
3. **[README.md](./README.md)** - Project overview
4. **[FAZE-2-NAVOD.md](./FAZE-2-NAVOD.md)** - Původní návod (deprecated)

---

## 🚀 Aktuální Implementační Progress (2025-12-08)

### ✅ Fáze 2.1: Příprava (DOKONČENO)

**Co bylo uděláno:**
1. ✅ Vytvořena kompletní dokumentace (4 dokumenty)
2. ✅ Redesign Prisma schématu
   - Nové modely: Chapter, Lesson, Concept
   - Source tracking (JSON field)
   - Deprecated staré modely (Topic, Section)
3. ✅ Databáze resetována a synchronizována
4. ✅ AI pipeline script vytvořen (`generate-master-outline.ts`)

### ✅ Fáze 2.2: Master Osnova (DOKONČENO)

**Výsledek:**
```json
{
  "chapters": 12,
  "lessons": 44,
  "documentsProcessed": 4,
  "coverage": {
    "CELÉ PRÁVO DLE NOZ": "98%",
    "Základy práva": "95%",
    "obchodnipravo_zapisky": "92%",
    "zápočtový test": "85%"
  },
  "conflicts": 3
}
```

**Soubor:** `extractions/master-outline-2025-12-08T23-14-59-201Z.json`

**Identifikované konflikty:**
1. **Definice podnikání** - více verzí napříč dokumenty
2. **Struktura právní normy** - klasická vs. zjednodušená → **řešení: klasická**
3. **s.r.o. kapitál** - 1 Kč na společníka vs. celkem → **řešení: 1 Kč celkem**

### 🔜 Fáze 2.3: Content Assembly (NEXT)

**Varianta A: Proof of Concept**

**Plán:**
1. ⏳ Vyřešit konflikty v outline
2. ⏳ Vytvořit `assemble-lesson-content.ts` script
3. ⏳ Vygenerovat 2-3 ukázkové lekce:
   - "Pojem práva a jeho funkce"
   - "Právní subjekty - fyzické osoby"
   - "Vznik a zánik s.r.o."
4. ⏳ Implementovat základní UI
5. ⏳ Demo & feedback

**Proč Proof of Concept:**
- Rychlejší validace celého flow
- Možnost iterace na základě feedbacku
- Nižší riziko selhání než generování všech 44 lekcí najednou

### 📋 Next Session Checklist

Až budeš pokračovat, začni tady:

1. **Vyřešit konflikty:**
   ```bash
   # Upravit extractions/master-outline-*.json
   # Podle rozhodnutí:
   # - s.r.o. kapitál: "1 Kč celkem"
   # - Struktura normy: "klasická (hypotéza-dispozice-sankční hypotéza-sankce)"
   ```

2. **Vytvořit content assembly script:**
   ```bash
   cd pravo-quiz-app
   # Editovat/vytvořit: scripts/assemble-lesson-content.ts
   ```

3. **Spustit generování ukázkové lekce:**
   ```bash
   npx tsx scripts/assemble-lesson-content.ts \
     --outline extractions/master-outline-*.json \
     --lesson "Pojem práva a jeho funkce"
   ```

4. **Implementovat UI:**
   ```bash
   # Vytvořit:
   # - app/textbook/page.tsx (seznam kapitol)
   # - app/textbook/[chapterId]/page.tsx (lekce v kapitole)
   # - app/textbook/lesson/[lessonId]/page.tsx (detail lekce)
   ```

---

**Poslední update:** 2025-12-08 23:15 CET
**Schválil:** Uživatel
**Status:** 🔄 Implementace (Proof of Concept in progress)
