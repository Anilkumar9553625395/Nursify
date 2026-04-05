'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  Star, Clock, User, Globe, Award, ChevronLeft,
  Phone, Mail, DollarSign, Calendar, CheckCircle, Send
} from 'lucide-react'
import type { Nurse } from '@/lib/store'

export default function NurseProfilePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [nurse, setNurse]         = useState<Nurse | null>(null)
  const [loading, setLoading]     = useState(true)
  const [tab, setTab]             = useState<'about' | 'book' | 'reviews'>('about')

  // Booking form state
  const [bookType, setBookType]   = useState<'hourly' | 'daily'>('hourly')
  const [hours, setHours]         = useState(2)
  const [days, setDays]           = useState(1)
  const [startDate, setStartDate] = useState('')
  const [patientName, setPatientName] = useState('')
  const [patientEmail, setPatientEmail] = useState('')
  const [patientPhone, setPatientPhone] = useState('')
  const [notes, setNotes]         = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess]     = useState(false)

  // Review form
  const [reviewName, setReviewName]     = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)

  useEffect(() => {
    fetch(`/api/nurses/${id}`)
      .then(r => r.json())
      .then(data => { setNurse(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading…</div>
  if (!nurse)  return <div className="min-h-screen flex items-center justify-center text-gray-400">Nurse not found.</div>

  const cost = bookType === 'hourly' ? hours * nurse.hourlyRate : days * nurse.dailyRate

  async function handleBook(e: React.FormEvent) {
    e.preventDefault()
    if (!patientName || !patientEmail || !startDate) return
    setSubmitting(true)
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nurseId: nurse!.id,
        nurseName: nurse!.name,
        patientName, patientEmail, patientPhone,
        bookingType: bookType,
        hours: bookType === 'hourly' ? hours : undefined,
        days: bookType === 'daily' ? days : undefined,
        startDate, notes,
        totalCost: cost,
      }),
    })
    if (res.ok) setSuccess(true)
    setSubmitting(false)
  }

  async function handleReview(e: React.FormEvent) {
    e.preventDefault()
    if (!reviewName || !reviewComment) return
    setReviewSubmitting(true)
    const res = await fetch(`/api/nurses/${nurse!.id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientName: reviewName, rating: reviewRating, comment: reviewComment }),
    })
    if (res.ok) {
      const updatedNurse = await res.json()
      setNurse(updatedNurse)
      setReviewName(''); setReviewComment(''); setReviewRating(5)
    }
    setReviewSubmitting(false)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Back */}
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-teal-700 mb-6 transition">
            <ChevronLeft size={16} /> Back to nurses
          </button>

          {/* Profile card */}
          <div className="card p-8 mb-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-teal-50 flex-shrink-0">
                {nurse.photo ? (
                  <Image src={nurse.photo} alt={nurse.name} fill className="object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-teal-300">
                    {nurse.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{nurse.name}</h1>
                    <p className="text-gray-500 text-sm mt-0.5">{nurse.qualifications}</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                    <Star size={14} fill="currentColor" />
                    {nurse.rating > 0 ? nurse.rating : 'New'} 
                    {nurse.reviewCount > 0 && <span className="font-normal text-yellow-600">({nurse.reviewCount})</span>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5"><User size={14} /> {nurse.experience} yrs experience</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} /> {nurse.availability}</span>
                  <span className="flex items-center gap-1.5"><DollarSign size={14} /> ${nurse.hourlyRate}/hr · ${nurse.dailyRate}/day</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {nurse.specializations.map(s => <span key={s} className="badge-teal">{s}</span>)}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 mb-6 w-fit">
            {(['about', 'book', 'reviews'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  tab === t ? 'bg-teal-600 text-white' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                  {t}{t === 'reviews' && ` (${nurse.reviews?.length || 0})`}
                </button>
              ))}
            </div>

          {/* About tab */}
          {tab === 'about' && (
            <div className="card p-7 space-y-6">
              <div>
                <h2 className="font-bold text-gray-900 mb-2">About</h2>
                <p className="text-gray-600 leading-relaxed">{nurse.bio}</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><Globe size={15} /> Languages</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {nurse.languages.map(l => <span key={l} className="badge-gray">{l}</span>)}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><Award size={15} /> Qualifications</h3>
                  <p className="text-sm text-gray-600">{nurse.qualifications}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><Mail size={15} /> Contact</h3>
                  <p className="text-sm text-gray-600">{nurse.email}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><Phone size={15} /> Phone</h3>
                  <p className="text-sm text-gray-600">{nurse.phone}</p>
                </div>
              </div>
            </div>
          )}

          {/* Book tab */}
          {tab === 'book' && (
            <div className="card p-7">
              {success ? (
                <div className="text-center py-10">
                  <CheckCircle size={52} className="text-teal-500 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-gray-900">Booking Confirmed!</h2>
                  <p className="text-gray-500 mt-2">Your booking request has been sent. Check <Link href="/bookings" className="text-teal-600 underline">My Bookings</Link> to track status.</p>
                </div>
              ) : (
                <form onSubmit={handleBook} className="space-y-5">
                  <h2 className="font-bold text-gray-900 text-lg">Book {nurse.name}</h2>

                  {/* Booking type */}
                  <div className="flex gap-3">
                    {(['hourly', 'daily'] as const).map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setBookType(t)}
                        className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                          bookType === t ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-600'
                        }`}
                      >
                        {t === 'hourly' ? '⏱ By the Hour' : '📅 By the Day'}
                      </button>
                    ))}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {bookType === 'hourly' ? (
                      <div>
                        <label className="label">Number of Hours</label>
                        <input type="number" min={1} max={24} value={hours}
                          onChange={e => setHours(+e.target.value)} className="input" />
                      </div>
                    ) : (
                      <div>
                        <label className="label">Number of Days</label>
                        <input type="number" min={1} max={30} value={days}
                          onChange={e => setDays(+e.target.value)} className="input" />
                      </div>
                    )}
                    <div>
                      <label className="label">Start Date</label>
                      <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                        className="input" required min={new Date().toISOString().split('T')[0]} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Your Name *</label>
                      <input value={patientName} onChange={e => setPatientName(e.target.value)} className="input" placeholder="Full name" required />
                    </div>
                    <div>
                      <label className="label">Email *</label>
                      <input type="email" value={patientEmail} onChange={e => setPatientEmail(e.target.value)} className="input" placeholder="you@example.com" required />
                    </div>
                    <div>
                      <label className="label">Phone</label>
                      <input value={patientPhone} onChange={e => setPatientPhone(e.target.value)} className="input" placeholder="+1 234 567 890" />
                    </div>
                  </div>

                  <div>
                    <label className="label">Additional Notes</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                      className="input resize-none" placeholder="Any specific requirements or medical notes…" />
                  </div>

                  {/* Price summary */}
                  <div className="bg-teal-50 rounded-xl p-4 flex justify-between items-center">
                    <span className="text-sm text-teal-700">
                      {bookType === 'hourly' ? `${hours} hr × $${nurse.hourlyRate}` : `${days} day × $${nurse.dailyRate}`}
                    </span>
                    <span className="text-xl font-bold text-teal-800">${cost}</span>
                  </div>

                  <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-3">
                    {submitting ? 'Booking…' : <><Calendar size={17} /> Confirm Booking</>}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Reviews tab */}
          {tab === 'reviews' && (
            <div className="space-y-5">
              {(nurse.reviews?.length || 0) === 0 && (
                <p className="text-gray-400 text-center py-10">No reviews yet. Be the first!</p>
              )}
              {nurse.reviews?.map(r => (
                <div key={r.id} className="card p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{r.patientName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{r.date}</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{r.comment}</p>
                </div>
              ))}

              {/* Add review */}
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Leave a Review</h3>
                <form onSubmit={handleReview} className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="label">Your Name</label>
                      <input value={reviewName} onChange={e => setReviewName(e.target.value)} className="input" placeholder="Jane Doe" required />
                    </div>
                    <div>
                      <label className="label">Rating</label>
                      <select value={reviewRating} onChange={e => setReviewRating(+e.target.value)} className="input">
                        {[5,4,3,2,1].map(n => <option key={n} value={n}>{'★'.repeat(n)} ({n}/5)</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="label">Comment</label>
                    <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)}
                      rows={3} className="input resize-none" placeholder="Share your experience…" required />
                  </div>
                  <button type="submit" disabled={reviewSubmitting} className="btn-primary">
                    <Send size={15} /> {reviewSubmitting ? 'Submitting…' : 'Submit Review'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
