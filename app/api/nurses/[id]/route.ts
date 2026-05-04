import { NextResponse } from 'next/server'
import { getNurseById, updateNurse } from '@/lib/store'
import { getAuthUser } from '@/lib/auth'

export const revalidate = 60 // Cache response for 60 seconds

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const nurse = await getNurseById(params.id)
  if (!nurse) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(nurse)
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser()
    if (!user || user.role !== 'nurse') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const nurse = await getNurseById(params.id)
    if (!nurse || nurse.email !== user.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const updatedNurse = await updateNurse(params.id, body)
    
    if (!updatedNurse) {
      return NextResponse.json({ error: 'Failed to update nurse' }, { status: 500 })
    }
    
    return NextResponse.json(updatedNurse)
  } catch (err: any) {
    console.error('Error updating nurse:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
