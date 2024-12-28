'use client'
import { useAnalysisStore } from '@/lib/store'

export default function TechnicalIndicators() {
  const { data } = useAnalysisStore()
  
  if (!data?.indicators) return null

  const { movingAverages, rsi, macd, bollingerBands, stochastic } = data.indicators

  return (
    <div className="bg-gray-900/60 rounded-xl p-6 backdrop-blur-sm border border-gray-600/30">
      <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
        Temel Analiz
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Her bir gösterge için */}
        <div className="bg-gray-800/50 p-4 rounded-xl hover:bg-gray-800/70 transition-all">
          {/* ... gösterge başlığı ... */}
          <div className="font-mono text-xs sm:text-sm text-gray-400">
            ${(value / 1000).toFixed(1)}K
          </div>
        </div>
      </div>
    </div>
  )
} 