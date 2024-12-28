'use client'
import { useAnalysisStore } from '@/lib/store'

export default function AnalysisSummary() {
  const { data } = useAnalysisStore()

  if (!data) return null

  const generateSummary = () => {
    const signals = {
      bullish: 0,
      bearish: 0,
      total: 0
    }

    // Teknik göstergelerden sinyaller
    if (data.technical?.indicators) {
      // RSI
      signals.total++
      if (data.technical.indicators.rsi < 30) signals.bullish++
      else if (data.technical.indicators.rsi > 70) signals.bearish++

      // MACD
      signals.total++
      if (data.technical.indicators.macd.histogram > 0) signals.bullish++
      else signals.bearish++

      // Stochastic
      signals.total++
      if (data.technical.indicators.stochastic.K < 20) signals.bullish++
      else if (data.technical.indicators.stochastic.K > 80) signals.bearish++
    }

    // Diğer analizlerden sinyaller
    if (data.elliott?.currentWave) {
      signals.total++
      if (data.elliott.currentWave.trend === 'UP') signals.bullish++
      else if (data.elliott.currentWave.trend === 'DOWN') signals.bearish++
    }

    if (data.priceAction?.signals?.primary) {
      signals.total++
      if (data.priceAction.signals.primary.action === 'BUY') signals.bullish++
      else if (data.priceAction.signals.primary.action === 'SELL') signals.bearish++
    }

    const bullishPercentage = (signals.bullish / signals.total) * 100
    const bearishPercentage = (signals.bearish / signals.total) * 100

    return {
      sentiment: bullishPercentage > bearishPercentage ? 'BULLISH' : 
                bearishPercentage > bullishPercentage ? 'BEARISH' : 'NEUTRAL',
      strength: Math.abs(bullishPercentage - bearishPercentage) / 100,
      distribution: {
        bullish: bullishPercentage,
        bearish: bearishPercentage,
        neutral: 100 - bullishPercentage - bearishPercentage
      }
    }
  }

  const summary = generateSummary()

  return (
    <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-lg p-4 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-sm text-gray-400">Piyasa Görünümü</h3>
          <div className="flex items-center gap-4">
            <div className={`text-2xl font-bold ${
              summary.sentiment === 'BULLISH' ? 'text-green-500' :
              summary.sentiment === 'BEARISH' ? 'text-red-500' :
              'text-blue-500'
            }`}>
              {summary.sentiment === 'BULLISH' ? 'YÜKSELIŞ' :
               summary.sentiment === 'BEARISH' ? 'DÜŞÜŞ' : 'NÖTR'}
            </div>
            <div className={`px-3 py-1 rounded-full text-sm ${
              data.gann?.predictions.market_position.current_phase === 'DISTRIBUTION' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
              data.gann?.predictions.market_position.current_phase === 'ACCUMULATION' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
              'bg-blue-500/10 text-blue-400 border border-blue-500/20'
            }`}>
              {data.gann?.predictions.market_position.current_phase || 'NÖTR'}
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Alış: %{summary.distribution.bullish.toFixed(0)}</span>
            <span>Satış: %{summary.distribution.bearish.toFixed(0)}</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full flex">
              <div 
                className="bg-green-500" 
                style={{ width: `${summary.distribution.bullish}%` }}
              />
              <div 
                className="bg-gray-500" 
                style={{ width: `${summary.distribution.neutral}%` }}
              />
              <div 
                className="bg-red-500" 
                style={{ width: `${summary.distribution.bearish}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 