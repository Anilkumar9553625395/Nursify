import { getAllNurses, getAllBookings } from '@/lib/store'
import Link from 'next/link'
import { Users, Calendar, CheckCircle, Clock, TrendingUp, AlertCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const nurses   = await getAllNurses()
  const bookings = await getAllBookings()

  const stats = {
    totalNurses:    nurses.length,
    approvedNurses: nurses.filter(n => n.status === 'approved').length,
    pendingNurses:  nurses.filter(n => n.status === 'pending').length,
    totalBookings:  bookings.length,
    confirmed:      bookings.filter(b => b.status === 'confirmed').length,
    revenue:        bookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + b.totalCost, 0),
  }

  const recentBookings  = [...bookings].reverse().slice(0, 5)
  const pendingNursesList = nurses.filter(n => n.status === 'pending')

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome back, Admin</p>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Users,       label: 'Total Nurses',    value: stats.totalNurses,    color: 'teal' },
          { icon: CheckCircle, label: 'Approved Nurses', value: stats.approvedNurses, color: 'green' },
          { icon: AlertCircle, label: 'Pending Approval',value: stats.pendingNurses,  color: 'yellow' },
          { icon: Calendar,    label: 'Total Bookings',  value: stats.totalBookings,  color: 'teal' },
          { icon: Clock,       label: 'Confirmed',       value: stats.confirmed,      color: 'green' },
          { icon: TrendingUp,  label: 'Total Revenue',   value: `$${stats.revenue.toLocaleString()}`, color: 'teal' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl bg-${color}-50 flex items-center justify-center mb-3`}>
              <Icon size={19} className={`text-${color}-600`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending nurses */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Pending Nurse Approvals</h2>
            <Link href="/admin/nurses" className="text-sm text-teal-600 hover:underline">View all</Link>
          </div>
          {pendingNursesList.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">No pending approvals</p>
          ) : (
            <div className="space-y-3">
              {pendingNursesList.map(n => (
                <div key={n.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{n.name}</p>
                    <p className="text-xs text-gray-400">{n.specializations.slice(0,2).join(', ')}</p>
                  </div>
                  <Link href="/admin/nurses" className="text-xs text-teal-600 font-medium hover:underline">Review</Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent bookings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-sm text-teal-600 hover:underline">View all</Link>
          </div>
          {recentBookings.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">No bookings yet</p>
          ) : (
            <div className="space-y-3">
              {recentBookings.map(b => (
                <div key={b.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{b.patientName}</p>
                    <p className="text-xs text-gray-400">→ {b.nurseName} · ${b.totalCost}</p>
                  </div>
                  <span className={`badge text-xs ${
                    b.status === 'confirmed' ? 'badge-teal' :
                    b.status === 'completed' ? 'badge-green' :
                    b.status === 'cancelled' ? 'badge-red' : 'badge-yellow'
                  }`}>{b.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
