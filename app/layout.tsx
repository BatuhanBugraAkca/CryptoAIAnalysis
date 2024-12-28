import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://your-domain.com'),
  title: 'CryptoAI Analysis - AI-Powered Crypto Analysis Platform',
  description: 'Analyze cryptocurrency markets with AI-powered technical analysis, Elliott Waves, Gann, and Price Action analysis.',
  keywords: 'crypto analysis, artificial intelligence, bitcoin, ethereum, technical analysis, elliott waves, gann analysis',
  openGraph: {
    title: 'CryptoAI Analysis',
    description: 'AI-powered crypto analysis platform',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CryptoAI Analysis',
    description: 'AI-powered crypto analysis platform',
    images: ['/twitter-image.png'],
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#1a1b1e" />
        <meta name="google-site-verification" content="your-verification-code" />
      </head>
      <body className="bg-gray-900 text-gray-100">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
