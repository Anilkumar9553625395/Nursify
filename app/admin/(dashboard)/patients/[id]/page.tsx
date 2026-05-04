'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User, Mail, Calendar, ArrowLeft, Phone, Clock,
  Stethoscope, FileText, CheckCircle, XCircle, MapPin, Activity
} from 'lucide-react'

interface Patient {
  id: string
  username: string
  email: string
  role: string
  created_at: string
}

interface Booking {
  id: string
  nurseName: string
  patientName: string
  patientAge: number
  patientGender: string
  patientLocation: string
  diagnosis: string
  servicesNeeded: string[]
  bookingType: string
  hours?: number
  days?: number
  startDate: string
  totalCost: number
  status: string
  createdAt: string
}

export default function AdminPatientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/patients').then(r => r.json()),
      fetch('/api/admin/bookings').then(r => r.json()),
    ]).then(([patients, allBookings]) => {
      const found = (Array.isArray(patients) ? patients : []).find((p: Patient) => p.id === id)
      setPatient(found || null)
      if (found) {
        const patBookings = (Array.isArray(allBookings) ? allBookings : []).filter(
          (b: any) => b.requesterEmail?.toLowerCase() === found.email?.toLowerCase()
        )
        setBookings(patBookings)
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading patient details...</p>
        </div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="p-8">
        <div className="card p-16 text-center">
          <XCircle size={40} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-navy-900 mb-2">Patient Not Found</h2>
          <p className="text-gray-400 mb-6">This patient record does not exist.</p>
          <button onClick={() => router.back()} className="btn-secondary">← Go Back</button>
        </div>
      </div>
    )
  }

  const totalSpent = bookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + b.totalCost, 0)

  return (
    <div className="p-8 bg-medical-bg min-h-screen">
      {/* Back */}
      <div className="mb-6">
        <Link href="/admin/patients" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 font-semibold transition-colors">
          <ArrowLeft size={16} /> Back to Patients
        </Link>
      </div>

      {/* Profile header */}
      <div className="card p-6 mb-6 flex items-start gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-medical flex-shrink-0">
          <span className="text-white font-extrabold text-3xl">
            {patient.username?.charAt(0)?.toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-extrabold text-navy-900">{patient.username}</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <Mail size={14} className="text-emerald-500" /> {patient.email}
          </p>
          <p className="text-gray-500 mt-1 flex items-center gap-2 text-sm">
            <Calendar size={14} className="text-emerald-500" />
            Member since {new Date(patient.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex flex-col gap-2 text-right">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-xs font-bold text-emerald-700">
            <CheckCircle size={12} /> Registered Patient
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-5 text-center">
          <p className="text-3xl font-extrabold text-navy-900">{bookings.length}</p>
          <p className="text-sm text-gray-500 mt-1">Total Bookings</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-3xl font-extrabold text-emerald-600">
            {bookings.filter(b => b.status === 'completed').length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Completed</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-3xl font-extrabold text-sapphire-600">₹{totalSpent.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Total Spent</p>
        </div>
      </div>

      {/* Booking history */}
      <div className="card p-6 shadow-card">
        <h2 className="font-bold text-navy-900 flex items-center gap-2 mb-5">
          <FileText size={18} className="text-emerald-500" /> Booking History
        </h2>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-gray-100 flex items-center justify-center">
              <Activity size={22} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">No bookings found for this patient.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => (
              <div key={b.id} className="border border-gray-100 rounded-2xl p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <p className="font-bold text-navy-900">{b.patientName}</p>
                    <p className="text-sm text-gray-500 mt-0.5">Nurse: {b.nurseName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                      b.status === 'completed' ? 'bg-green-50 text-green-700' :
                      b.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                      b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>{b.status}</span>
                    <Link
                      href={`/admin/bookings/${b.id}`}
                      className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Calendar size={12} className="text-emerald-500" />
                    {new Date(b.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Clock size={12} className="text-emerald-500" />
                    {b.bookingType === 'hourly' ? `${b.hours}h` : `${b.days} days`}
                  </div>
                  {b.patientLocation && (
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <MapPin size={12} className="text-emerald-500" />
                      {b.patientLocation}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 font-bold text-navy-900">
                    ₹{b.totalCost.toLocaleString()}
                  </div>
                </div>

                {b.servicesNeeded?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {b.servicesNeeded.slice(0, 3).map((s: string) => (
                      <span key={s} className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full font-medium">
                        {s}
                      </span>
                    ))}
                    {b.servicesNeeded.length > 3 && (
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        +{b.servicesNeeded.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
