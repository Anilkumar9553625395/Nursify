import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Heart, LayoutDashboard, Users, Calendar, UserCheck } from 'lucide-react'
import { isAdminAuthenticated } from '@/lib/auth'
import LogoutButton from '@/components/LogoutButton'

export const metadata: Metadata = { title: 'NurseCare Admin' }

const navItems = [
  { href: '/admin',          icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/nurses',   icon: UserCheck,       label: 'Nurses' },
  { href: '/admin/bookings', icon: Calendar,        label: 'Bookings' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isAuth = isAdminAuthenticated()
  
  if (!isAuth) {
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-teal-900 text-white flex flex-col flex-shrink-0 shadow-2xl z-20">
        <div className="p-8 border-b border-teal-800/50">
          <Link href="/admin" className="flex items-center gap-3 font-bold text-xl group">
            <span className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-all">
              <Heart size={18} fill="white" />
            </span>
            <span className="tracking-tight">NurseCare</span>
          </Link>
          <p className="text-teal-400 text-xs mt-2 font-medium uppercase tracking-widest pl-1">Admin Panel</p>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-teal-200 hover:bg-teal-800 hover:text-white transition-all group">
              <Icon size={18} className="group-hover:scale-110 transition-transform" />
              {label}
            </Link>
          ))}
        </nav>
        
        <div className="p-6 border-t border-teal-800/50 space-y-4">
          <Link href="/" className="flex items-center gap-2 text-xs text-teal-400 hover:text-white transition px-4 py-1 font-medium">
            ← View Site
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 h-screen overflow-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-gray-50 to-gray-50">
        {children}
      </main>
    </div>
  )
}
