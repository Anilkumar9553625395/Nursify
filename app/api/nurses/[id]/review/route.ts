import { NextResponse } from 'next/server'
import { addReview } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json()
  const { patientName, rating, comment } = body

  if (!patientName || !rating || !comment) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  try {
    const updatedNurse = await addReview(params.id, {
      patientName,
      rating: Math.min(5, Math.max(1, Number(rating))),
      comment,
    })

    return NextResponse.json(updatedNurse)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Nurse not found' }, { status: 404 })
  }
}
