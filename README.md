# 📚 Moderní Učebnice Práva

AI-powered digitální učebnice pro přípravu na zkoušku z Práva - čitelná, důvěryhodná, optimalizovaná pro mobil i desktop.

## 🚀 Rychlý Start

### Instalace

```bash
# Nainstalovat závislosti
npm install

# Vytvořit a naplnit databázi
npx prisma migrate dev
npm run db:seed

# Spustit vývojový server
npm run dev
```

Aplikace poběží na `http://localhost:3000`

## ✨ Hlavní Funkce

### ✅ Otázky ke Zkoušce (Fáze 2.5 - DOKONČENO)
- ✅ **40 zkouškových otázek** - Kompletní seznam otázek k ústní zkoušce
- ✅ **Krátké odpovědi** - Základní body, které musíš umět říct
- ✅ **AI formátování** - Přehledný markdown s headingy, bold, seznamy, citacemi
- ✅ **Toggle režim** - Přepínání mezi krátkou a dlouhou odpovědí (dlouhé zatím "brzy")
- ✅ **Mobile-first UI** - Perfektně optimalizováno pro mobil i desktop
- ✅ **Navigace** - Předchozí/Další otázka, číslo otázky, zpět na seznam

### 📖 Moderní Učebnice (Fáze 2 - PLÁNOVÁNO)
- 🔜 **Souvislé čtení** - Dlouhé lekce bez fragmentace
- 🔜 **Flexibilní navigace** - Čti jako knihu NEBO skoč na téma
- 🔜 **Source tracking** - Každý text má odkaz na původní dokument
- 🔜 **Zero hallucinations** - AI pouze cituje, nevymýšlí
- 🔜 **Multi-source consolidation** - 6 dokumentů → jedna koherentní učebnice

### ✅ Kvízový Režim (Fáze 1 - DOKONČENO)
- ✅ **Testovací otázky** - Single/Multiple choice, True/False
- ✅ **Kategorie** - Základy práva, Obchodní právo
- ✅ **Vysvětlení** - Detailní vysvětlení správných odpovědí
- ✅ **Admin rozhraní** - Správa kategorií a otázek

## 🛠️ Technologie

- **Next.js 14** (App Router, Server Components)
- **TypeScript** - Type safety
- **Prisma ORM** - Database management
- **SQLite** - Databáze (pro MVP)
- **Tailwind CSS** - Styling

## 📁 Struktura Projektu

```
pravo-quiz-app/
├── app/
│   ├── page.tsx              # Hlavní stránka s kategoriemi
│   ├── quiz/[categoryId]/    # Quiz rozhraní
│   ├── admin/                # Admin panel
│   └── api/                  # API routes
│       ├── categories/       # CRUD pro kategorie
│       └── questions/        # CRUD pro otázky
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── seed.ts              # Testovací data
│   └── dev.db               # SQLite databáze
├── lib/
│   └── prisma.ts            # Prisma client singleton
└── CLAUDE.md                # Dokumentace pro AI asistenty
```

## 📊 Databázové Schéma

### ExamQuestion (Zkouškové otázky)
- `id` - UUID
- `order` - Pořadové číslo (1-40)
- `title` - Název otázky
- `shortAnswer` - Krátká odpověď (markdown)
- `longAnswer` - Dlouhá odpověď (markdown, nullable)
- `source` - Zdroj PDF

### Category (Kvízy)
- `id` - UUID
- `name` - Název kategorie (unique)
- `description` - Popis
- `color` - Barva pro UI

### Question (Kvízy)
- `id` - UUID
- `text` - Text otázky
- `explanation` - Vysvětlení správné odpovědi
- `type` - SINGLE_CHOICE | MULTIPLE_CHOICE | TRUE_FALSE
- `difficulty` - EASY | MEDIUM | HARD
- `categoryId` - Vazba na kategorii

### Answer (Kvízy)
- `id` - UUID
- `text` - Text odpovědi
- `isCorrect` - Boolean
- `questionId` - Vazba na otázku

## 🔄 Development Roadmap

### ✅ Fáze 1: MVP Core (DOKONČENO)
- [x] Next.js aplikace s PostgreSQL
- [x] Quiz režim s různými typy otázek
- [x] Admin rozhraní
- [x] LocalStorage progres tracking

### ✅ Fáze 2.5: Otázky ke Zkoušce (DOKONČENO - 2025-12-10)

**🎯 Cíl:** Rychlé nasazení 40 zkouškových otázek s krátkými odpověďmi

**✅ Kompletně hotovo:**
- [x] Extrakce 40 otázek z PDF (Patocka_Ustni_2024-1.pdf)
- [x] AI-powered formátování všech odpovědí do čistého markdownu
- [x] Database model ExamQuestion + API endpoints
- [x] Seznam otázek (`/exam-questions`) s přehlednými kartami
- [x] Detail otázky (`/exam-questions/[id]`) s toggle short/long
- [x] Mobile-first UI design s gradientními barvami
- [x] Navigace předchozí/další + zpět na seznam
- [x] react-markdown rendering s custom komponenty
- [x] Deployment na Vercel: [pravo-quiz-ebka3ddug-lukass-projects-2757878c.vercel.app](https://pravo-quiz-ebka3ddug-lukass-projects-2757878c.vercel.app)

**📊 Výsledek:**
- 40 zkouškových otázek s AI-formátovanými krátkými odpověďmi
- Placeholder "brzy" pro dlouhé odpovědi (připraveno pro budoucí rozšíření)
- Plně funkční a nasazeno do produkce

### 🔄 Fáze 2: Moderní Učebnice (PLÁNOVÁNO - PROOF OF CONCEPT)

**🎯 Nový směr:** Pivot od fragmentovaného UI k moderní, plynulé učebnici

**📖 Koncept:** [KONCEPT-MODERNICH-UCEBNIC.md](./KONCEPT-MODERNICH-UCEBNIC.md)

**✅ Hotovo:**
- [x] Redesign databázového schématu (Chapter → Lesson → Concept)
- [x] AI pipeline script (generate-master-outline.ts)
- [x] Master osnova vygenerována (12 kapitol, 44 lekcí)
- [x] Source tracking system implementován
- [x] Conflict detection funguje (3 konflikty nalezeny)

**🔜 Next Steps (Varianta A - Proof of Concept):**
- [ ] Vyřešit konflikty v master outline
- [ ] Content assembly script (assemble-lesson-content.ts)
- [ ] Vygenerovat 2-3 ukázkové lekce
- [ ] Implementovat základní UI (kapitoly → lekce → detail)
- [ ] Demo & feedback

**📊 Aktuální stav:**
```
✅ Master Outline: extractions/master-outline-2025-12-08T23-14-59-201Z.json
   - 12 kapitol
   - 44 lekcí
   - 98% pokrytí hlavního dokumentu
   - 3 konflikty ke kontrole
```

**Zpracování materiálů:**
```
✅ CELÉ PRÁVO DLE NOZ - NIKOLA KUCHAŘÍKOVÁ.docx (174 KB) → 98% pokryto
✅ Základy práva - kompletně vše, co potřebujete.docx (59 KB) → 95% pokryto
✅ obchodnipravo_zapisky_1-4.docx (81 KB) → 92% pokryto
⚠️  zápočtový test.doc (444 KB) → 85% pokryto (starý .doc formát)
🔜 gl-obchodnipravo/ (složka) - ještě nezpracováno
🔜 Komplet teorie s otázkami ke zkoušce ZP,OP/ (složka) - ještě nezpracováno
```

### 🔜 Fáze 3: Quiz z Učebnice (Plánováno)
- [ ] Automatické generování kvízů z ověřeného obsahu lekcí
- [ ] Propojení konceptů z učebnice s testovými otázkami
- [ ] Adaptivní obtížnost na základě čtení

### 🔜 Fáze 4: Full-stack Upgrade (Plánováno)
- [ ] Uživatelská autentizace (NextAuth.js)
- [ ] Synchronizace mezi zařízeními
- [ ] Pokročilé statistiky a analytics

## 🎯 Design Principles

### Content Integrity (KRITICKÉ)
- ✅ **ZERO AI HALLUCINATIONS** - AI pouze zpracovává dokumenty, nic nevymýšlí
- ✅ **100% SOURCE TRACKING** - každý text má odkaz na původní zdroj
- ✅ **MULTI-SOURCE VALIDATION** - opakování napříč dokumenty = důležité
- ✅ **CONFLICT DETECTION** - rozpory mezi dokumenty → označit ke kontrole
- ✅ **HUMAN VALIDATION** - obsah musí být schválen před publikací

### UX Principles
- 📱 **MOBILE FIRST** - primární optimalizace pro mobil
- 📖 **HIGH READABILITY** - velké písmo (16-18px), line-height 1.75, vysoký kontrast
- 🌊 **CONTINUOUS READING** - ne fragmentované klikání, plynulý scroll
- 🧭 **FLEXIBLE NAVIGATION** - čti jako knihu NEBO skoč na téma
- 🎨 **MINIMAL NOISE** - čisté UI bez přehnaných boxů, ikon, badges

### Reading Experience
- Typography: System fonts, 16-18px base, vysoké řádkování
- Max content width: 800px (optimální čitelnost)
- Dark mode: Deep dark (#0f1419) s high contrast text
- Sections: Přehledné H2/H3 nadpisy, ne collapsible boxy

## 📝 Poznámky

- **Database:** PostgreSQL (Prisma) - production ready
- **Autentizace:** V MVP není - všichni sdílejí stejnou databázi
- **Progres:** LocalStorage pro MVP, později server-side tracking
- **Zdrojové dokumenty:** 6 materiálů v nadřazeném adresáři
- **AI Safety:** KRITICKÉ - AI nesmí nic vymýšlet, pouze citovat!

## 📚 Dokumentace

### Začni tady! 👇
- **[ROADMAP.md](./ROADMAP.md)** - 🗺️ **KOMPLETNÍ ROADMAP** k dotažení aplikace do dokonalosti
- **[QUICKSTART-NEXT-SESSION.md](./QUICKSTART-NEXT-SESSION.md)** - ⚡ Quick start pro příští session
- **[SESSION-STATUS.md](./SESSION-STATUS.md)** - 📍 Kde jsme skončili + co dělat příště

### Detailní dokumenty:
- **[KONCEPT-MODERNICH-UCEBNIC.md](./KONCEPT-MODERNICH-UCEBNIC.md)** - Kompletní koncept a vize aplikace
- **[DECISIONS.md](./DECISIONS.md)** - Klíčová rozhodnutí + aktuální progress
- **[CLAUDE.md](./CLAUDE.md)** - Technická dokumentace pro AI asistenty
- **[scripts/README-MODERN-TEXTBOOK.md](./scripts/README-MODERN-TEXTBOOK.md)** - Návod na AI scripty
- **[FAZE-2-NAVOD.md](./FAZE-2-NAVOD.md)** - Původní návod (deprecated)

## 🤝 Vývoj

```bash
# Vývojový server s hot reload
npm run dev

# Production build
npm run build
npm start

# Linting
npm run lint

# Database migrations
npx prisma migrate dev --name <název_migrace>
```

## 📄 Licence

Osobní projekt pro studijní účely.
