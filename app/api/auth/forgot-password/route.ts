import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendResetEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 })
    }

    // Check if user exists
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single()

    if (error || !user) {
      // Don't leak that the user doesn't exist for security reasons
      return NextResponse.json({ success: true, message: 'If an account exists, a reset link was sent.' })
    }

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString('hex')
    // Set expiry to 1 hour from now
    const expiryDate = new Date()
    expiryDate.setHours(expiryDate.getHours() + 1)

    // Save token to database
    const { error: updateError } = await supabase
      .from('users')
      .update({
        reset_token: resetToken,
        reset_token_expiry: expiryDate.toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Failed to update reset token:', updateError)
      return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }

    // Send email
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await sendResetEmail(email, resetToken)
      } catch (emailError) {
        console.error('Failed to send email:', emailError)
        return NextResponse.json({ message: 'Failed to send email. Please ensure EMAIL_USER and EMAIL_PASS are configured in .env.local.' }, { status: 500 })
      }
    } else {
      // For local development without email configured
      const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
      console.log('\n\n=========================================');
      console.log('EMAIL NOT CONFIGURED. MOCK RESET LINK:');
      console.log(resetLink);
      console.log('=========================================\n\n');
      
      // Send the link back to the client for easy local testing
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({ 
          success: true, 
          message: 'Development mode: Password reset link generated.',
          resetLink: resetLink
        })
      }
    }

    return NextResponse.json({ success: true, message: 'If an account exists, a reset link was sent.' })
  } catch (error) {
    console.error('Forgot password server error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
