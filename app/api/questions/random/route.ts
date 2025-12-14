import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { shuffleArray } from '@/lib/utils'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where = categoryId ? { categoryId } : {}

    const totalQuestions = await prisma.question.count({ where })

    if (totalQuestions === 0) {
      return NextResponse.json([])
    }

    // Náhodný výběr otázek
    const questions = await prisma.question.findMany({
      where,
      include: {
        answers: true,
        category: true
      },
      take: Math.min(limit, totalQuestions)
    })

    // Fisher-Yates shuffle
    const shuffled = shuffleArray(questions)

    return NextResponse.json(shuffled)
  } catch (error) {
    console.error('Error fetching random questions:', error)
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
  }
}
