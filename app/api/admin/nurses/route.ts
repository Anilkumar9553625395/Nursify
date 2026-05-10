import { NextResponse } from 'next/server'
import { getAllNurses } from '@/lib/store'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '100')

    const result = await getAllNurses(page, limit)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Failed to get nurses:', error)
    return NextResponse.json({ nurses: [], count: 0 }, { status: 500 })
  }
}
