import { NextResponse } from 'next/server'
import { fetchChamberStats } from '@/lib/chamberStats'

export const dynamic = 'force-dynamic'
export const revalidate = 15

export async function GET() {
  try {
    const stats = await fetchChamberStats()
    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30',
      },
    })
  } catch (err) {
    console.error('Chamber stats fetch error:', err)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
