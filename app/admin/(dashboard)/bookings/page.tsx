'use client'

import { useEffect, useState } from 'react'
import { Calendar, Clock, DollarSign, Search } from 'lucide-react'
import type { Booking, BookingStatus } from '@/lib/store'

const STATUS_BADGE: Record<string, string> = {
  pending:   'badge-yellow',
  confirmed: 'badge-teal',
  completed: 'badge-green',
  cancelled: 'badge-red',
}

const ALL_STATUSES: BookingStatus[] = ['pending', 'confirmed', 'completed', 'cancelled']

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [search, setSearch]     = useState('')
  const [statusFilter, setStatus] = useState<BookingStatus | 'all'>('all')
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    fetch('/api/admin/bookings')
      .then(r => r.json())
      .then(data => { setBookings(data); setLoading(false) })
  }, [])

  async function updateStatus(id: string, status: BookingStatus) {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      const updated = await res.json()
      setBookings(prev => prev.map(b => b.id === id ? updated : b))
    }
  }

  const filtered = bookings.filter(b => {
    const matchStatus = statusFilter === 'all' || b.status === statusFilter
    const q = search.toLowerCase()
    const matchSearch = !q ||
      b.patientName.toLowerCase().includes(q) ||
      b.nurseName.toLowerCase().includes(q) ||
      b.requesterEmail.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  const totalRevenue = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((s, b) => s + b.totalCost, 0)

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-500">Manage all patient bookings</p>
        </div>
        <div className="bg-teal-50 text-teal-800 px-5 py-2.5 rounded-xl text-sm font-medium">
          Revenue: <span className="font-bold">${totalRevenue.toLocaleString()}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input pl-9 text-sm"
            placeholder="Search by patient or nurse…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 flex-wrap">
          {(['all', ...ALL_STATUSES] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                statusFilter === s ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No bookings found.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(b => (
            <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="flex-1 min-w-0">
                  {/* Header row */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-bold text-gray-900">{b.patientName}</span>
                    <span className="text-gray-400 text-sm">→</span>
                    <span className="font-semibold text-teal-700">{b.nurseName}</span>
                    <span className={STATUS_BADGE[b.status] || 'badge-gray'}>
                      {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                    </span>
                  </div>

                  {/* Meta */}
                  <p className="text-xs text-gray-400 mb-2">{b.requesterEmail} · {b.patientContact || b.requesterPhone}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-teal-500" />
                      {b.startDate}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="text-teal-500" />
                      {b.bookingType === 'hourly'
                        ? `${b.hours} hour(s)`
                        : `${b.days} day(s)`}
                    </span>
                    <span className="flex items-center gap-1.5 font-semibold text-gray-900">
                      <DollarSign size={13} className="text-teal-500" />
                      ${b.totalCost}
                    </span>
                  </div>
                  {b.notes && (
                    <p className="mt-2 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg">
                      📝 {b.notes}
                    </p>
                  )}
                </div>

                {/* Status actions */}
                <div className="flex gap-2 flex-wrap flex-shrink-0">
                  {b.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(b.id, 'confirmed')}
                        className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-medium transition-all"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateStatus(b.id, 'cancelled')}
                        className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-all"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {b.status === 'confirmed' && (
                    <button
                      onClick={() => updateStatus(b.id, 'completed')}
                      className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-all"
                    >
                      Mark Complete
                    </button>
                  )}
                  <p className="text-xs text-gray-400 self-center">
                    #{b.id.slice(-6)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
