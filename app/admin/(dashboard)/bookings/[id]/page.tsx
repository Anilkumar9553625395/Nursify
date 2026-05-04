import { getBookingById, getNurseById } from '@/lib/store'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Phone, Mail, MapPin, Calendar, Clock, FileText, AlertCircle, Activity, HeartPulse } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminBookingDetailsPage({ params }: { params: { id: string } }) {
  const booking = await getBookingById(params.id)

  if (!booking) {
    notFound()
  }

  // Fetch the nurse to display their name nicely
  const nurse = await getNurseById(booking.nurseId)

  return (
    <div className="p-8 max-w-5xl mx-auto pb-20">
      <Link href="/admin/bookings" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-teal-600 mb-6 font-medium transition-colors">
        <ArrowLeft size={16} /> Back to Bookings
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-sapphire-50/50 to-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">Care Request #{booking.id.slice(-6)}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                  booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                  booking.status === 'confirmed' || booking.status === 'assigned' ? 'bg-teal-100 text-teal-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {booking.status === 'confirmed' ? 'assigned' : booking.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Calendar size={14} className="text-sapphire-500" />
                Submitted on {new Date(booking.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="bg-sapphire-50 px-5 py-3 rounded-xl border border-sapphire-100 text-right">
              <p className="text-xs font-bold text-sapphire-700 uppercase tracking-widest mb-1">Total Cost</p>
              <p className="text-xl font-extrabold text-gray-900">${booking.totalCost}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User size={18} className="text-sapphire-500" /> Patient Information
                </h2>
                <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Patient Name</p>
                    <p className="text-sm font-semibold text-gray-900">{booking.patientName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Age</p>
                      <p className="text-sm font-semibold text-gray-900">{booking.patientAge} Years</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Gender</p>
                      <p className="text-sm font-semibold text-gray-900">{booking.patientGender}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Service Address</p>
                    <p className="text-sm text-gray-900 flex items-start gap-1.5">
                      <MapPin size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                      {booking.patientAddress} ({booking.patientLocation})
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Phone size={18} className="text-sapphire-500" /> Contact Details
                </h2>
                <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Requester Account</p>
                    <p className="text-sm font-semibold text-gray-900">{booking.requesterName} <span className="text-gray-400 font-normal">({booking.relationToPatient})</span></p>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5"><Mail size={14} /> {booking.requesterEmail}</p>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5"><Phone size={14} /> {booking.requesterPhone}</p>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Patient Direct Contact</p>
                    <p className="text-sm font-semibold text-gray-900">{booking.patientContact || 'Same as requester'}</p>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 text-red-500">Emergency Contact</p>
                    <p className="text-sm font-semibold text-gray-900">{booking.emergencyContact}</p>
                    <p className="text-xs text-gray-500 mt-1">Relation: {booking.emergencyRelation}</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText size={18} className="text-sapphire-500" /> Consent & Documents
                </h2>
                <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Decision Making</p>
                    <p className="text-sm text-gray-900">
                      {booking.canMakeDecisions 
                        ? 'Patient has capacity to make medical decisions.' 
                        : 'Patient CANNOT make decisions. Proxy required.'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Consent Signed By</p>
                    <p className="text-sm font-semibold text-gray-900 capitalize">{booking.consentSignedBy}</p>
                  </div>
                  {booking.consentSignedBy === 'relative' && (
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Relative Details</p>
                      <p className="text-sm text-gray-900">Relation: {booking.relativeRelation}</p>
                      <p className="text-sm text-gray-900 mt-1">Aadhar/ID: <span className="font-mono bg-gray-100 px-1 rounded">{booking.relativeAadhar}</span></p>
                      <p className="text-sm text-gray-900 mt-1">Reason: {booking.noConsentReason}</p>
                    </div>
                  )}
                  <div className="pt-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Patient Documents</p>
                    <p className="text-sm text-gray-500 italic">No external documents uploaded.</p>
                    <p className="text-[10px] text-gray-400 mt-2 flex items-start gap-1">
                      <FileText size={12} className="flex-shrink-0 mt-0.5" />
                      *Note: The platform does not currently collect document uploads (like prescriptions) during booking. All clinical data is provided via text fields.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <HeartPulse size={18} className="text-sapphire-500" /> Clinical Needs
                </h2>
                <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Primary Diagnosis / Condition</p>
                    <p className="text-sm font-semibold text-gray-900">{booking.diagnosis}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Clinical Notes</p>
                    <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200">{booking.clinicalNotes}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Recent Hospital Admissions:</p>
                    <p className={`text-xs font-bold px-2 py-0.5 rounded ${booking.recentAdmissions ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-700'}`}>
                      {booking.recentAdmissions ? 'YES' : 'NO'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Services Needed</p>
                    <div className="flex flex-wrap gap-2">
                      {booking.servicesNeeded && booking.servicesNeeded.length > 0 ? (
                        booking.servicesNeeded.map(s => (
                          <span key={s} className="px-2.5 py-1 bg-white text-sapphire-700 rounded-lg text-xs font-medium border border-sapphire-100 shadow-sm">{s}</span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">Not specified</span>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-sapphire-500" /> Scheduling
                </h2>
                <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Assigned Nurse</p>
                    <Link href={`/admin/nurses/${booking.nurseId}`} className="text-sm font-bold text-teal-600 hover:underline">
                      {booking.nurseName} {nurse ? `(${nurse.regNumber})` : ''}
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Start Date</p>
                      <p className="text-sm font-semibold text-gray-900">{booking.startDate}</p>
                    </div>
                    {booking.endDate && (
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">End Date</p>
                        <p className="text-sm font-semibold text-gray-900">{booking.endDate}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Duration</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {booking.bookingType === 'hourly' ? `${booking.hours} hours` : `${booking.days} days`}
                    </p>
                  </div>
                  {booking.notes && (
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Additional Notes</p>
                      <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200">{booking.notes}</p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
