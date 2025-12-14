import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { shuffleArray } from '@/lib/utils';

/**
 * GET /api/midterm-quiz
 *
 * Fetch quiz questions for midterm test
 *
 * Query params:
 * - limit: number of questions (default: 20)
 * - category: filter by category (ZP, OP, MIXED)
 * - shuffle: randomize order (default: true)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category'); // Optional filter
    const shuffle = searchParams.get('shuffle') !== 'false'; // Default true

    // Build where clause
    const where = category ? { category } : {};

    // Fetch ALL available questions first (to enable proper randomization)
    const allQuestions = await prisma.quizQuestion.findMany({
      where,
      select: {
        id: true,
        questionText: true,
        explanation: true,
        explanationConfidence: true,
        originalId: true,
        category: true,
        answers: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    // Shuffle ALL questions first if requested
    let shuffledQuestions = allQuestions;
    if (shuffle) {
      shuffledQuestions = shuffleArray(allQuestions);
    }

    // THEN take the limit (this ensures different questions each time)
    const resultQuestions = shuffledQuestions.slice(0, Math.min(limit, 100));

    return NextResponse.json({
      questions: resultQuestions,
      total: resultQuestions.length,
    });
  } catch (error) {
    console.error('Error fetching midterm quiz questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}
