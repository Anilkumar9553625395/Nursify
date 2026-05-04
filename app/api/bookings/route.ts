import { NextResponse } from 'next/server'
import { getAllBookings, getBookingsByEmail, addBooking, getNurseById } from '@/lib/store'
import { sendBookingConfirmation, sendNurseBookingNotification } from '@/lib/email'

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

    // Send Notifications
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        // 1. Notify Patient
        await sendBookingConfirmation(requesterEmail, booking)

        // 2. Notify Nurse (Fetch nurse email first)
        const nurse = await getNurseById(nurseId)
        if (nurse?.email) {
          await sendNurseBookingNotification(nurse.email, booking)
        }
      } catch (err) {
        console.error('Email notification failed:', err)
        // Don't fail the whole request if email fails, but log it
      }
    } else {
      console.log('Email not configured. Skipping notifications.')
    }

    return NextResponse.json(booking, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create care request' }, { status: 500 })
  }
}
