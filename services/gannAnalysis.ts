interface GannAnalysis {
  angles: {
    current: number
    direction: 'UP' | 'DOWN' | 'NEUTRAL'
    strength: number
    levels: {
      angle: number
      price: number
      type: '1x1' | '2x1' | '3x1' | '4x1' | '8x1'
    }[]
  }
  squares: {
    support: number[]
    resistance: number[]
    next_target: number
    fibonacci_levels: {
      level: number
      price: number
      type: 'SUPPORT' | 'RESISTANCE'
    }[]
    cardinal_points: {
      price: number
      angle: number
      significance: number
    }[]
  }
  time_cycles: {
    current_phase: string
    next_turning_point: Date
    cycle_strength: number
    fibonacci_time_zones: {
      date: Date
      type: 'MAJOR' | 'MINOR'
      probability: number
    }[]
    seasonal_patterns: {
      pattern: string
      start_date: Date
      end_date: Date
      historical_accuracy: number
    }[]
  }
  predictions: {
    price: {
      next: number
      target: number
      stop: number
      confidence: number
      time_frame: 'SHORT' | 'MEDIUM' | 'LONG'
    }
    time: {
      critical_dates: Date[]
      cycle_completion: number
      next_reversal: {
        date: Date
        probability: number
        expected_direction: 'UP' | 'DOWN'
      }
    }
    market_position: {
      current_phase: string
      strength: number
      momentum: number
      volatility: number
    }
  }
}

export class GannAnalyzer {
  private data: any[]
  private currentPrice: number
  private angles: number[] = [15, 26.25, 45, 63.75, 75, 82.5]
  private squareRoot: number = Math.sqrt(9)
  private fibonacciRatios = [0.236, 0.382, 0.5, 0.618, 0.786, 1, 1.618, 2.618, 4.236]
  private cycleDays = [21, 34, 55, 89, 144, 233, 377, 610, 987]

  constructor(historicalData: any[], currentPrice: number) {
    this.data = historicalData
    this.currentPrice = currentPrice
  }

  private calculateGannAngle(startPrice: number, endPrice: number, periods: number): number {
    try {
      // Fiyat değişimi
      const priceChange = endPrice - startPrice
      
      // Yatay eksende zaman birimi başına değişim
      const timeUnit = periods
      
      // Açıyı hesapla (radyan cinsinden)
      const angleRadians = Math.atan2(priceChange, timeUnit)
      
      // Radyanı dereceye çevir
      const angleDegrees = angleRadians * (180 / Math.PI)
      
      // Açıyı normalize et (-90 ile 90 derece arasında)
      return Math.max(Math.min(angleDegrees, 90), -90)
    } catch (error) {
      console.error('Gann açısı hesaplama hatası:', error)
      return 0 // Hata durumunda nötr açı döndür
    }
  }

  private calculateGannAngles(currentPrice: number): { angle: number, price: number, type: string }[] {
    try {
      const angles = []
      const timeUnit = 1 // 1 gün

      // 1x1, 2x1, 3x1, 4x1, 8x1 açıları hesapla
      const slopes = [1, 2, 3, 4, 8]
      
      for (const slope of slopes) {
        const angleRadians = Math.atan(slope)
        const angleDegrees = angleRadians * (180 / Math.PI)
        const price = currentPrice * (1 + (slope * timeUnit / 100))
        
        angles.push({
          angle: angleDegrees,
          price,
          type: `${slope}x1`
        })
      }

      return angles
    } catch (error) {
      console.error('Gann açıları hesaplama hatası:', error)
      return [] // Hata durumunda boş dizi döndür
    }
  }

  private calculateSquareOfNine(basePrice: number): number[] {
    const levels: number[] = []
    const squareRoot = Math.sqrt(9)
    
    // 9 kare için hesaplama
    for (let i = 1; i <= 9; i++) {
      const angle = (i * 360) / 8
      const radius = Math.sqrt(i)
      const price = basePrice * (1 + (radius * squareRoot / 100))
      levels.push(price)
    }

    return levels
  }

  private findCardinalPoints(prices: number[]): { price: number, angle: number, significance: number }[] {
    const points = []
    const currentPrice = prices[prices.length - 1]

    // 90, 180, 270, 360 derece noktaları
    for (let angle = 90; angle <= 360; angle += 90) {
      const radius = Math.sqrt(angle / 90)
      const price = currentPrice * (1 + (radius * this.squareRoot / 100))
      
      points.push({
        price,
        angle,
        significance: this.calculateSignificance(angle)
      })
    }

    return points
  }

  private calculateSignificance(angle: number): number {
    // 90 ve 270 derece noktaları daha önemli
    if (angle === 90 || angle === 270) return 0.8
    // 180 ve 360 derece noktaları en önemli
    if (angle === 180 || angle === 360) return 1
    return 0.5
  }

  private calculateFibonacciTimeZones(): { date: Date, type: 'MAJOR' | 'MINOR', probability: number }[] {
    const zones = []
    const currentDate = new Date()
    
    for (const days of this.cycleDays) {
      const futureDate = new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000)
      zones.push({
        date: futureDate,
        type: days >= 89 ? 'MAJOR' : 'MINOR',
        probability: this.calculateZoneProbability(days)
      })
    }

    return zones
  }

  private calculateZoneProbability(days: number): number {
    // Fibonacci günlerine göre olasılık hesapla
    const majorCycles = [89, 144, 233]
    if (majorCycles.includes(days)) return 0.8
    return 0.5
  }

  private findSeasonalPatterns(): { pattern: string, start_date: Date, end_date: Date, historical_accuracy: number }[] {
    const patterns = []
    const currentDate = new Date()
    
    // Örnek mevsimsel paternler
    const seasonalPatterns = [
      { name: 'Spring Rally', months: [3, 4], accuracy: 0.65 },
      { name: 'Summer Consolidation', months: [6, 7, 8], accuracy: 0.55 },
      { name: 'Fall Decline', months: [9, 10], accuracy: 0.60 },
      { name: 'Year-End Rally', months: [11, 12], accuracy: 0.70 }
    ]

    for (const pattern of seasonalPatterns) {
      const startDate = new Date(currentDate.getFullYear(), pattern.months[0] - 1, 1)
      const endDate = new Date(currentDate.getFullYear(), pattern.months[pattern.months.length - 1] - 1, 30)
      
      patterns.push({
        pattern: pattern.name,
        start_date: startDate,
        end_date: endDate,
        historical_accuracy: pattern.accuracy
      })
    }

    return patterns
  }

  public analyze(): GannAnalysis {
    try {
      // Güncel fiyatı kullan
      const currentPrice = this.currentPrice
      const startPrice = this.data[this.data.length - 20].close
      const currentAngle = this.calculateGannAngle(startPrice, currentPrice, 20)
      
      // Gann açılarını hesapla
      const angleAnalysis = this.calculateGannAngles(currentPrice)
      
      // Square of Nine hesapla
      const squareLevels = this.calculateSquareOfNine(currentPrice)
      
      // Kardinal noktaları bul
      const cardinalPoints = this.findCardinalPoints(this.data.map(d => d.close))
      
      // Fibonacci zaman bölgelerini hesapla
      const timeZones = this.calculateFibonacciTimeZones()
      
      // Mevsimsel paternleri bul
      const seasonalPatterns = this.findSeasonalPatterns()

      return {
        angles: {
          current: currentAngle,
          direction: this.determineDirection(currentAngle),
          strength: Math.min(Math.abs(currentAngle) / 90, 1),
          levels: angleAnalysis
        },
        squares: {
          support: squareLevels.filter(l => l < currentPrice),
          resistance: squareLevels.filter(l => l > currentPrice),
          next_target: this.findNextTarget(currentPrice, squareLevels),
          fibonacci_levels: this.calculateFibonacciLevels(this.data, currentPrice),
          cardinal_points: cardinalPoints
        },
        time_cycles: {
          current_phase: this.determineCurrentPhase(),
          next_turning_point: this.findNextTurningPoint(),
          cycle_strength: this.calculateCycleStrength(),
          fibonacci_time_zones: timeZones,
          seasonal_patterns: seasonalPatterns
        },
        predictions: {
          price: {
            next: currentPrice,
            target: this.calculateTargetPrice(),
            stop: this.calculateStopPrice(),
            confidence: this.calculateConfidence(),
            time_frame: this.determineTimeFrame()
          },
          time: {
            critical_dates: this.findCriticalDates(),
            cycle_completion: this.calculateCycleCompletion(),
            next_reversal: this.predictNextReversal()
          },
          market_position: {
            current_phase: this.determineMarketPhase(),
            strength: this.calculateMarketStrength(),
            momentum: this.calculateMomentum(),
            volatility: this.calculateVolatility()
          }
        }
      }
    } catch (error) {
      console.error('Gann analizi hatası:', error)
      // Hata durumunda varsayılan değerler döndür
      return this.getDefaultAnalysis()
    }
  }

  private getDefaultAnalysis(): GannAnalysis {
    const currentPrice = this.data[this.data.length - 1].close
    return {
      angles: {
        current: 0,
        direction: 'NEUTRAL',
        strength: 0,
        levels: []
      },
      squares: {
        support: [currentPrice * 0.95, currentPrice * 0.90],
        resistance: [currentPrice * 1.05, currentPrice * 1.10],
        next_target: currentPrice,
        fibonacci_levels: [],
        cardinal_points: []
      },
      time_cycles: {
        current_phase: 'UNKNOWN',
        next_turning_point: new Date(),
        cycle_strength: 0,
        fibonacci_time_zones: [],
        seasonal_patterns: []
      },
      predictions: {
        price: {
          next: currentPrice,
          target: currentPrice,
          stop: currentPrice * 0.95,
          confidence: 0,
          time_frame: 'SHORT'
        },
        time: {
          critical_dates: [],
          cycle_completion: 0,
          next_reversal: {
            date: new Date(),
            probability: 0,
            expected_direction: 'NEUTRAL'
          }
        },
        market_position: {
          current_phase: 'UNKNOWN',
          strength: 0,
          momentum: 0,
          volatility: 0
        }
      }
    }
  }

  private determineDirection(angle: number): 'UP' | 'DOWN' | 'NEUTRAL' {
    if (angle > 15) return 'UP'
    if (angle < -15) return 'DOWN'
    return 'NEUTRAL'
  }

  private findNextTarget(currentPrice: number, levels: number[]): number {
    const direction = this.determineDirection(this.calculateGannAngle(
      this.data[this.data.length - 2].close,
      currentPrice,
      1
    ))

    if (direction === 'UP') {
      const nextResistance = levels.find(l => l > currentPrice)
      return nextResistance || currentPrice * 1.05
    } else if (direction === 'DOWN') {
      const nextSupport = [...levels].reverse().find(l => l < currentPrice)
      return nextSupport || currentPrice * 0.95
    }
    return currentPrice
  }

  private calculateFibonacciLevels(historicalData: any[], currentPrice: number): { level: number, price: number, type: 'SUPPORT' | 'RESISTANCE' }[] {
    try {
      // Son 100 günlük veriyi al
      const last100Days = historicalData.slice(-100)
      
      // En yüksek ve en düşük noktaları bul
      const highestPrice = Math.max(...last100Days.map(d => d.high))
      const lowestPrice = Math.min(...last100Days.map(d => d.low))
      
      // Fiyat aralığını hesapla
      const priceRange = highestPrice - lowestPrice
      
      // Fibonacci seviyeleri (klasik seviyeler)
      const fibLevels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1]
      
      return fibLevels.map(level => {
        // Yükselen trend için fibonacci seviyeleri
        const price = lowestPrice + (priceRange * level)
        
        return {
          level,
          price,
          // Fiyat seviyesine göre destek/direnç belirle
          type: price > currentPrice ? 'RESISTANCE' : 'SUPPORT'
        }
      }).sort((a, b) => a.price - b.price) // Fiyata göre sırala
    } catch (error) {
      console.error('Fibonacci hesaplama hatası:', error)
      return []
    }
  }

  private determineCurrentPhase(): string {
    const prices = this.data.slice(-20).map(d => d.close)
    const firstPrice = prices[0]
    const lastPrice = prices[prices.length - 1]
    const maxPrice = Math.max(...prices)
    const minPrice = Math.min(...prices)

    if (lastPrice > firstPrice && lastPrice >= maxPrice * 0.95) return 'ACCUMULATION'
    if (lastPrice < firstPrice && lastPrice <= minPrice * 1.05) return 'DISTRIBUTION'
    if (lastPrice > firstPrice) return 'MARK UP'
    if (lastPrice < firstPrice) return 'MARK DOWN'
    return 'CONSOLIDATION'
  }

  private findNextTurningPoint(): Date {
    const currentDate = new Date()
    const nextCycleDay = this.cycleDays.find(days => 
      days > Math.floor((currentDate.getTime() - new Date(this.data[0].time * 1000).getTime()) 
      / (24 * 60 * 60 * 1000))
    ) || 21

    return new Date(currentDate.getTime() + nextCycleDay * 24 * 60 * 60 * 1000)
  }

  private calculateCycleStrength(): number {
    const prices = this.data.slice(-89).map(d => d.close) // Son 89 gün (Fibonacci)
    let strength = 0
    let prevDirection = 'NEUTRAL'

    for (let i = 1; i < prices.length; i++) {
      const currentDirection = prices[i] > prices[i-1] ? 'UP' : 'DOWN'
      if (currentDirection === prevDirection) strength += 1/prices.length
      prevDirection = currentDirection
    }

    return Math.min(strength, 1)
  }

  private calculateNextPrice(): number {
    const currentPrice = this.data[this.data.length - 1].close
    const direction = this.determineDirection(this.calculateGannAngle(
      this.data[this.data.length - 2].close,
      currentPrice,
      1
    ))
    const volatility = this.calculateVolatility()

    return currentPrice * (1 + (volatility * (direction === 'UP' ? 1 : -1)))
  }

  private calculateTargetPrice(): number {
    const currentPrice = this.data[this.data.length - 1].close
    const levels = this.calculateSquareOfNine(currentPrice)
    return this.findNextTarget(currentPrice, levels)
  }

  private calculateStopPrice(): number {
    const currentPrice = this.data[this.data.length - 1].close
    const volatility = this.calculateVolatility()
    return currentPrice * (1 - volatility * 2)
  }

  private calculateConfidence(): number {
    try {
      // Son 5 günlük verileri al
      const recentPrices = this.data.slice(-5).map(d => d.close)
      const currentPrice = this.currentPrice
      
      // Faktörleri hesapla
      const trendStrength = this.calculateTrendStrength(recentPrices)
      const volatilityFactor = 1 - this.calculateVolatility() // Yüksek volatilite = düşük güven
      const momentumStrength = Math.abs(this.calculateMomentum())
      const cycleAlignment = this.calculateCycleStrength()
      
      // Fibonacci seviyelerine yakınlık kontrolü
      const fibLevels = this.calculateFibonacciLevels(this.data, currentPrice)
      const nearestFibDistance = this.calculateNearestFibDistance(currentPrice, fibLevels)
      
      // Faktörleri ağırlıklandır
      const confidence = (
        trendStrength * 0.3 +      // Trend gücü (%30 ağırlık)
        volatilityFactor * 0.2 +   // Volatilite etkisi (%20 ağırlık)
        momentumStrength * 0.2 +   // Momentum gücü (%20 ağırlık)
        cycleAlignment * 0.2 +     // Döngü uyumu (%20 ağırlık)
        nearestFibDistance * 0.1   // Fibonacci seviyelerine yakınlık (%10 ağırlık)
      )

      // Güven seviyesini 0.35 ile 0.85 arasında sınırla
      return Math.max(0.35, Math.min(0.85, confidence))
    } catch (error) {
      console.error('Güven hesaplama hatası:', error)
      return 0.5 // Hata durumunda nötr değer
    }
  }

  private calculateTrendStrength(prices: number[]): number {
    // Trend gücünü hesapla
    const priceChanges = prices.slice(1).map((price, i) => price - prices[i])
    const consistentDirection = priceChanges.every(change => change > 0) || 
                              priceChanges.every(change => change < 0)
    
    return consistentDirection ? 0.8 : 0.4
  }

  private calculateNearestFibDistance(currentPrice: number, fibLevels: any[]): number {
    // En yakın Fibonacci seviyesine olan uzaklığı normalize et
    const distances = fibLevels.map(level => 
      Math.abs(level.price - currentPrice) / currentPrice
    )
    
    const minDistance = Math.min(...distances)
    return 1 - Math.min(minDistance * 10, 1) // Uzaklığı 0-1 arasına normalize et
  }

  private determineTimeFrame(): 'SHORT' | 'MEDIUM' | 'LONG' {
    const strength = this.calculateCycleStrength()
    if (strength > 0.7) return 'LONG'
    if (strength > 0.4) return 'MEDIUM'
    return 'SHORT'
  }

  private findCriticalDates(): Date[] {
    const currentDate = new Date()
    return this.cycleDays.slice(0, 3).map(days => 
      new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000)
    )
  }

  private calculateCycleCompletion(): number {
    const currentCycle = 144 // Gann'ın temel döngüsü
    const daysPassed = Math.floor((new Date().getTime() - new Date(this.data[0].time * 1000).getTime()) 
      / (24 * 60 * 60 * 1000))
    return (daysPassed % currentCycle) / currentCycle * 100
  }

  private predictNextReversal(): { date: Date, probability: number, expected_direction: 'UP' | 'DOWN' } {
    const currentPrice = this.data[this.data.length - 1].close
    const direction = this.determineDirection(this.calculateGannAngle(
      this.data[this.data.length - 2].close,
      currentPrice,
      1
    ))

    return {
      date: this.findNextTurningPoint(),
      probability: this.calculateConfidence(),
      expected_direction: direction === 'UP' ? 'DOWN' : 'UP'
    }
  }

  private determineMarketPhase(): string {
    return this.determineCurrentPhase()
  }

  private calculateMarketStrength(): number {
    return this.calculateCycleStrength()
  }

  private calculateMomentum(): number {
    const prices = this.data.slice(-10).map(d => d.close)
    let momentum = 0
    
    for (let i = 1; i < prices.length; i++) {
      momentum += (prices[i] - prices[i-1]) / prices[i-1]
    }

    return Math.max(Math.min(momentum, 1), -1)
  }

  private calculateVolatility(): number {
    const prices = this.data.slice(-20).map(d => d.close)
    const returns = prices.slice(1).map((price, i) => 
      (price - prices[i]) / prices[i]
    )
    
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length
    
    return Math.sqrt(variance)
  }
} 