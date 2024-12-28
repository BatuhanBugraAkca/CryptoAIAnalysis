'use client'
import { useState, useEffect } from 'react'

export default function AIAssistant() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    "Merhaba! Ben CryptoAI'nin asistanı. Size nasıl yardımcı olabilirim?",
    "Siteyi birlikte geliştirelim! Fikirlerinizi duymak isteriz.",
    "Geri bildirimleriniz bizim için çok değerli!",
    "İletişim için: bba.softt@gmail.com"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div 
        className={`bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg p-4 shadow-lg
          transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <p className="text-sm text-gray-300">{messages[currentMessage]}</p>
            <a 
              href="mailto:bba.softt@gmail.com"
              className="text-xs text-blue-400 hover:text-blue-300 mt-2 inline-block"
            >
              İletişime Geç
            </a>
          </div>
        </div>
      </div>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="mt-2 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500
          flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
      >
        <span className="text-xl">{isVisible ? '✕' : '💬'}</span>
      </button>
    </div>
  )
} 