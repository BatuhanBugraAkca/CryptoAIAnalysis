interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export class TechnicalIndicators {
  private data: Candle[];

  constructor(historicalData: any[]) {
    this.data = historicalData;
  }

  // SMA Hesaplama
  calculateSMA(period: number): number {
    const prices = this.data.slice(-period).map(d => d.close);
    return prices.reduce((a, b) => a + b, 0) / period;
  }

  // EMA Hesaplama
  calculateEMA(period: number): number {
    const prices = this.data.map(d => d.close);
    const multiplier = 2 / (period + 1);
    let ema = prices[0];

    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] - ema) * multiplier + ema;
    }

    return ema;
  }

  // RSI Hesaplama
  calculateRSI(period: number = 14): number {
    const changes = this.data.slice(-period - 1).map((d, i, arr) => {
      if (i === 0) return 0;
      return d.close - arr[i - 1].close;
    }).slice(1);

    const gains = changes.map(c => c > 0 ? c : 0);
    const losses = changes.map(c => c < 0 ? -c : 0);

    const avgGain = gains.reduce((a, b) => a + b, 0) / period;
    const avgLoss = losses.reduce((a, b) => a + b, 0) / period;

    if (avgLoss === 0) return 100;
    const RS = avgGain / avgLoss;
    return 100 - (100 / (1 + RS));
  }

  // MACD Hesaplama
  calculateMACD(): { macd: number; signal: number; histogram: number } {
    const ema12 = this.calculateEMA(12);
    const ema26 = this.calculateEMA(26);
    const macd = ema12 - ema26;
    const signal = this.calculateSignalLine(macd);
    const histogram = macd - signal;

    return { macd, signal, histogram };
  }

  private calculateSignalLine(macd: number): number {
    return macd * 0.2 + (this.calculateEMA(9) * 0.8); // 9-period EMA of MACD
  }

  // Bollinger Bands Hesaplama
  calculateBollingerBands(period: number = 20): { upper: number; middle: number; lower: number } {
    const prices = this.data.slice(-period).map(d => d.close);
    const sma = prices.reduce((a, b) => a + b, 0) / period;
    
    const squaredDiffs = prices.map(p => Math.pow(p - sma, 2));
    const standardDeviation = Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / period);
    
    return {
      upper: sma + (standardDeviation * 2),
      middle: sma,
      lower: sma - (standardDeviation * 2)
    };
  }

  // Stochastic Oscillator Hesaplama
  calculateStochastic(period: number = 14): { K: number; D: number } {
    const subset = this.data.slice(-period);
    const currentClose = subset[subset.length - 1].close;
    const lowestLow = Math.min(...subset.map(d => d.low));
    const highestHigh = Math.max(...subset.map(d => d.high));

    const K = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
    const D = this.calculateSMA(3); // 3-period SMA of %K

    return { K, D };
  }

  // Tüm göstergeleri analiz et
  analyze(): {
    movingAverages: { sma: number; ema: number };
    rsi: number;
    macd: { macd: number; signal: number; histogram: number };
    bollingerBands: { upper: number; middle: number; lower: number };
    stochastic: { K: number; D: number };
  } {
    return {
      movingAverages: {
        sma: this.calculateSMA(20),
        ema: this.calculateEMA(20)
      },
      rsi: this.calculateRSI(),
      macd: this.calculateMACD(),
      bollingerBands: this.calculateBollingerBands(),
      stochastic: this.calculateStochastic()
    };
  }
} 