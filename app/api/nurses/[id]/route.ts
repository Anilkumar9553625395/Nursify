import { NextResponse } from 'next/server'
import { getNurseById } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const nurse = await getNurseById(params.id)
  if (!nurse) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(nurse)
}
