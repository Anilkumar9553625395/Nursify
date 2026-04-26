'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  Star, Clock, User, Globe, Award, ChevronLeft,
  Phone, Mail, IndianRupee, Calendar, CheckCircle, Send,
  Shield, MapPin, Heart, Activity, AlertTriangle,
  FileText, Stethoscope, ClipboardList, UserCheck, Lock
} from 'lucide-react'
import type { Nurse } from '@/lib/store'
import { SERVICES_NEEDED, RELATIONS, LOCATIONS } from '@/lib/constants'

export default function NurseProfilePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [nurse, setNurse]         = useState<Nurse | null>(null)
  const [loading, setLoading]     = useState(true)
  const [tab, setTab]             = useState<'about' | 'schedule' | 'reviews'>('about')

  // ── Booking form — 6-step flow ──
  const [step, setStep] = useState(1)
  const TOTAL_STEPS = 6

  // Step 1: Requester details
  const [requesterName, setRequesterName] = useState('')
  const [requesterEmail, setRequesterEmail] = useState('')
  const [requesterPhone, setRequesterPhone] = useState('')
  const [relationToPatient, setRelation] = useState('Self')

  // Step 2: Patient info
  const [patientName, setPatientName] = useState('')
  const [patientAge, setPatientAge] = useState('')
  const [patientGender, setPatientGender] = useState('')
  const [patientAddress, setPatientAddress] = useState('')
  const [patientLocation, setPatientLocation] = useState(LOCATIONS[0])
  const [patientContact, setPatientContact] = useState('')
  const [emergencyContact, setEmergencyContact] = useState('')
  const [emergencyRelation, setEmergencyRelation] = useState('')

  // Step 3: Clinical assessment
  const [clinicalNotes, setClinicalNotes] = useState('')
  const [recentAdmissions, setRecentAdmissions] = useState(false)
  const [treatmentPlan, setTreatmentPlan] = useState('')
  const [diagnosis, setDiagnosis] = useState('')

  // Step 4: Services needed
  const [servicesNeeded, setServicesNeeded] = useState<string[]>([])

  // Step 5: Decision capacity & consent
  const [canMakeDecisions, setCanMakeDecisions] = useState(true)
  const [understandsLimitations, setUnderstandsLimitations] = useState(false)
  const [consentAgreed, setConsentAgreed] = useState(false)
  const [relativeRelation, setRelativeRelation] = useState('')
  const [relativeAadhar, setRelativeAadhar] = useState('')
  const [noConsentReason, setNoConsentReason] = useState('')
  const [relativeConsentAgreed, setRelativeConsentAgreed] = useState(false)

  // Step 6: Duration & confirmation
  const [bookType, setBookType] = useState<'hourly' | 'daily'>('hourly')
  const [hours, setHours] = useState(2)
  const [days, setDays] = useState(1)
  const [startDate, setStartDate] = useState('')
  const [notes, setNotes] = useState('')
  const [emergencyDisclaimer, setEmergencyDisclaimer] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  // Review form
  const [reviewName, setReviewName] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)

  useEffect(() => {
    fetch(`/api/nurses/${id}`)
      .then(r => r.json())
      .then(data => { setNurse(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  // Auto-fill patient name if self
  useEffect(() => {
    if (relationToPatient === 'Self') {
      setPatientName(requesterName)
      setPatientContact(requesterPhone)
    }
  }, [relationToPatient, requesterName, requesterPhone])

  if (loading) return (
    <div className="min-h-screen bg-medical-bg flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 border-2 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
        <span className="text-gray-400 font-medium">Loading profile…</span>
      </div>
    </div>
  )
  if (!nurse) return (
    <div className="min-h-screen bg-medical-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
          <User size={28} className="text-gray-300" />
        </div>
        <p className="text-gray-400 font-medium">Nurse not found.</p>
      </div>
    </div>
  )

  const cost = bookType === 'hourly' ? hours * nurse.hourlyRate : days * nurse.dailyRate

  function toggleService(s: string) {
    setServicesNeeded(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  async function handleSubmitCare(e: React.FormEvent) {
    e.preventDefault()
    if (!emergencyDisclaimer) return
    setSubmitting(true)
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nurseId: nurse!.id,
        nurseName: nurse!.name,
        requesterName, requesterEmail, requesterPhone,
        relationToPatient,
        patientName,
        patientAge: +patientAge,
        patientGender,
        patientAddress,
        patientLocation,
        patientContact,
        emergencyContact, emergencyRelation,
        diagnosis, clinicalNotes,
        recentAdmissions, treatmentPlan,
        servicesNeeded,
        canMakeDecisions, understandsLimitations,
        consentSignedBy: canMakeDecisions ? 'patient' : 'relative',
        relativeRelation: !canMakeDecisions ? relativeRelation : undefined,
        relativeAadhar: !canMakeDecisions ? relativeAadhar : undefined,
        noConsentReason: !canMakeDecisions ? noConsentReason : undefined,
        bookingType: bookType,
        hours: bookType === 'hourly' ? hours : undefined,
        days: bookType === 'daily' ? days : undefined,
        startDate,
        totalCost: cost,
        notes,
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

  const stepLabels = [
    { num: 1, label: 'Your Details', icon: User },
    { num: 2, label: 'Patient Info', icon: ClipboardList },
    { num: 3, label: 'Clinical', icon: Stethoscope },
    { num: 4, label: 'Services', icon: Activity },
    { num: 5, label: 'Consent', icon: Lock },
    { num: 6, label: 'Confirm', icon: CheckCircle },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-medical-bg pb-16">
        {/* Profile Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 gradient-hero" />
          <div className="absolute inset-0 medical-pattern opacity-50" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-28">
            <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-emerald-400 mb-8 transition-colors font-medium">
              <ChevronLeft size={16} /> Back to nurses
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-400/20 to-sapphire-400/20 flex-shrink-0 border-2 border-white/10 shadow-glass-lg">
                {nurse.photo ? (
                  <Image src={nurse.photo} alt={nurse.name} fill className="object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                    <span className="text-4xl font-extrabold text-white">{nurse.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl font-extrabold text-white tracking-tight">{nurse.name}</h1>
                      <div className="verified-badge bg-emerald-500/20 border-emerald-400/30 text-emerald-300">
                        <Shield size={10} /> Verified
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm">{nurse.qualifications}</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-amber-300 px-3.5 py-2 rounded-xl text-sm font-bold border border-white/10">
                    <Star size={14} fill="currentColor" />
                    {nurse.rating > 0 ? nurse.rating : 'New'} 
                    {nurse.reviewCount > 0 && <span className="font-normal text-gray-300">({nurse.reviewCount})</span>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-300">
                  <span className="flex items-center gap-1.5"><User size={14} className="text-emerald-400" /> {nurse.experience} yrs experience</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} className="text-sapphire-400" /> {nurse.availability}</span>
                  <span className="flex items-center gap-1.5"><IndianRupee size={14} className="text-emerald-400" /> ₹{nurse.hourlyRate}/hr · ₹{nurse.dailyRate}/day</span>
                  {nurse.location && <span className="flex items-center gap-1.5"><MapPin size={14} className="text-amber-400" /> {nurse.location}</span>}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {nurse.specializations.map(s => (
                    <span key={s} className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/10 text-emerald-300 border border-white/10">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 relative z-10">
          {/* Tabs */}
          <div className="flex gap-1 bg-white rounded-2xl p-1.5 shadow-glass border border-gray-100/50 mb-6 w-fit">
            {(['about', 'schedule', 'reviews'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  tab === t ? 'bg-emerald-500 text-white shadow-medical' : 'text-gray-500 hover:text-navy-800 hover:bg-gray-50'
                }`}
              >
                {t === 'about' ? 'About' : t === 'schedule' ? 'Schedule Care' : `Reviews (${nurse.reviews?.length || 0})`}
              </button>
            ))}
          </div>

          {/* ── About tab ── */}
          {tab === 'about' && (
            <div className="card p-8 space-y-7 shadow-glass">
              <div>
                <h2 className="font-bold text-navy-900 text-lg mb-3 flex items-center gap-2">
                  <Activity size={18} className="text-emerald-500" /> About
                </h2>
                <p className="text-gray-600 leading-relaxed">{nurse.bio}</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-bold text-navy-800 mb-3 flex items-center gap-2 text-sm"><Globe size={15} className="text-emerald-500" /> Languages</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {nurse.languages.map(l => <span key={l} className="badge-gray">{l}</span>)}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-bold text-navy-800 mb-3 flex items-center gap-2 text-sm"><Award size={15} className="text-emerald-500" /> Qualifications</h3>
                  <p className="text-sm text-gray-600">{nurse.qualifications}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-bold text-navy-800 mb-3 flex items-center gap-2 text-sm"><Mail size={15} className="text-emerald-500" /> Contact</h3>
                  <p className="text-sm text-gray-600">{nurse.email}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-bold text-navy-800 mb-3 flex items-center gap-2 text-sm"><Phone size={15} className="text-emerald-500" /> Phone</h3>
                  <p className="text-sm text-gray-600">{nurse.phone}</p>
                </div>
              </div>
            </div>
          )}

          {/* ── Schedule Care tab — 6-step form ── */}
          {tab === 'schedule' && (
            <div className="card shadow-glass overflow-visible">
              {success ? (
                <div className="text-center py-16 px-8">
                  <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-medical">
                    <CheckCircle size={40} className="text-white" />
                  </div>
                  <h2 className="text-xl font-extrabold text-navy-900">Care Request Submitted!</h2>
                  <p className="text-gray-500 mt-3 max-w-md mx-auto">Your care request is now <span className="font-bold text-amber-600">pending</span>. Our team will review and assign a nurse shortly.</p>
                  <p className="text-gray-400 text-sm mt-2">Check <Link href="/bookings" className="text-emerald-600 font-semibold hover:underline">My Care Requests</Link> to track status.</p>
                  <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-md mx-auto">
                    <p className="text-sm text-amber-800 flex items-start gap-2">
                      <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                      This is a non-emergency home care service. For emergencies, contact local emergency services immediately.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Step indicator */}
                  <div className="px-8 pt-8 pb-6 border-b border-gray-100">
                    <div className="flex items-center justify-between overflow-x-auto gap-1">
                      {stepLabels.map((s, i) => (
                        <div key={s.num} className="flex items-center flex-shrink-0">
                          <button
                            onClick={() => { if (s.num < step) setStep(s.num) }}
                            className={`flex items-center gap-2 ${s.num < step ? 'cursor-pointer' : 'cursor-default'}`}
                          >
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                              step > s.num ? 'bg-emerald-500 text-white' :
                              step === s.num ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-medical' :
                              'bg-gray-100 text-gray-400'
                            }`}>
                              {step > s.num ? <CheckCircle size={16} /> : <s.icon size={16} />}
                            </div>
                            <span className={`hidden lg:block text-xs font-semibold ${step >= s.num ? 'text-navy-900' : 'text-gray-400'}`}>{s.label}</span>
                          </button>
                          {i < 5 && <div className={`w-6 lg:w-12 h-0.5 mx-1 rounded-full ${step > s.num ? 'bg-emerald-500' : 'bg-gray-200'}`} />}
                        </div>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleSubmitCare} className="p-8 space-y-6">

                    {/* ── Step 1: Your Details ── */}
                    {step === 1 && <>
                      <div>
                        <h2 className="font-bold text-navy-900 text-lg flex items-center gap-2 mb-1">
                          <User size={18} className="text-emerald-500" /> Your Details
                        </h2>
                        <p className="text-sm text-gray-500">Who is scheduling this care? For you or your loved ones.</p>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="label">Your Full Name *</label>
                          <input value={requesterName} onChange={e => setRequesterName(e.target.value)} className="input" placeholder="Your name" required />
                        </div>
                        <div>
                          <label className="label">Email *</label>
                          <input type="email" value={requesterEmail} onChange={e => setRequesterEmail(e.target.value)} className="input" placeholder="you@example.com" required />
                        </div>
                        <div>
                          <label className="label">Phone *</label>
                          <input value={requesterPhone} onChange={e => setRequesterPhone(e.target.value)} className="input" placeholder="+91 98765 43210" required />
                        </div>
                        <div>
                          <label className="label">Relation to Patient *</label>
                          <select value={relationToPatient} onChange={e => setRelation(e.target.value)} className="input">
                            {RELATIONS.map(r => <option key={r}>{r}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end pt-2">
                        <button type="button" onClick={() => {
                          if (requesterName && requesterEmail && requesterPhone) setStep(2)
                        }} className="btn-primary">Continue →</button>
                      </div>
                    </>}

                    {/* ── Step 2: Patient Information ── */}
                    {step === 2 && <>
                      <div>
                        <h2 className="font-bold text-navy-900 text-lg flex items-center gap-2 mb-1">
                          <ClipboardList size={18} className="text-emerald-500" /> Patient Information
                        </h2>
                        <p className="text-sm text-gray-500">Details of the person who will receive care.</p>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="label">Patient Full Name *</label>
                          <input value={patientName} onChange={e => setPatientName(e.target.value)} className="input" placeholder="Patient name" required />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="label">Age *</label>
                            <input type="number" min={0} max={120} value={patientAge} onChange={e => setPatientAge(e.target.value)} className="input" placeholder="65" required />
                          </div>
                          <div>
                            <label className="label">Gender *</label>
                            <select value={patientGender} onChange={e => setPatientGender(e.target.value)} className="input" required>
                              <option value="">Select</option>
                              <option>Male</option>
                              <option>Female</option>
                              <option>Other</option>
                            </select>
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="label">Address *</label>
                          <textarea value={patientAddress} onChange={e => setPatientAddress(e.target.value)} className="input resize-none" rows={2} placeholder="Full address for home care visit" required />
                        </div>
                        <div>
                          <label className="label flex items-center gap-1.5"><MapPin size={14} className="text-emerald-500" /> Location (Area) *</label>
                          <select value={patientLocation} onChange={e => setPatientLocation(e.target.value)} className="input" required>
                            {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="label">Patient Contact Number *</label>
                          <input value={patientContact} onChange={e => setPatientContact(e.target.value)} className="input" placeholder="+91 98765 43210" required />
                        </div>
                        <div>
                          <label className="label">Emergency Contact Number *</label>
                          <input value={emergencyContact} onChange={e => setEmergencyContact(e.target.value)} className="input" placeholder="+91 98765 43210" required />
                        </div>
                        <div>
                          <label className="label">Emergency Contact Relation *</label>
                          <select value={emergencyRelation} onChange={e => setEmergencyRelation(e.target.value)} className="input" required>
                            <option value="">Select relation</option>
                            {RELATIONS.filter(r => r !== 'Self').map(r => <option key={r}>{r}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-between pt-2">
                        <button type="button" onClick={() => setStep(1)} className="btn-secondary">← Back</button>
                        <button type="button" onClick={() => {
                          if (patientName && patientAge && patientGender && patientAddress && patientContact && emergencyContact && emergencyRelation) setStep(3)
                        }} className="btn-primary">Continue →</button>
                      </div>
                    </>}

                    {/* ── Step 3: Clinical Assessment ── */}
                    {step === 3 && <>
                      <div>
                        <h2 className="font-bold text-navy-900 text-lg flex items-center gap-2 mb-1">
                          <Stethoscope size={18} className="text-emerald-500" /> Clinical Assessment
                        </h2>
                        <p className="text-sm text-gray-500">Help us understand the care needed.</p>
                      </div>
                      <div>
                        <label className="label">What care is needed? (Clinical description) *</label>
                        <textarea value={clinicalNotes} onChange={e => setClinicalNotes(e.target.value)} className="input resize-none" rows={3} placeholder="Describe the patient's condition and the type of nursing care required..." required />
                      </div>
                      <div>
                        <label className="label mb-3">Any recent admissions or day care procedures?</label>
                        <div className="flex gap-3">
                          {[true, false].map(v => (
                            <button key={String(v)} type="button"
                              onClick={() => setRecentAdmissions(v)}
                              className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                                recentAdmissions === v ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-500'
                              }`}>
                              {v ? 'Yes' : 'No'}
                            </button>
                          ))}
                        </div>
                      </div>
                      {recentAdmissions && (
                        <div className="space-y-4 bg-emerald-50/50 border border-emerald-100 rounded-xl p-5">
                          <div>
                            <label className="label text-emerald-800">Discharge Summary / Treatment Plan *</label>
                            <textarea value={treatmentPlan} onChange={e => setTreatmentPlan(e.target.value)} className="input resize-none border-emerald-200" rows={3} placeholder="Enter details from the discharge summary or treatment plan..." required />
                          </div>
                          <div>
                            <label className="label text-emerald-800">Diagnosis (from discharge summary) *</label>
                            <input value={diagnosis} onChange={e => setDiagnosis(e.target.value)} className="input border-emerald-200" placeholder="e.g. Type 2 Diabetes, Post-CABG, Hip Replacement..." required />
                          </div>
                        </div>
                      )}
                      {!recentAdmissions && (
                        <div>
                          <label className="label">Diagnosis (if known)</label>
                          <input value={diagnosis} onChange={e => setDiagnosis(e.target.value)} className="input" placeholder="e.g. Type 2 Diabetes, Chronic back pain..." />
                        </div>
                      )}
                      <div className="flex justify-between pt-2">
                        <button type="button" onClick={() => setStep(2)} className="btn-secondary">← Back</button>
                        <button type="button" onClick={() => {
                          if (clinicalNotes) setStep(4)
                        }} className="btn-primary">Continue →</button>
                      </div>
                    </>}

                    {/* ── Step 4: Services Needed ── */}
                    {step === 4 && <>
                      <div>
                        <h2 className="font-bold text-navy-900 text-lg flex items-center gap-2 mb-1">
                          <Activity size={18} className="text-emerald-500" /> Services Needed
                        </h2>
                        <p className="text-sm text-gray-500">Select all the services required for the patient.</p>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {SERVICES_NEEDED.map(s => (
                          <button key={s} type="button" onClick={() => toggleService(s)}
                            className={`text-left px-4 py-3.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                              servicesNeeded.includes(s)
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-medical'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}>
                            <span className="flex items-center gap-2">
                              {servicesNeeded.includes(s) && <CheckCircle size={14} />}
                              {s}
                            </span>
                          </button>
                        ))}
                      </div>
                      {servicesNeeded.length === 0 && (
                        <p className="text-xs text-amber-600">Please select at least one service.</p>
                      )}
                      <div className="flex justify-between pt-2">
                        <button type="button" onClick={() => setStep(3)} className="btn-secondary">← Back</button>
                        <button type="button" onClick={() => {
                          if (servicesNeeded.length > 0) setStep(5)
                        }} className="btn-primary" disabled={servicesNeeded.length === 0}>Continue →</button>
                      </div>
                    </>}

                    {/* ── Step 5: Decision Capacity & Consent ── */}
                    {step === 5 && <>
                      <div>
                        <h2 className="font-bold text-navy-900 text-lg flex items-center gap-2 mb-1">
                          <Lock size={18} className="text-emerald-500" /> Decision Capacity & Consent
                        </h2>
                        <p className="text-sm text-gray-500">Required for home care services.</p>
                      </div>

                      <div>
                        <label className="label mb-3">Is the patient able to make decisions? *</label>
                        <div className="flex gap-3">
                          {[true, false].map(v => (
                            <button key={String(v)} type="button"
                              onClick={() => { setCanMakeDecisions(v); setConsentAgreed(false); setRelativeConsentAgreed(false) }}
                              className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                                canMakeDecisions === v ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-500'
                              }`}>
                              {v ? 'Yes' : 'No'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Patient CAN make decisions */}
                      {canMakeDecisions && (
                        <div className="space-y-4">
                          <div>
                            <label className="label mb-3">Does the patient understand the limitations of home care? *</label>
                            <div className="flex gap-3">
                              {[true, false].map(v => (
                                <button key={String(v)} type="button"
                                  onClick={() => setUnderstandsLimitations(v)}
                                  className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                                    understandsLimitations === v ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-500'
                                  }`}>
                                  {v ? 'Yes' : 'No'}
                                </button>
                              ))}
                            </div>
                          </div>

                          {understandsLimitations && (
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                              <h3 className="font-bold text-navy-900 text-sm mb-3 flex items-center gap-2">
                                <FileText size={15} className="text-emerald-500" /> Patient Consent Form
                              </h3>
                              <div className="bg-white border border-gray-200 rounded-lg p-4 text-xs text-gray-600 leading-relaxed max-h-40 overflow-y-auto mb-4">
                                <p className="font-semibold text-navy-900 mb-2">Consent for Non-Emergency Home Care Services</p>
                                <p>I, the patient, hereby consent to receive non-emergency home nursing care services provided through Nursify Healthcare. I understand that:</p>
                                <ul className="list-disc pl-4 mt-2 space-y-1">
                                  <li>This is a non-emergency home care service and does not replace hospital-level care.</li>
                                  <li>For medical emergencies, I should contact local emergency services (108/112) immediately.</li>
                                  <li>The nurse will provide care as per the agreed service plan.</li>
                                  <li>I have the right to refuse or discontinue services at any time.</li>
                                  <li>My personal and medical information will be kept confidential.</li>
                                </ul>
                              </div>
                              <label className="flex items-start gap-3 cursor-pointer">
                                <input type="checkbox" checked={consentAgreed} onChange={e => setConsentAgreed(e.target.checked)}
                                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                                <span className="text-sm text-navy-900 font-semibold">I, the patient, agree to the above terms and consent to receive home care services.</span>
                              </label>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Patient CANNOT make decisions */}
                      {!canMakeDecisions && (
                        <div className="space-y-4 bg-amber-50/50 border border-amber-200 rounded-xl p-5">
                          <p className="text-sm text-amber-800 font-semibold flex items-center gap-2">
                            <AlertTriangle size={15} /> Consent to be provided by relative/guardian
                          </p>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="label">Your Relation to Patient *</label>
                              <select value={relativeRelation} onChange={e => setRelativeRelation(e.target.value)} className="input" required>
                                <option value="">Select</option>
                                {RELATIONS.filter(r => r !== 'Self').map(r => <option key={r}>{r}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="label">Aadhar Card Number (for verification) *</label>
                              <input value={relativeAadhar} onChange={e => setRelativeAadhar(e.target.value)} className="input" placeholder="XXXX XXXX XXXX" required />
                            </div>
                          </div>
                          <div>
                            <label className="label">Reason patient cannot consent *</label>
                            <textarea value={noConsentReason} onChange={e => setNoConsentReason(e.target.value)} className="input resize-none" rows={2} placeholder="e.g. Patient has dementia and is unable to understand the care plan..." required />
                          </div>

                          {/* Relative consent form */}
                          <div className="bg-white border border-amber-200 rounded-lg p-4 text-xs text-gray-600 leading-relaxed max-h-40 overflow-y-auto">
                            <p className="font-semibold text-navy-900 mb-2">Consent by Relative/Guardian</p>
                            <p>I, acting as the authorized relative/guardian of the patient, hereby consent to non-emergency home nursing care services on behalf of the patient. I confirm that:</p>
                            <ul className="list-disc pl-4 mt-2 space-y-1">
                              <li>The patient is unable to provide consent due to the reason stated above.</li>
                              <li>I am legally authorized to make healthcare decisions on their behalf.</li>
                              <li>I have provided my Aadhar card for identity verification.</li>
                              <li>I understand this is a non-emergency service and emergencies should be directed to 108/112.</li>
                            </ul>
                          </div>
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" checked={relativeConsentAgreed} onChange={e => setRelativeConsentAgreed(e.target.checked)}
                              className="mt-0.5 w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                            <span className="text-sm text-navy-900 font-semibold">I, as the authorized relative/guardian, consent to home care on behalf of the patient.</span>
                          </label>
                        </div>
                      )}

                      <div className="flex justify-between pt-2">
                        <button type="button" onClick={() => setStep(4)} className="btn-secondary">← Back</button>
                        <button type="button" onClick={() => {
                          const canProceed = canMakeDecisions 
                            ? (understandsLimitations && consentAgreed)
                            : (relativeRelation && relativeAadhar && noConsentReason && relativeConsentAgreed)
                          if (canProceed) setStep(6)
                        }} className="btn-primary"
                          disabled={canMakeDecisions ? !(understandsLimitations && consentAgreed) : !(relativeRelation && relativeAadhar && noConsentReason && relativeConsentAgreed)}
                        >Continue →</button>
                      </div>
                    </>}

                    {/* ── Step 6: Confirmation ── */}
                    {step === 6 && <>
                      <div>
                        <h2 className="font-bold text-navy-900 text-lg flex items-center gap-2 mb-1">
                          <CheckCircle size={18} className="text-emerald-500" /> Confirm Care Request
                        </h2>
                        <p className="text-sm text-gray-500">Review your details and schedule care for {patientName}.</p>
                      </div>

                      {/* Summary */}
                      <div className="bg-gray-50 rounded-xl p-5 space-y-3 text-sm">
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div><span className="text-gray-500">Patient:</span> <span className="font-semibold text-navy-900">{patientName}, {patientAge}yrs, {patientGender}</span></div>
                          <div><span className="text-gray-500">Location:</span> <span className="font-semibold text-navy-900">{patientLocation}</span></div>
                          <div><span className="text-gray-500">Requester:</span> <span className="font-semibold text-navy-900">{requesterName} ({relationToPatient})</span></div>
                          <div><span className="text-gray-500">Nurse:</span> <span className="font-semibold text-navy-900">{nurse.name}</span></div>
                        </div>
                        <div className="pt-2 border-t border-gray-200">
                          <span className="text-gray-500">Services:</span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {servicesNeeded.map(s => <span key={s} className="badge-emerald text-[10px]">{s}</span>)}
                          </div>
                        </div>
                        {diagnosis && (
                          <div><span className="text-gray-500">Diagnosis:</span> <span className="font-semibold text-navy-900">{diagnosis}</span></div>
                        )}
                      </div>

                      {/* Duration */}
                      <div className="flex gap-3">
                        {(['hourly', 'daily'] as const).map(t => (
                          <button key={t} type="button" onClick={() => setBookType(t)}
                            className={`flex-1 py-3.5 rounded-xl border-2 text-sm font-bold transition-all ${
                              bookType === t ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-medical' : 'border-gray-200 text-gray-500'
                            }`}>
                            {t === 'hourly' ? '⏱ By the Hour' : '📅 By the Day'}
                          </button>
                        ))}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        {bookType === 'hourly' ? (
                          <div>
                            <label className="label">Number of Hours</label>
                            <input type="number" min={1} max={24} value={hours} onChange={e => setHours(+e.target.value)} className="input" />
                          </div>
                        ) : (
                          <div>
                            <label className="label">Number of Days</label>
                            <input type="number" min={1} max={30} value={days} onChange={e => setDays(+e.target.value)} className="input" />
                          </div>
                        )}
                        <div>
                          <label className="label">Start Date *</label>
                          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                            className="input" required min={new Date().toISOString().split('T')[0]} />
                        </div>
                      </div>

                      <div>
                        <label className="label">Additional Notes</label>
                        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                          className="input resize-none" placeholder="Any additional instructions for the nurse..." />
                      </div>

                      {/* Price */}
                      <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-xl p-5 flex justify-between items-center border border-emerald-200">
                        <span className="text-sm text-emerald-700 font-medium">
                          {bookType === 'hourly' ? `${hours} hr × ₹${nurse.hourlyRate}` : `${days} day × ₹${nurse.dailyRate}`}
                        </span>
                        <span className="text-2xl font-extrabold text-emerald-800">₹{cost}</span>
                      </div>

                      {/* Emergency disclaimer */}
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" checked={emergencyDisclaimer} onChange={e => setEmergencyDisclaimer(e.target.checked)}
                            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500" />
                          <span className="text-sm text-red-800">
                            <strong>⚠️ I understand:</strong> This is a <strong>non-emergency home care service</strong>. For medical emergencies, I will contact local emergency services (108/112) immediately. Nursify is not responsible for emergency medical situations.
                          </span>
                        </label>
                      </div>

                      {/* Status note */}
                      <div className="bg-sapphire-50 border border-sapphire-200 rounded-xl p-4 flex items-start gap-3">
                        <FileText size={16} className="text-sapphire-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-sapphire-800">
                          After submitting, your care request will have status <span className="font-bold">Pending</span>. Once reviewed, it will be <span className="font-bold">Assigned</span> to a nurse, and marked <span className="font-bold">Completed</span> after care delivery.
                        </p>
                      </div>

                      <div className="flex justify-between pt-2">
                        <button type="button" onClick={() => setStep(5)} className="btn-secondary">← Back</button>
                        <button type="submit" disabled={submitting || !startDate || !emergencyDisclaimer} className="btn-primary">
                          {submitting ? (
                            <span className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Submitting…
                            </span>
                          ) : <><Calendar size={16} /> Confirm Care Request</>}
                        </button>
                      </div>
                    </>}

                  </form>
                </>
              )}
            </div>
          )}

          {/* ── Reviews tab ── */}
          {tab === 'reviews' && (
            <div className="space-y-5">
              {(nurse.reviews?.length || 0) === 0 && (
                <div className="text-center py-14">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                    <Star size={28} className="text-gray-300" />
                  </div>
                  <p className="text-gray-400 font-medium">No reviews yet. Be the first!</p>
                </div>
              )}
              {nurse.reviews?.map(r => (
                <div key={r.id} className="card p-6 shadow-card">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                        <span className="font-bold text-emerald-700 text-sm">{r.patientName.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-bold text-navy-900">{r.patientName}</p>
                        <p className="text-xs text-gray-400">{r.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} size={12} className="text-amber-400" fill="#fbbf24" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4 leading-relaxed">{r.comment}</p>
                </div>
              ))}

              <div className="card p-7 shadow-glass">
                <h3 className="font-bold text-navy-900 mb-5 flex items-center gap-2">
                  <Heart size={16} className="text-emerald-500" /> Leave a Review
                </h3>
                <form onSubmit={handleReview} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
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
