'use client'
import { useState, useEffect } from 'react'
import { useAnalysisStore } from '@/lib/store'

interface HarmonicPattern {
  type: 'GARTLEY' | 'BAT' | 'BUTTERFLY' | 'CRAB' | 'ABCD'
  direction: 'BULLISH' | 'BEARISH'
  completion: number
  confidence: number
  potentialReversal: number
}

interface FibLevel {
  level: number;
  price: number;
  type: 'SUPPORT' | 'RESISTANCE';
  strength: number;
  description: string;
}

export default function HarmonicAnalysis() {
  const { data, isLoading, error, fetchAnalysis } = useAnalysisStore()

  useEffect(() => {
    if (!data) fetchAnalysis()
  }, [data, fetchAnalysis])

  const getPatternDescription = (type: string) => {
    const descriptions = {
      GARTLEY: 'Gartley formasyonu genellikle trend dönüşlerinde görülür. 0.618 ve 0.786 Fibonacci seviyeleri önemlidir.',
      BAT: 'Bat formasyonu, daha derin düzeltmeler gösterir. 0.886 seviyesi kritiktir.',
      BUTTERFLY: 'Butterfly formasyonu, X noktasının ötesine uzanan hedefler oluşturur.',
      CRAB: 'Crab formasyonu en geniş hedef aralığına sahiptir. 1.618 seviyesi önemlidir.',
      ABCD: 'ABCD formasyonu en temel harmonik desendir. Eşit bacak uzunlukları önemlidir.'
    };
    return descriptions[type] || 'Harmonik formasyon analizi';
  };

  const getFibDescription = (level: number) => {
    const descriptions = {
      0.236: 'Zayıf düzeltme seviyesi',
      0.382: 'Orta düzeltme seviyesi',
      0.5: 'Orta-güçlü düzeltme seviyesi',
      0.618: 'Altın oran düzeltme seviyesi',
      0.786: 'Derin düzeltme seviyesi',
      1: 'Tam düzeltme seviyesi',
      1.272: 'Genişleme seviyesi',
      1.618: 'Altın oran genişleme seviyesi'
    };
    return descriptions[level] || 'Fibonacci seviyesi';
  };

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

  if (!data?.harmonic) return null

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
          Harmonik Analiz
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
        {/* Ana Sinyal Kartı - En üstte */}
        <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-lg font-medium mb-3">Sinyal Özeti</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-900/50 rounded-lg">
              <div className="text-gray-400 text-sm mb-1">Pattern</div>
              <div className="text-xl font-bold text-purple-400">
                {data.harmonic.currentPattern?.type || 'BEKLEME'}
              </div>
              <div className={`text-lg font-bold mt-1 ${
                data.harmonic.currentPattern?.direction === 'BULLISH' ? 'text-green-500' : 
                data.harmonic.currentPattern?.direction === 'BEARISH' ? 'text-red-500' : 
                'text-yellow-500'
              }`}>
                {data.harmonic.currentPattern?.direction || 'NÖTR'}
              </div>
              <div className="text-sm text-gray-400 mt-1">
                Güven: %{(data.harmonic.predictions.confidence * 100).toFixed(0)}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-900/50 rounded-lg">
              <div className="text-gray-400 text-sm mb-1">Hedef Seviye</div>
              <div className="text-lg font-bold text-blue-400">
                ${data.harmonic.predictions.nextTarget.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400 mt-1">
                Stop: ${data.harmonic.predictions.stopLoss.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">
                Risk/Ödül: {(
                  Math.abs(data.harmonic.predictions.nextTarget - data.currentPrice) /
                  Math.abs(data.harmonic.predictions.stopLoss - data.currentPrice)
                ).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Fibonacci Seviyeleri */}
        <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg border border-gray-700">
          <h3 className="font-medium mb-2 text-blue-400">Fibonacci Seviyeleri</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-gray-400 mb-2">Destek Seviyeleri</div>
              {data.harmonic.fibonacci.retracements
                .filter(level => level.type === 'SUPPORT')
                .map((level, i) => (
                  <div key={i} className="font-mono text-green-300 flex justify-between">
                    <span>%{(level.level * 100).toFixed(1)}</span>
                    <span>${level.price.toLocaleString()}</span>
                  </div>
                ))}
            </div>
            <div>
              <div className="text-gray-400 mb-2">Direnç Seviyeleri</div>
              {data.harmonic.fibonacci.retracements
                .filter(level => level.type === 'RESISTANCE')
                .map((level, i) => (
                  <div key={i} className="font-mono text-red-300 flex justify-between">
                    <span>%{(level.level * 100).toFixed(1)}</span>
                    <span>${level.price.toLocaleString()}</span>
                  </div>
                ))}
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            * Son 100 günün en yüksek ve en düşük noktaları baz alınmıştır
          </div>
        </div>

        {/* Dönüş Bölgeleri */}
        <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg border border-gray-700">
          <h3 className="font-medium mb-2 text-purple-400">Potansiyel Dönüş Bölgeleri</h3>
          <div className="space-y-2">
            {data.harmonic.predictions.reversalZones.map((zone, i) => (
              <div key={i} className="bg-gray-900/40 p-3 rounded">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <span className={`text-lg mr-2 ${
                      zone.pattern.includes('BULLISH') ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {zone.pattern.includes('BULLISH') ? '▲' : '▼'}
                    </span>
                    <span className="text-gray-300">{zone.pattern}</span>
                  </div>
                  <span className="font-mono text-blue-300">${zone.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Güç Seviyesi:</span>
                  <div className="flex items-center">
                    <div className="w-20 h-1 bg-gray-700 rounded-full overflow-hidden mr-2">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${zone.strength * 100}%` }}
                      />
                    </div>
                    <span className="text-blue-300">%{(zone.strength * 100).toFixed(0)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tahminler */}
        <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg border border-gray-700">
          <h3 className="font-medium mb-3 text-green-400">Harmonik Tahminler</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900/30 p-3 rounded">
                <div className="text-gray-400 text-sm">Hedef Bölgesi</div>
                <div className="font-mono text-lg text-blue-300 mt-1">
                  ${data.harmonic.predictions.nextTarget.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Potansiyel Kazanç: {(
                    ((data.harmonic.predictions.nextTarget - data.currentPrice) / 
                    data.currentPrice) * 100
                  ).toFixed(1)}%
                </div>
              </div>
              <div className="bg-gray-900/30 p-3 rounded">
                <div className="text-gray-400 text-sm">Stop Loss</div>
                <div className="font-mono text-lg text-red-300 mt-1">
                  ${data.harmonic.predictions.stopLoss.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Risk: {(
                    Math.abs(data.currentPrice - data.harmonic.predictions.stopLoss) / 
                    data.currentPrice * 100
                  ).toFixed(1)}%
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900/30 p-3 rounded">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-gray-400 text-sm">Güven Skoru</div>
                  <div className="font-mono text-lg text-purple-300">
                    %{(data.harmonic.predictions.confidence * 100).toFixed(0)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-gray-400 text-sm">Risk/Ödül Oranı</div>
                  <div className="font-mono text-lg text-green-300">
                    {(Math.abs(data.harmonic.predictions.nextTarget - data.currentPrice) /
                      Math.abs(data.harmonic.predictions.stopLoss - data.currentPrice)).toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-400">
                * Risk/Ödül oranı 1'in üzerinde olmalıdır
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 