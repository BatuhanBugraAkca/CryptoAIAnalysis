'use client'
import { useState, useEffect, useCallback } from 'react'
import { useAnalysisStore } from '@/lib/store'

interface PriceActionAnalysis {
  pattern: {
    current: {
      type: 'BULLISH' | 'BEARISH' | 'NEUTRAL'
      name: string
      strength: number
      confirmation: boolean
    }
    recent: Array<{
      type: 'BULLISH' | 'BEARISH' | 'NEUTRAL'
      name: string
      strength: number
      confirmation: boolean
    }>
  }
  trend: {
    direction: 'UP' | 'DOWN' | 'SIDEWAYS'
    strength: number
    keyLevels: {
      supports: number[]
      resistances: number[]
    }
  }
  signals: {
    primary: {
      action: 'BUY' | 'SELL' | 'HOLD'
      confidence: number
      reason: string
    }
  }
}

const getActionColor = (action: 'BUY' | 'SELL' | 'HOLD') => {
  switch (action) {
    case 'BUY': return 'text-green-500'
    case 'SELL': return 'text-red-500'
    default: return 'text-yellow-500'
  }
}

const getActionText = (action: 'BUY' | 'SELL' | 'HOLD') => {
  switch (action) {
    case 'BUY': return 'AL'
    case 'SELL': return 'SAT'
    default: return 'BEKLE'
  }
}

export default function PriceActionAnalysis() {
  const { data, isLoading, error, fetchAnalysis } = useAnalysisStore()

  useEffect(() => {
    if (!data) fetchAnalysis()
  }, [data, fetchAnalysis])

  if (isLoading && !data) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-700 rounded w-1/3"></div>
        <div className="h-4 bg-gray-700 rounded w-1/4"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-red-500">{error}</div>
        <button 
          onClick={() => fetchAnalysis()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tekrar Dene
        </button>
      </div>
    )
  }

  if (!data?.priceAction) return null

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold bg-gradient-to-r from-green-500 to-blue-500 text-transparent bg-clip-text">
          Price Action Analizi
        </h2>
        {data.lastUpdate && (
          <div className="text-xs text-gray-400">
            Son güncelleme: {new Date(data.lastUpdate).toLocaleTimeString()}
          </div>
        )}
      </div>
      
      <div className="space-y-6">
        {/* Ana Sinyal Kartı */}
        <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-lg font-medium mb-3">İşlem Sinyali</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-900/50 rounded-lg">
              <div className="text-gray-400 text-sm mb-1">Sinyal</div>
              <div className={`text-2xl font-bold ${getActionColor(data.priceAction.signals.primary.action)}`}>
                {getActionText(data.priceAction.signals.primary.action)}
              </div>
              <div className="text-sm text-gray-400 mt-1">
                Güven: %{(data.priceAction.signals.primary.confidence * 100).toFixed(0)}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-900/50 rounded-lg">
              <div className="text-gray-400 text-sm mb-1">Neden</div>
              <div className="text-sm text-blue-300">
                {data.priceAction.signals.primary.reason}
              </div>
            </div>
          </div>
        </div>

        {/* Pattern Bilgileri */}
        <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg border border-gray-700">
          <h3 className="font-medium mb-2 text-blue-400">Mevcut Pattern</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Pattern</div>
              <div className="font-mono text-lg text-blue-300">
                {data.priceAction.pattern.current.name}
              </div>
            </div>
            <div>
              <div className="text-gray-400">Güvenilirlik</div>
              <div className="font-mono text-lg text-green-300">
                %{(data.priceAction.pattern.current.strength * 100).toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Destek/Direnç Seviyeleri - Yeni Tasarım */}
        <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg border border-gray-700">
          <h3 className="font-medium mb-4 text-purple-400">Önemli Seviyeler</h3>
          <div className="space-y-4">
            {/* Direnç Seviyeleri */}
            <div>
              <div className="text-xs text-gray-400 mb-2">Direnç Seviyeleri</div>
              <div className="space-y-2">
                {data.priceAction.trend.keyLevels.resistances.map((level, i) => (
                  <div key={i} className="bg-gray-900/40 p-2 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-1 h-6 bg-red-500/30 rounded-full" />
                      <span className="text-xs text-gray-300">R{i + 1}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm text-red-400">
                        ${(level / 1000).toFixed(1)}K
                      </span>
                      <div className={`px-2 py-0.5 rounded-full text-[10px] ${
                        level > data.currentPrice ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                        'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                      }`}>
                        {((level - data.currentPrice) / data.currentPrice * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Destek Seviyeleri */}
            <div>
              <div className="text-xs text-gray-400 mb-2">Destek Seviyeleri</div>
              <div className="space-y-2">
                {data.priceAction.trend.keyLevels.supports.map((level, i) => (
                  <div key={i} className="bg-gray-900/40 p-2 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-1 h-6 bg-green-500/30 rounded-full" />
                      <span className="text-xs text-gray-300">S{i + 1}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm text-green-400">
                        ${(level / 1000).toFixed(1)}K
                      </span>
                      <div className={`px-2 py-0.5 rounded-full text-[10px] ${
                        level < data.currentPrice ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                        'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                      }`}>
                        {((data.currentPrice - level) / data.currentPrice * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Fibonacci Seviyeleri */}
        <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium text-blue-400 mb-4">Fibonacci Seviyeleri</h3>
          <div className="space-y-4">
            {/* Destek Seviyeleri */}
            <div>
              <div className="text-sm text-gray-400 mb-2">Destek Seviyeleri</div>
              <div className="space-y-2">
                {data.priceAction.fibonacci.retracements
                  .filter(level => level.type === 'SUPPORT')
                  .map((level, i) => (
                    <div key={i} className="bg-gray-900/40 p-2 rounded flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-gray-300">%{(level.level * 100).toFixed(1)}</span>
                      </div>
                      <span className="font-mono text-green-400">${level.price.toLocaleString()}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Direnç Seviyeleri */}
            <div>
              <div className="text-sm text-gray-400 mb-2">Direnç Seviyeleri</div>
              <div className="space-y-2">
                {data.priceAction.fibonacci.retracements
                  .filter(level => level.type === 'RESISTANCE')
                  .map((level, i) => (
                    <div key={i} className="bg-gray-900/40 p-2 rounded flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span className="text-gray-300">%{(level.level * 100).toFixed(1)}</span>
                      </div>
                      <span className="font-mono text-red-400">${level.price.toLocaleString()}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 