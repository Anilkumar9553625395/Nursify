import { getAllNurses, getAllBookings } from '@/lib/store'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Users, Calendar, CheckCircle, Clock, TrendingUp, AlertCircle, Activity, Shield, UserRound } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminDashboard() {
  const [{ nurses, count: totalNursesCount }, bookings, { count: patientCount }] = await Promise.all([
    getAllNurses(1, 1000), // Get a large batch for stats
    getAllBookings(),
    supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'patient')
      .then(r => ({ count: r.count ?? 0 })),
  ])

  const stats = {
    totalNurses:    totalNursesCount,
    approvedNurses: nurses.filter(n => n.status === 'approved').length,
    pendingNurses:  nurses.filter(n => n.status === 'pending').length,
    totalBookings:  bookings.length,
    assigned:       bookings.filter(b => b.status === 'assigned' || b.status === 'confirmed').length,
    revenue:        bookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + b.totalCost, 0),
    totalPatients:  patientCount,
  }

  const recentBookings  = [...bookings].reverse().slice(0, 5)
  const pendingNursesList = nurses.filter(n => n.status === 'pending')

  const statCards = [
    { icon: Users,       label: 'Total Nurses',    value: stats.totalNurses,    gradient: 'from-emerald-400 to-emerald-600', href: '/admin/nurses' },
    { icon: CheckCircle, label: 'Approved Nurses',  value: stats.approvedNurses, gradient: 'from-green-400 to-green-600',     href: '/admin/nurses' },
    { icon: AlertCircle, label: 'Pending Approval', value: stats.pendingNurses,  gradient: 'from-amber-400 to-amber-600',    href: '/admin/nurses' },
    { icon: Calendar,    label: 'Total Bookings',   value: stats.totalBookings,  gradient: 'from-sapphire-400 to-sapphire-600', href: '/admin/bookings' },
    { icon: UserRound,   label: 'Patients',         value: stats.totalPatients,  gradient: 'from-purple-400 to-purple-600', href: '/admin/patients' },
    { icon: TrendingUp,  label: 'Total Revenue',    value: `₹${stats.revenue.toLocaleString()}`, gradient: 'from-navy-700 to-navy-900', href: null },
  ]

  return (
    <div className="p-8 bg-medical-bg min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight flex items-center gap-2">
            <Activity size={24} className="text-emerald-500" /> Dashboard
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Welcome back, Admin. Here&apos;s your overview.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
          <Shield size={13} className="text-emerald-600" />
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Verified Platform</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map(({ icon: Icon, label, value, gradient, href }) => (
          href ? (
            <Link key={label} href={href} className="card p-5 group hover:shadow-card-hover transition-all duration-300 block">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform`}>
                <Icon size={20} className="text-white" />
              </div>
              <p className="text-2xl font-extrabold text-navy-900">{value}</p>
              <p className="text-sm text-gray-500 mt-0.5 font-medium">{label}</p>
            </Link>
          ) : (
            <div key={label} className="card p-5 group hover:shadow-card-hover transition-all duration-300">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform`}>
                <Icon size={20} className="text-white" />
              </div>
              <p className="text-2xl font-extrabold text-navy-900">{value}</p>
              <p className="text-sm text-gray-500 mt-0.5 font-medium">{label}</p>
            </div>
          )
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending nurses */}
        <div className="card p-6 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-navy-900 flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-500" /> Pending Approvals
            </h2>
            <Link href="/admin/nurses" className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold hover:underline">View all</Link>
          </div>
          {pendingNursesList.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-emerald-50 flex items-center justify-center">
                <CheckCircle size={20} className="text-emerald-400" />
              </div>
              <p className="text-sm text-gray-400 font-medium">All caught up! No pending approvals.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pendingNursesList.map(n => (
                <div key={n.id} className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                      <span className="text-amber-700 font-bold text-xs">{n.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-navy-900 text-sm">{n.name}</p>
                      <p className="text-xs text-gray-400">{n.specializations.slice(0,2).join(', ')}</p>
                    </div>
                  </div>
                  <Link href="/admin/nurses" className="text-xs text-emerald-600 font-bold hover:underline bg-emerald-50 px-3 py-1 rounded-lg">Review</Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent bookings */}
        <div className="card p-6 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-navy-900 flex items-center gap-2">
              <Calendar size={16} className="text-sapphire-500" /> Recent Care Requests
            </h2>
            <Link href="/admin/bookings" className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold hover:underline">View all</Link>
          </div>
          {recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-100 flex items-center justify-center">
                <Calendar size={20} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-400 font-medium">No bookings yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentBookings.map(b => (
                <div key={b.id} className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sapphire-100 to-sapphire-200 flex items-center justify-center">
                      <span className="text-sapphire-700 font-bold text-xs">{b.patientName.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-navy-900 text-sm">{b.patientName}</p>
                      <p className="text-xs text-gray-400">→ {b.nurseName} · ${b.totalCost}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                    b.status === 'assigned' || b.status === 'confirmed' ? 'badge-emerald' :
                    b.status === 'completed' ? 'badge-green' :
                    b.status === 'cancelled' ? 'badge-red' : 'badge-yellow'
                  }`}>{b.status === 'confirmed' ? 'assigned' : b.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
