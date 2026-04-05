import { NextResponse } from 'next/server'
import { getAllBookings, getBookingsByEmail, addBooking } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')

  if (email) {
    const bookings = await getBookingsByEmail(email)
    return NextResponse.json(bookings)
  }
  const bookings = await getAllBookings()
  return NextResponse.json(bookings)
}

export async function POST(req: Request) {
  const body = await req.json()

  const {
    nurseId, nurseName,
    patientName, patientEmail, patientPhone,
    bookingType, hours, days,
    startDate, endDate, totalCost, notes,
  } = body

  if (!nurseId || !patientName || !patientEmail || !startDate || !totalCost) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const booking = await addBooking({
      nurseId, nurseName,
      patientName, patientEmail,
      patientPhone: patientPhone || '',
      bookingType: bookingType || 'hourly',
      hours: bookingType === 'hourly' ? Number(hours) : undefined,
      days: bookingType === 'daily' ? Number(days) : undefined,
      startDate, endDate,
      totalCost: Number(totalCost),
      notes: notes || '',
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create booking' }, { status: 500 })
  }
}
