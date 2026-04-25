import { getAuthUser } from '@/lib/auth'
import { getNurseByEmail } from '@/lib/store'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  MessageSquare, 
  FileText, 
  ShieldCheck,
  ArrowRight,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function MyApplicationPage() {
  const user = getAuthUser()

  if (!user) {
    redirect('/login')
  }

  if (user.role !== 'nurse') {
    redirect('/')
  }

  const nurse = await getNurseByEmail(user.email)

  return (
    <div className="min-h-screen bg-medical-bg flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 py-16">
        <div className="mb-10">
          <span className="section-label group flex items-center gap-2 w-fit px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs uppercase tracking-widest border border-emerald-100 hover:bg-emerald-100 transition-all cursor-default">
            <ShieldCheck size={14} className="group-hover:scale-110 transition-transform" />
            Vetted Professional
          </span>
          <h1 className="text-4xl font-extrabold text-navy-900 mt-4 tracking-tight">Your Application</h1>
          <p className="text-gray-500 mt-2 text-lg">Track your vetting status and platform approval</p>
        </div>

        {!nurse ? (
          <div className="card p-12 text-center shadow-glass border-dashed border-2 border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-400">
              <FileText size={40} />
            </div>
            <h2 className="text-2xl font-bold text-navy-900 mb-2">Application Not Found</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              You haven't submitted your professional details yet. Complete your profile to start receiving care requests.
            </p>
            <Link href="/register" className="btn-primary px-8 py-4 text-lg inline-flex items-center gap-2">
              Complete Registration <ArrowRight size={20} />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status Card */}
            <div className="card p-8 shadow-glass overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <TrendingUp size={120} />
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1 font-mono">Current Status</p>
                  <div className="flex items-center gap-3">
                    {nurse.status === 'approved' && (
                      <>
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                          <CheckCircle2 size={28} />
                        </div>
                        <span className="text-3xl font-black text-emerald-600 uppercase tracking-tight">Active</span>
                      </>
                    )}
                    {nurse.status === 'pending' && (
                      <>
                        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                          <Clock size={28} className="animate-pulse" />
                        </div>
                        <span className="text-3xl font-black text-amber-600 uppercase tracking-tight">Under Review</span>
                      </>
                    )}
                    {nurse.status === 'rejected' && (
                      <>
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
                          <XCircle size={28} />
                        </div>
                        <span className="text-3xl font-black text-red-600 uppercase tracking-tight">Declined</span>
                      </>
                    )}
                  </div>
                </div>

                {nurse.status === 'approved' && (
                  <Link href={`/nurse/${nurse.id}`} className="btn-primary border-emerald-500 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-6 py-3 font-bold border-2 shadow-none group">
                    View Public Profile <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mt-10 h-3 bg-gray-100 rounded-full overflow-hidden flex gap-1">
                <div className={`h-full ${nurse.status === 'rejected' ? 'bg-red-400' : 'bg-emerald-500'} w-1/3`} />
                <div className={`h-full ${
                  nurse.status === 'pending' ? 'bg-amber-400 animate-pulse' : 
                  nurse.status === 'approved' ? 'bg-emerald-500' : 
                  nurse.status === 'rejected' ? 'bg-red-100' : 'bg-gray-200'
                } w-1/3`} />
                <div className={`h-full ${
                  nurse.status === 'approved' ? 'bg-emerald-500' : 
                  'bg-gray-200'
                } w-1/3`} />
              </div>
              <div className="flex justify-between mt-3 text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                <span>Submitted</span>
                <span>Verification</span>
                <span>Onboarded</span>
              </div>
            </div>

            {/* Admin Comments */}
            <div className="card p-8 shadow-glass border-l-4 border-l-emerald-500 bg-white/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-navy-900 text-white rounded-xl flex items-center justify-center">
                  <MessageSquare size={20} strokeWidth={2.5} />
                </div>
                <h2 className="text-xl font-extrabold text-navy-900 tracking-tight">Admin Feedback</h2>
              </div>
              
              <div className="bg-emerald-50/30 rounded-2xl p-6 border border-emerald-100/50">
                {nurse.adminComments ? (
                  <p className="text-gray-700 leading-relaxed italic text-lg font-medium ring-0 focus:ring-0">
                    &ldquo;{nurse.adminComments}&rdquo;
                  </p>
                ) : (
                  <p className="text-gray-400 leading-relaxed italic font-medium">
                    No specific comments from the administration yet. Your documents are being verified for credentials and experience.
                  </p>
                )}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Last Updated: {new Date(nurse.createdAt).toLocaleDateString()}</p>
                <Link href="/help" className="text-xs font-black text-emerald-600 hover:underline uppercase tracking-widest">Need help? Contact Support</Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
