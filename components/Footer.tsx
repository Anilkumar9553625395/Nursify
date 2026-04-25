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
                <span className="font-extrabold text-lg text-white tracking-tight block leading-none">Nursify</span>
                <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest leading-none">Healthcare</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Professional home nursing care — for you and your loved ones. Verified nurses, transparent pricing across India.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <Shield size={14} className="text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Verified & Licensed</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: '/find-nurses', label: 'Find Nurses' },
                { href: '/register',    label: 'Join as Nurse' },
                { href: '/bookings',    label: 'My Bookings' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-emerald-600 group-hover:bg-emerald-400 transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-5">Services</h4>
            <ul className="space-y-3">
              {['Home Care', 'Senior Care', 'Post-Surgery Care', 'Pediatric Care', 'ICU at Home'].map(s => (
                <li key={s}>
                  <span className="text-sm text-gray-400 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-emerald-600" />
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white">+91 95536 25395</p>
                  <p className="text-xs text-gray-500">24/7 Emergency Line</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-400">support@nursify.in</p>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-400">India — Serving All Major Cities</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-navy-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Nursify Healthcare. All rights reserved. Quality healthcare at your doorstep.
          </p>
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-emerald-500" />
            <span className="text-xs font-semibold text-gray-500">Trusted by families across India</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
