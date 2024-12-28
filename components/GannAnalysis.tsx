import React from 'react'
import { useCryptoStore } from '@/lib/store'

export default function GannAnalysis() {
  const { cryptoData, loading, error } = useCryptoStore()

  if (loading) return <div>Yükleniyor...</div>
  if (error) return <div>Hata: {error}</div>
  if (!cryptoData) return null

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Gann Analysis</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold">Bitcoin Gann Levels</h3>
          <p>Price: ${cryptoData.bitcoin.price.toLocaleString()}</p>
          <p>Market Cap: {cryptoData.bitcoin.marketCap}</p>
          <p>Volume: {cryptoData.bitcoin.volume}</p>
        </div>
        <div>
          <h3 className="font-semibold">Ethereum Gann Levels</h3>
          <p>Price: ${cryptoData.ethereum.price.toLocaleString()}</p>
          <p>Market Cap: {cryptoData.ethereum.marketCap}</p>
          <p>Volume: {cryptoData.ethereum.volume}</p>
        </div>
      </div>
    </div>
  )
} 