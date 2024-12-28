import {
  calculatePriceChange,
  calculateRSI,
  calculateMA,
  findSupportResistanceLevels,
  findNearestLevel
} from './technicalAnalysis'

interface CryptoAnalysis {
  signal: 'BUY' | 'SELL' | 'HOLD'
  confidence: number
  reasons: string[]
  indicators: {
    price: number
    price_change_24h: number
    price_change_7d: number
    price_change_30d: number
    volume_24h: number
    trend: string
    rsi_14: number
    ma_50: number
    ma_200: number
  }
}

// Binance API tiplerini tanımla
interface BinanceKline {
  0: number  // Open time
  4: string  // Close price
  5: string  // Volume
}

export async function getCryptoAnalysis(): Promise<CryptoAnalysis> {
  try {
    // CryptoCompare API'den veri çek
    const response = await fetch('/api/crypto')
    
    if (!response.ok) {
      throw new Error('API hatası')
    }

    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error)
    }

    return {
      signal: data.signal,
      confidence: data.confidence,
      reasons: data.reasons,
      indicators: {
        price: data.price,
        price_change_24h: data.change24h,
        price_change_7d: data.change7d,
        price_change_30d: data.change30d,
        volume_24h: data.volume24h,
        trend: data.trend,
        rsi_14: data.rsi,
        ma_50: data.ma50,
        ma_200: data.ma200
      }
    }
  } catch (error) {
    console.error('Analiz hatası:', error)
    throw new Error('Veri çekilemedi')
  }
}

// Trend analizi fonksiyonunu düzelt
function analyzeTrend(prices: [number, number][], ma50: number, ma200: number): string {
  const values = prices.map(p => p[1])
  const lastPrice = values[values.length - 1]
  
  let upCount = 0
  let downCount = 0

  for (let i = 1; i < values.length; i++) {
    if (values[i] > values[i-1]) upCount++
    else if (values[i] < values[i-1]) downCount++
  }

  const trendStrength = Math.abs(upCount - downCount) / values.length

  if (lastPrice > ma50 && ma50 > ma200 && trendStrength > 0.6) return 'GÜÇLÜ YÜKSELİŞ'
  if (lastPrice > ma50 && ma50 > ma200) return 'YÜKSELİŞ'
  if (lastPrice < ma50 && ma50 < ma200 && trendStrength > 0.6) return 'GÜÇLÜ DÜŞÜŞ'
  if (lastPrice < ma50 && ma50 < ma200) return 'DÜŞÜŞ'
  return 'YATAY'
} 