import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const questions = await prisma.examQuestion.findMany({
    orderBy: { order: 'asc' },
    select: {
      order: true,
      title: true,
      shortAnswer: true,
      longAnswer: true,
    }
  })

  console.log(`Total questions: ${questions.length}`)
  console.log('\nFirst 3 questions:')
  questions.slice(0, 3).forEach(q => {
    console.log(`\n[${q.order}] ${q.title}`)
    console.log(`Short answer length: ${q.shortAnswer.length} chars`)
    console.log(`Long answer: ${q.longAnswer ? `${q.longAnswer.length} chars` : 'NULL'}`)
  })

  const withLongAnswer = questions.filter(q => q.longAnswer).length
  console.log(`\nQuestions with longAnswer: ${withLongAnswer}/${questions.length}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
