# 🎨 Proof of Concept Demo - Moderní Učebnice

**Stav:** ✅ Funkční prototype s mock daty
**Datum:** 2025-12-09

---

## 🚀 Jak otestovat

### 1. Spusť aplikaci

Server by měl už běžet na: **http://localhost:3000**

Pokud ne:
```bash
cd pravo-quiz-app
npm run dev
```

### 2. Navigace k učebnici

**Možnost A:** Klikni na "Moderní Učebnice" na homepage
**Možnost B:** Přímo na URL: http://localhost:3000/textbook

---

## 📋 Co testovat

### ✅ Desktop Experience (na počítači)

1. **Homepage učebnice** (`/textbook`)
   - [ ] Vidíš 3 kapitoly v grid layoutu
   - [ ] Každá kapitola má číslo, název, popis a počet lekcí
   - [ ] Hover efekt funguje (stín, změna barvy)
   - [ ] Modré info pole nahoře je čitelné

2. **Detail kapitoly** (`/textbook/chapter/uvod-do-prava`)
   - [ ] Breadcrumb navigace funguje
   - [ ] Seznam lekcí je přehledný
   - [ ] Vidíš odhadovaný čas čtení
   - [ ] Badges (Proof of concept) jsou viditelné
   - [ ] Kliknutí na lekci funguje

3. **Detail lekce** (`/textbook/lesson/pojem-prava-a-jeho-funkce`)
   - [ ] **HLAVNÍ TEST:** Čitelnost textu
   - [ ] Je písmo dostatečně velké? (mělo by být 18px)
   - [ ] Je kontrast dostatečný?
   - [ ] Je řádkování příjemné? (line-height 1.75)
   - [ ] Je šířka obsahu OK? (max 800px, vycentrované)
   - [ ] Nadpisy H2/H3 jsou přehledně oddělené
   - [ ] Tabulky jsou čitelné a stylové
   - [ ] Blockquote (citace) je viditelně odlišené
   - [ ] Sticky header nahoře funguje (při scrollování zůstává)

4. **Navigace v lekci**
   - [ ] Breadcrumb v headeru funguje
   - [ ] "Zpět na kapitolu" link dole funguje
   - [ ] Odhadovaný čas čtení je viditelný v headeru

### ✅ Mobile Experience (na mobilu nebo zmenšeném okně)

1. **Otevři Dev Tools (F12) → Toggle Device Toolbar**
   - Vyber iPhone nebo jiný mobil

2. **Homepage učebnice**
   - [ ] Kapitoly se zobrazují ve sloupci (ne vedle sebe)
   - [ ] Text je čitelný
   - [ ] Tlačítka jsou dostatečně velké

3. **Detail kapitoly**
   - [ ] Breadcrumb se neláme divně
   - [ ] Seznam lekcí je mobile-friendly
   - [ ] Vše je přehledné

4. **Detail lekce**
   - [ ] **KRITICKÝ TEST:** Je čtení příjemné na mobilu?
   - [ ] Písmo je dost velké? (mělo by být 16px na mobilu)
   - [ ] Není třeba zoomovat
   - [ ] Tabulky se scrollují horizontálně (pokud jsou široké)
   - [ ] Sticky header nezabírá moc místa
   - [ ] Breadcrumb je zkrácený/přehledný

### ✅ Dark Mode

1. **Přepni dark mode** (pokud máš v systému, nebo změň v dev tools)
   - [ ] Pozadí je deep dark (`#0f1419`)
   - [ ] Text má vysoký kontrast (bílý/šedý)
   - [ ] Není žádný prvek, který by byl nečitelný
   - [ ] Odkazy jsou modré (`#58a6ff`) a viditelné

---

## 🎯 Klíčové otázky pro feedback

### Čitelnost
1. Je písmo dostatečně velké? (nebo moc velké?)
2. Je kontrast textu dostatečný?
3. Je řádkování příjemné pro delší čtení?
4. Je šířka obsahu OK? (800px max-width)

### Navigace
1. Je jasné, jak se dostat zpět?
2. Je breadcrumb užitečný?
3. Chybí nějaká navigace?

### Layout
1. Je layout příjemný na mobilu?
2. Je layout příjemný na desktopu?
3. Je něco přetížené vizuálně?
4. Je něco naopak prázdné/nudné?

### Obsah
1. Je struktura lekce přehledná? (H2/H3 nadpisy)
2. Jsou tabulky čitelné?
3. Jsou příklady viditelně oddělené?
4. Je délka lekce OK? (tato má ~15 min čtení)

### Celkový dojem
1. Líbí se ti tento přístup k učebnici?
2. Preferoval bys jiný design?
3. Co ti vadí nejvíc?
4. Co se ti líbí nejvíc?

---

## 📸 Co si prohlédnout

### Doporučené URL pro testování:

1. **Homepage:** http://localhost:3000/textbook
2. **Kapitola 1:** http://localhost:3000/textbook/chapter/uvod-do-prava
3. **Lekce 1 (hlavní test čitelnosti):** http://localhost:3000/textbook/lesson/pojem-prava-a-jeho-funkce
4. **Lekce 2 (více obsahu):** http://localhost:3000/textbook/lesson/prameny-prava
5. **Lekce 3 (tabulky a strukturovaný obsah):** http://localhost:3000/textbook/lesson/fyzicke-osoby-zakladni-pojmy

---

## 🐛 Známé problémy (Proof of Concept)

- ⚠️ Mock data - není napojeno na databázi
- ⚠️ Není sidebar TOC (table of contents) v lekci
- ⚠️ Není "Další lekce" tlačítko
- ⚠️ Není ukládání reading progress
- ⚠️ Není vyhledávání
- ⚠️ Source tracking je jen placeholder (info box dole)

**Tyto věci se dodělají až po feedbacku na základní koncept!**

---

## 📝 Jak dát feedback

Když testuješ, zapiš si poznámky:

**Co se ti líbí:**
- ...

**Co ti vadí:**
- ...

**Co změnit:**
- ...

**Návrhy na vylepšení:**
- ...

---

## 🎨 Technické detaily (pro referenci)

### Typography
- Desktop: 18px base, line-height 1.75
- Mobile: 16px base, line-height 1.75
- Max content width: 800px
- Headings: H2 (2em), H3 (1.5em)

### Colors (Dark Mode)
- Background: `#0f1419` (deep dark)
- Text: `#e6edf3` (off-white)
- Headings: `#ffffff` (white)
- Links: `#58a6ff` (blue)

### Stack
- Next.js 16 (App Router)
- Tailwind CSS
- react-markdown pro rendering
- Mock data (zatím ne databáze)

---

**Připraveno k testování!** 🚀
