import { cookies } from 'next/headers'

const ADMIN_SESSION_COOKIE = 'admin_session'
const ADMIN_SESSION_VALUE = 'authenticated_admin_session_val_123' // In a real app, this would be a secure token

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
