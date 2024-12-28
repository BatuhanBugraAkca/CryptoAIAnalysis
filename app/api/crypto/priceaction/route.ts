import { NextResponse } from 'next/server'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function GET() {
  try {
    const mockAnalysis = {
      currentPattern: {
        type: 'Bullish Engulfing',
        confidence: 0.85,
        timeframe: '4H'
      },
      keyLevels: {
        resistance: [2100, 2200, 2300],
        support: [1900, 1800, 1700]
      },
      candlePatterns: [
        {
          type: 'Bullish Engulfing',
          timeframe: '4H',
          confidence: 0.85,
          location: 'Support'
        },
        {
          type: 'Doji',
          timeframe: '1D',
          confidence: 0.65,
          location: 'Trend'
        }
      ],
      trendAnalysis: {
        shortTerm: 'BULLISH',
        mediumTerm: 'NEUTRAL',
        longTerm: 'BULLISH'
      }
    }

    return NextResponse.json({
      success: true,
      data: mockAnalysis
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Price Action analysis failed' },
      { status: 500 }
    )
  }
} 