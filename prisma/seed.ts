import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Vyčištění stávajících dat
  await prisma.answer.deleteMany()
  await prisma.question.deleteMany()
  await prisma.category.deleteMany()

  // Vytvoření kategorií
  const zakladyPrava = await prisma.category.create({
    data: {
      name: 'Základy práva',
      description: 'Základní právní pojmy a principy',
      color: '#3B82F6'
    }
  })

  const obchodniPravo = await prisma.category.create({
    data: {
      name: 'Obchodní právo',
      description: 'Právní úprava podnikání a obchodu',
      color: '#10B981'
    }
  })

  // Testovací otázky pro Základy práva
  await prisma.question.create({
    data: {
      text: 'Co je to právní norma?',
      explanation: 'Právní norma je obecné pravidlo chování, které je závazné a jehož dodržování je zajištěno státní mocí.',
      type: 'SINGLE_CHOICE',
      difficulty: 'EASY',
      categoryId: zakladyPrava.id,
      answers: {
        create: [
          { text: 'Obecné pravidlo chování závazné a vynucované státní mocí', isCorrect: true },
          { text: 'Morální zásada bez sankce', isCorrect: false },
          { text: 'Doporučení od právníka', isCorrect: false },
          { text: 'Zvyklost bez právní síly', isCorrect: false }
        ]
      }
    }
  })

  await prisma.question.create({
    data: {
      text: 'Jaké jsou základní druhy právních odvětví?',
      explanation: 'Právo se dělí na veřejné (vztahynadřízenosti - trestní, správní) a soukromé (vztahy rovnosti - občanské, obchodní).',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      categoryId: zakladyPrava.id,
      answers: {
        create: [
          { text: 'Veřejné právo', isCorrect: true },
          { text: 'Soukromé právo', isCorrect: true },
          { text: 'Mezinárodní právo', isCorrect: true },
          { text: 'Digitální právo', isCorrect: false }
        ]
      }
    }
  })

  await prisma.question.create({
    data: {
      text: 'Hierarchie právních předpisů - Ústava má vyšší právní sílu než zákon.',
      explanation: 'Správně. Ústava je základním zákonem státu a má nejvyšší právní sílu. Všechny ostatní právní předpisy musí být v souladu s ústavou.',
      type: 'TRUE_FALSE',
      difficulty: 'EASY',
      categoryId: zakladyPrava.id,
      answers: {
        create: [
          { text: 'Pravda', isCorrect: true },
          { text: 'Nepravda', isCorrect: false }
        ]
      }
    }
  })

  // Testovací otázky pro Obchodní právo
  await prisma.question.create({
    data: {
      text: 'Kdo je podnikatelem podle zákona o obchodních korporacích?',
      explanation: 'Podnikatelem je osoba samostatně vykonávající na vlastní účet a odpovědnost výdělečnou činnost živnostenským nebo obdobným způsobem se záměrem činit tak soustavně za účelem dosažení zisku.',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      categoryId: obchodniPravo.id,
      answers: {
        create: [
          { text: 'Osoba vykonávající výdělečnou činnost soustavně a na vlastní účet', isCorrect: true },
          { text: 'Každý zaměstnanec pracující v obchodě', isCorrect: false },
          { text: 'Pouze vlastník velké firmy', isCorrect: false },
          { text: 'Osoba s vysokoškolským vzděláním v oboru', isCorrect: false }
        ]
      }
    }
  })

  await prisma.question.create({
    data: {
      text: 'Jaké jsou základní formy obchodních společností v ČR?',
      explanation: 'V České republice jsou to: veřejná obchodní společnost (v.o.s.), komanditní společnost (k.s.), společnost s ručením omezeným (s.r.o.) a akciová společnost (a.s.).',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      categoryId: obchodniPravo.id,
      answers: {
        create: [
          { text: 'Společnost s ručením omezeným (s.r.o.)', isCorrect: true },
          { text: 'Akciová společnost (a.s.)', isCorrect: true },
          { text: 'Veřejná obchodní společnost (v.o.s.)', isCorrect: true },
          { text: 'Nezisková organizace (n.o.)', isCorrect: false }
        ]
      }
    }
  })

  await prisma.question.create({
    data: {
      text: 'Společnost s ručením omezeným musí mít minimální základní kapitál 1 Kč.',
      explanation: 'Pravda. Od roku 2014 byl minimální základní kapitál s.r.o. snížen na symbolickou 1 Kč, aby se usnadnilo založení společnosti.',
      type: 'TRUE_FALSE',
      difficulty: 'EASY',
      categoryId: obchodniPravo.id,
      answers: {
        create: [
          { text: 'Pravda', isCorrect: true },
          { text: 'Nepravda', isCorrect: false }
        ]
      }
    }
  })

  console.log('Seed completed successfully!')
  console.log(`Created ${2} categories`)
  console.log(`Created ${6} questions`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
