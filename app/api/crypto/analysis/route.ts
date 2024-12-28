import { NextResponse } from 'next/server'
import { TechnicalAnalyzer } from '@/services/technicalAnalysis'

export const dynamic = 'force-static'
export const revalidate = 3600 // Her saat başı yenile

export async function GET() {
  try {
    // Örnek veri
    const mockData = Array.from({ length: 100 }, (_, i) => ({
      time: Date.now() - i * 86400000,
      close: 2000 + Math.random() * 1000
    }))

    const analyzer = new TechnicalAnalyzer(mockData)
    const analysis = analyzer.analyze()

    return NextResponse.json({
      success: true,
      data: analysis
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Analysis failed' },
      { status: 500 }
    )
  }
} 