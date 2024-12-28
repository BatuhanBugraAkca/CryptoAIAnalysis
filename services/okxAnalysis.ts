import crypto from 'crypto'

interface OKXResponse {
  code: string
  msg: string
  data: [{
    instId: string
    last: string
    lastSz: string
    askPx: string
    askSz: string
    bidPx: string
    bidSz: string
    open24h: string
    high24h: string
    low24h: string
    volCcy24h: string
    vol24h: string
    ts: string
  }]
}

interface AnalysisResult {
  signal: 'BUY' | 'SELL' | 'HOLD'
  confidence: number
  reasons: string[]
  indicators: {
    price: number
    priceChange24h: number
    volume24h: number
    high24h: number
    low24h: number
  }
}

function createSignature(timestamp: number, method: string, requestPath: string, body: string = '') {
  const message = `${timestamp}${method}${requestPath}${body}`
  return crypto
    .createHmac('sha256', process.env.OKX_SECRET_KEY || '')
    .update(message)
    .digest('base64')
}

export async function getOKXAnalysis(): Promise<AnalysisResult> {
  try {
    const timestamp = Date.now() / 1000
    const requestPath = '/api/v5/market/ticker?instId=ETH-USDT'
    const signature = createSignature(timestamp, 'GET', requestPath)

    const response = await fetch(`https://www.okx.com${requestPath}`, {
      method: 'GET',
      headers: {
        'OK-ACCESS-KEY': process.env.OKX_API_KEY || '',
        'OK-ACCESS-SIGN': signature,
        'OK-ACCESS-TIMESTAMP': timestamp.toString(),
        'OK-ACCESS-PASSPHRASE': process.env.OKX_PASSPHRASE || '',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`OKX API Hatası: ${response.status}`)
    }

    const data: OKXResponse = await response.json()
    
    if (data.code !== '0') {
      throw new Error(`OKX API Hatası: ${data.msg}`)
    }

    const ticker = data.data[0]
    const currentPrice = parseFloat(ticker.last)
    const open24h = parseFloat(ticker.open24h)
    const priceChange24h = ((currentPrice - open24h) / open24h) * 100
    const volume24h = parseFloat(ticker.vol24h)

    // Analiz yap
    let signal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD'
    let confidence = 0
    const reasons: string[] = []

    // Fiyat değişimi analizi
    if (priceChange24h < -5) {
      signal = 'BUY'
      confidence += 0.3
      reasons.push('24 saatlik düşüş %5\'ten fazla (Alım fırsatı)')
    } else if (priceChange24h > 5) {
      signal = 'SELL'
      confidence += 0.3
      reasons.push('24 saatlik yükseliş %5\'ten fazla (Satış fırsatı)')
    }

    // Hacim analizi
    const avgVolume = volume24h / 24 // Saatlik ortalama hacim
    if (volume24h > avgVolume * 1.5) {
      confidence += 0.2
      reasons.push('Yüksek işlem hacmi')
    }

    // Fiyat aralığı analizi
    const high24h = parseFloat(ticker.high24h)
    const low24h = parseFloat(ticker.low24h)
    const priceRange = ((high24h - low24h) / low24h) * 100

    if (priceRange > 5) {
      confidence += 0.2
      reasons.push('Yüksek fiyat volatilitesi')
    }

    // Alım-satım spread analizi
    const spread = (parseFloat(ticker.askPx) - parseFloat(ticker.bidPx)) / parseFloat(ticker.bidPx) * 100
    if (spread < 0.1) {
      confidence += 0.1
      reasons.push('Düşük spread (Likit piyasa)')
    }

    return {
      signal,
      confidence: parseFloat(confidence.toFixed(2)),
      reasons,
      indicators: {
        price: currentPrice,
        priceChange24h: parseFloat(priceChange24h.toFixed(2)),
        volume24h,
        high24h,
        low24h
      }
    }
  } catch (error) {
    console.error('OKX analiz hatası:', error)
    throw new Error('Veri analizi sırasında bir hata oluştu')
  }
} 