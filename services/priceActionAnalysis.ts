interface Candlestick {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

interface PricePattern {
  type: 'BULLISH' | 'BEARISH' | 'NEUTRAL'
  name: string
  strength: number
  confirmation: boolean
}

export class PriceActionAnalyzer {
  private data: Candlestick[]
  private patterns: PricePattern[] = []
  private swingPoints: { price: number; type: 'HIGH' | 'LOW' }[] = []
  private keyLevels: {
    supports: number[]
    resistances: number[]
  }

  constructor(historicalData: any[]) {
    this.data = this.preprocessData(historicalData)
    this.findSwingPoints() // Önce swing noktalarını bul
    this.keyLevels = this.findKeyLevels()
    this.identifyPatterns()
  }

  private preprocessData(data: any[]): Candlestick[] {
    return data.map(d => ({
      time: d.time,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
      volume: d.volume || 0
    }))
  }

  private findSwingPoints(): void {
    const lookback = 5
    for (let i = lookback; i < this.data.length - lookback; i++) {
      const current = this.data[i]
      const before = this.data.slice(i - lookback, i)
      const after = this.data.slice(i + 1, i + lookback + 1)

      // Swing High
      if (before.every(b => b.high <= current.high) && 
          after.every(a => a.high <= current.high)) {
        this.swingPoints.push({
          price: current.high,
          type: 'HIGH'
        })
      }

      // Swing Low
      if (before.every(b => b.low >= current.low) && 
          after.every(a => a.low >= current.low)) {
        this.swingPoints.push({
          price: current.low,
          type: 'LOW'
        })
      }
    }
  }

  private findKeyLevels(): { supports: number[], resistances: number[] } {
    const lastPrice = this.data[this.data.length - 1].close
    const recentSwings = this.swingPoints.slice(-20)
    
    const supports = recentSwings
      .filter(p => p.type === 'LOW' && p.price < lastPrice)
      .map(p => p.price)
      .sort((a, b) => b - a)
      .slice(0, 3)

    const resistances = recentSwings
      .filter(p => p.type === 'HIGH' && p.price > lastPrice)
      .map(p => p.price)
      .sort((a, b) => a - b)
      .slice(0, 3)

    return { supports, resistances }
  }

  private identifyPatterns(): void {
    // Son 100 mumu analiz et
    const recentCandles = this.data.slice(-100)
    
    for (let i = 2; i < recentCandles.length; i++) {
      const current = recentCandles[i]
      const prev = recentCandles[i-1]
      const prevPrev = recentCandles[i-2]

      // Engulfing Pattern
      if (this.isEngulfing(current, prev)) {
        this.patterns.push({
          type: current.close > current.open ? 'BULLISH' : 'BEARISH',
          name: 'ENGULFING',
          strength: this.calculatePatternStrength(current, this.keyLevels),
          confirmation: this.confirmPattern(i, 'ENGULFING')
        })
      }

      // Pin Bar
      if (this.isPinBar(current)) {
        this.patterns.push({
          type: this.determinePinBarType(current),
          name: 'PIN_BAR',
          strength: this.calculatePatternStrength(current, this.keyLevels),
          confirmation: this.confirmPattern(i, 'PIN_BAR')
        })
      }

      // Inside Bar
      if (this.isInsideBar(current, prev)) {
        this.patterns.push({
          type: 'NEUTRAL',
          name: 'INSIDE_BAR',
          strength: this.calculatePatternStrength(current, this.keyLevels),
          confirmation: this.confirmPattern(i, 'INSIDE_BAR')
        })
      }

      // Morning/Evening Star
      if (this.isMorningStar(current, prev, prevPrev)) {
        this.patterns.push({
          type: 'BULLISH',
          name: 'MORNING_STAR',
          strength: this.calculatePatternStrength(current, this.keyLevels) * 1.2,
          confirmation: this.confirmPattern(i, 'MORNING_STAR')
        })
      }
    }
  }

  private isPinBar(candle: Candlestick): boolean {
    const bodySize = Math.abs(candle.close - candle.open)
    const upperWick = candle.high - Math.max(candle.open, candle.close)
    const lowerWick = Math.min(candle.open, candle.close) - candle.low
    const totalLength = candle.high - candle.low

    // Pin Bar kriterleri
    return (
      (upperWick > bodySize * 2 || lowerWick > bodySize * 2) && // Uzun fitil
      bodySize < totalLength * 0.3 && // Küçük gövde
      (upperWick < bodySize * 0.2 || lowerWick < bodySize * 0.2) // Tek taraflı fitil
    )
  }

  private determinePinBarType(candle: Candlestick): 'BULLISH' | 'BEARISH' {
    const upperWick = candle.high - Math.max(candle.open, candle.close)
    const lowerWick = Math.min(candle.open, candle.close) - candle.low

    return lowerWick > upperWick ? 'BULLISH' : 'BEARISH'
  }

  private isEngulfing(current: Candlestick, prev: Candlestick): boolean {
    const currentBody = Math.abs(current.close - current.open)
    const prevBody = Math.abs(prev.close - prev.open)

    return (
      currentBody > prevBody * 1.5 && // Gövde büyüklüğü kontrolü
      ((current.close > current.open && prev.close < prev.open) || // Bullish Engulfing
       (current.close < current.open && prev.close > prev.open))   // Bearish Engulfing
    )
  }

  private calculatePatternStrength(candle: Candlestick, levels: any): number {
    let strength = 0.5 // Başlangıç değeri

    // Destek/Direnç yakınlığı kontrolü
    const price = (candle.high + candle.low) / 2
    const nearLevel = this.isNearKeyLevel(price, levels)
    if (nearLevel) strength += 0.2

    // Mum büyüklüğü kontrolü
    const bodySize = Math.abs(candle.close - candle.open)
    const totalSize = candle.high - candle.low
    if (bodySize > totalSize * 0.7) strength += 0.2

    // Trend yönü ile uyum
    if (this.isAlignedWithTrend(candle)) strength += 0.1

    return Math.min(strength, 1) // Maksimum 1
  }

  private isNearKeyLevel(price: number, levels: any): boolean {
    const tolerance = price * 0.002 // %0.2 tolerans

    return [...levels.supports, ...levels.resistances].some(level => 
      Math.abs(price - level) < tolerance
    )
  }

  private isAlignedWithTrend(candle: Candlestick): boolean {
    const trend = this.identifyTrend()
    return (trend === 'UP' && candle.close > candle.open) ||
           (trend === 'DOWN' && candle.close < candle.open)
  }

  private identifyTrend(): 'UP' | 'DOWN' | 'SIDEWAYS' {
    const prices = this.data.slice(-20).map(c => c.close)
    let upMoves = 0
    let downMoves = 0

    for (let i = 1; i < prices.length; i++) {
      if (prices[i] > prices[i-1]) upMoves++
      else if (prices[i] < prices[i-1]) downMoves++
    }

    if (Math.abs(upMoves - downMoves) < 5) return 'SIDEWAYS'
    return upMoves > downMoves ? 'UP' : 'DOWN'
  }

  public analyze() {
    const currentPattern = this.patterns[this.patterns.length - 1]
    const trend = this.identifyTrend()

    return {
      pattern: {
        current: currentPattern || {
          type: 'NEUTRAL',
          name: 'NO_PATTERN',
          strength: 0,
          confirmation: false
        },
        recent: this.patterns.slice(-3)
      },
      trend: {
        direction: trend,
        strength: this.calculateTrendStrength(),
        keyLevels: this.keyLevels
      },
      signals: this.generateSignals(),
      fibonacci: {
        retracements: this.calculateFibonacciLevels(this.data)
      }
    }
  }

  private generateSignals() {
    const currentPattern = this.patterns[this.patterns.length - 1]
    const trend = this.identifyTrend()

    return {
      primary: {
        action: this.determineAction(currentPattern, trend),
        confidence: this.calculateConfidence(currentPattern, trend),
        reason: this.generateReason(currentPattern, trend)
      }
    }
  }

  private calculateTrendStrength(): number {
    const prices = this.data.slice(-20).map(c => c.close)
    let upMoves = 0
    let downMoves = 0

    for (let i = 1; i < prices.length; i++) {
      if (prices[i] > prices[i-1]) upMoves++
      else if (prices[i] < prices[i-1]) downMoves++
    }

    return Math.abs(upMoves - downMoves) / prices.length
  }

  private confirmPattern(index: number, patternType: string): boolean {
    // Pattern doğrulama mantığı
    const nextCandles = this.data.slice(index + 1, index + 4)
    const pattern = this.patterns[this.patterns.length - 1]
    
    if (!pattern) return false

    if (pattern.type === 'BULLISH') {
      return nextCandles.some(c => c.close > c.open)
    } else if (pattern.type === 'BEARISH') {
      return nextCandles.some(c => c.close < c.open)
    }
    
    return false
  }

  private determineAction(pattern: PricePattern | undefined, trend: 'UP' | 'DOWN' | 'SIDEWAYS'): 'BUY' | 'SELL' | 'HOLD' {
    if (!pattern) return 'HOLD'

    if (pattern.type === 'BULLISH' && trend === 'UP') return 'BUY'
    if (pattern.type === 'BEARISH' && trend === 'DOWN') return 'SELL'
    
    return 'HOLD'
  }

  private calculateConfidence(pattern: PricePattern | undefined, trend: 'UP' | 'DOWN' | 'SIDEWAYS'): number {
    if (!pattern) return 0

    let confidence = pattern.strength

    // Trend ile uyum kontrolü
    if ((pattern.type === 'BULLISH' && trend === 'UP') ||
        (pattern.type === 'BEARISH' && trend === 'DOWN')) {
      confidence *= 1.2
    }

    return Math.min(confidence, 1)
  }

  private generateReason(pattern: PricePattern | undefined, trend: 'UP' | 'DOWN' | 'SIDEWAYS'): string {
    if (!pattern) return 'Belirgin bir pattern yok'

    return `${pattern.name} paterni ${pattern.type.toLowerCase()} sinyal veriyor. ` +
           `Trend ${trend.toLowerCase()} yönlü.`
  }

  private isInsideBar(current: Candlestick, prev: Candlestick): boolean {
    return current.high <= prev.high && current.low >= prev.low
  }

  private isMorningStar(current: Candlestick, prev: Candlestick, prevPrev: Candlestick): boolean {
    return prevPrev.close < prevPrev.open && // İlk mum düşüş
           Math.abs(prev.close - prev.open) < Math.abs(prevPrev.close - prevPrev.open) * 0.3 && // Küçük gövde
           current.close > current.open // Son mum yükseliş
  }

  private calculateFibonacciLevels(historicalData: any[]): { level: number; price: number; type: 'SUPPORT' | 'RESISTANCE' }[] {
    try {
      // Son 100 günlük veriyi al
      const last100Days = historicalData.slice(-100);
      
      // En yüksek ve en düşük noktaları bul
      const high = Math.max(...last100Days.map(d => d.high));
      const low = Math.min(...last100Days.map(d => d.low));
      const currentPrice = historicalData[historicalData.length - 1].close;
      
      // Fibonacci seviyeleri
      const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
      
      return levels.map(level => {
        const price = low + (high - low) * level;
        return {
          level,
          price,
          type: price > currentPrice ? 'RESISTANCE' : 'SUPPORT'
        };
      });
    } catch (error) {
      console.error('Fibonacci hesaplama hatası:', error);
      return [];
    }
  }

  // ... diğer metodlar aynı ...
} 