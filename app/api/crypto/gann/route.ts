import { NextResponse } from 'next/server'

export const dynamic = 'force-static'
export const revalidate = 3600 // Her saat başı yenile

export async function GET() {
  try {
    // Örnek Gann analizi
    const mockAnalysis = {
      currentPrice: 2000,
      gannLevels: {
        resistance: [2100, 2200, 2300, 2400],
        support: [1900, 1800, 1700, 1600]
      },
      gannAngles: {
        ascending: [
          { angle: '1x1', price: 2100 },
          { angle: '2x1', price: 2200 },
          { angle: '3x1', price: 2300 }
        ],
        descending: [
          { angle: '1x1', price: 1900 },
          { angle: '2x1', price: 1800 },
          { angle: '3x1', price: 1700 }
        ]
      },
      timeAnalysis: {
        nextCriticalDate: '2024-04-15',
        currentCycle: '144 days'
      }
    }

    return NextResponse.json({
      success: true,
      data: mockAnalysis
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gann analysis failed' },
      { status: 500 }
    )
  }
} 