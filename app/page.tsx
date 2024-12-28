'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { useAnalysisStore } from '@/lib/store'
import TradingAnalysis from '@/components/TradingAnalysis'
import PriceActionAnalysis from '@/components/PriceActionAnalysis'
import GannAnalysis from '@/components/GannAnalysis'
import TechnicalIndicators from '@/components/TechnicalIndicators'
import TechnicalAnalysis from '@/components/TechnicalAnalysis'
import AnalysisSummary from '@/components/AnalysisSummary'
import Header from '@/components/Header'
import ContactWidget from '@/components/ContactWidget'

// TradingView widget'ı client-side'da yüklenecek
const TradingViewWidget = dynamic(
  () => import('@/components/TradingViewWidget'),
  { ssr: false }
)

function calculateConfidenceScore(data: any): number {
  if (!data) return 0;

  // Tüm analizlerden güven skorlarını al
  const scores = [
    // Elliott analizi güven skoru
    data.elliott?.currentWave?.confidence || 0,
    
    // Price Action analizi güven skoru
    data.priceAction?.signals?.primary?.confidence || 0,
    
    // Gann analizi güven skoru
    data.gann?.predictions?.price?.confidence || 0,
    
    // Trend gücü
    data.gann?.predictions?.market_position?.strength || 0,
    
    // Volatilite bazlı güven (düşük volatilite = yüksek güven)
    1 - (data.gann?.predictions?.market_position?.volatility || 0)
  ];

  // Momentum yönü ile trend uyumu kontrolü
  const momentum = data.gann?.predictions?.market_position?.momentum || 0;
  const trendDirection = data.priceAction?.trend?.direction;
  
  if ((momentum > 0 && trendDirection === 'UP') || 
      (momentum < 0 && trendDirection === 'DOWN')) {
    scores.push(0.8); // Trend ile momentum uyumlu
  } else {
    scores.push(0.2); // Trend ile momentum uyumsuz
  }

  // Destek/Direnç yakınlığı kontrolü
  const currentPrice = data.currentPrice;
  const keyLevels = data.priceAction?.trend?.keyLevels;
  if (keyLevels) {
    const nearLevel = [...keyLevels.supports, ...keyLevels.resistances]
      .some(level => Math.abs(level - currentPrice) / currentPrice < 0.01); // %1 yakınlık
    
    scores.push(nearLevel ? 0.7 : 0.3);
  }

  // Tüm skorların ağırlıklı ortalaması
  const weights = [0.25, 0.2, 0.2, 0.15, 0.1, 0.05, 0.05]; // Toplam 1
  const weightedScore = scores.reduce((acc, score, i) => 
    acc + (score * (weights[i] || 0)), 0);

  return Math.round(weightedScore * 100);
}

export default function Home() {
  const { data, setSelectedCoin } = useAnalysisStore()

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 text-gray-100">
      {/* Header component'i burada kullanılacak */}
      <Header />

      {/* Loading Göstergesi */}
      {data?.isLoading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-blue-500/20">
          <div className="h-full w-1/3 bg-blue-500 animate-loading"></div>
        </div>
      )}

      {/* Ana İçerik */}
      <div className="pt-16 pb-10"> {/* pt-16 ile header'ın altında başlasın */}
        <div className="container mx-auto px-4">
          {/* Grafik ve Quick Stats Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
            {/* Grafik Bölümü */}
            <div className="xl:col-span-3">
              <div className="bg-gray-900/60 rounded-xl backdrop-blur-sm border border-gray-600/30 overflow-hidden shadow-lg">
                <div className="h-[400px] sm:h-[500px] md:h-[600px]">
                  <TradingViewWidget />
                </div>
              </div>
            </div>

            {/* Quick Stats - Dikey */}
            <div className="space-y-4">
              {[
                {
                  label: 'Volatilite',
                  value: `%${(data?.gann?.predictions.market_position.volatility * 100).toFixed(1) || '0'}`,
                  icon: '📊',
                  color: 'from-blue-400/10 to-blue-600/10',
                  tooltip: 'Son 20 günlük fiyat oynaklığı'
                },
                {
                  label: 'İşlem Hacmi',
                  value: `$${(data?.volume24h || 0).toLocaleString()}`,
                  icon: '💰',
                  color: 'from-purple-400/10 to-purple-600/10',
                  tooltip: 'Son 24 saatlik toplam işlem hacmi'
                },
                {
                  label: 'Trend Gücü',
                  value: `%${(data?.gann?.predictions.market_position.strength * 100).toFixed(1) || '0'}`,
                  icon: '📈',
                  color: 'from-green-400/10 to-green-600/10',
                  tooltip: 'Mevcut trend gücü'
                },
                {
                  label: 'Güven Skoru',
                  value: `%${calculateConfidenceScore(data) || '0'}`,
                  icon: '🎯',
                  color: 'from-pink-400/10 to-pink-600/10',
                  tooltip: 'Tüm analizlerin ortak güven skoru'
                }
              ].map((stat, i) => (
                <div 
                  key={i} 
                  className={`bg-gradient-to-br ${stat.color} rounded-lg border border-gray-600/30 p-4 
                  backdrop-blur-sm hover:bg-gray-800/40 transition-all shadow-lg group relative`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{stat.icon}</span>
                    <div>
                      <div className="text-sm text-gray-300 flex items-center">
                        {stat.label}
                        <span className="ml-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">ℹ️</span>
                      </div>
                      <div className="text-lg font-bold text-white">{stat.value}</div>
                    </div>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 
                    text-xs text-gray-300 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {stat.tooltip}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analiz Özeti */}
          <div className="mb-8">
            <AnalysisSummary />
          </div>

          {/* Teknik Göstergeler */}
          <div className="mb-8">
            <div className="bg-gray-900/60 rounded-xl p-6 backdrop-blur-sm border border-gray-600/30">
              <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                Teknik Göstergeler
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <TechnicalIndicators />
              </div>
            </div>
          </div>

          {/* Analiz Widget'ları */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Teknik Analiz Widget'ı */}
            <div className="bg-gray-900/60 rounded-xl backdrop-blur-sm border border-gray-600/30 p-8 
              hover:shadow-lg transition-all duration-300 hover:border-purple-500/30 
              hover:bg-gray-800/60">
              <TechnicalAnalysis />
            </div>

            {/* Elliott Dalga Widget'ı */}
            <div className="bg-gray-900/60 rounded-xl backdrop-blur-sm border border-gray-600/30 p-8 
              hover:shadow-lg transition-all duration-300 hover:border-purple-500/30 
              hover:bg-gray-800/60">
              <TradingAnalysis />
            </div>

            {/* Price Action Widget'ı */}
            <div className="bg-gray-900/60 rounded-xl backdrop-blur-sm border border-gray-600/30 p-8 
              hover:shadow-lg transition-all duration-300 hover:border-purple-500/30 
              hover:bg-gray-800/60">
              <PriceActionAnalysis />
            </div>

            {/* Gann Widget'ı */}
            <div className="bg-gray-900/60 rounded-xl backdrop-blur-sm border border-gray-600/30 p-8 
              hover:shadow-lg transition-all duration-300 hover:border-purple-500/30 
              hover:bg-gray-800/60">
              <GannAnalysis />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900/90 border-t border-gray-700/50 backdrop-blur-sm py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col space-y-4">
            {/* Üst Kısım */}
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div>
                * Tüm analizler yapay zeka destekli teknik analiz algoritmalarıyla üretilmektedir.
              </div>
              <div className="flex items-center space-x-2">
                <span>Son Güncelleme:</span>
                <span className="font-mono">
                  {data?.timestamp ? new Date(data.timestamp).toLocaleTimeString('tr-TR') : '--:--:--'}
                </span>
              </div>
            </div>

            {/* Alt Kısım - Sosyal Medya */}
            <div className="flex justify-center space-x-4 pt-4 border-t border-gray-800">
              <a 
                href="https://www.linkedin.com/in/batuhan-buğra-akça-018987189/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span className="text-sm">LinkedIn</span>
              </a>
              <a 
                href="https://github.com/BatuhanBugraAkca" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="text-sm">GitHub</span>
              </a>
            </div>

            {/* Copyright */}
            <div className="text-center text-xs text-gray-500 mt-4">
              © {new Date().getFullYear()} CryptoAI Analysis. Tüm hakları saklıdır.
            </div>
          </div>
        </div>
      </footer>
      <ContactWidget />
    </main>
  )
}
