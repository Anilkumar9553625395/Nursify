import { getNurseById } from '@/lib/store'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, User, Phone, Mail, MapPin, Briefcase, Star, Clock, Calendar, CheckCircle, Shield, FileText } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminNurseDetailsPage({ params }: { params: { id: string } }) {
  const nurse = await getNurseById(params.id)

  if (!nurse) {
    notFound()
  }

  return (
    <div className="p-8 max-w-5xl mx-auto pb-20">
      <Link href="/admin/nurses" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-teal-600 mb-6 font-medium transition-colors">
        <ArrowLeft size={16} /> Back to Nurses
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-teal-50/50 to-white">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-teal-100 flex-shrink-0 shadow-sm border border-teal-200/50">
              {nurse.photo ? (
                <Image src={nurse.photo} alt={nurse.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-teal-500">
                  {nurse.name.charAt(0)}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{nurse.name}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  nurse.status === 'approved' ? 'bg-green-100 text-green-700' :
                  nurse.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {nurse.status}
                </span>
                <span className="flex items-center gap-1 bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-bold border border-teal-100">
                  <Star size={12} fill="currentColor" /> {nurse.rating > 0 ? nurse.rating : 'New'}
                </span>
              </div>
              <p className="text-gray-500 text-sm flex flex-wrap gap-4 mt-2">
                <span className="flex items-center gap-1.5"><Mail size={14} className="text-teal-500" /> {nurse.email}</span>
                <span className="flex items-center gap-1.5"><Phone size={14} className="text-teal-500" /> {nurse.phone}</span>
                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-teal-500" /> {nurse.location}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase size={18} className="text-teal-500" /> Professional Details
                </h2>
                <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Experience</p>
                    <p className="text-sm font-semibold text-gray-900">{nurse.experience} Years</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Availability</p>
                    <p className="text-sm font-semibold text-gray-900">{nurse.availability}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Rates</p>
                    <p className="text-sm font-semibold text-gray-900">${nurse.hourlyRate}/hr • ${nurse.dailyRate}/day</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Specializations</p>
                    <div className="flex flex-wrap gap-2">
                      {nurse.specializations.map(s => (
                        <span key={s} className="px-2.5 py-1 bg-teal-50 text-teal-700 rounded-lg text-xs font-medium border border-teal-100">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Languages</p>
                    <div className="flex flex-wrap gap-2">
                      {nurse.languages.map(l => (
                        <span key={l} className="px-2.5 py-1 bg-white text-gray-600 rounded-lg text-xs font-medium border border-gray-200 shadow-sm">{l}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User size={18} className="text-teal-500" /> Bio & Qualifications
                </h2>
                <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Qualifications</p>
                    <p className="text-sm text-gray-700">{nurse.qualifications}</p>
                  </div>
                  {nurse.bio && (
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Bio</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{nurse.bio}</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield size={18} className="text-teal-500" /> Registration & Documents
                </h2>
                <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Registration Number</p>
                    <p className="text-sm font-mono font-semibold text-gray-900 bg-white px-3 py-1.5 rounded-lg border border-gray-200 inline-block">{nurse.regNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Registration State</p>
                    <p className="text-sm font-semibold text-gray-900">{nurse.regState}</p>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Uploaded Documents</p>
                    {/* The platform currently only requires a profile photo during registration. Future iterations will support PDF document uploads. */}
                    {nurse.photo ? (
                      <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl">
                        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                          <Image src={nurse.photo} alt="Photo" width={40} height={40} className="rounded-lg object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Profile Photo</p>
                          <p className="text-xs text-gray-500">Image • Image.jpg</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No documents uploaded.</p>
                    )}
                    <p className="text-[10px] text-gray-400 mt-3 flex items-start gap-1">
                      <FileText size={12} className="flex-shrink-0 mt-0.5" />
                      *Note: The platform currently only collects profile photos during initial registration. Official document uploads will be enabled in a future update.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar size={18} className="text-teal-500" /> System Details
                </h2>
                <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Database ID</p>
                    <p className="text-sm font-mono text-gray-500 break-all">{nurse.id}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Registered On</p>
                    <p className="text-sm font-semibold text-gray-900">{new Date(nurse.createdAt).toLocaleString()}</p>
                  </div>
                  {nurse.adminComments && (
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Internal Admin Notes</p>
                      <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200">{nurse.adminComments}</p>
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
