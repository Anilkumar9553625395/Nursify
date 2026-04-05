'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Search, Calendar, Clock, DollarSign, User } from 'lucide-react'
import type { Booking } from '@/lib/store'

const STATUS_STYLE: Record<string, string> = {
  pending:   'badge-yellow',
  confirmed: 'badge-teal',
  completed: 'badge-green',
  cancelled: 'badge-red',
}

export default function BookingsPage() {
  const [email, setEmail]       = useState('')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading]   = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    const res = await fetch(`/api/bookings?email=${encodeURIComponent(email)}`)
    const data = await res.json()
    setBookings(data)
    setSearched(true)
    setLoading(false)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-500 mt-1 mb-8">Track all your nurse bookings</p>

          {/* Email lookup */}
          <form onSubmit={handleSearch} className="card p-6 mb-8 flex gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input pl-10"
                placeholder="Enter your email to find bookings…"
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Searching…' : 'Search'}
            </button>
          </form>

          {/* Results */}
          {searched && bookings.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Calendar size={40} className="mx-auto mb-3 opacity-40" />
              No bookings found for this email.
            </div>
          )}

          {bookings.length > 0 && (
            <div className="space-y-4">
              {bookings.map(b => (
                <div key={b.id} className="card p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <h2 className="font-bold text-gray-900 text-lg">{b.nurseName}</h2>
                      <p className="text-sm text-gray-500 mt-0.5">Booking #{b.id.slice(-6)}</p>
                    </div>
                    <span className={STATUS_STYLE[b.status] || 'badge-gray'}>
                      {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={15} className="text-teal-500" />
                      <div>
                        <p className="text-xs text-gray-400">Start date</p>
                        <p>{b.startDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={15} className="text-teal-500" />
                      <div>
                        <p className="text-xs text-gray-400">Duration</p>
                        <p>
                          {b.bookingType === 'hourly'
                            ? `${b.hours} hour${(b.hours ?? 0) > 1 ? 's' : ''}`
                            : `${b.days} day${(b.days ?? 0) > 1 ? 's' : ''}`
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign size={15} className="text-teal-500" />
                      <div>
                        <p className="text-xs text-gray-400">Total cost</p>
                        <p className="font-semibold text-gray-900">${b.totalCost}</p>
                      </div>
                    </div>
                  </div>

                  {b.notes && (
                    <p className="mt-3 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                      📝 {b.notes}
                    </p>
                  )}

                  <p className="text-xs text-gray-400 mt-3">Booked on {b.createdAt}</p>
                </div>
              ))}
            </div>
          )}

          {!searched && (
            <div className="text-center py-16 text-gray-400">
              <User size={40} className="mx-auto mb-3 opacity-40" />
              Enter your email above to view your bookings.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
