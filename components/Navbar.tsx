'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Heart, Menu, X, Activity, User, LogOut, UserCheck } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Hide navbar on admin routes
  if (pathname.startsWith('/admin')) return null

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    
    // Check auth session
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => setUser(data.user || null))
      .catch(() => setUser(null))

    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/')
    router.refresh()
  }

  const baseLinks = [
    { href: '/',                  label: 'Home' },
    { href: '/find-nurses',       label: 'Find Nurses' },
  ]

  const authLinks = user ? [
    ...(user.role === 'nurse' 
      ? [{ href: '/my-application', label: 'Application Status' }] 
      : [{ href: '/register-patient', label: 'Register as Patient' }]
    ),
    { href: '/bookings',          label: 'My Care Requests' },
  ] : [
    { href: '/register-patient',  label: 'Register as Patient' },
    { href: '/register',          label: 'Register as Nurse' },
  ]

  const links = [...baseLinks, ...authLinks]

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/90 backdrop-blur-xl shadow-nav border-b border-gray-100/50' 
        : 'bg-white/70 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <span className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-medical group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <Heart size={18} className="text-white" fill="white" />
              </span>
              <Activity size={10} className="absolute -top-0.5 -right-0.5 text-emerald-400 animate-pulse-soft" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-navy-900 tracking-tight leading-none">Nursify</span>
              <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest leading-none mt-0.5">For you & your loved ones</span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map(({ href, label }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    active
                      ? 'bg-emerald-500 text-white shadow-medical'
                      : 'text-navy-700 hover:text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </div>

          {/* User Auth Actions */}
          <div className="flex items-center gap-3">
            {!user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login" className="px-4 py-2 text-sm font-bold text-navy-700 hover:text-emerald-600 transition-colors">
                  Log In
                </Link>
                <Link href="/signup" className="btn-primary text-sm px-5 py-2">
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-xl border border-gray-200 shadow-inner">
                  <div className="w-6 h-6 bg-emerald-500 text-white rounded-lg flex items-center justify-center">
                    <User size={12} />
                  </div>
                  <span className="text-xs font-black text-navy-900 tracking-tight">{user.username}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl bg-gray-100 text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all border border-gray-200"
                  aria-label="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
            
            <button
              className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-all"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-gray-100/50 bg-white/95 backdrop-blur-xl px-4 pb-5 pt-3 space-y-1 animate-slide-up">
          {user && (
             <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 rounded-xl mb-2">
               <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center font-bold">
                 {user.username.charAt(0).toUpperCase()}
               </div>
               <div>
                 <p className="text-sm font-black text-navy-900">{user.username}</p>
                 <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">{user.role}</p>
               </div>
             </div>
          )}
          {links.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  active ? 'bg-emerald-500 text-white shadow-medical' : 'text-navy-800 hover:bg-emerald-50'
                }`}
              >
                {label}
              </Link>
            )
          })}
          {!user ? (
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100">
              <Link href="/login" onClick={() => setOpen(false)} className="block text-center px-4 py-3 rounded-xl text-sm font-bold text-navy-800 bg-gray-50">
                Log In
              </Link>
              <Link href="/signup" onClick={() => setOpen(false)} className="block text-center px-4 py-3 rounded-xl text-sm font-bold text-white bg-emerald-500 shadow-medical">
                Sign Up
              </Link>
            </div>
          ) : (
            <button
              onClick={() => { setOpen(false); handleLogout(); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl text-sm font-bold text-red-500 bg-red-50 mt-4"
            >
              <LogOut size={18} /> Log Out
            </button>
          )}
        </div>
      )}
    </nav>
  )
}

