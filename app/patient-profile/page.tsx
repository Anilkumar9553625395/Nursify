'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  User, Mail, Phone, MapPin, AlertTriangle, CheckCircle,
  Save, Loader2, Heart, ChevronRight
} from 'lucide-react'

const LOCATIONS = [
  'Banjara Hills', 'Jubilee Hills', 'Madhapur', 'Gachibowli', 'Kondapur',
  'Hitech City', 'Kukatpally', 'Secunderabad', 'Ameerpet', 'Dilsukhnagar',
  'LB Nagar', 'Uppal', 'Kompally', 'Miyapur', 'Manikonda',
  'Nallagandla', 'Attapur', 'Mehdipatnam', 'Shamshabad', 'Other'
]

export default function PatientProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  // Profile fields
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [location, setLocation] = useState(LOCATIONS[0])
  const [emergencyContact, setEmergencyContact] = useState('')
  const [emergencyRelation, setEmergencyRelation] = useState('')

  useEffect(() => {
    // Load auth user + saved profile
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(auth => {
        if (!auth.user || auth.user.role !== 'patient') {
          router.push('/login')
          return
        }
        setUser(auth.user)
        return fetch('/api/auth/profile').then(r => r.json())
      })
      .then(data => {
        if (data?.profile) {
          setPhone(data.profile.phone || '')
          setAddress(data.profile.address || '')
          setLocation(data.profile.location || LOCATIONS[0])
          setEmergencyContact(data.profile.emergencyContact || '')
          setEmergencyRelation(data.profile.emergencyRelation || '')
        }
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false))
  }, [router])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setError('')

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, address, location, emergencyContact, emergencyRelation }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        const d = await res.json()
        setError(d.error || 'Failed to save profile')
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-medical-bg flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
            <span className="text-gray-400 font-medium">Loading profile…</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-medical-bg flex flex-col">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-medical">
              <span className="text-white font-extrabold text-3xl">
                {user?.username?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">{user?.username}</h1>
            <p className="text-gray-500 mt-1 flex items-center justify-center gap-2">
              <Mail size={14} className="text-emerald-500" /> {user?.email}
            </p>
          </div>

          {/* Info banner */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-8 flex items-start gap-3">
            <Heart size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">Why fill this in?</p>
              <p className="text-sm text-emerald-700 mt-0.5">
                Save your contact & address details once — they will be <strong>auto-filled</strong> every time you schedule a nurse, so you never have to type them again!
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Link href="/find-nurses" className="card p-4 flex items-center justify-between group hover:shadow-card-hover transition-all">
              <div>
                <p className="font-bold text-navy-900 text-sm">Find Nurses</p>
                <p className="text-xs text-gray-400">Browse available nurses</p>
              </div>
              <ChevronRight size={16} className="text-emerald-500 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/my-dashboard" className="card p-4 flex items-center justify-between group hover:shadow-card-hover transition-all">
              <div>
                <p className="font-bold text-navy-900 text-sm">My Bookings</p>
                <p className="text-xs text-gray-400">View care requests</p>
              </div>
              <ChevronRight size={16} className="text-emerald-500 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/clinical-history" className="card p-4 flex items-center justify-between group hover:shadow-card-hover transition-all border-emerald-100 bg-emerald-50/20">
              <div>
                <p className="font-bold text-navy-900 text-sm">Clinical History</p>
                <p className="text-xs text-emerald-600 font-medium">Your medical journey</p>
              </div>
              <ChevronRight size={16} className="text-emerald-500 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Profile form */}
          <div className="card p-8 shadow-card">
            <h2 className="text-lg font-bold text-navy-900 mb-6 flex items-center gap-2">
              <User size={20} className="text-emerald-500" /> Contact & Location Details
            </h2>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Phone */}
              <div>
                <label className="label">Your Phone Number</label>
                <div className="relative mt-1.5">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="input pl-10"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="label">Area / Locality in Hyderabad</label>
                <div className="relative mt-1.5">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="input pl-10"
                  >
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="label">Full Address</label>
                <textarea
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  rows={3}
                  className="input resize-none mt-1.5"
                  placeholder="Flat / House No., Street, Landmark…"
                />
              </div>

              <div className="border-t border-gray-100 pt-5">
                <h3 className="font-bold text-navy-900 text-sm mb-4 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-amber-500" /> Emergency Contact
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Emergency Contact Number</label>
                    <input
                      type="tel"
                      value={emergencyContact}
                      onChange={e => setEmergencyContact(e.target.value)}
                      className="input mt-1.5"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="label">Relation to Patient</label>
                    <select
                      value={emergencyRelation}
                      onChange={e => setEmergencyRelation(e.target.value)}
                      className="input mt-1.5"
                    >
                      <option value="">Select relation</option>
                      {['Spouse', 'Parent', 'Child', 'Sibling', 'Son', 'Daughter', 'Friend', 'Other'].map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Error / Success */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-red-500" />
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}
              {saved && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-500" />
                  <p className="text-sm text-emerald-700 font-medium">Profile saved! This will auto-fill your next booking.</p>
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="btn-primary w-full mt-2"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" /> Saving…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Save size={16} /> Save Profile
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
