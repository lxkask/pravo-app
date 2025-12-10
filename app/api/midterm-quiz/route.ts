import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // Fetch questions with answers
    const questions = await prisma.quizQuestion.findMany({
      where,
      include: {
        answers: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      take: limit > 100 ? 100 : limit, // Max 100 questions per request
    });

    // Shuffle if requested
    let resultQuestions = questions;
    if (shuffle) {
      resultQuestions = questions.sort(() => Math.random() - 0.5);
    }

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
