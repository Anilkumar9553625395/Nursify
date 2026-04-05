import { NextResponse } from 'next/server'
import { updateNurseStatus, type NurseStatus } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { status } = await req.json() as { status: NurseStatus }

  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const updated = await updateNurseStatus(params.id, status)
  if (!updated) return NextResponse.json({ error: 'Nurse not found' }, { status: 404 })

  return NextResponse.json(updated)
}
