'use client'
import { useState, useEffect, useCallback } from 'react'
import { useAnalysisStore } from '@/lib/store'

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

// Sinyal ve hedef durumunu belirleyen yardımcı fonksiyon
const getSignalDetails = (data: any) => {
  const currentPrice = data.gann.predictions.price.next
  const targetPrice = data.gann.predictions.price.target
  const confidence = data.gann.predictions.price.confidence
  const priceDiff = targetPrice - currentPrice

  if (confidence < 0.5) {
    return {
      direction: 'NEUTRAL',
      signal: 'BEKLE',
      action: 'BEKLE',
      color: 'text-yellow-500'
    }
  }

  if (priceDiff > 0) {
    return {
      direction: 'YUKARI',
      signal: 'AL',
      action: 'LONG',
      color: 'text-green-500'
    }
  } else {
    return {
      direction: 'AŞAĞI',
      signal: 'SAT',
      action: 'SHORT',
      color: 'text-red-500'
    }
  }
}

export default function GannAnalysis() {
  const { data } = useAnalysisStore()

  if (!data?.gann) return null

  // Veri kontrolü ekleyelim
  const angles = data.gann.angles?.levels || []

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          Gann Analizi
        </h2>
        {data.lastUpdate && (
          <div className="text-xs text-gray-400">
            Son güncelleme: {new Date(data.lastUpdate).toLocaleTimeString('tr-TR', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
        )}
      </div>
      
      <div className="space-y-6">
        {/* Ana Sinyal Kartı */}
        <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-lg font-medium mb-3">Sinyal Özeti</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-900/50 rounded-lg">
              {(() => {
                const signal = getSignalDetails(data)
                return (
                  <>
                    <div className="text-gray-400 text-sm mb-1">Yön</div>
                    <div className={`text-2xl font-bold ${signal.color}`}>
                      {signal.direction}
                    </div>
                    <div className={`text-lg font-bold mt-1 ${signal.color}`}>
                      {signal.signal}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      Güven: %{(data.gann.predictions.price.confidence * 100).toFixed(0)}
                    </div>
                  </>
                )
              })()}
            </div>
            <div className="text-center p-3 bg-gray-900/50 rounded-lg">
              <div className="text-gray-400 text-sm mb-1">Hedef Seviyeler</div>
              <div className="text-lg font-bold text-blue-400">
                ${data.gann.predictions.price.target.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400 mt-1">
                Mevcut: ${data.gann.predictions.price.next.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">
                Stop: ${data.gann.predictions.price.stop.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">
                Risk/Ödül: {(
                  (Math.abs(data.gann.predictions.price.target - data.gann.predictions.price.next) /
                  Math.abs(data.gann.predictions.price.stop - data.gann.predictions.price.next)).toFixed(2)
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Gann Açıları */}
        <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium text-purple-400 mb-4">Gann Açıları</h3>
          <div className="grid grid-cols-2 gap-4">
            {angles.map((level, i) => (
              <div key={i} className="bg-gray-900/40 p-3 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">{level.type}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    level.angle > 45 ? 'bg-green-500/10 text-green-400' :
                    level.angle < -45 ? 'bg-red-500/10 text-red-400' :
                    'bg-blue-500/10 text-blue-400'
                  }`}>
                    {Math.abs(level.angle % 100).toFixed(0)}°
                  </span>
                </div>
                <div className="font-mono text-sm text-blue-300">
                  ${level.price.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zaman Döngüleri */}
        <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium text-purple-400 mb-4">Zaman Döngüleri</h3>
          <div className="space-y-4">
            {/* Mevcut Faz ve Güç */}
            <div className="bg-gray-900/40 p-3 rounded">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-400">Mevcut Faz</div>
                  <div className={`text-lg font-medium ${
                    data.gann.time_cycles.current_phase.includes('UP') ? 'text-green-400' :
                    data.gann.time_cycles.current_phase.includes('DOWN') ? 'text-red-400' :
                    'text-blue-400'
                  }`}>
                    {data.gann.time_cycles.current_phase}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Döngü Gücü</div>
                  <div className="text-lg font-medium text-blue-400">
                    %{(data.gann.time_cycles.cycle_strength * 100).toFixed(0)}
                  </div>
                </div>
              </div>
            </div>

            {/* Kritik Tarihler */}
            <div className="space-y-2">
              <div className="text-sm text-gray-400">Kritik Tarihler</div>
              {data.gann.time_cycles.fibonacci_time_zones.slice(0, 3).map((zone, i) => (
                <div key={i} className="bg-gray-900/40 p-2 rounded flex justify-between items-center">
                  <span className="text-sm text-gray-300">
                    {new Date(zone.date).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      zone.type === 'MAJOR' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      {zone.type}
                    </span>
                    <span className="text-xs text-gray-400">
                      %{(zone.probability * 100).toFixed(0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tahminler - Yeni Tasarım */}
        <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700/50 hover:bg-gray-800/70 transition-all">
          <h3 className="text-lg font-medium text-purple-400 mb-4">Gann Tahminleri</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fiyat Hedefleri */}
            <div className="space-y-4">
              <div className="text-gray-400 text-sm font-medium mb-2">Fiyat Hedefleri</div>
              <div className="space-y-3">
                <div className="bg-gray-900/40 p-3 rounded-lg flex justify-between items-center">
                  <span className="text-gray-300">Hedef</span>
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-lg text-green-400">
                      ${data.gann.predictions.price.target.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500">
                      %{((data.gann.predictions.price.target - data.currentPrice) / data.currentPrice * 100).toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-900/40 p-3 rounded-lg flex justify-between items-center">
                  <span className="text-gray-300">Stop</span>
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-lg text-red-400">
                      ${data.gann.predictions.price.stop.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500">
                      %{((data.currentPrice - data.gann.predictions.price.stop) / data.currentPrice * 100).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Metrikleri */}
            <div className="space-y-4">
              <div className="text-gray-400 text-sm font-medium mb-2">Risk Metrikleri</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-900/40 p-3 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">Risk/Ödül</div>
                  <div className="text-lg font-bold text-blue-400">
                    {((data.gann.predictions.price.target - data.currentPrice) / 
                      (data.currentPrice - data.gann.predictions.price.stop)).toFixed(2)}
                  </div>
                </div>
                <div className="bg-gray-900/40 p-3 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">Güven</div>
                  <div className="text-lg font-bold text-yellow-400">
                    %{(data.gann.predictions.price.confidence * 100).toFixed(0)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 