'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { LogIn, Mail, Lock, User, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loginType, setLoginType] = useState<'user' | 'admin'>('user')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = loginType === 'admin' ? '/api/admin/login' : '/api/auth/login'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginType === 'admin' ? { email: identifier, password } : { identifier, password }),
      })

      const data = await res.json()

      if (res.ok) {
        router.push('/')
        router.refresh()
      } else {
        setError(data.message || 'Login failed')
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
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LogIn className="text-emerald-600" size={32} />
            </div>
            <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">Welcome Back</h1>
            <p className="text-gray-500 mt-2">Log in to manage your care journey</p>
          </div>

          <div className="card p-8 shadow-glass transition-all duration-300">
            <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-6">
              <button
                onClick={() => setLoginType('user')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                  loginType === 'user' ? 'bg-white text-navy-900 shadow-sm' : 'text-gray-500 hover:text-navy-900'
                }`}
              >
                Patient / Nurse
              </button>
              <button
                onClick={() => setLoginType('admin')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                  loginType === 'admin' ? 'bg-white text-navy-900 shadow-sm' : 'text-gray-500 hover:text-navy-900'
                }`}
              >
                Admin
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-pulse">
                  <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}

              <div>
                <label className="label ml-1">Email or Username</label>
                <div className="relative group mt-1.5">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    className="input pl-11"
                    placeholder={loginType === 'admin' ? "Enter your admin email" : "Enter your email or username"}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label ml-1">Password</label>
                <div className="relative group mt-1.5">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input pl-11 pr-11"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-emerald-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
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
                  'Secure Log In'
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-500 text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-emerald-600 font-bold hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
