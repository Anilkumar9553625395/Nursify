import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Heart, LayoutDashboard, Users, Calendar, UserCheck, Activity, Shield, UserRound } from 'lucide-react'
import { isAdminAuthenticated } from '@/lib/auth'
import LogoutButton from '@/components/LogoutButton'

export const metadata: Metadata = { title: 'miAROGYA Admin Dashboard' }

const navItems = [
  { href: '/admin',           icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/nurses',    icon: UserCheck,       label: 'Nurses' },
  { href: '/admin/bookings',  icon: Calendar,        label: 'Bookings' },
  { href: '/admin/patients',  icon: UserRound,       label: 'Patients' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isAuth = isAdminAuthenticated()
  
  if (!isAuth) {
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-medical-bg">
      {/* Sidebar */}
      <aside className="w-64 bg-navy-900 text-white flex flex-col flex-shrink-0 shadow-2xl z-20 relative overflow-hidden">
        {/* Decorative gradient */}
        <div className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at 0% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 60%)'
          }}
        />

        <div className="relative p-7 border-b border-navy-800/50">
          <Link href="/admin" className="flex items-center gap-3 font-bold text-xl group">
            <span className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-medical group-hover:scale-105 transition-all">
              <Heart size={18} fill="white" className="text-white" />
            </span>
            <span className="tracking-tight">miAROGYA</span>
          </Link>
          <div className="flex items-center gap-2 mt-3 pl-1">
            <Shield size={12} className="text-emerald-400" />
            <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>
        
        <nav className="relative flex-1 p-5 space-y-1.5">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-300 hover:bg-navy-800 hover:text-white transition-all group">
              <div className="w-8 h-8 rounded-lg bg-navy-800 group-hover:bg-emerald-500/20 flex items-center justify-center transition-all">
                <Icon size={16} className="group-hover:text-emerald-400 transition-colors" />
              </div>
              {label}
            </Link>
          ))}
        </nav>
        
        <div className="relative p-5 border-t border-navy-800/50 space-y-3">
          <Link href="/" className="flex items-center gap-2 text-xs text-gray-400 hover:text-emerald-400 transition px-4 py-2 font-semibold rounded-lg hover:bg-navy-800">
            ← View Site
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 h-screen overflow-auto">
        {children}
      </main>
    </div>
  )
}
