import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET() {
  try {
    // Örnek arama sonuçları
    const mockResults = {
      coins: [
        {
          id: 'bitcoin',
          name: 'Bitcoin',
          symbol: 'BTC',
          price: 42000,
          change24h: 2.5
        },
        {
          id: 'ethereum',
          name: 'Ethereum',
          symbol: 'ETH',
          price: 2200,
          change24h: 1.8
        }
      ],
      trends: ['DeFi', 'NFT', 'Layer2'],
      popularSearches: ['BTC', 'ETH', 'SOL']
    }

    return NextResponse.json({
      success: true,
      data: mockResults
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    )
  }
} 