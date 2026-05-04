'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, XCircle, Clock, Search, Star, User } from 'lucide-react'
import type { Nurse, NurseStatus } from '@/lib/store'

const TAB_OPTIONS: { label: string; value: NurseStatus | 'all' }[] = [
  { label: 'All',      value: 'all' },
  { label: 'Pending',  value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
]

const STATUS_BADGE: Record<string, string> = {
  approved: 'badge-green',
  pending:  'badge-yellow',
  rejected: 'badge-red',
}

export default function AdminNursesPage() {
  const [nurses, setNurses]   = useState<Nurse[]>([])
  const [tab, setTab]         = useState<NurseStatus | 'all'>('all')
  const [search, setSearch]   = useState('')
  const [comments, setComments] = useState<Record<string, string>>({})
  const [updating, setUpdating] = useState<string | null>(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    fetch('/api/admin/nurses')
      .then(r => r.json())
      .then(data => { 
        setNurses(Array.isArray(data) ? data : [])
        const initialComments: Record<string, string> = {}
        if (Array.isArray(data)) {
          data.forEach((n: Nurse) => { initialComments[n.id] = n.adminComments || '' })
        }
        setComments(initialComments)
        setLoading(false) 
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  async function updateStatus(id: string, status: NurseStatus) {
    setUpdating(id)
    const res = await fetch(`/api/admin/nurses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminComments: comments[id] }),
    })
    if (res.ok) {
      const updated = await res.json()
      setNurses(prev => prev.map(n => n.id === id ? updated : n))
    }
    setUpdating(null)
  }

  const filtered = nurses.filter(n => {
    const matchTab    = tab === 'all' || n.status === tab
    const matchSearch = !search || (n.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (n.email?.toLowerCase() || '').includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Nurses</h1>
      <p className="text-gray-500 mb-6">Manage nurse registrations and approvals</p>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input pl-9 text-sm"
            placeholder="Search nurses…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {TAB_OPTIONS.map(t => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                tab === t.value ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
              <span className="ml-1.5 text-xs text-gray-400">
                ({nurses.filter(n => t.value === 'all' ? true : n.status === t.value).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No nurses found.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map(nurse => (
            <div key={nurse.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* Avatar */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-teal-50 flex-shrink-0">
                  {nurse.photo ? (
                    <Image src={nurse.photo} alt={nurse.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-teal-300">
                      {nurse.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="font-bold text-gray-900">{nurse.name}</h2>
                    <span className={STATUS_BADGE[nurse.status] || 'badge-gray'}>
                      {nurse.status.charAt(0).toUpperCase() + nurse.status.slice(1)}
                    </span>
                    {nurse.rating > 0 && (
                      <span className="flex items-center gap-1 text-xs text-yellow-600 font-medium">
                        <Star size={12} fill="currentColor" /> {nurse.rating} ({nurse.reviewCount})
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{nurse.email} · {nurse.phone}</p>
                  
                  {/* Admin Comments Section */}
                  <div className="mt-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Internal Notes / Feedback to Nurse</label>
                    <textarea
                      className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all placeholder:text-gray-300"
                      placeholder="Add suggestions or rejection reasons..."
                      value={comments[nurse.id] || ''}
                      onChange={e => setComments(prev => ({ ...prev, [nurse.id]: e.target.value }))}
                      rows={2}
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    <span className="badge-gray font-mono">{nurse.regNumber}</span>
                    <span className="badge-gray">{nurse.regState}</span>
                    <span className="badge-gray">{nurse.experience}yr exp</span>
                    <span className="badge-gray">{nurse.availability}</span>
                    <span className="badge-gray">${nurse.hourlyRate}/hr</span>
                    {nurse.specializations.slice(0, 3).map(s => (
                      <span key={s} className="badge-teal">{s}</span>
                    ))}
                  </div>

                  {nurse.bio && (
                    <p className="text-sm text-gray-500 mt-3 line-clamp-2">{nurse.bio}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2 flex-shrink-0 w-full lg:w-36">
                  <Link href={`/admin/nurses/${nurse.id}`} className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-bold transition-all mb-2">
                    View Details
                  </Link>
                  {nurse.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(nurse.id, 'approved')}
                        disabled={updating === nurse.id}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                      >
                        <CheckCircle size={15} /> Approve
                      </button>
                      <button
                        onClick={() => updateStatus(nurse.id, 'rejected')}
                        disabled={updating === nurse.id}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                      >
                        <XCircle size={15} /> Reject
                      </button>
                    </>
                  )}
                  {nurse.status === 'approved' && (
                    <>
                      <button
                        onClick={() => updateStatus(nurse.id, 'approved')}
                        disabled={updating === nurse.id}
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-teal-200 text-teal-600 hover:bg-teal-50 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                      >
                        Save Notes
                      </button>
                      <button
                        onClick={() => updateStatus(nurse.id, 'rejected')}
                        disabled={updating === nurse.id}
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                      >
                        <XCircle size={15} /> Suspend
                      </button>
                    </>
                  )}
                  {nurse.status === 'rejected' && (
                    <>
                      <button
                        onClick={() => updateStatus(nurse.id, 'rejected')}
                        disabled={updating === nurse.id}
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                      >
                        Save Notes
                      </button>
                      <button
                        onClick={() => updateStatus(nurse.id, 'approved')}
                        disabled={updating === nurse.id}
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-teal-200 text-teal-600 hover:bg-teal-50 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                      >
                        <CheckCircle size={15} /> Re-approve
                      </button>
                    </>
                  )}
                  <p className="text-[10px] font-bold text-gray-400 text-center mt-2 uppercase tracking-widest">
                    <Clock size={11} className="inline mr-1 -mt-0.5" />
                    Joined {new Date(nurse.createdAt).toLocaleDateString()}
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
