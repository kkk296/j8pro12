// In-memory store for Vercel serverless environment
// This will reset on each cold start but works for demo

interface Session {
  token: string
  userType: 'admin' | 'client' | 'demo'
  password: string
  activatedAt: Date
  expiresAt: Date | null
  isActive: boolean
}

interface Settings {
  sessionToken: string
  backgroundColor: string
}

interface Favorite {
  symbol: string
  name: string
}

// In-memory storage
const sessions = new Map<string, Session>()
const settings = new Map<string, Settings>()
const favorites: Favorite[] = []

// Password configuration
export const PASSWORDS = {
  'J8PRO': { type: 'admin' as const, durationDays: null },
  'DM': { type: 'client' as const, durationDays: 30 },
  'DEMO': { type: 'demo' as const, durationDays: 1 },
}

export function createSession(password: string): Session | null {
  const config = PASSWORDS[password as keyof typeof PASSWORDS]
  if (!config) return null

  const now = new Date()
  const expiresAt = config.durationDays
    ? new Date(now.getTime() + config.durationDays * 24 * 60 * 60 * 1000)
    : null

  const token = `${config.type}_${Date.now()}_${Math.random().toString(36).substring(7)}`

  const session: Session = {
    token,
    userType: config.type,
    password,
    activatedAt: now,
    expiresAt,
    isActive: true,
  }

  sessions.set(token, session)
  settings.set(token, { sessionToken: token, backgroundColor: '#000000' })

  return session
}

export function getSession(token: string): Session | null {
  return sessions.get(token) || null
}

export function getSessionByPassword(password: string): Session | null {
  for (const session of sessions.values()) {
    if (session.password === password) {
      return session
    }
  }
  return null
}

export function updateSession(token: string, data: Partial<Session>): Session | null {
  const session = sessions.get(token)
  if (!session) return null

  const updated = { ...session, ...data }
  sessions.set(token, updated)
  return updated
}

export function getSettings(token: string): Settings | null {
  return settings.get(token) || null
}

export function updateSettings(token: string, backgroundColor: string): Settings | null {
  const s = settings.get(token)
  if (!s) return null

  s.backgroundColor = backgroundColor
  settings.set(token, s)
  return s
}

export function getFavorites(): Favorite[] {
  return favorites
}

export function addFavorite(symbol: string, name: string): boolean {
  if (favorites.some(f => f.symbol === symbol)) return false
  favorites.push({ symbol, name })
  return true
}

export function removeFavorite(symbol: string): boolean {
  const index = favorites.findIndex(f => f.symbol === symbol)
  if (index === -1) return false
  favorites.splice(index, 1)
  return true
}

// Check if we're in a serverless environment (Vercel)
export function isServerless(): boolean {
  return process.env.VERCEL === '1' || !process.env.DATABASE_URL
}
