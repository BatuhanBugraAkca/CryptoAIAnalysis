/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export',
  images: {
    unoptimized: true,
    loader: 'custom',
    loaderFile: './image-loader.js'
  },
  basePath: process.env.NODE_ENV === 'production' ? '/CryptoAIAnalysis' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/CryptoAIAnalysis/' : '',
  trailingSlash: true,
  distDir: 'out'
}

module.exports = nextConfig 