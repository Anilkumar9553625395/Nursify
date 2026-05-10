import { NextResponse } from 'next/server'
import { loginAdmin } from '@/lib/auth'

const ADMIN_CREDENTIALS = {
  email: 'admin@miAROGYA.com',
  password: 'admin123',
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      await loginAdmin()
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
