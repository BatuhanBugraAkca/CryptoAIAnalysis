interface Wave {
  start: { price: number; time: number }
  end: { price: number; time: number }
  type: 'IMPULSE' | 'CORRECTIVE'
  degree: 'PRIMARY' | 'INTERMEDIATE' | 'MINOR'
  subwaves: Wave[]
  number: number // 1-5 for impulse, A-B-C for corrective
  fibonacci: {
    retracement: number[]
    extension: number[]
  }
}

export class ElliottAnalyzer {
  private data: any[]
  private waves: Wave[] = []
  private pivots: { price: number; time: number; type: 'HIGH' | 'LOW' }[] = []

  constructor(historicalData: any[]) {
    this.data = historicalData
    this.findPivotPoints()
    this.identifyWaves()
  }

  private findPivotPoints(): void {
    const lookback = 5
    for (let i = lookback; i < this.data.length - lookback; i++) {
      const current = this.data[i]
      const before = this.data.slice(i - lookback, i)
      const after = this.data.slice(i + 1, i + lookback + 1)

      // Pivot High
      if (before.every(b => b.high <= current.high) && 
          after.every(a => a.high <= current.high)) {
        this.pivots.push({
          price: current.high,
          time: current.time,
          type: 'HIGH'
        })
      }

      // Pivot Low
      if (before.every(b => b.low >= current.low) && 
          after.every(a => a.low >= current.low)) {
        this.pivots.push({
          price: current.low,
          time: current.time,
          type: 'LOW'
        })
      }
    }
  }

  private identifyWaves(): void {
    let currentWave: Wave | null = null
    let waveCount = 1
    let isImpulse = true

    for (let i = 0; i < this.pivots.length - 1; i++) {
      const start = this.pivots[i]
      const end = this.pivots[i + 1]
      
      // Wave kurallarını kontrol et
      if (this.isValidWavePattern(start, end, waveCount, isImpulse)) {
        currentWave = {
          start,
          end,
          type: isImpulse ? 'IMPULSE' : 'CORRECTIVE',
          degree: this.determineWaveDegree(start, end),
          subwaves: [],
          number: waveCount,
          fibonacci: this.calculateFibonacciLevels(start.price, end.price)
        }

        this.waves.push(currentWave)

        // Dalga sayısını güncelle
        if (isImpulse) {
          if (waveCount === 5) {
            waveCount = 1
            isImpulse = false
          } else {
            waveCount++
          }
        } else {
          if (waveCount === 3) {
            waveCount = 1
            isImpulse = true
          } else {
            waveCount++
          }
        }
      }
    }
  }

  private isValidWavePattern(start: any, end: any, waveCount: number, isImpulse: boolean): boolean {
    // Elliott Wave kuralları
    if (isImpulse) {
      switch (waveCount) {
        case 2: // Dalga 2 asla dalga 1'in başlangıcının altına inmez
          return end.price > this.waves[this.waves.length - 1]?.start.price
        case 3: // Dalga 3 genellikle en uzun dalgadır
          const wave1Length = Math.abs(this.waves[this.waves.length - 1]?.end.price - 
                                     this.waves[this.waves.length - 1]?.start.price)
          return Math.abs(end.price - start.price) > wave1Length
        case 4: // Dalga 4 asla dalga 1'in bölgesine girmez
          const wave1High = Math.max(this.waves[this.waves.length - 3]?.start.price,
                                   this.waves[this.waves.length - 3]?.end.price)
          return end.price > wave1High
        default:
          return true
      }
    }
    return true
  }

  private determineWaveDegree(start: any, end: any): 'PRIMARY' | 'INTERMEDIATE' | 'MINOR' {
    const length = Math.abs(end.price - start.price)
    const timeframe = end.time - start.time

    if (length > 1000 && timeframe > 30 * 24 * 60 * 60) return 'PRIMARY'
    if (length > 500 && timeframe > 7 * 24 * 60 * 60) return 'INTERMEDIATE'
    return 'MINOR'
  }

  private calculateFibonacciLevels(startPrice: number, endPrice: number) {
    const diff = Math.abs(endPrice - startPrice)
    const direction = endPrice > startPrice ? 1 : -1

    return {
      retracement: [0.236, 0.382, 0.5, 0.618, 0.786].map(level => 
        endPrice - (diff * level * direction)
      ),
      extension: [1.618, 2.618, 4.236].map(level =>
        endPrice + (diff * (level - 1) * direction)
      )
    }
  }

  public analyze() {
    const currentWave = this.waves[this.waves.length - 1]
    const wavePattern = this.identifyWavePattern()
    const nextWaveProjection = this.projectNextWave()

    return {
      currentWave: {
        number: currentWave.number,
        type: currentWave.type,
        degree: currentWave.degree,
        phase: this.determineWavePhase()
      },
      pattern: wavePattern,
      nextMove: nextWaveProjection,
      fibonacci: currentWave.fibonacci
    }
  }

  private determineWavePhase(): 'START' | 'MIDDLE' | 'END' {
    const currentWave = this.waves[this.waves.length - 1]
    const progress = (currentWave.end.price - currentWave.start.price) / 
                    this.calculateTypicalWaveLength()

    if (progress < 0.3) return 'START'
    if (progress > 0.7) return 'END'
    return 'MIDDLE'
  }

  private calculateTypicalWaveLength(): number {
    return this.waves.reduce((sum, wave) => 
      sum + Math.abs(wave.end.price - wave.start.price), 0
    ) / this.waves.length
  }

  private identifyWavePattern() {
    const recentWaves = this.waves.slice(-5)
    const pattern = {
      type: recentWaves[0]?.type === 'IMPULSE' ? '5-3' : '3-3',
      completion: this.calculatePatternCompletion()
    }
    return pattern
  }

  private calculatePatternCompletion(): number {
    const currentWave = this.waves[this.waves.length - 1]
    const isImpulse = currentWave.type === 'IMPULSE'
    const totalWaves = isImpulse ? 5 : 3
    return (currentWave.number / totalWaves) * 100
  }

  private projectNextWave() {
    const currentWave = this.waves[this.waves.length - 1]
    const direction = currentWave.number % 2 === 0 ? 'DOWN' : 'UP'
    const target = this.calculateNextWaveTarget()

    return {
      direction,
      target
    }
  }

  private calculateNextWaveTarget(): number {
    const currentWave = this.waves[this.waves.length - 1]
    const waveLength = Math.abs(currentWave.end.price - currentWave.start.price)
    
    if (currentWave.type === 'IMPULSE') {
      return currentWave.end.price + (waveLength * 1.618 * 
             (currentWave.number % 2 === 0 ? -1 : 1))
    } else {
      return currentWave.end.price + (waveLength * 0.618 * 
             (currentWave.number % 2 === 0 ? -1 : 1))
    }
  }
} 