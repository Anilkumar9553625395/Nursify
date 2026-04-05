import { NextResponse } from 'next/server'
import { updateBookingStatus, type BookingStatus } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { status } = await req.json() as { status: BookingStatus }

  const valid: BookingStatus[] = ['pending', 'confirmed', 'completed', 'cancelled']
  if (!valid.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const updated = updateBookingStatus(params.id, status)
  if (!updated) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })

  return NextResponse.json(updated)
}
