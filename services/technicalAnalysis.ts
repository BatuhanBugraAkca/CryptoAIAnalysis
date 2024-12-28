interface Price {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export class TechnicalAnalyzer {
  private prices: Price[];

  constructor(prices: Price[]) {
    this.prices = prices;
  }

  calculateRSI(period: number = 14): number {
    if (this.prices.length < period + 1) {
      return 50; // Default value if not enough data
    }

    let gains = 0;
    let losses = 0;

    // Calculate initial gains and losses
    for (let i = 1; i <= period; i++) {
      const difference = this.prices[i].close - this.prices[i - 1].close;
      if (difference >= 0) {
        gains += difference;
      } else {
        losses -= difference;
      }
    }

    // Calculate initial averages
    let avgGain = gains / period;
    let avgLoss = losses / period;

    // Calculate subsequent values using Wilder's smoothing
    for (let i = period + 1; i < this.prices.length; i++) {
      const difference = this.prices[i].close - this.prices[i - 1].close;
      
      if (difference >= 0) {
        avgGain = (avgGain * (period - 1) + difference) / period;
        avgLoss = (avgLoss * (period - 1)) / period;
      } else {
        avgGain = (avgGain * (period - 1)) / period;
        avgLoss = (avgLoss * (period - 1) - difference) / period;
      }
    }

    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  calculateMA(period: number): number {
    if (this.prices.length < period) {
      return this.prices[this.prices.length - 1]?.close || 0;
    }

    const sum = this.prices
      .slice(-period)
      .reduce((acc, price) => acc + price.close, 0);
    
    return sum / period;
  }

  calculatePriceChange(): number {
    if (this.prices.length < 2) {
      return 0;
    }

    const oldPrice = this.prices[0].close;
    const newPrice = this.prices[this.prices.length - 1].close;
    
    return ((newPrice - oldPrice) / oldPrice) * 100;
  }
} 