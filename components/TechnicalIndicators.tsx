'use client'
import React from 'react'
import { useCryptoStore } from '@/lib/store'

export default function TechnicalIndicators() {
  const { cryptoData, loading, error } = useCryptoStore()

  if (loading) return <div>Yükleniyor...</div>
  if (error) return <div>Hata: {error}</div>
  if (!cryptoData) return null

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Technical Indicators</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold">Bitcoin Indicators</h3>
          <p>Price: ${cryptoData.bitcoin.price.toLocaleString()}</p>
          <p>24h Change: {cryptoData.bitcoin.change24h}%</p>
          <p>Market Cap: {cryptoData.bitcoin.marketCap}</p>
        </div>
        <div>
          <h3 className="font-semibold">Ethereum Indicators</h3>
          <p>Price: ${cryptoData.ethereum.price.toLocaleString()}</p>
          <p>24h Change: {cryptoData.ethereum.change24h}%</p>
          <p>Market Cap: {cryptoData.ethereum.marketCap}</p>
        </div>
      </div>
    </div>
  )
} 