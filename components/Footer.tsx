import { Heart, Activity, Phone, Mail, MapPin, Shield } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="relative bg-navy-900 text-gray-300 overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 20% 0%, rgba(16, 185, 129, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
        }}
      />

      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 group mb-5">
              <span className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-medical group-hover:scale-105 transition-all">
                <Heart size={18} className="text-white" fill="white" />
              </span>
              <div>
                <span className="font-extrabold text-lg text-white tracking-tight block leading-none">miAROGYA</span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mt-1">Care & Wellness</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Empowering families with qualified, compassionate nursing care at the comfort of their homes.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                  <Mail size={14} className="text-emerald-500 group-hover:text-white" />
                </div>
                <p className="text-sm text-gray-400">support@miAROGYA.in</p>
              </div>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-5">Platform</h4>
            <ul className="space-y-3">
              <li><Link href="/nurses" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">Find Nurses</Link></li>
              <li><Link href="/register" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">Join as Nurse</Link></li>
              <li><Link href="/login" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">Client Login</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-5">Support</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">Help Center</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li>
                <a href="https://wa.me/919553625395" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 group">
                  <Phone size={16} className="text-emerald-400 mt-0.5 flex-shrink-0 group-hover:text-emerald-300 transition-colors" />
                  <div>
                    <p className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">+91 95536 25395</p>
                    <p className="text-xs text-gray-500">24/7 Support Line</p>
                  </div>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-400">Serving Hyderabad</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-navy-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} miAROGYA Healthcare. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-emerald-500" />
            <span className="text-xs font-semibold text-gray-500">Trusted by families across Hyderabad</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
