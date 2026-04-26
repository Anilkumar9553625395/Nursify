import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json({ message: 'Missing token or password' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters' }, { status: 400 })
    }

    // Find user with this valid token
    const now = new Date().toISOString()
    const { data: user, error } = await supabase
      .from('users')
      .select('id')
      .eq('reset_token', token)
      .gte('reset_token_expiry', now)
      .single()

    if (error || !user) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 })
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    // Update password and clear token
    const { error: updateError } = await supabase
      .from('users')
      .update({
        password_hash: passwordHash,
        reset_token: null,
        reset_token_expiry: null
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Failed to update password:', updateError)
      return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Password updated successfully' })
  } catch (error) {
    console.error('Reset password server error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
