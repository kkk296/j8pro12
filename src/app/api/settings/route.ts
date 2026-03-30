import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession, updateSettings, isServerless } from '@/lib/auth-store'

export async function POST(request: NextRequest) {
  try {
    const { token, backgroundColor } = await request.json()

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 })
    }

    // Use in-memory store for Vercel (serverless)
    if (isServerless()) {
      const session = getSession(token)
      if (!session || !session.isActive) {
        return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
      }

      const settings = updateSettings(token, backgroundColor)
      return NextResponse.json({ success: true, settings })
    }

    // Use Prisma for local development
    const session = await db.userSession.findUnique({
      where: { sessionToken: token }
    })

    if (!session || !session.isActive) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    // Update or create settings
    const settings = await db.userSettings.upsert({
      where: { sessionToken: token },
      update: { backgroundColor },
      create: { sessionToken: token, backgroundColor }
    })

    return NextResponse.json({ success: true, settings })
  } catch (error) {
    console.error('Settings error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
