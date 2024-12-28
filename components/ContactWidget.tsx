'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ContactWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Submission failed')

      setStatus('success')
      setFormData({ name: '', email: '', message: '' })
      
      // Auto close after 1 second
      setTimeout(() => {
        setIsOpen(false)
        setStatus('idle')
      }, 1000)

    } catch (error) {
      console.error('Form submission error:', error)
      setStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div 
      className="fixed z-50"
      initial={{ bottom: 24, right: 24 }}
      drag
      dragConstraints={{
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      }}
      dragElastic={0.1}
      dragMomentum={false}
      onDragEnd={(_, info) => {
        setPosition({
          x: position.x + info.offset.x,
          y: position.y + info.offset.y
        })
      }}
      animate={{
        x: position.x,
        y: position.y
      }}
    >
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative w-12 h-12">
          <motion.div
            className="absolute inset-0"
          >
            <svg viewBox="0 0 24 24" className="w-full h-full text-white">
              <path
                fill="currentColor"
                d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z"
              />
            </svg>
          </motion.div>
        </div>
      </motion.button>

      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-full right-0 mb-4 bg-white text-gray-800 rounded-lg p-4 shadow-xl max-w-[200px]"
          >
            <p className="text-sm">I need your feedback! 🤖</p>
            <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-4 h-4 bg-white"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-full right-0 mb-4 bg-gray-900 rounded-lg p-6 shadow-xl w-80"
          >
            <h3 className="text-lg font-medium text-white mb-4">Contact Us</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  className="w-full bg-gray-800 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  className="w-full bg-gray-800 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <textarea
                  placeholder="Your Message"
                  required
                  rows={4}
                  className="w-full bg-gray-800 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full rounded py-2 transition-all ${
                  isLoading 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90'
                } text-white`}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>

              {status === 'success' && (
                <div className="text-green-400 text-sm text-center">
                  Message sent successfully! ✨
                </div>
              )}
              {status === 'error' && (
                <div className="text-red-400 text-sm text-center">
                  An error occurred. Please try again.
                </div>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
} 