import { create } from 'zustand'

interface CryptoData {
  bitcoin: {
    price: number
    change24h: number
    marketCap: string
    volume: string
  }
  ethereum: {
    price: number
    change24h: number
    marketCap: string
    volume: string
  }
}

interface CryptoStore {
  cryptoData: CryptoData | null
  loading: boolean
  error: string | null
  setCryptoData: (data: CryptoData) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useCryptoStore = create<CryptoStore>((set) => ({
  cryptoData: null,
  loading: false,
  error: null,
  setCryptoData: (data) => set({ cryptoData: data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error })
})) 