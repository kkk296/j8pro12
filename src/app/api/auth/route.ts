import { NextRequest, NextResponse } from 'next/server'
import {
  createSession,
  getSession,
  getSessionByPassword,
  updateSession,
  getSettings,
  isServerless,
  PASSWORDS
} from '@/lib/auth-store'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 })
    }

    const upperPassword = password.toUpperCase()
    const config = PASSWORDS[upperPassword as keyof typeof PASSWORDS]

    if (!config) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // Use in-memory store for Vercel (serverless)
    if (isServerless()) {
      // Check if there's an existing session for this password
      let session = getSessionByPassword(upperPassword)

      const now = new Date()

      if (session) {
        // Check if session is expired
        if (session.expiresAt && new Date(session.expiresAt) < now) {
          updateSession(session.token, { isActive: false })
          return NextResponse.json({
            error: 'Access expired. Please contact admin to renew.',
            expired: true
          }, { status: 403 })
        }

        if (!session.isActive) {
          return NextResponse.json({
            error: 'Access blocked. Please contact admin.',
            blocked: true
          }, { status: 403 })
        }
      } else {
        // Create new session
        session = createSession(upperPassword)
        if (!session) {
          return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
        }
      }

      return NextResponse.json({
        success: true,
        session: {
          token: session.token,
          userType: session.userType,
          activatedAt: session.activatedAt,
          expiresAt: session.expiresAt
        }
      })
    }

    // Use Prisma for local development with SQLite
    let session = await db.userSession.findFirst({
      where: { password: upperPassword }
    })

    const now = new Date()

    if (session) {
      if (session.expiresAt && new Date(session.expiresAt) < now) {
        await db.userSession.update({
          where: { id: session.id },
          data: { isActive: false }
        })
        return NextResponse.json({
          error: 'Access expired. Please contact admin to renew.',
          expired: true
        }, { status: 403 })
      }

      if (!session.isActive) {
        return NextResponse.json({
          error: 'Access blocked. Please contact admin.',
          blocked: true
        }, { status: 403 })
      }

      await db.userSession.update({
        where: { id: session.id },
        data: { updatedAt: now }
      })
    } else {
      const expiresAt = config.durationDays
        ? new Date(now.getTime() + config.durationDays * 24 * 60 * 60 * 1000)
        : null

      session = await db.userSession.create({
        data: {
          sessionToken: `${config.type}_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          userType: config.type,
          password: upperPassword,
          activatedAt: now,
          expiresAt,
          isActive: true
        }
      })

      await db.userSettings.create({
        data: {
          sessionToken: session.sessionToken,
          backgroundColor: '#000000'
        }
      })
    }

    return NextResponse.json({
      success: true,
      session: {
        token: session.sessionToken,
        userType: session.userType,
        activatedAt: session.activatedAt,
        expiresAt: session.expiresAt
      }
    })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token')

    if (!token) {
      return NextResponse.json({ valid: false }, { status: 400 })
    }

    // Use in-memory store for Vercel (serverless)
    if (isServerless()) {
      const session = getSession(token)

      if (!session || !session.isActive) {
        return NextResponse.json({ valid: false, reason: 'not_found' }, { status: 401 })
      }

      const now = new Date()

      if (session.expiresAt && new Date(session.expiresAt) < now) {
        updateSession(session.token, { isActive: false })
        return NextResponse.json({ valid: false, reason: 'expired' }, { status: 401 })
      }

      const settings = getSettings(token)

      return NextResponse.json({
        valid: true,
        session: {
          token: session.token,
          userType: session.userType,
          activatedAt: session.activatedAt,
          expiresAt: session.expiresAt
        },
        settings: settings || { backgroundColor: '#000000' }
      })
    }

    // Use Prisma for local development
    const session = await db.userSession.findUnique({
      where: { sessionToken: token }
    })

    if (!session || !session.isActive) {
      return NextResponse.json({ valid: false, reason: 'not_found' }, { status: 401 })
    }

    const now = new Date()

    if (session.expiresAt && new Date(session.expiresAt) < now) {
      await db.userSession.update({
        where: { id: session.id },
        data: { isActive: false }
      })
      return NextResponse.json({ valid: false, reason: 'expired' }, { status: 401 })
    }

    const settings = await db.userSettings.findUnique({
      where: { sessionToken: token }
    })

    return NextResponse.json({
      valid: true,
      session: {
        token: session.sessionToken,
        userType: session.userType,
        activatedAt: session.activatedAt,
        expiresAt: session.expiresAt
      },
      settings: settings || { backgroundColor: '#000000' }
    })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json({ valid: false }, { status: 500 })
  }
}
