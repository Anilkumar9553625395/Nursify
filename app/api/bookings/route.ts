import { NextResponse } from 'next/server'
import { getAllBookings, getBookingsByEmail, addBooking } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    if (email) {
      const bookings = await getBookingsByEmail(email)
      return NextResponse.json(bookings)
    }
    const bookings = await getAllBookings()
    return NextResponse.json(bookings)
  } catch (error: any) {
    console.error('Bookings GET error:', error.message)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: Request) {
  const body = await req.json()

  const {
    nurseId, nurseName,
    requesterName, requesterEmail, requesterPhone,
    relationToPatient,
    patientName, patientAge, patientGender,
    patientAddress, patientLocation, patientContact,
    emergencyContact, emergencyRelation,
    diagnosis, clinicalNotes,
    recentAdmissions, treatmentPlan,
    servicesNeeded,
    canMakeDecisions, understandsLimitations,
    consentSignedBy, relativeRelation, relativeAadhar, noConsentReason,
    bookingType, hours, days,
    startDate, endDate, totalCost, notes,
  } = body

  if (!nurseId || !requesterName || !requesterEmail || !patientName || !startDate || !totalCost) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const booking = await addBooking({
      nurseId, nurseName,
      requesterName, requesterEmail,
      requesterPhone: requesterPhone || '',
      relationToPatient: relationToPatient || 'Self',
      patientName,
      patientAge: Number(patientAge) || 0,
      patientGender: patientGender || '',
      patientAddress: patientAddress || '',
      patientLocation: patientLocation || '',
      patientContact: patientContact || '',
      emergencyContact: emergencyContact || '',
      emergencyRelation: emergencyRelation || '',
      diagnosis: diagnosis || '',
      clinicalNotes: clinicalNotes || '',
      recentAdmissions: recentAdmissions || false,
      treatmentPlan: treatmentPlan || '',
      servicesNeeded: servicesNeeded || [],
      canMakeDecisions: canMakeDecisions ?? true,
      understandsLimitations: understandsLimitations,
      consentSignedBy: consentSignedBy || 'patient',
      relativeRelation: relativeRelation,
      relativeAadhar: relativeAadhar,
      noConsentReason: noConsentReason,
      bookingType: bookingType || 'hourly',
      hours: bookingType === 'hourly' ? Number(hours) : undefined,
      days: bookingType === 'daily' ? Number(days) : undefined,
      startDate, endDate,
      totalCost: Number(totalCost),
      notes: notes || '',
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create care request' }, { status: 500 })
  }
}
