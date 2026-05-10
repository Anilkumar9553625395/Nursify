import { NextResponse } from 'next/server'
import { getAllBookings } from '@/lib/store'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const bookings = await getAllBookings()
    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Failed to get bookings:', error)
    return NextResponse.json([], { status: 500 })
  }
}
