'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Users, Search, Mail, Calendar, User, ArrowRight, PhoneCall } from 'lucide-react'

interface Patient {
  id: string
  username: string
  email: string
  role: string
  created_at: string
  bookingCount?: number
}

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/patients').then(r => r.json()),
      fetch('/api/admin/bookings').then(r => r.json()),
    ]).then(([p, b]) => {
      const patientsWithCount = (Array.isArray(p) ? p : []).map((pat: Patient) => ({
        ...pat,
        bookingCount: (Array.isArray(b) ? b : []).filter(
          (bk: any) => bk.requesterEmail?.toLowerCase() === pat.email?.toLowerCase()
        ).length,
      }))
      setPatients(patientsWithCount)
      setBookings(Array.isArray(b) ? b : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filtered = patients.filter(p => {
    const q = search.toLowerCase()
    return !q || p.username?.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q)
  })

  return (
    <div className="p-8 bg-medical-bg min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight flex items-center gap-2">
            <Users size={24} className="text-emerald-500" /> Registered Patients
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            All patients who have signed up on Nursify.
          </p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full">
          <span className="text-emerald-700 font-bold text-sm">{patients.length} Total Patients</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="card p-5">
          <p className="text-3xl font-extrabold text-navy-900">{patients.length}</p>
          <p className="text-sm text-gray-500 mt-1">Total Registered</p>
        </div>
        <div className="card p-5">
          <p className="text-3xl font-extrabold text-emerald-600">
            {patients.filter(p => p.bookingCount! > 0).length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Patients with Bookings</p>
        </div>
        <div className="card p-5">
          <p className="text-3xl font-extrabold text-sapphire-600">
            {patients.filter(p => {
              const d = new Date(p.created_at)
              const now = new Date()
              return now.getTime() - d.getTime() < 7 * 24 * 60 * 60 * 1000
            }).length}
          </p>
          <p className="text-sm text-gray-500 mt-1">New This Week</p>
        </div>
      </div>

      {/* Search */}
      <div className="card p-5 mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-10 w-full md:w-80"
          />
        </div>
      </div>

      {/* Patients table */}
      {loading ? (
        <div className="card p-16 text-center">
          <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Loading patients...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
            <Users size={28} className="text-gray-300" />
          </div>
          <p className="text-gray-400 font-medium">No patients found</p>
        </div>
      ) : (
        <div className="card overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Registered</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Bookings</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-emerald-700 font-bold text-sm">
                            {p.username?.charAt(0)?.toUpperCase() || 'P'}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-navy-900 text-sm">{p.username}</p>
                          <p className="text-xs text-gray-400">Patient</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} className="text-gray-400" />
                        {p.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} className="text-gray-400" />
                        {new Date(p.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                        p.bookingCount! > 0
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {p.bookingCount} booking{p.bookingCount !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/patients/${p.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        View Details <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
