interface PatternRules {
  XA: number;
  AB: number;
  BC: number;
  CD: number;
  AD: number;
}

interface HarmonicPattern {
  type: 'GARTLEY' | 'BAT' | 'BUTTERFLY' | 'CRAB' | 'ABCD';
  points: {
    X: number;
    A: number;
    B: number;
    C: number;
    D: number;
  };
  ratios: {
    XA?: number;
    AB: number;
    BC: number;
    CD: number;
    XD?: number;
  };
  direction: 'BULLISH' | 'BEARISH';
  completion: number;
  confidence: number;
  potentialReversal: number;
}

interface PatternRatios {
  XA: number;
  AB: number;
  BC: number;
  CD: number;
  AD: number;
}

interface HarmonicAnalysis {
  currentPattern: HarmonicPattern | null;
  activePatterns: HarmonicPattern[];
  fibonacci: {
    retracements: {
      level: number;
      price: number;
      type: 'SUPPORT' | 'RESISTANCE';
    }[];
    projections: {
      level: number;
      price: number;
      significance: number;
    }[];
  };
  predictions: {
    reversalZones: {
      price: number;
      strength: number;
      pattern: string;
    }[];
    nextTarget: number;
    stopLoss: number;
    confidence: number;
  };
}

export class HarmonicAnalyzer {
  private data: any[];
  private fibLevels = [0.236, 0.382, 0.5, 0.618, 0.786, 1, 1.272, 1.618, 2.618];
  private patternRules: Record<HarmonicPattern['type'], PatternRules> = {
    GARTLEY: {
      XA: 1,
      AB: 0.618,
      BC: 0.382,
      CD: 1.272,
      AD: 0.786
    },
    BAT: {
      XA: 1,
      AB: 0.382,
      BC: 0.886,
      CD: 2.618,
      AD: 0.886
    },
    BUTTERFLY: {
      XA: 1,
      AB: 0.786,
      BC: 0.382,
      CD: 1.618,
      AD: 1.27
    },
    CRAB: {
      XA: 1,
      AB: 0.382,
      BC: 0.886,
      CD: 3.618,
      AD: 1.618
    },
    ABCD: {
      XA: 1,
      AB: 0.618,
      BC: 0.382,
      CD: 1.618,
      AD: 1
    }
  };

  constructor(historicalData: any[]) {
    this.data = historicalData;
  }

  private findSwingPoints(period: number = 20): { highs: number[], lows: number[] } {
    const highs: number[] = [];
    const lows: number[] = [];
    
    for (let i = period; i < this.data.length - period; i++) {
      const currentPrice = this.data[i].high;
      const isSwingHigh = this.data
        .slice(i - period, i + period)
        .every(candle => candle.high <= currentPrice);

      if (isSwingHigh) {
        highs.push(currentPrice);
      }

      const currentLow = this.data[i].low;
      const isSwingLow = this.data
        .slice(i - period, i + period)
        .every(candle => candle.low >= currentLow);

      if (isSwingLow) {
        lows.push(currentLow);
      }
    }

    return { highs, lows };
  }

  private calculateRatio(price1: number, price2: number): number {
    return Math.abs((price2 - price1) / price1);
  }

  private validatePattern(points: number[], type: HarmonicPattern['type']): boolean {
    const ratios: PatternRatios = {
      XA: this.calculateRatio(points[0], points[1]),
      AB: this.calculateRatio(points[1], points[2]),
      BC: this.calculateRatio(points[2], points[3]),
      CD: this.calculateRatio(points[3], points[4]),
      AD: this.calculateRatio(points[1], points[4])
    };

    const rules = this.patternRules[type];
    const tolerance = 0.1;

    return Object.entries(rules).every(([key, value]) => {
      const ratio = ratios[key as keyof PatternRatios];
      return Math.abs(ratio - value) <= tolerance;
    });
  }

  private findPatterns(): HarmonicPattern[] {
    const { highs, lows } = this.findSwingPoints();
    const patterns: HarmonicPattern[] = [];
    const points = [...highs, ...lows].sort((a, b) => a - b);

    for (let i = 0; i < points.length - 4; i++) {
      const potentialPattern = points.slice(i, i + 5);
      
      Object.keys(this.patternRules).forEach(type => {
        if (this.validatePattern(potentialPattern, type as HarmonicPattern['type'])) {
          patterns.push({
            type: type as HarmonicPattern['type'],
            points: {
              X: potentialPattern[0],
              A: potentialPattern[1],
              B: potentialPattern[2],
              C: potentialPattern[3],
              D: potentialPattern[4]
            },
            ratios: {
              XA: this.calculateRatio(potentialPattern[0], potentialPattern[1]),
              AB: this.calculateRatio(potentialPattern[1], potentialPattern[2]),
              BC: this.calculateRatio(potentialPattern[2], potentialPattern[3]),
              CD: this.calculateRatio(potentialPattern[3], potentialPattern[4])
            },
            direction: potentialPattern[4] > potentialPattern[0] ? 'BULLISH' : 'BEARISH',
            completion: this.calculateCompletion(potentialPattern),
            confidence: this.calculateConfidence(potentialPattern, type as HarmonicPattern['type']),
            potentialReversal: this.calculatePotentialReversal(potentialPattern, type as HarmonicPattern['type'])
          });
        }
      });
    }

    return patterns;
  }

  private calculateCompletion(points: number[]): number {
    // Pattern tamamlanma yüzdesini hesapla
    const totalDistance = Math.abs(points[4] - points[0]);
    const currentPrice = this.data[this.data.length - 1].close;
    const remainingDistance = Math.abs(currentPrice - points[4]);
    
    return Math.min(((totalDistance - remainingDistance) / totalDistance) * 100, 100);
  }

  private calculateConfidence(points: number[], type: HarmonicPattern['type']): number {
    const idealRatios = this.patternRules[type];
    const actualRatios: PatternRatios = {
      XA: this.calculateRatio(points[0], points[1]),
      AB: this.calculateRatio(points[1], points[2]),
      BC: this.calculateRatio(points[2], points[3]),
      CD: this.calculateRatio(points[3], points[4]),
      AD: this.calculateRatio(points[1], points[4])
    };

    const deviations = Object.entries(idealRatios).map(([key, value]) => {
      const ratio = actualRatios[key as keyof PatternRatios];
      return Math.abs(ratio - value) / value;
    });

    const averageDeviation = deviations.reduce((a, b) => a + b, 0) / deviations.length;
    return Math.max(0, Math.min(1 - averageDeviation, 1));
  }

  private calculatePotentialReversal(points: number[], type: HarmonicPattern['type']): number {
    const currentPrice = this.data[this.data.length - 1].close;
    const range = Math.abs(points[4] - points[0]);
    const direction = points[4] > points[0] ? 1 : -1;

    // Pattern tipine göre hedef hesaplama
    switch(type) {
      case 'GARTLEY':
        return points[4] + (direction * range * 0.786);
      case 'BAT':
        return points[4] + (direction * range * 0.886);
      case 'BUTTERFLY':
        return points[4] + (direction * range * 1.27);
      case 'CRAB':
        return points[4] + (direction * range * 1.618);
      case 'ABCD':
        return points[4] + (direction * range * 0.786);
      default:
        return currentPrice;
    }
  }

  private calculateReversalZones(patterns: HarmonicPattern[]): { price: number; strength: number; pattern: string }[] {
    const currentPrice = this.data[this.data.length - 1].close;
    
    return patterns
      .filter(pattern => pattern.confidence > 0.5) // Sadece güvenilir pattern'ler
      .map(pattern => {
        const direction = pattern.direction === 'BULLISH' ? 'YUKARI' : 'AŞAĞI';
        const range = Math.abs(pattern.points.D - pattern.points.X);
        const targetPrice = pattern.direction === 'BULLISH' 
          ? currentPrice + (range * this.patternRules[pattern.type].CD)
          : currentPrice - (range * this.patternRules[pattern.type].CD);

        return {
          price: targetPrice,
          strength: pattern.confidence,
          pattern: `${pattern.type} ${direction}`
        };
      })
      .sort((a, b) => Math.abs(a.price - currentPrice) - Math.abs(b.price - currentPrice)) // En yakın hedefler önce
      .slice(0, 3); // En yakın 3 hedef
  }

  private calculateStopLoss(pattern: HarmonicPattern | null, currentPrice: number): number {
    if (!pattern) return currentPrice * 0.95;

    const range = Math.abs(pattern.points.D - pattern.points.X);
    const stopDistance = range * 0.1; // %10 stop loss
    
    return pattern.direction === 'BULLISH'
      ? pattern.points.D - stopDistance // Bullish için D noktasının altı
      : pattern.points.D + stopDistance; // Bearish için D noktasının üstü
  }

  public analyze(): HarmonicAnalysis {
    const patterns = this.findPatterns();
    const currentPrice = this.data[this.data.length - 1].close;
    
    // En son ve en güvenilir pattern'i bul
    const currentPattern = patterns.length > 0 
      ? patterns.reduce((a, b) => a.confidence > b.confidence ? a : b)
      : null;

    const reversalZones = this.calculateReversalZones(patterns);
    const nextTarget = currentPattern 
      ? this.calculatePotentialReversal(Object.values(currentPattern.points), currentPattern.type)
      : currentPrice;

    return {
      currentPattern,
      activePatterns: patterns,
      fibonacci: {
        retracements: this.calculateFibonacciLevels(this.data),
        projections: this.calculateFibonacciProjections(currentPrice)
      },
      predictions: {
        reversalZones,
        nextTarget,
        stopLoss: this.calculateStopLoss(currentPattern, currentPrice),
        confidence: currentPattern?.confidence || 0
      }
    };
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

  private calculateFibonacciProjections(currentPrice: number): { level: number; price: number; significance: number }[] {
    const high = Math.max(...this.data.slice(-100).map(d => d.high));
    const low = Math.min(...this.data.slice(-100).map(d => d.low));
    const range = high - low;

    return this.fibLevels.map(level => ({
      level,
      price: currentPrice + (range * level),
      significance: 1 - Math.abs(0.618 - level)
    }));
  }
} 