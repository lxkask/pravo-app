// Mock data pro proof of concept moderní učebnice
// Tato data simulují strukturu, kterou později vygeneruje AI z dokumentů

export interface MockChapter {
  id: string
  title: string
  description: string
  slug: string
  order: number
  lessonsCount: number
}

export interface MockLesson {
  id: string
  title: string
  slug: string
  description: string
  chapterId: string
  chapterTitle: string
  order: number
  content: string // Markdown content
  estimatedReadingTime: number
  verified: boolean
}

export const mockChapters: MockChapter[] = [
  {
    id: '1',
    title: 'Úvod do práva',
    description: 'Základní pojmy, funkce práva, prameny práva a systém práva v ČR',
    slug: 'uvod-do-prava',
    order: 1,
    lessonsCount: 3
  },
  {
    id: '2',
    title: 'Právní subjekty',
    description: 'Fyzické a právnické osoby, jejich vznik, zánik a právní způsobilost',
    slug: 'pravni-subjekty',
    order: 2,
    lessonsCount: 4
  },
  {
    id: '3',
    title: 'Obchodní společnosti',
    description: 'Typy obchodních společností, jejich vznik, fungování a zánik',
    slug: 'obchodni-spolecnosti',
    order: 3,
    lessonsCount: 5
  }
]

export const mockLessons: MockLesson[] = [
  // Kapitola 1: Úvod do práva
  {
    id: 'lesson-1',
    title: 'Pojem práva a jeho funkce',
    slug: 'pojem-prava-a-jeho-funkce',
    description: 'Co je právo, k čemu slouží a jaké jsou jeho základní funkce ve společnosti',
    chapterId: '1',
    chapterTitle: 'Úvod do práva',
    order: 1,
    estimatedReadingTime: 15,
    verified: false,
    content: `## Co je právo?

**Právo** je systém obecně závazných pravidel chování, která jsou stanovena nebo uznána státem a jejich dodržování je zajištěno státní mocí.

Právo představuje jeden z nejvýznamnějších **regulátorů společenských vztahů**. Na rozdíl od jiných sociálních norms (např. morálky nebo obyčejů) je právo výjimečné tím, že jeho dodržování je vymahatelné státní mocí.

---

## Základní znaky práva

Právo se vyznačuje několika charakteristickými znaky:

### 1. Obecná závaznost

Právní normy platí pro všechny osoby, na které dopadají. Nelze se od nich jednostranně odchýlit.

### 2. Formální určitost

Právní normy jsou obsaženy v psaných předpisech (zákony, vyhlášky), které jsou veřejně dostupné.

### 3. Vymahatelnost státní mocí

Pokud někdo právo poruší, může proti němu stát použít donucovací prostředky (pokuty, vězení, exekuce).

---

## Funkce práva

Právo ve společnosti plní několik klíčových funkcí:

### Ochranná funkce

Právo chrání základní hodnoty společnosti a práva jednotlivců. Například trestní právo chrání život, zdraví, majetek a další důležité hodnoty.

> **💡 Příklad**
>
> Trestní zákoník stanoví trest za vraždu, krádež nebo podvod - tím chrání naše základní práva.

### Regulativní funkce

Právo upravuje společenské vztahy a stanoví pravidla jejich fungování. Určuje, co je povoleno a co zakázáno.

> **💡 Příklad**
>
> Občanský zákoník upravuje, jak se uzavírá smlouva, jak se dědí majetek nebo jak se žení a vdává.

### Organizační funkce

Právo organizuje státní moc a veřejnou správu. Stanoví, kdo má jaké pravomoci a jak má postupovat.

> **💡 Příklad**
>
> Ústava definuje, že máme Parlament, prezidenta a vládu, a určuje, co každý z nich smí dělat.

### Výchovná funkce

Právo formuje chování lidí a vytváří právní vědomí společnosti.

---

## Právo vs. morálka

Je důležité rozlišovat mezi **právem** a **morálkou**:

| Kritérium | Právo | Morálka |
|-----------|-------|---------|
| **Zdroj** | Stát, zákonodárce | Společnost, náboženství, filozofie |
| **Forma** | Psané předpisy | Nepsaná pravidla |
| **Vymahatelnost** | Státní moc (soudy, policie) | Společenské sankce (ostrakizace) |
| **Sankce** | Pokuty, vězení, exekuce | Společenská izolace, výčitky svědomí |

> **💡 Příklad rozdílu**
>
> Lhaní je z morálního hlediska špatné, ale samo o sobě není nezákonné. Teprve když lhaní způsobí škodu (např. podvod), stává se i právním problémem.

---

## ✅ Shrnutí

- Právo je systém závazných pravidel vynucovaných státem
- Má formální podobu (zákony, vyhlášky) a je veřejně dostupné
- Plní ochrannou, regulativní, organizační a výchovnou funkci
- Liší se od morálky - je formální a státem vymahatelné

V dalších lekcích se podíváme na to, jak je právo vytvářeno (prameny práva) a jak je organizováno (systém práva).`
  },
  {
    id: 'lesson-2',
    title: 'Prameny práva',
    slug: 'prameny-prava',
    description: 'Zákony, vyhlášky, mezinárodní smlouvy a další zdroje práva v českém právním řádu',
    chapterId: '1',
    chapterTitle: 'Úvod do práva',
    order: 2,
    estimatedReadingTime: 20,
    verified: false,
    content: `## Co jsou prameny práva?

**Prameny práva** jsou formální zdroje, ze kterých poznáváme obsah práva. Jednoduše řečeno - jsou to dokumenty a předpisy, kde najdeme platná právní pravidla.

---

## Hierarchie pramenů práva v ČR

Právní předpisy mají mezi sebou určité pořadí - hierarchii. Předpis nižší v hierarchii nesmí být v rozporu s předpisem vyšším.

### 1. Ústava a ústavní zákony

**Nejvyšší** právní předpisy v ČR. Mění se pouze kvalifikovanou většinou (3/5 všech poslanců).

> **📜 Příklady ústavních zákonů:**
>
> - Ústava České republiky (č. 1/1993 Sb.)
> - Listina základních práv a svobod (č. 2/1993 Sb.)
> - Ústavní zákon o bezpečnosti ČR

### 2. Mezinárodní smlouvy

Mezinárodní smlouvy, ke kterým dal Parlament souhlas, mají přednost před zákony.

> **⚠️ Důležité**
>
> Evropská úmluva o lidských právech má v ČR přednost před běžnými zákony!

### 3. Zákony

Schvaluje je Parlament ČR. Zákony musí být v souladu s Ústavou.

> **📜 Příklady významných zákonů:**
>
> - Občanský zákoník (č. 89/2012 Sb.)
> - Trestní zákoník (č. 40/2009 Sb.)
> - Zákoník práce (č. 262/2006 Sb.)

### 4. Podzákonné právní předpisy

#### a) Nařízení vlády

Vydává je vláda pro provedení zákona.

#### b) Vyhlášky ministerstev

Vydávají je jednotlivá ministerstva v rozsahu své působnosti.

#### c) Obecně závazné vyhlášky obcí

Obce mohou vydávat vyhlášky v záležitostech, které zákon svěřuje do jejich působnosti.

> **💡 Příklad**
>
> Vyhláška obce o nočním klidu, o venčení psů, o pohybu psů na veřejnosti.

---

## Sbírka zákonů

Všechny právní předpisy musí být **zveřejněny ve Sbírce zákonů**, aby nabyli účinnosti.

**Důležité údaje u každého předpisu:**

- **Číslo předpisu** - např. "89/2012 Sb."
- **Datum vyhlášení** - kdy byl zveřejněn ve Sbírce zákonů
- **Datum účinnosti** - od kdy platí (obvykle 15 dní po vyhlášení)

> **💡 Příklad**
>
> Občanský zákoník má číslo 89/2012 Sb. - to znamená, že je to 89. předpis zveřejněný ve Sbírce zákonů v roce 2012.

---

## Judikatura

V České republice judikatura (rozhodnutí soudů) **není** primárním pramenem práva, ale má velký význam.

Zejména rozhodnutí:

- **Ústavního soudu** - která jsou závazná pro všechny
- **Nejvyššího soudu** - které sjednocují rozhodování obecných soudů
- **Nejvyššího správního soudu** - která sjednocují rozhodování správních soudů

---

## ✅ Shrnutí

Prameny práva v ČR (od nejvyššího):

1. **Ústava a ústavní zákony**
2. **Mezinárodní smlouvy** (se souhlasem Parlamentu)
3. **Zákony**
4. **Nařízení vlády**
5. **Vyhlášky ministerstev**
6. **Obecně závazné vyhlášky obcí**

Všechny předpisy musí být zveřejněny ve **Sbírce zákonů**.`
  },
  // Kapitola 2: Právní subjekty
  {
    id: 'lesson-3',
    title: 'Fyzické osoby - základní pojmy',
    slug: 'fyzicke-osoby-zakladni-pojmy',
    description: 'Kdo je fyzická osoba, kdy vzniká a zaniká, právní způsobilost a svéprávnost',
    chapterId: '2',
    chapterTitle: 'Právní subjekty',
    order: 1,
    estimatedReadingTime: 18,
    verified: false,
    content: `## Kdo je fyzická osoba?

**Fyzická osoba** je člověk jako subjekt práv a povinností. Každý člověk je z pohledu práva fyzickou osobou.

---

## Vznik a zánik fyzické osoby

### Vznik

Fyzická osoba vzniká **narozením**. Přesněji řečeno - oddělením plodu od těla matky.

> **⚠️ Důležité**
>
> Pokud se dítě narodí živé, má právní způsobilost od početí (zpětně). To je důležité například pro dědictví.

### Zánik

Fyzická osoba zaniká **smrtí**.

Zákon také počítá s institutem **prohlášení za mrtvého**, pokud:

- Osoba je nezvěstná déle než 3 roky, NEBO
- Osoba zmizela za okolností, které téměř jistě znamenají její smrt (např. při katastrofě)

---

## Právní způsobilost

**Právní způsobilost** je schopnost mít práva a povinnosti.

**Klíčové vlastnosti:**

- ✅ Má ji **každý člověk** od narození do smrti
- ✅ Je **rovná** - všichni ji mají stejnou
- ✅ **Nelze se jí vzdát** ani o ni nemůže nikdo přijít
- ✅ Nelze ji **omezit** (až na výjimky - např. trestní sankce)

> **💡 Příklad**
>
> Každý člověk může mít majetek, může být zaměstnán, může dědit. To jsou všechno práva plynoucí z právní způsobilosti.

---

## Svéprávnost

**Svéprávnost** je schopnost **vlastními úkony** nabývat práva a povinnosti.

Na rozdíl od právní způsobilosti:

- ❌ Nemají ji všichni lidé stejně
- ❌ Může být omezena
- ❌ Mění se s věkem

### Plná svéprávnost

**Kdy vzniká plná svéprávnost?**

1. **Zletilostí** - dovršením 18 let
2. **Uzavřením manželství** - i před 18. rokem (minimálně 16 let s povolením soudu)
3. **Emancipací** - zletilostí nabytou před dovršením 18 let (uděluje soud, pokud osoba od 16 let)

### Omezení svéprávnosti

Svéprávnost může být **omezena**, pokud:

- Osoba má duševní poruchu nebo poruchu rozumové schopnosti
- Osoba pro tuto poruchu není schopna právně jednat
- Omezení schválí soud

> **⚠️ Důležité**
>
> Omezení svéprávnosti je individuální - soud určí, v jakých věcech osoba nemůže jednat.

> **💡 Příklad**
>
> Člověk s Alzheimerovou chorobou může mít omezenou svéprávnost v oblasti nakládání s majetkem, ale může si stále vybírat, kde chce bydlet.

---

## Nezletilí a jejich jednání

**Nezletilí** (osoby mladší 18 let) mají **omezenou svéprávnost** podle věku:

### Do 6 let

- **Žádná svéprávnost**
- Nemohou sami právně jednat
- Za ně jednají rodiče

### 6-18 let

- **Částečná svéprávnost**
- Mohou dělat běžné věci (nakupovat v obchodě, jet MHD)
- K důležitým úkonům potřebují souhlas rodičů

> **💡 Příklad běžných věcí (bez souhlasu):**
>
> - Koupit si svačinu v obchodě
> - Jet autobusem
> - Přijmout malý dar

> **⚠️ Věci vyžadující souhlas rodičů:**
>
> - Podepsat pracovní smlouvu
> - Vzít si půjčku
> - Prodat svůj majetek

---

## ✅ Shrnutí

| Pojem | Význam | Komu náleží |
|-------|--------|-------------|
| **Právní způsobilost** | Mít práva a povinnosti | Všem lidem stejně |
| **Svéprávnost** | Vlastními úkony nabývat práva | Zletilí plně, nezletilí omezeně |

**Zapamatuj si:**

- Právní způsobilost = **MÁM** práva
- Svéprávnost = **MŮŽU S NIMI JEDNAT**`
  }
]

export function getMockChapterById(id: string): MockChapter | undefined {
  return mockChapters.find(ch => ch.id === id)
}

export function getMockLessonById(id: string): MockLesson | undefined {
  return mockLessons.find(l => l.id === id)
}

export function getMockLessonsByChapterId(chapterId: string): MockLesson[] {
  return mockLessons.filter(l => l.chapterId === chapterId)
}
