# 📚 Fáze 2: AI Extrakce Právního Obsahu - Návod

## 🎯 Co je Fáze 2?

Fáze 2 se zaměřuje na **extrakci přesného, strukturovaného právního obsahu** z tvých dokumentů pomocí AI. Prioritou je **kvalita a přesnost**, ne kvantita.

### Hlavní rozdíl oproti Fázi 1:

- **Fáze 1 (MVP)**: Manuální vytváření kvízů
- **Fáze 2 (Teď)**: AI extrahuje **strukturovanou teorii** → z ní se pak generují kvízy

## 🚀 Rychlý Start

### 1. Nastavení API klíče

Budeš potřebovat Anthropic API klíč pro Claude:

1. Jdi na https://console.anthropic.com/
2. Zaregistruj se / přihlas se
3. Vytvoř nový API klíč
4. Zkopíruj `.env.example` do `.env`:
   ```bash
   cp .env.example .env
   ```
5. Přidej svůj API klíč do `.env`:
   ```
   ANTHROPIC_API_KEY="sk-ant-api03-..."
   ```

### 2. První extrakce

Zkusíme extrahovat jeden dokument:

```bash
# Příklad s dokumentem ze složky výše
tsx scripts/extract-documents.ts "../CELÉ PRÁVO DLE NOZ - NIKOLA KUCHAŘÍKOVÁ.docx"
```

**Co se stane:**
1. Script načte text z .docx souboru
2. Pošle ho Claude AI s přesným promptem
3. AI vrátí strukturovaný JSON s lekcemi, tématy, sekcemi
4. JSON se uloží do `./extractions/` složky

**Výstup:**
```
🚀 Starting document extraction...
📄 Reading DOCX file: ../CELÉ PRÁVO DLE NOZ.docx
📝 Extracted 45239 characters
📦 Split text into 3 chunks
🤖 Processing chunk 1/3 with Claude...
✅ Extracted 4 lessons from chunk 1
...
✨ Extraction complete!
📊 Statistics:
   - Lessons: 12
   - Topics: 38
   - Sections: 156
   - Quality: HIGH
   - Requires review: Yes ⚠️
```

### 3. Kontrola extrakce

Než importuješ do databáze, **VŽDY zkontroluj** extrahovaný JSON:

```bash
# Zobraz seznam extrakcí
tsx scripts/import-to-database.ts --list
```

Otevři si JSON soubor v `./extractions/` a zkontroluj:
- ✅ Jsou odkazy na paragrafy správné? (§ 23 NOZ)
- ✅ Jsou definice přesné?
- ✅ Není tam něco vymyšleného?

### 4. Import do databáze

Když jsi spokojený s extrakcí:

```bash
# Import s automatickou kategorií
tsx scripts/import-to-database.ts ./extractions/cele-pravo-dle-noz.json

# Nebo s vlastní kategorií
tsx scripts/import-to-database.ts ./extractions/cele-pravo-dle-noz.json "Základy práva"
```

**Výstup:**
```
🚀 Importing extraction: ./extractions/cele-pravo-dle-noz.json
📊 Found 12 lessons to import
✅ Using category: Základy práva
📖 Importing lesson: Právní subjekty
  ✓ Created lesson: Právní subjekty
    ✓ Created topic: Fyzické osoby
      ✓ Created 8 sections
...
✨ Import complete!
```

## 📖 Struktura extrahovaného obsahu

### Hierarchie:
```
Kategorie (Základy práva)
  └── Lekce (Právní subjekty)
      └── Téma (Fyzické osoby)
          └── Sekce (Definice fyzické osoby)
```

### Typy sekcí:

- **DEFINITION**: Právní definice (např. "Co je právní subjekt?")
  - 💡 Použij pro základní pojmy
- **TEXT**: Běžný výkladový text
  - 💡 Pro vysvětlení konceptů
- **LAW_QUOTE**: Citace ze zákona
  - 💡 Přesná citace § XY
- **EXAMPLE**: Praktický příklad
  - 💡 "Například: Jan zakoupil auto..."
- **CASE_STUDY**: Kazuistika, složitější případ
  - 💡 Realističtější scénáře
- **IMPORTANT**: Důležité upozornění
  - 💡 Výjimky, specifika, časté chyby

### Důležitost (Importance):

- **CRITICAL** ⚠️: Musíš znát (základní definice)
- **HIGH** 🔴: Velmi důležité (časté na zkoušce)
- **MEDIUM** 🟡: Standardní obsah
- **LOW** 🟢: Doplňující info

## 🎯 Workflow - Kompletní proces

### Scénář: Máš 5 .docx souborů s právem

```bash
# 1. Extrahuj všechny dokumenty
tsx scripts/extract-documents.ts "../Základy práva.docx"
tsx scripts/extract-documents.ts "../Obchodní právo.docx"
tsx scripts/extract-documents.ts "../gl-obchodnipravo/GL - Obchodní právo otázky.doc"
# atd...

# 2. Zkontroluj co se extrahovalo
tsx scripts/import-to-database.ts --list

# 3. Otevři každý JSON a zkontroluj
# - Jsou definice správné?
# - Odpovídají odkazy na paragrafy?
# - Není tam něco vymyšleného?

# 4. Importuj jeden po druhém
tsx scripts/import-to-database.ts ./extractions/zaklady-prava.json "Základy práva"
tsx scripts/import-to-database.ts ./extractions/obchodni-pravo.json "Obchodní právo"

# 5. Otevři aplikaci a zkontroluj obsah
npm run dev
# Jdi na http://localhost:3000
```

## ⚠️ DŮLEŽITÉ UPOZORNĚNÍ

### AI není perfektní!

**VŽDY manuálně kontroluj extrahovaný obsah**, protože AI může:
- ❌ Udělat chybu v interpretaci
- ❌ Přehlédnout detail
- ❌ Nepoznat zastaralou legislativu
- ❌ Vymyslet si něco, co tam není

### Best Practices:

1. **Začni s malým dokumentem** - Nejprve vyzkoušej na 5-10 stránkách
2. **Kontroluj, kontroluj, kontroluj** - Každou definici, každý paragraf
3. **Označ co ověříš** - V databázi nastav `verified: true` až po kontrole
4. **Rozděl velké soubory** - Lépe extrahovat po kapitolách než celý 200str dokument
5. **Postupně importuj** - Nejprve 1 lekce, ověř, pak další

## 🔧 Troubleshooting

### "ANTHROPIC_API_KEY is not set"
```bash
# Ujisti se, že máš .env soubor s API klíčem
cat .env

# Měl by obsahovat:
ANTHROPIC_API_KEY="sk-ant-..."
```

### "Extraction quality is LOW"
- 🔍 Zkontroluj zdrojový dokument - je text čitelný?
- 📄 Možná jsou v dokumentu převážně obrázky/tabulky
- ✂️ Zkus rozdělit na menší části

### "Failed to parse AI response"
- 🔄 Zkus spustit znovu (AI není 100% deterministická)
- ⏳ Možná byla API request příliš dlouhá, zkus menší části

### "Databáze obsahuje divné symboly"
- 📝 Zkontroluj encoding zdrojového souboru
- 🔧 Možná je .docx poškozen

## 📊 Monitorování kvality

Po každé extrakci zkontroluj metadata:

```json
{
  "metadata": {
    "extractionQuality": "HIGH",  // ✅ Dobré!
    "requiresReview": true,       // ⚠️ Vždy zkontroluj
    "warnings": [                 // 👀 Přečti si varování
      "Některé paragrafy nejsou v aktuálním znění NOZ"
    ]
  }
}
```

## 🎓 Tipy pro lepší výsledky

### Příprava dokumentů:

1. **Čistý formát**: .docx je nejlepší, ne scany PDF
2. **Strukturovaný text**: Kapitoly, nadpisy pomohou AI
3. **Aktuální znění**: Používej aktuální verze zákonů
4. **Bez obrázků**: AI neumí číst obrázky (zatím)

### Optimalizace promptu:

Prompty jsou v `scripts/prompts/extract-content.ts`. Můžeš je upravit podle potřeby:
- Přidat specifické instrukce pro tvůj typ dokumentů
- Zdůraznit důležité aspekty
- Přidat příklady správného výstupu

## 🔜 Co dál?

Po úspěšné extrakci a importu:

1. **Vytvoř UI pro prohlížení lekcí** - Abys mohl studovat z extrahované teorie
2. **Přidej review systém** - Pro označení ověřených sekcí
3. **Generuj kvízy automaticky** - Z ověřeného obsahu

---

**Otázky? Problém?**
Zkontroluj `scripts/README.md` nebo se podívej do kódu v `scripts/extract-documents.ts`.
