import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')

    const where = categoryId ? { categoryId } : {}

    const questions = await prisma.question.findMany({
      where,
      include: {
        answers: true,
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(questions)
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { text, explanation, type, difficulty, categoryId, answers } = body

    const question = await prisma.question.create({
      data: {
        text,
        explanation,
        type,
        difficulty,
        categoryId,
        answers: {
          create: answers
        }
      },
      include: {
        answers: true,
        category: true
      }
    })

    return NextResponse.json(question, { status: 201 })
  } catch (error) {
    console.error('Error creating question:', error)
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 })
  }
}
