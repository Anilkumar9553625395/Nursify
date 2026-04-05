import { NextResponse } from 'next/server'
import { getAllNurses } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const nurses = await getAllNurses()
  return NextResponse.json(nurses)
}
