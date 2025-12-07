# 📚 Pravo Quiz App

Interaktivní webová aplikace pro přípravu na zkoušku z Práva s kvízy, flashcards a studijními materiály.

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

## ✨ Funkce (MVP - Fáze 1)

### Pro studenty:
- ✅ **Kvízový režim** - Testovací otázky s okamžitou zpětnou vazbou
- ✅ **Různé typy otázek** - Single choice, Multiple choice, True/False
- ✅ **Kategorie** - Základy práva, Obchodní právo, atd.
- ✅ **Obtížnosti** - Lehká, Střední, Těžká
- ✅ **Vysvětlení** - Detailní vysvětlení správných odpovědí
- ✅ **Progres tracking** - Sledování skóre a pokroku (LocalStorage)

### Pro správu obsahu:
- ✅ **Admin rozhraní** - Přidávání kategorií a otázek
- ✅ **Barevné značení** - Vizuální odlišení kategorií
- ✅ **Testovací data** - 6 připravených otázek ze 2 kategorií

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

### Category
- `id` - UUID
- `name` - Název kategorie (unique)
- `description` - Popis
- `color` - Barva pro UI

### Question
- `id` - UUID
- `text` - Text otázky
- `explanation` - Vysvětlení správné odpovědi
- `type` - SINGLE_CHOICE | MULTIPLE_CHOICE | TRUE_FALSE
- `difficulty` - EASY | MEDIUM | HARD
- `categoryId` - Vazba na kategorii

### Answer
- `id` - UUID
- `text` - Text odpovědi
- `isCorrect` - Boolean
- `questionId` - Vazba na otázku

## 🔄 Další Fáze Vývoje

### Fáze 2: AI Extrakce (✅ MVP DOKONČENO)
- [x] Rozšířené databázové schéma (Lesson, Topic, Section)
- [x] Script pro čtení .docx dokumentů
- [x] Claude API integrace s přesnými prompty
- [x] Strukturovaná extrakce obsahu (ne jen otázky!)
- [x] Import pipeline do databáze
- [x] UI pro prohlížení lekcí a teorie
- [x] Mobilně přívětivé rozhraní s markdown renderingem
- [ ] Validace a review systém (plánováno)
- [ ] Automatické generování kvízů z ověřeného obsahu (plánováno)

**📖 Kompletní návod: [FAZE-2-NAVOD.md](./FAZE-2-NAVOD.md)**

### Fáze 3: Rozšíření Funkcí (Plánováno)
- [ ] Flashcards režim
- [ ] Přehled teorie po kapitolách
- [ ] Praktické případy (kazusy)
- [ ] Pokročilé statistiky a analytics
- [ ] Export/import otázek (JSON/CSV)

### Fáze 4: Full-stack Upgrade (Plánováno)
- [ ] Uživatelská autentizace (NextAuth.js)
- [ ] PostgreSQL databáze
- [ ] Synchronizace mezi zařízeními
- [ ] Cloud deployment (Vercel)

## 🎯 Použití

### 1. Pro studenty

1. Otevři `http://localhost:3000`
2. Vyber si kategorii (např. "Základy práva")
3. Procvičuj otázky, sleduj své skóre
4. Čti vysvětlení u správných odpovědí

### 2. Pro přidání vlastních otázek

1. Otevři Admin panel na `/admin`
2. Vytvoř novou kategorii (pokud neexistuje)
3. Přidej otázku s odpověďmi
4. Označ správné odpovědi checkboxem

### 3. Pro práci s databází

```bash
# Otevřít Prisma Studio (GUI pro databázi)
npx prisma studio

# Resetovat databázi a naplnit testovacími daty
npx prisma migrate reset

# Přidat seed data ručně
npm run db:seed
```

## 📝 Poznámky

- V MVP verzi není autentizace - všichni uživatelé sdílejí stejnou databázi
- Progres se ukládá pouze v LocalStorage (nemigrovatelné mezi zařízeními)
- Zdrojové právní dokumenty jsou v nadřazeném adresáři pro budoucí AI zpracování

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
