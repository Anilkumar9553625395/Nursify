'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  FileText, 
  Activity,
  HeartPulse,
  User,
  History,
  ShieldCheck,
  ChevronRight
} from 'lucide-react'

interface Booking {
  id: string
  nurseName: string
  patientName: string
  patientAge: number
  patientGender: string
  diagnosis: string
  clinicalNotes: string
  treatmentPlan: string
  servicesNeeded: string[]
  bookingType: string
  startDate: string
  status: string
  createdAt: string
}

export default function ClinicalHistoryPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Auth check
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(auth => {
        if (!auth.user || auth.user.role !== 'patient') {
          router.push('/login')
          return
        }
        setUser(auth.user)
        // 2. Fetch history (bookings)
        return fetch(`/api/bookings?email=${auth.user.email}`)
      })
      .then(res => res?.json())
      .then(data => {
        if (data) {
          // Sort by date descending
          const sorted = data.sort((a: any, b: any) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          setBookings(sorted)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-medical-bg flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400 font-medium">Loading clinical records...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-medical-bg flex flex-col">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          {/* Back link */}
          <div className="mb-8">
            <Link href="/patient-profile" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 font-bold transition-all">
              <ArrowLeft size={16} /> Back to Profile
            </Link>
          </div>

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                <History className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-navy-900 tracking-tight">Clinical History</h1>
                <p className="text-gray-500 mt-1">Your comprehensive medical journey and care summary</p>
              </div>
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="card p-16 text-center shadow-glass border-dashed border-2 border-gray-200">
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
                <FileText size={40} />
              </div>
              <h2 className="text-2xl font-bold text-navy-900 mb-2">No Clinical Records Found</h2>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                Once you schedule a nurse, your diagnosis and care summaries will appear here as a permanent health record.
              </p>
              <Link href="/find-nurses" className="btn-primary px-8 py-4 inline-flex items-center gap-2">
                Find a Nurse <ChevronRight size={18} />
              </Link>
            </div>
          ) : (
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-emerald-200 before:to-transparent">
              
              {bookings.map((b, idx) => (
                <div key={b.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-emerald-50 text-emerald-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <Activity size={16} />
                  </div>
                  {/* Content */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-3xl bg-white border border-gray-100 shadow-glass hover:shadow-card-hover transition-all duration-300">
                    <div className="flex items-center justify-between space-x-2 mb-4">
                      <div className="font-bold text-navy-900">
                        {new Date(b.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </div>
                      <time className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-wider">
                        #{b.id.slice(-6)}
                      </time>
                    </div>

                    <div className="space-y-4">
                      {/* Patient Name Tag */}
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Patient: {b.patientName}</span>
                      </div>

                      {/* Diagnosis */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Stethoscope size={16} className="text-emerald-500" />
                          <span className="font-bold text-navy-900">Diagnosis</span>
                        </div>
                        <p className="text-sm text-emerald-700 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 font-medium">
                          {b.diagnosis || 'No specific diagnosis recorded'}
                        </p>
                      </div>

                      {/* Clinical Summary */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <FileText size={16} className="text-emerald-500" />
                          <span className="font-bold text-navy-900">Clinical Summary</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100 italic">
                          &quot;{b.clinicalNotes || 'No additional notes provided for this request.'}&quot;
                        </p>
                      </div>

                      {/* Nurse & Services */}
                      <div className="pt-4 border-t border-gray-50 flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                            <User size={14} className="text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Assigned Nurse</p>
                            <p className="text-xs font-bold text-navy-900">{b.nurseName}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {b.servicesNeeded.slice(0, 2).map(s => (
                            <span key={s} className="text-[9px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold uppercase">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          )}

          {/* Emergency Note */}
          <div className="mt-16 bg-navy-900 text-white rounded-3xl p-8 overflow-hidden relative group">
            <ShieldCheck className="absolute -right-4 -bottom-4 text-white/5 group-hover:scale-110 transition-transform duration-700" size={160} />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3 text-emerald-400">
                <HeartPulse size={20} />
                <span className="font-bold uppercase tracking-widest text-xs">Medical Integrity</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Your Secure Health Record</h3>
              <p className="text-navy-100/70 text-sm leading-relaxed max-w-xl">
                This history is a consolidated view of all your care requests. It helps our medical team understand your health journey and provide better, more personalized care over time. Your data is encrypted and only accessible to authorized personnel.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
