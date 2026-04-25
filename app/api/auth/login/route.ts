import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import { loginUser } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json()

    if (!identifier || !password) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 })
    }

    // Find user by email OR username
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .or(`email.eq.${identifier},username.eq.${identifier}`)
      .single()

    if (error || !user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash)
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    // Login
    await loginUser({
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    })

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Login server error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
