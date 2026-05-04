import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = getAuthUser()
    if (!user) return NextResponse.json({ profile: null }, { status: 401 })

    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, profile_data')
      .eq('id', user.userId)
      .single()

    if (error || !data) return NextResponse.json({ profile: { username: user.username, email: user.email } })

    let extra: any = {}
    if (data.profile_data) {
      try { extra = JSON.parse(data.profile_data) } catch { extra = {} }
    }

    return NextResponse.json({
      profile: {
        username: data.username,
        email: data.email,
        ...extra,
      }
    })
  } catch (err: any) {
    // If column doesn't exist yet, return basic auth user info
    const user = getAuthUser()
    if (user) return NextResponse.json({ profile: { username: user.username, email: user.email } })
    return NextResponse.json({ profile: null })
  }
}

export async function POST(req: Request) {
  try {
    const user = getAuthUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const profileData = JSON.stringify({
      phone: body.phone || '',
      address: body.address || '',
      location: body.location || '',
      emergencyContact: body.emergencyContact || '',
      emergencyRelation: body.emergencyRelation || '',
    })

    const { error } = await supabase
      .from('users')
      .update({ profile_data: profileData })
      .eq('id', user.userId)

    if (error) {
      // Column might not exist yet
      console.warn('profile_data column error:', error.message)
      return NextResponse.json({ 
        success: false, 
        error: 'Profile column not set up yet. Please add the "profile_data TEXT" column to the users table in Supabase.' 
      }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
