import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { shuffleArray } from '@/lib/shuffle'

export const dynamic = 'force-dynamic'

/**
 * GET /api/exam-questions
 *
 * Query parameters:
 * - shuffle: boolean - Whether to shuffle the questions
 * - limit: number - Number of questions to return (default: all)
 * - includeAnswers: boolean - Whether to include shortAnswer and longAnswer fields
 *
 * Returns array of exam questions
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const shuffle = searchParams.get('shuffle') === 'true'
    const limit = searchParams.get('limit')
    const includeAnswers = searchParams.get('includeAnswers') !== 'false' // default true

    // Fetch all questions from database
    const questions = await prisma.examQuestion.findMany({
      orderBy: { order: 'asc' },
      select: {
        id: true,
        order: true,
        title: true,
        shortAnswer: includeAnswers,
        longAnswer: includeAnswers,
        source: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // Apply shuffle if requested
    let result = questions

    if (shuffle) {
      result = shuffleArray(questions)
    }

    // Apply limit if specified
    if (limit) {
      const limitNum = parseInt(limit, 10)
      if (!isNaN(limitNum) && limitNum > 0) {
        result = result.slice(0, limitNum)
      }
    }

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (error) {
    console.error('Error fetching exam questions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch exam questions' },
      { status: 500 }
    )
  }
}
