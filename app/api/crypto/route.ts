import { NextResponse } from 'next/server'

export const dynamic = 'force-static'
export const revalidate = 3600 // Her saat başı yenile

export async function GET() {
  try {
    // Örnek kripto verileri
    const mockData = {
      bitcoin: {
        price: 42000,
        change24h: 2.5,
        marketCap: "825B",
        volume24h: "25B"
      },
      ethereum: {
        price: 2200,
        change24h: 1.8,
        marketCap: "265B",
        volume24h: "12B"
      },
      marketStats: {
        totalMarketCap: "1.5T",
        totalVolume24h: "85B",
        btcDominance: "45%",
        activeCoins: 2000
      }
    }

    return NextResponse.json({
      success: true,
      data: mockData
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Crypto data fetch failed' },
      { status: 500 }
    )
  }
} 