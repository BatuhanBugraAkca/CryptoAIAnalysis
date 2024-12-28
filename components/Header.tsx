import React, { memo, useCallback } from 'react'
import { useAnalysisStore } from '@/lib/store'

const Header = memo(() => {
  const { data, setSelectedCoin } = useAnalysisStore()

  // Coin seçimi için memoized callback
  const handleCoinChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCoin = e.target.value as 'ETH' | 'BTC'
    setSelectedCoin(newCoin)
  }, [setSelectedCoin])

  // Fiyat formatlaması için memoized değer
  const formattedPrice = React.useMemo(() => {
    return data?.currentPrice?.toLocaleString() || '---'
  }, [data?.currentPrice])

  // Momentum değeri için memoized değer
  const momentumData = React.useMemo(() => {
    if (!data?.gann?.predictions.market_position.momentum) return null
    
    const momentum = data.gann.predictions.market_position.momentum
    return {
      isPositive: momentum >= 0,
      value: Math.abs(momentum * 100).toFixed(1)
    }
  }, [data?.gann?.predictions.market_position.momentum])

  return (
    <header className="border-b border-gray-700/50 bg-gray-800/90 backdrop-blur-md fixed w-full z-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-row justify-between items-center h-14">
          {/* Logo ve İsim */}
          <div className="flex items-center">
            <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" className="fill-blue-500"/>
              <path d="M2 17L12 22L22 17M2 12L12 17L22 12" className="stroke-purple-500" strokeWidth="2"/>
              <circle cx="12" cy="12" r="3" className="fill-pink-500"/>
            </svg>
            <h1 className="ml-2 text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              CryptoAI Analysis
            </h1>
            <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
              Beta
            </span>
          </div>

          {/* Fiyat ve Coin Seçici */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Fiyat Göstergesi */}
            <div className="bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700/50">
              <div className="text-xs sm:text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">{data?.selectedCoin || 'ETH'}/USD</span>
                  <span className="font-mono font-bold">
                    ${formattedPrice}
                  </span>
                </div>
                {momentumData && (
                  <div className={`text-[10px] sm:text-xs font-mono ${
                    momentumData.isPositive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {momentumData.isPositive ? '▲' : '▼'}
                    {momentumData.value}%
                  </div>
                )}
              </div>
            </div>

            {/* Coin Seçici */}
            <select 
              value={data?.selectedCoin || 'ETH'} 
              onChange={handleCoinChange}
              className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs sm:text-sm"
            >
              <option value="ETH">ETH/USD</option>
              <option value="BTC">BTC/USD</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  )
})

Header.displayName = 'Header'

export default Header 