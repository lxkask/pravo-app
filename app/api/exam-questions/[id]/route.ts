import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const questionNumber = parseInt(id)

    if (isNaN(questionNumber)) {
      return NextResponse.json(
        { error: 'Invalid question number' },
        { status: 400 }
      )
    }

    const question = await prisma.examQuestion.findFirst({
      where: { order: questionNumber },
    })

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(question)
  } catch (error) {
    console.error('Error fetching question:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
