'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Edit2, X, Save, MapPin, Loader2 } from 'lucide-react'
import { LOCATIONS } from '@/lib/constants'
import type { Nurse } from '@/lib/store'

export default function EditNurseProfile({ nurse }: { nurse: Nurse }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const [phone, setPhone] = useState(nurse.phone || '')
  const [location, setLocation] = useState(nurse.location || '')
  const [hourlyRate, setHourlyRate] = useState(nurse.hourlyRate?.toString() || '')
  const [dailyRate, setDailyRate] = useState(nurse.dailyRate?.toString() || '')
  const [bio, setBio] = useState(nurse.bio || '')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/nurses/${nurse.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          location,
          hourlyRate: Number(hourlyRate),
          dailyRate: Number(dailyRate),
          bio
        })
      })

      if (res.ok) {
        setIsOpen(false)
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to update profile')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-white text-emerald-600 border border-emerald-200 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-sm text-sm"
      >
        <Edit2 size={16} /> Edit Profile
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-extrabold text-navy-900">Edit Profile</h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-1 bg-gray-50 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Phone Number *</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} className="input" required />
            </div>

            <div>
              <label className="label flex items-center gap-1.5"><MapPin size={14} className="text-emerald-500" /> Primary Service Area *</label>
              <input list="edit-locations-list" value={location} onChange={e => setLocation(e.target.value)} className="input" placeholder="Enter or select area" required />
              <datalist id="edit-locations-list">
                {LOCATIONS.map(l => <option key={l} value={l} />)}
              </datalist>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Hourly Rate (₹) *</label>
                <input type="number" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} className="input" required />
              </div>
              <div>
                <label className="label">Daily Rate (₹)</label>
                <input type="number" value={dailyRate} onChange={e => setDailyRate(e.target.value)} className="input" />
              </div>
            </div>

            <div>
              <label className="label">Professional Bio *</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} className="input resize-none" rows={4} required />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button type="button" onClick={() => setIsOpen(false)} className="btn-secondary px-6">
            Cancel
          </button>
          <button type="submit" form="edit-profile-form" disabled={loading} className="btn-primary px-8 flex items-center gap-2">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
