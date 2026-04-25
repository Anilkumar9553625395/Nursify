import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'

export async function GET() {
  const user = getAuthUser()
  return NextResponse.json({ user })
}
