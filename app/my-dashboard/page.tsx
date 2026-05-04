import { getAuthUser } from '@/lib/auth'
import { getBookingsByEmail } from '@/lib/store'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { 
  HeartPulse, 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  MapPin, 
  Activity,
  IndianRupee,
  ArrowRight,
  Stethoscope
} from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const STATUS_STYLE: Record<string, string> = {
  pending:   'badge-yellow',
  assigned:  'badge-emerald',
  completed: 'badge-green',
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

export default async function MyDashboardPage() {
  const user = getAuthUser()

  if (!user) {
    redirect('/login')
  }

  if (user.role !== 'patient') {
    redirect('/')
  }

  const bookings = await getBookingsByEmail(user.email)

  return (
    <div className="min-h-screen bg-medical-bg flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 py-16">
        <div className="mb-10">
          <span className="section-label group flex items-center gap-2 w-fit px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs uppercase tracking-widest border border-emerald-100 hover:bg-emerald-100 transition-all cursor-default">
            <HeartPulse size={14} className="group-hover:scale-110 transition-transform" />
            Patient Dashboard
          </span>
          <h1 className="text-4xl font-extrabold text-navy-900 mt-4 tracking-tight">My Care Requests</h1>
          <p className="text-gray-500 mt-2 text-lg">Track and manage all your nursing care requests</p>
        </div>

        {bookings.length === 0 ? (
          <div className="card p-12 text-center shadow-glass border-dashed border-2 border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-400">
              <Calendar size={40} />
            </div>
            <h2 className="text-2xl font-bold text-navy-900 mb-2">No Care Requests</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              You haven't submitted any care requests yet. Find a nurse and schedule care when you're ready.
            </p>
            <Link href="/find-nurses" className="btn-primary px-8 py-4 text-lg inline-flex items-center gap-2">
              Find a Nurse <ArrowRight size={20} />
            </Link>
          </div>
        ) : (
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
                    <IndianRupee size={16} className="text-emerald-500 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Total Cost</p>
                      <p className="font-bold text-navy-900 text-lg">₹{b.totalCost}</p>
                    </div>
                  </div>
                </div>

                {/* Diagnosis & Clinical Summary */}
                {(b.diagnosis || b.clinicalNotes) && (
                  <div className="mt-4 p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Stethoscope size={14} className="text-emerald-500" />
                      <span className="text-xs font-bold text-navy-900 uppercase tracking-wider">Condition Details</span>
                    </div>
                    {b.diagnosis && (
                      <p className="text-sm font-bold text-navy-900 mb-1">
                        Diagnosis: <span className="text-emerald-700">{b.diagnosis}</span>
                      </p>
                    )}
                    {b.clinicalNotes && (
                      <p className="text-xs text-gray-600 italic leading-relaxed">
                        &quot;{b.clinicalNotes}&quot;
                      </p>
                    )}
                  </div>
                )}

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
      </main>

      <Footer />
    </div>
  )
}
