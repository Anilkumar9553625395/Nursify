import { NextResponse } from 'next/server'
import { getAllNurses } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const nurses = await getAllNurses()
    return NextResponse.json(nurses)
  } catch (error) {
    console.error('Failed to get nurses:', error)
    return NextResponse.json([], { status: 500 })
  }
}
