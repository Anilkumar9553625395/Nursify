import { NextResponse } from 'next/server'
import { getAllBookings } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const bookings = await getAllBookings()
  return NextResponse.json(bookings)
}
