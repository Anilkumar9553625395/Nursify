'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Search, Calendar, Clock, DollarSign, User, Activity, FileText, MapPin, Stethoscope, CheckCircle } from 'lucide-react'
import type { Booking } from '@/lib/store'

const STATUS_STYLE: Record<string, string> = {
  pending:   'badge-yellow',
  assigned:  'badge-emerald',
  completed: 'badge-green',
  // Legacy support
  confirmed: 'badge-emerald',
  cancelled: 'badge-red',
}

const STATUS_DOT: Record<string, string> = {
  pending:   'bg-amber-400',
  assigned:  'bg-emerald-500',
  completed: 'bg-green-500',
  confirmed: 'bg-emerald-500',
  cancelled: 'bg-red-400',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending Review',
  assigned: 'Nurse Assigned',
  completed: 'Care Completed',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
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
      <main className="min-h-screen bg-medical-bg pb-16">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 gradient-hero" />
          <div className="absolute inset-0 medical-pattern opacity-50" />
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5 border border-white/10">
              <Stethoscope size={13} className="text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Care Tracker</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">My Care Requests</h1>
            <p className="text-gray-300 mt-2">Track and manage all your nursing care requests</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
          {/* Status legend */}
          <div className="flex items-center gap-4 justify-center mb-6 text-xs">
            {[
              { label: 'Pending', color: 'bg-amber-400' },
              { label: 'Assigned', color: 'bg-emerald-500' },
              { label: 'Completed', color: 'bg-green-500' },
            ].map(s => (
              <span key={s.label} className="flex items-center gap-1.5 text-gray-500 font-medium">
                <span className={`w-2 h-2 rounded-full ${s.color}`} />
                {s.label}
              </span>
            ))}
          </div>

          {/* Email lookup */}
          <form onSubmit={handleSearch} className="card p-6 mb-8 flex gap-3 shadow-glass-lg">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input pl-11"
                placeholder="Enter your email to find care requests…"
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Searching…
                </span>
              ) : (
                <span className="flex items-center gap-2"><Search size={15} /> Search</span>
              )}
            </button>
          </form>

          {/* Results */}
          {searched && bookings.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                <Calendar size={28} className="text-gray-300" />
              </div>
              <p className="text-gray-400 font-medium">No care requests found for this email.</p>
              <p className="text-gray-400 text-sm mt-1">Make sure you&apos;re using the email you scheduled with.</p>
            </div>
          )}

          {bookings.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 font-medium flex items-center gap-2 mb-2">
                <Activity size={14} className="text-emerald-500" />
                {bookings.length} care request{bookings.length !== 1 ? 's' : ''} found
              </p>
              {bookings.map(b => (
                <div key={b.id} className="card-hover p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                    <div>
                      <h2 className="font-bold text-navy-900 text-lg flex items-center gap-2">
                        {b.nurseName}
                        <span className="text-xs font-medium text-gray-400">→ {b.patientName}</span>
                      </h2>
                      <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
                        <FileText size={11} /> Care Request #{b.id.slice(-6)}
                      </p>
                    </div>
                    <span className={`${STATUS_STYLE[b.status] || 'badge-gray'} flex items-center gap-1.5`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[b.status] || 'bg-gray-400'}`} />
                      {STATUS_LABELS[b.status] || b.status}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-3 text-gray-600 bg-gray-50 rounded-xl p-3">
                      <Calendar size={16} className="text-emerald-500 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Start Date</p>
                        <p className="font-semibold text-navy-900">{b.startDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 bg-gray-50 rounded-xl p-3">
                      <Clock size={16} className="text-sapphire-500 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Duration</p>
                        <p className="font-semibold text-navy-900">
                          {b.bookingType === 'hourly'
                            ? `${b.hours} hour${(b.hours ?? 0) > 1 ? 's' : ''}`
                            : `${b.days} day${(b.days ?? 0) > 1 ? 's' : ''}`
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 bg-gray-50 rounded-xl p-3">
                      <DollarSign size={16} className="text-emerald-500 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Total Cost</p>
                        <p className="font-bold text-navy-900 text-lg">${b.totalCost}</p>
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  {b.servicesNeeded && b.servicesNeeded.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {b.servicesNeeded.map(s => <span key={s} className="badge-emerald text-[10px]">{s}</span>)}
                    </div>
                  )}

                  {/* Location */}
                  {b.patientLocation && (
                    <p className="mt-3 text-xs text-gray-500 flex items-center gap-1.5">
                      <MapPin size={11} className="text-emerald-500" /> {b.patientLocation}
                    </p>
                  )}

                  {b.notes && (
                    <p className="mt-3 text-sm text-gray-500 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100">
                      📝 {b.notes}
                    </p>
                  )}

                  <p className="text-xs text-gray-400 mt-4 flex items-center gap-1.5">
                    <Clock size={11} /> Requested on {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          )}

          {!searched && (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <User size={28} className="text-emerald-300" />
              </div>
              <p className="text-gray-500 font-medium">Enter your email above to view your care requests.</p>
              <p className="text-gray-400 text-sm mt-1">We&apos;ll find all care requests associated with your email.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
