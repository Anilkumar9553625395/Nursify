import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const ADMIN_SESSION_COOKIE = 'admin_session'
const ADMIN_SESSION_VALUE = 'authenticated_admin_session_val_123'
const USER_SESSION_COOKIE = 'user_session'
const JWT_SECRET = process.env.JWT_SECRET || 'miAROGYA-secret-key-456'

export interface UserSession {
  userId: string
  email: string
  username: string
  role: 'nurse' | 'patient' | 'admin'
}

// ── Admin Auth ──────────────────────────────────────────────────────────────

export function isAdminAuthenticated() {
  const cookieStore = cookies()
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)
  return session?.value === ADMIN_SESSION_VALUE
}

export async function loginAdmin() {
  const cookieStore = cookies()
  cookieStore.set(ADMIN_SESSION_COOKIE, ADMIN_SESSION_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  })
}

export async function logoutAdmin() {
  const cookieStore = cookies()
  cookieStore.delete(ADMIN_SESSION_COOKIE)
}

// ── User Auth ───────────────────────────────────────────────────────────────

export function getAuthUser(): UserSession | null {
  const cookieStore = cookies()
  const token = cookieStore.get(USER_SESSION_COOKIE)?.value
  
  if (!token) return null
  
  try {
    return jwt.verify(token, JWT_SECRET) as UserSession
  } catch {
    return null
  }
}

export async function loginUser(user: UserSession) {
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' })
  const cookieStore = cookies()
  
  cookieStore.set(USER_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function logoutUser() {
  const cookieStore = cookies()
  cookieStore.delete(USER_SESSION_COOKIE)
}
