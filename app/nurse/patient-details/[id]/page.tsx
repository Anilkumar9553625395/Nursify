'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { 
  User, 
  Phone, 
  MapPin, 
  Stethoscope, 
  FileText, 
  Calendar, 
  Clock, 
  ArrowLeft,
  History,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Download,
  Activity,
  HeartPulse
} from 'lucide-react'

interface Booking {
  id: string
  requesterName: string
  requesterEmail: string
  requesterPhone: string
  patientName: string
  patientAge: number
  patientGender: string
  patientAddress: string
  patientLocation: string
  patientContact: string
  emergencyContact: string
  emergencyRelation: string
  diagnosis: string
  clinicalNotes: string
  recentAdmissions: boolean
  treatmentPlan: string
  servicesNeeded: string[]
  bookingType: string
  startDate: string
  status: string
  documents?: string
  createdAt: string
}

export default function NursePatientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [history, setHistory] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Fetch current booking details
    fetch(`/api/admin/bookings`) // We can reuse admin booking fetch or dedicated one
      .then(r => r.json())
      .then(allBookings => {
        const found = allBookings.find((b: any) => b.id === id)
        if (!found) {
          router.push('/my-application')
          return
        }
        setBooking(found)

        // 2. Fetch clinical history for this patient (by email)
        const patientEmail = found.requesterEmail || found.patientEmail
        return fetch(`/api/bookings?email=${patientEmail}`)
      })
      .then(res => res?.json())
      .then(data => {
        if (data) {
          // Filter out current booking and sort
          setHistory(data.filter((h: any) => h.id !== id))
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-medical-bg flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400 font-medium">Loading patient records...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!booking) return null

  return (
    <div className="min-h-screen bg-medical-bg flex flex-col">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <Link href="/my-application" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 font-bold transition-all">
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
            <div className="flex items-center gap-2">
              <span className="badge-emerald px-3 py-1.5 text-[10px] uppercase tracking-widest font-black">Professional Access</span>
              <span className="badge-blue px-3 py-1.5 text-[10px] uppercase tracking-widest font-black">Request ID: #{booking.id.slice(-6)}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Column: Patient Profile */}
            <div className="lg:col-span-1 space-y-6">
              <div className="card p-8 text-center shadow-card border-t-4 border-t-emerald-500">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-medical">
                  <span className="text-white font-black text-4xl">{booking.patientName.charAt(0)}</span>
                </div>
                <h1 className="text-2xl font-black text-navy-900">{booking.patientName}</h1>
                <p className="text-gray-500 font-medium">{booking.patientAge} Years • {booking.patientGender}</p>
                
                <div className="mt-8 pt-8 border-t border-gray-100 space-y-4 text-left">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                      <Phone size={14} className="text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Contact</p>
                      <p className="font-bold text-navy-900">{booking.patientContact || booking.requesterPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                      <MapPin size={14} className="text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Location</p>
                      <p className="font-bold text-navy-900">{booking.patientLocation}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="card p-6 bg-amber-50 border-amber-100 shadow-sm">
                <h3 className="text-sm font-black text-amber-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-amber-500" /> Emergency Contact
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] text-amber-700 font-bold uppercase">Relationship</p>
                    <p className="font-bold text-navy-900">{booking.emergencyRelation || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-amber-700 font-bold uppercase">Phone Number</p>
                    <p className="font-bold text-navy-900">{booking.emergencyContact || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Vetting Badge */}
              <div className="bg-navy-900 rounded-3xl p-6 text-white overflow-hidden relative group">
                <ShieldCheck className="absolute -right-4 -bottom-4 text-white/5 group-hover:scale-110 transition-transform duration-700" size={100} />
                <div className="relative z-10">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-400" /> Secure Data
                  </h4>
                  <p className="text-[11px] text-navy-200 leading-relaxed">
                    This information is shared only after admin verification. HIPAA/DPDP guidelines apply to all patient data handling.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Clinical Details & History */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Current Clinical Summary */}
              <div className="card p-8 shadow-glass relative overflow-hidden">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <Stethoscope size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-navy-900 tracking-tight">Clinical Overview</h2>
                    <p className="text-sm text-gray-500 font-medium">Detailed care requirements for this request</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Primary Diagnosis</h4>
                      <p className="text-lg font-bold text-emerald-700 bg-emerald-50 px-4 py-3 rounded-2xl border border-emerald-100">
                        {booking.diagnosis || 'No diagnosis provided'}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Care Summary</h4>
                      <p className="text-sm text-gray-600 leading-relaxed italic">
                        &quot;{booking.clinicalNotes}&quot;
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Services Requested</h4>
                      <div className="flex flex-wrap gap-2">
                        {booking.servicesNeeded.map(s => (
                          <span key={s} className="px-3 py-1.5 bg-navy-900 text-white text-[10px] font-bold rounded-lg uppercase tracking-tight">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    {booking.treatmentPlan && (
                      <div>
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Treatment Plan</h4>
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                          <p className="text-xs text-gray-600 leading-relaxed">{booking.treatmentPlan}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Documents Section */}
                <div className="mt-10 pt-8 border-t border-gray-100">
                  <h3 className="text-sm font-black text-navy-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FileText size={16} className="text-emerald-500" /> Attached Medical Reports
                  </h3>
                  {booking.documents ? (
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <FileText size={24} className="text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-bold text-navy-900">Patient Reports Package</p>
                          <p className="text-xs text-gray-500">Shared via External Cloud Storage</p>
                        </div>
                      </div>
                      <a 
                        href={booking.documents} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-primary px-6 py-3 text-sm inline-flex items-center gap-2 shadow-emerald-200"
                      >
                        Access Documents <ExternalLink size={16} />
                      </a>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-2xl p-8 text-center border-dashed border-2 border-gray-200">
                      <p className="text-gray-400 text-sm italic">No medical reports were attached to this request.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Clinical History Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                    <History size={20} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-2xl font-black text-navy-900 tracking-tight">Patient Clinical History</h2>
                </div>

                {history.length === 0 ? (
                  <div className="card p-10 text-center border-dashed border-2 border-gray-100">
                    <p className="text-gray-400 text-sm">No previous care history found for this patient on our platform.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {history.map(h => (
                      <div key={h.id} className="card p-6 flex items-start gap-5 hover:border-emerald-200 transition-all">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                          <Activity size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-4 mb-2">
                            <span className="text-xs font-bold text-gray-400 uppercase">{new Date(h.createdAt).toLocaleDateString()}</span>
                            <span className="text-[10px] font-black text-emerald-600 uppercase">#{h.id.slice(-6)}</span>
                          </div>
                          <h4 className="font-bold text-navy-900 mb-1">{h.diagnosis || 'General Care Request'}</h4>
                          <p className="text-xs text-gray-500 line-clamp-2 italic">&quot;{h.clinicalNotes}&quot;</p>
                          <div className="mt-3 flex flex-wrap gap-1">
                            {h.servicesNeeded.slice(0, 3).map(s => (
                              <span key={s} className="text-[8px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full font-black uppercase">{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Address Details */}
              <div className="card p-8 bg-gray-50 border-gray-100">
                <h3 className="text-sm font-black text-navy-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <MapPin size={16} className="text-emerald-500" /> Exact Care Location
                </h3>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <p className="text-lg font-bold text-navy-900 leading-tight mb-2">{booking.patientLocation}</p>
                  <p className="text-gray-600 leading-relaxed">{booking.patientAddress}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
