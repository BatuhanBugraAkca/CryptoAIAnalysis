'use client'

import { useEffect } from 'react'
import { useCryptoStore } from '@/lib/store'
import TradingAnalysis from '@/components/TradingAnalysis'
import PriceActionAnalysis from '@/components/PriceActionAnalysis'
import GannAnalysis from '@/components/GannAnalysis'
import TechnicalIndicators from '@/components/TechnicalIndicators'

export default function Home() {
  const { setCryptoData, setLoading, setError } = useCryptoStore()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/data/crypto.json')
        const data = await response.json()
        setCryptoData(data.data)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [setCryptoData, setLoading, setError])

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          AI-Powered Crypto Analysis Platform
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <TradingAnalysis />
          <PriceActionAnalysis />
          <GannAnalysis />
          <TechnicalIndicators />
        </div>
      </div>
    </main>
  )
}
