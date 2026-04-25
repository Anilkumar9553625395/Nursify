'use client'

import { MessageCircle, X } from 'lucide-react'
import { useState } from 'react'
import { WHATSAPP_LINK } from '@/lib/constants'

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tooltip / Chat prompt */}
      {showTooltip && (
        <div className="bg-white rounded-2xl shadow-glass-lg border border-gray-100 p-4 w-72 animate-slide-up">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center">
                <MessageCircle size={16} className="text-white" fill="white" />
              </div>
              <div>
                <p className="font-bold text-navy-900 text-sm">Nursify Support</p>
                <p className="text-[10px] text-green-600 font-medium">● Online now</p>
              </div>
            </div>
            <button onClick={() => setShowTooltip(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
              <X size={14} />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Hi! 👋 Need help scheduling care or have questions? Chat with us on WhatsApp.
          </p>
          <div className="space-y-2">
            <a
              href={`${WHATSAPP_LINK}?text=${encodeURIComponent("Hi Nursify, I need help scheduling nursing care for my family.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white text-sm font-semibold transition-all justify-center"
            >
              <MessageCircle size={16} fill="white" /> Chat as Patient
            </a>
            <a
              href={`${WHATSAPP_LINK}?text=${encodeURIComponent("Hi Nursify, I am a nurse and I'd like to register on your platform.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-white border-2 border-[#25D366] text-[#25D366] hover:bg-green-50 text-sm font-semibold transition-all justify-center"
            >
              <MessageCircle size={16} /> Chat as Nurse
            </a>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setShowTooltip(!showTooltip)}
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95 relative group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={26} fill="white" />
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
        {/* Notification dot */}
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white" />
      </button>
    </div>
  )
}
