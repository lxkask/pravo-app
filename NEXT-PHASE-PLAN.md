# 🚀 Plán Další Fáze

**Datum vytvoření:** 2025-12-10
**Status:** Fáze 2.5 dokončena - 40 zkouškových otázek nasazeno

---

## ✅ Co je hotovo (Fáze 2.5)

- 40 zkouškových otázek s krátkými odpověďmi
- AI-powered formátování (markdown s headingy, bold, seznamy)
- Krásné mobile-first UI
- Plně funkční navigace
- Nasazeno na Vercel: https://pravo-quiz-ebka3ddug-lukass-projects-2757878c.vercel.app

---

## 🎯 Co Dělat Příště?

### Možnost A: Dlouhé Odpovědi ke Zkouškám (Quick Win)

**Popis:** Rozšířit existující zkouškové otázky o detailní dlouhé odpovědi

**Výhody:**
- Navazuje na hotovou práci
- Uživatelé mohou hloubkově pochopit každou otázku
- Relativně rychlá implementace

**Co to obnáší:**
1. Získat PDF nebo Word s dlouhými odpověďmi (nebo jiný zdroj)
2. Vytvořit script `extract-long-answers.ts` podobný `clean-questions-with-ai.ts`
3. Spárovat dlouhé odpovědi s existujícími otázkami (podle `order` nebo `title`)
4. Update databáze - naplnit pole `longAnswer`
5. Otestovat toggle mezi krátkou a dlouhou verzí
6. Deploy

**Odhad času:** 2-3 hodiny

**Potřebné:**
- Zdrojový materiál s dlouhými odpověďmi

---

### Možnost B: Progress Tracking & Bookmarks

**Popis:** Přidat možnost sledovat pokrok a ukládat oblíbené otázky

**Výhody:**
- Uživatelé si mohou označit, co už se naučili
- Bookmark na obtížné otázky k opakování
- Lepší studijní zážitek

**Co to obnáší:**
1. LocalStorage tracking:
   - `examQuestionsProgress: { [questionId]: { viewed: boolean, learned: boolean, bookmarked: boolean } }`
2. UI změny:
   - Checkbox "Naučil jsem se" pod každou otázkou
   - Ikona bookmark (hvězdička) v headeru detail stránky
   - Progress bar na homepage (např. "Naučeno: 15/40")
   - Filter na seznam otázek: "Vše / Naučené / Neučené / Bookmarks"
3. Persistence v LocalStorage

**Odhad času:** 3-4 hodiny

**Potřebné:**
- Žádné externí zdroje

---

### Možnost C: Flashcard Mód

**Popis:** Přidat flashcard režim pro rychlé opakování

**Výhody:**
- Aktivní učení (vybavení z paměti)
- Rychlé opakování před zkouškou
- Gamifikace učení

**Co to obnáší:**
1. Nová stránka `/exam-questions/flashcards`
2. UI:
   - Karta s otázkou (title)
   - Tlačítko "Ukázat odpověď"
   - Po odkrytí: krátká odpověď + tlačítka "Znám ✓" / "Neznám ✗"
   - Navigace na další náhodnou otázku
3. Statistiky:
   - Counter správných/špatných odpovědí
   - Možnost reset session
4. Propojení s progress tracking (pokud hotovo)

**Odhad času:** 4-5 hodin

**Potřebné:**
- Žádné externí zdroje

---

### Možnost D: Pokračovat v Moderní Učebnici (Větší projekt)

**Popis:** Implementovat původní vizi moderní učebnice s master outline

**Výhody:**
- Systematické pokrytí celé látky
- Multi-source consolidation
- Source tracking (zero hallucinations)

**Co to obnáší:**
1. Vyřešit 3 konflikty v master outline
2. Vytvořit `assemble-lesson-content.ts` script
3. Vygenerovat 2-3 ukázkové lekce
4. Nový UI design pro plynulé čtení
5. Implementovat kapitoly → lekce → detail pages
6. Reading progress tracking

**Odhad času:** 15-20 hodin (velký projekt)

**Potřebné:**
- Vyřešit konflikty v existujícím master outline
- Zpracovat zbývající dokumenty (gl-obchodnipravo/, Komplet teorie/)

**Status:** Master outline už existuje v `extractions/master-outline-2025-12-08T23-14-59-201Z.json`

---

### Možnost E: Midterm Quiz Improvements

**Popis:** Vylepšit existující midterm quiz s 94 otázkami

**Co se dá zlepšit:**
1. Lepší UI design (konzistentní s exam questions)
2. Progress tracking (kolik otázek správně/špatně)
3. Možnost opakovat jen špatné odpovědi
4. Timer pro realistický test
5. Statistiky a výsledky

**Odhad času:** 5-6 hodin

**Potřebné:**
- Žádné externí zdroje

---

## 💡 Doporučení

### Pro rychlý pokrok (1-2 sessions):
1. **Možnost A** (Dlouhé odpovědi) - pokud máš zdroj
2. **Možnost B** (Progress tracking) - okamžitě použitelné
3. **Možnost C** (Flashcards) - skvělý study tool

### Pro dlouhodobější vývoj:
1. **Možnost D** (Moderní učebnice) - původní velká vize
2. **Možnost E** (Midterm quiz improvements) - dokončit existující funkce

---

## 📝 Technické Poznámky

### Hotová Infrastruktura:
- ✅ PostgreSQL databáze (Neon serverless)
- ✅ Prisma ORM
- ✅ Next.js 16 (App Router)
- ✅ AI-powered extraction pipeline (Anthropic Claude)
- ✅ React-markdown rendering
- ✅ Vercel deployment pipeline

### Co Funguje:
- Extrakce z PDF pomocí `pdf-parse`
- AI formátování pomocí Anthropic tool use API
- Database seeding scripty
- Automatic deployment na Vercel při push

### Naučené Lekce:
- AI formátování je MNOHEM lepší než ruční parser
- Anthropic tool use API je spolehlivější než JSON extraction
- TypeScript errors v `scripts/` mohou rozbít Vercel build → exclude je nutné

---

## 🎓 Co Říct Uživateli?

Aplikace má nyní:
- ✅ 94 midterm quiz otázek (Fáze 1)
- ✅ 40 zkouškových otázek s krátkými odpověďmi (Fáze 2.5)
- ✅ Admin rozhraní pro správu kvízů
- ✅ Nasazeno na produkci

Příští kroky závisí na prioritách:
- Rychlé vylepšení: Dlouhé odpovědi, progress tracking, nebo flashcards
- Velký projekt: Dokončit moderní učebnici s master outline

---

## 🔗 Užitečné Odkazy

- **Vercel URL:** https://pravo-quiz-ebka3ddug-lukass-projects-2757878c.vercel.app
- **GitHub:** https://github.com/lxkask/pravo-app
- **Koncept učebnice:** [KONCEPT-MODERNICH-UCEBNIC.md](./KONCEPT-MODERNICH-UCEBNIC.md)
- **Master outline:** `extractions/master-outline-2025-12-08T23-14-59-201Z.json`

---

**Připraveno pro další session! 🚀**
