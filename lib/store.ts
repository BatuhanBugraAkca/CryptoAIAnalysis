import { create } from 'zustand'

interface AnalysisState {
  selectedCoin: 'ETH' | 'BTC';
  data: {
    currentPrice: number;
    volume24h: number;
    elliott: any;
    priceAction: any;
    gann: any;
    technical: {
      indicators: {
        movingAverages: { sma: number; ema: number };
        rsi: number;
        macd: { macd: number; signal: number; histogram: number };
        bollingerBands: { upper: number; middle: number; lower: number };
        stochastic: { K: number; D: number };
      };
      signals: {
        trend: {
          direction: 'UP' | 'DOWN' | 'NEUTRAL';
          strength: number;
          description: string;
        };
        momentum: {
          status: 'OVERSOLD' | 'OVERBOUGHT' | 'NEUTRAL';
          value: number;
          signal: 'BUY' | 'SELL' | 'HOLD';
        };
        volatility: {
          level: 'HIGH' | 'MEDIUM' | 'LOW';
          value: number;
          bandWidth: number;
        };
      };
      summary: {
        recommendation: 'STRONG_BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'STRONG_SELL';
        confidence: number;
        nextTargets: {
          support: number[];
          resistance: number[];
        };
      };
    };
    timestamp: string;
    lastUpdate: number;
  } | null;
  isLoading: boolean;
  error: string | null;
  setSelectedCoin: (coin: 'ETH' | 'BTC') => void;
  fetchAnalysis: () => Promise<void>;
}

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  selectedCoin: 'ETH',
  data: null,
  isLoading: false,
  error: null,
  setSelectedCoin: async (coin) => {
    set({ selectedCoin: coin, data: null });
    await get().fetchAnalysis();
  },
  fetchAnalysis: async () => {
    const coin = get().selectedCoin;
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(`/api/crypto/analysis?coin=${coin}`);
      if (!response.ok) throw new Error('Veri çekilemedi');
      
      const data = await response.json();
      set({ 
        data: {
          ...data,
          lastUpdate: Date.now()
        },
        error: null 
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Beklenmeyen hata' });
    } finally {
      set({ isLoading: false });
    }
  }
})) 