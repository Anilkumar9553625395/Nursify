import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import { loginUser } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { username, email, password, role } = await req.json()

    if (!username || !email || !password || !role) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 })
    }

    // Check if user exists
    const { data: existing } = await supabase
      .from('users')
      .select('email, username')
      .or(`email.eq.${email},username.eq.${username}`)
      .single()

    if (existing) {
      return NextResponse.json({ message: 'Email or Username already exists' }, { status: 400 })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    // Create user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        username,
        email,
        password_hash: passwordHash,
        role
      })
      .select()
      .single()

    if (error) {
      console.error('Signup error:', error)
      return NextResponse.json({ message: 'Failed to create user. Make sure "users" table exists.' }, { status: 500 })
    }

    // Auto-login
    await loginUser({
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role
    })

    return NextResponse.json({ success: true, user: newUser })
  } catch (error) {
    console.error('Signup server error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
