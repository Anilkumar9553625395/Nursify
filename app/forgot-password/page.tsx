'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Mail, Loader2, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
      } else {
        setError(data.message || 'Something went wrong')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-medical-bg flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 py-20">
        <div className="w-full max-w-md">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 mb-6 font-medium transition-colors">
            <ArrowLeft size={16} /> Back to login
          </Link>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="text-emerald-600" size={32} />
            </div>
            <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">Forgot Password</h1>
            <p className="text-gray-500 mt-2">Enter your email and we'll send you a reset link</p>
          </div>

          <div className="card p-8 shadow-glass transition-all duration-300">
            {success ? (
              <div className="text-center space-y-6 py-4">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="text-emerald-500" size={32} />
                </div>
                <h3 className="text-xl font-bold text-navy-900">Check your email</h3>
                <p className="text-gray-500">
                  We've sent a password reset link to <span className="font-semibold text-navy-900">{email}</span>.
                </p>
                <div className="pt-4">
                  <p className="text-xs text-gray-400 mb-4">Didn't receive the email? Check your spam folder.</p>
                  <button onClick={() => setSuccess(false)} className="text-emerald-600 font-bold hover:underline text-sm">
                    Try another email address
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                )}

                <div>
                  <label className="label ml-1">Email Address</label>
                  <div className="relative group mt-1.5">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      className="input pl-11"
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-4 font-bold text-lg shadow-lg shadow-emerald-200 disabled:opacity-50 transition-all border-0 ring-0 active:scale-95"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
