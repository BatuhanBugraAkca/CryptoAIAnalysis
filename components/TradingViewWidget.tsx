'use client'
import { useEffect, useRef } from 'react'
import { useAnalysisStore } from '@/lib/store'

let tvScriptLoadingPromise: Promise<void>

export default function TradingViewWidget() {
  const onLoadScriptRef = useRef<(() => void) | null>(null)
  const { data } = useAnalysisStore()
  const selectedCoin = data?.selectedCoin || 'ETH'

  useEffect(() => {
    onLoadScriptRef.current = createWidget

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement('script')
        script.id = 'tradingview-widget-loading-script'
        script.src = 'https://s3.tradingview.com/tv.js'
        script.type = 'text/javascript'
        script.onload = resolve as any
        document.head.appendChild(script)
      })
    }

    tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current())

    return () => {
      onLoadScriptRef.current = null
    }

    function createWidget() {
      if (document.getElementById('tradingview-widget') && 'TradingView' in window) {
        new (window as any).TradingView.widget({
          autosize: true,
          symbol: `${selectedCoin}USD`,
          interval: "D",
          timezone: "Europe/Istanbul",
          theme: "dark",
          style: "1",
          locale: "tr",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          container_id: "tradingview-widget",
          hide_volume: true,
          studies_overrides: {
            "volume.volume.display": false,
            "volume.volume ma.display": false,
            "RSI.display": false
          },
          disabled_features: [
            "volume_force_overlay",
            "create_volume_indicator_by_default"
          ],
          enabled_features: []
        })
      }
    }
  }, [selectedCoin])

  return (
    <div className="w-full h-full min-h-[250px] sm:min-h-[350px] md:min-h-[450px] lg:min-h-[550px] xl:min-h-[650px]">
      <div id='tradingview-widget' className="w-full h-full" />
    </div>
  )
} 