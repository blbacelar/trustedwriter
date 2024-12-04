import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    const { content, listingUrl } = await req.json()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const application = await prisma.application.create({
      data: {
        userId,
        content,
        listingUrl
      }
    })

    return NextResponse.json(application)
  } catch (error) {
    console.error('[APPLICATIONS_POST]', error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function GET() {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const applications = await prisma.application.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(applications)
  } catch (error) {
    console.error('[APPLICATIONS_GET]', error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 