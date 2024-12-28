'use client'
import { useAnalysisStore } from '@/lib/store'
import { TechnicalAnalyzer } from '@/services/technicalAnalysis'
import { useEffect, useState } from 'react'

export default function TechnicalAnalysis() {
  const { data } = useAnalysisStore()
  const [analysis, setAnalysis] = useState<any>(null)

  useEffect(() => {
    if (data?.historicalData) {
      const analyzer = new TechnicalAnalyzer(data.historicalData)
      setAnalysis(analyzer.analyze())
    }
  }, [data?.historicalData])

  if (!analysis) return null

  const { indicators, signals } = analysis

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-yellow-500 to-red-500 text-transparent bg-clip-text">
          Teknik Göstergeler
        </h2>
      </div>

      <div className="space-y-6">
        {/* RSI */}
        <div className="bg-gray-800/50 p-3 md:p-4 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-base md:text-lg font-medium mb-3 text-blue-400">RSI (14)</h3>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex items-center flex-wrap gap-2">
                <span className={`text-xl md:text-2xl font-bold ${
                  indicators.rsi > 70 ? 'text-red-400' :
                  indicators.rsi < 30 ? 'text-green-400' :
                  'text-blue-400'
                }`}>
                  {indicators.rsi.toFixed(1)}
                </span>
                <span className="text-sm text-gray-400">
                  {indicators.rsi > 70 ? 'Aşırı Alım' :
                   indicators.rsi < 30 ? 'Aşırı Satım' :
                   'Nötr Bölge'}
                </span>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm ${
                indicators.rsi > 70 ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                indicators.rsi < 30 ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              }`}>
                {indicators.rsi > 70 ? 'SAT' :
                 indicators.rsi < 30 ? 'AL' : 'BEKLE'}
              </div>
            </div>
            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-red-500"
                style={{ width: `${indicators.rsi}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Aşırı Satım (30)</span>
              <span>Nötr (50)</span>
              <span>Aşırı Alım (70)</span>
            </div>
          </div>
        </div>

        {/* MACD */}
        <div className="bg-gray-800/50 p-3 md:p-4 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-base md:text-lg font-medium mb-3 text-purple-400">MACD</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-900/30 p-2 rounded">
                <div className="text-gray-400 text-sm">MACD Line</div>
                <div className={`text-lg md:text-xl font-bold ${
                  indicators.macd.macd > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {indicators.macd.macd.toFixed(2)}
                </div>
              </div>
              <div className="bg-gray-900/30 p-2 rounded">
                <div className="text-gray-400 text-sm">Signal Line</div>
                <div className="text-lg md:text-xl font-bold text-blue-400">
                  {indicators.macd.signal.toFixed(2)}
                </div>
              </div>
              <div className="bg-gray-900/30 p-2 rounded">
                <div className="text-gray-400 text-sm">Histogram</div>
                <div className={`text-lg md:text-xl font-bold ${
                  indicators.macd.histogram > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {indicators.macd.histogram.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="text-xs md:text-sm text-gray-400">
              * MACD Line sinyal çizgisini yukarı keserse alış, aşağı keserse satış sinyali
            </div>
          </div>
        </div>

        {/* Bollinger Bands */}
        <div className="bg-gray-800/50 p-3 md:p-4 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-base md:text-lg font-medium mb-3 text-green-400">Bollinger Bantları</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-900/30 p-2 rounded">
                <div className="text-gray-400 text-sm">Üst Bant</div>
                <div className="text-lg md:text-xl font-bold text-red-400">
                  ${indicators.bollingerBands.upper.toLocaleString()}
                </div>
              </div>
              <div className="bg-gray-900/30 p-2 rounded">
                <div className="text-gray-400 text-sm">Orta Bant (SMA20)</div>
                <div className="text-lg md:text-xl font-bold text-blue-400">
                  ${indicators.bollingerBands.middle.toLocaleString()}
                </div>
              </div>
              <div className="bg-gray-900/30 p-2 rounded">
                <div className="text-gray-400 text-sm">Alt Bant</div>
                <div className="text-lg md:text-xl font-bold text-green-400">
                  ${indicators.bollingerBands.lower.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="text-xs md:text-sm text-gray-400">
              * Bantların daralması volatilitenin düşük olduğunu ve potansiyel bir kırılmanın yaklaştığını gösterir
            </div>
          </div>
        </div>

        {/* Stochastic */}
        <div className="bg-gray-800/50 p-3 md:p-4 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-base md:text-lg font-medium mb-3 text-yellow-400">Stochastic Oscillator</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-900/30 p-2 rounded">
                <div className="text-gray-400 text-sm">%K (Hızlı)</div>
                <div className={`text-lg md:text-xl font-bold ${
                  indicators.stochastic.K > 80 ? 'text-red-400' :
                  indicators.stochastic.K < 20 ? 'text-green-400' :
                  'text-blue-400'
                }`}>
                  {indicators.stochastic.K.toFixed(1)}
                </div>
              </div>
              <div className="bg-gray-900/30 p-2 rounded">
                <div className="text-gray-400 text-sm">%D (Yavaş)</div>
                <div className={`text-lg md:text-xl font-bold ${
                  indicators.stochastic.D > 80 ? 'text-red-400' :
                  indicators.stochastic.D < 20 ? 'text-green-400' :
                  'text-blue-400'
                }`}>
                  {indicators.stochastic.D.toFixed(1)}
                </div>
              </div>
            </div>
            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-red-500"
                style={{ width: `${indicators.stochastic.K}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Aşırı Satım (20)</span>
              <span>Nötr (50)</span>
              <span>Aşırı Alım (80)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 