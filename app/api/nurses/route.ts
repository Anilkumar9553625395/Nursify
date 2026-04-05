import { NextResponse } from 'next/server'
import { getApprovedNurses, addNurse } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const nurses = await getApprovedNurses()
  return NextResponse.json(nurses)
}

export async function POST(req: Request) {
  const body = await req.json()

  const {
    name, email, phone, photo = '',
    experience, hourlyRate, dailyRate,
    availability, specializations, languages,
    qualifications, bio, location,
    regNumber, regState,
  } = body

  if (!name || !email || !phone || !experience || !hourlyRate || !specializations?.length || !location || !regNumber || !regState) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const nurse = await addNurse({
      name, email, phone, photo,
      experience: Number(experience),
      hourlyRate: Number(hourlyRate),
      dailyRate: Number(dailyRate) || Number(hourlyRate) * 7,
      availability: availability || 'Flexible',
      specializations,
      languages: languages || ['English'],
      qualifications: qualifications || '',
      bio: bio || '',
      location,
      regNumber,
      regState,
    })

    return NextResponse.json(nurse, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to add nurse' }, { status: 500 })
  }
}
