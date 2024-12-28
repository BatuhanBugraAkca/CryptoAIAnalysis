'use client'
import { useState, useEffect, useCallback } from 'react'
import { useAnalysisStore } from '@/lib/store'

interface ElliottAnalysis {
  currentWave: {
    number: number
    type: 'IMPULSE' | 'CORRECTIVE'
    phase: 'START' | 'MIDDLE' | 'END'
  }
  pattern: {
    type: '5-3' | '3-3' | 'TRIANGLE'
    completion: number
  }
  nextMove: {
    direction: 'UP' | 'DOWN'
    target: number
  }
}

// Sinyal rengini belirleyen yardımcı fonksiyon
const getSignalColor = (direction: 'UP' | 'DOWN') => {
  return direction === 'UP' ? 'text-green-500' : 'text-red-500'
}

export default function TradingAnalysis() {
  const { data, isLoading, error, fetchAnalysis } = useAnalysisStore()
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    fetchAnalysis()
    const interval = setInterval(fetchAnalysis, 30 * 1000)
    return () => clearInterval(interval)
  }, [fetchAnalysis])

  useEffect(() => {
    if (data?.timestamp) {
      setLastUpdate(new Date(data.timestamp))
    }
  }, [data?.timestamp])

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
          onClick={fetchAnalysis}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tekrar Dene
        </button>
      </div>
    )
  }

  if (!data?.elliott) return null

  return (
    <div className="space-y-6">
      <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
        Elliott Dalga Analizi
      </div>

      {/* Ana Sinyal Kartı */}
      <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg border border-gray-700">
        <h3 className="text-lg font-medium mb-3">Sinyal Özeti</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-900/50 rounded-lg">
            <div className="text-gray-400 text-sm mb-1">Yön</div>
            <div className={`text-2xl font-bold ${getSignalColor(data.elliott.nextMove.direction)}`}>
              {data.elliott.nextMove.direction === 'UP' ? 'YÜKSELİŞ' : 'DÜŞÜŞ'}
            </div>
          </div>
          <div className="text-center p-3 bg-gray-900/50 rounded-lg">
            <div className="text-gray-400 text-sm mb-1">Hedef</div>
            <div className="text-xl font-bold text-blue-400">
              ${data.elliott.nextMove.target.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Dalga Detayları */}
      <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg border border-gray-700">
        <h3 className="font-medium mb-2 text-blue-400">Mevcut Dalga Detayları</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-400">Dalga Numarası</div>
            <div className="font-mono text-lg">
              {data.elliott.currentWave.number}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {data.elliott.currentWave.number <= 5 ? 'İtici Dalga' : 'Düzeltme Dalgası'}
            </div>
          </div>
          <div>
            <div className="text-gray-400">Dalga Tipi</div>
            <div className="font-mono text-lg text-blue-300">
              {data.elliott.currentWave.type === 'IMPULSE' ? 'DÜRTÜ' : 'DÜZELTME'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {data.elliott.currentWave.type === 'IMPULSE' ? '5 Dalga Yapısı' : '3 Dalga Yapısı'}
            </div>
          </div>
          <div>
            <div className="text-gray-400">Aşama</div>
            <div className="font-mono text-lg text-purple-300">
              {data.elliott.currentWave.phase === 'START' ? 'BAŞLANGIÇ' :
               data.elliott.currentWave.phase === 'MIDDLE' ? 'ORTA' : 'BİTİŞ'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {data.elliott.currentWave.phase === 'START' ? 'Yeni Dalga Başlangıcı' :
               data.elliott.currentWave.phase === 'MIDDLE' ? 'Dalga Gelişimi' : 'Dalga Tamamlanıyor'}
            </div>
          </div>
        </div>
      </div>

      {/* Desen Analizi */}
      <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg border border-gray-700">
        <h3 className="font-medium mb-2 text-green-400">Desen Analizi</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-400">Desen Tipi</div>
            <div className="font-mono text-lg text-blue-300">
              {data.elliott.pattern.type}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {data.elliott.pattern.type === '5-3' ? 'Klasik Elliott Yapısı' :
               data.elliott.pattern.type === '3-3' ? 'Düzeltme Yapısı' : 'Üçgen Formasyon'}
            </div>
          </div>
          <div>
            <div className="text-gray-400">Tamamlanma</div>
            <div className="font-mono text-lg text-green-300">
              %{data.elliott.pattern.completion.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {data.elliott.pattern.completion > 80 ? 'Tamamlanmak Üzere' :
               data.elliott.pattern.completion > 50 ? 'Gelişim Aşamasında' : 'Erken Aşama'}
            </div>
          </div>
        </div>
      </div>

      {/* Teknik Detaylar */}
      <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg border border-gray-700">
        <h3 className="font-medium mb-2 text-yellow-400">Teknik Göstergeler</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Trend Uyumu</span>
            <span className={`font-mono ${data.elliott.nextMove.direction === 'UP' ? 'text-green-300' : 'text-red-300'}`}>
              {data.elliott.nextMove.direction === 'UP' ? 'Yükselen' : 'Düşen'} Trend
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Dalga Kalitesi</span>
            <span className="font-mono text-blue-300">
              {data.elliott.pattern.completion > 70 ? 'Yüksek' :
               data.elliott.pattern.completion > 40 ? 'Orta' : 'Düşük'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Beklenen Hareket</span>
            <span className="font-mono text-purple-300">
              {Math.abs(data.elliott.nextMove.target - data.elliott.nextMove.target * 0.95).toFixed(0)} pips
            </span>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500">
        * Elliott Dalga Teorisi bazlı analiz {lastUpdate && `| Son güncelleme: ${
          lastUpdate.toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
        }`}
      </div>
    </div>
  )
} 