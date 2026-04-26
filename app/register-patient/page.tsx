'use client'

import { useState, useEffect, useRef } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { CheckCircle, MapPin, Shield, User, Heart, Phone, AlertTriangle, FileText, UserCheck, Upload, Loader2, X } from 'lucide-react'
import { LOCATIONS, RELATIONS, SERVICES_NEEDED } from '@/lib/constants'

const STEP_LABELS = [
  { num: 1, label: 'Your Details',   icon: User },
  { num: 2, label: 'Patient Info',   icon: Heart },
  { num: 3, label: 'Care Needs',     icon: FileText },
]

export default function RegisterPatientPage() {
  const [step, setStep] = useState(1)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Step 1: Requester
  const [requesterName, setRequesterName] = useState('')
  const [requesterEmail, setRequesterEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [requesterPhone, setRequesterPhone] = useState('')
  const [relationToPatient, setRelation] = useState('Self')

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.user) {
          setRequesterEmail(data.user.email)
          setIsLoggedIn(true)
        }
      })
  }, [])

  // Step 2: Patient
  const [patientName, setPatientName] = useState('')
  const [patientAge, setPatientAge] = useState('')
  const [patientGender, setPatientGender] = useState('')
  const [patientAddress, setPatientAddress] = useState('')
  const [patientLocation, setPatientLocation] = useState(LOCATIONS[0])
  const [patientContact, setPatientContact] = useState('')
  const [emergencyContact, setEmergencyContact] = useState('')
  const [emergencyRelation, setEmergencyRelation] = useState('')

  // Step 3: Care needs
  const [careDescription, setCareDescription] = useState('')
  const [servicesNeeded, setServicesNeeded] = useState<string[]>([])
  const [diagnosis, setDiagnosis] = useState('')
  const [recentAdmissions, setRecentAdmissions] = useState(false)
  const [treatmentPlan, setTreatmentPlan] = useState('')
  const [documentUrl, setDocumentUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [consentAccepted, setConsentAccepted] = useState(false)
  const [patientConsentStatus, setPatientConsentStatus] = useState('direct')
  const [unableReason, setUnableReason] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = async (file: File) => {
    setUploading(true)
    setUploadError('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('bucket', 'Patient Documents')

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await res.json()
      setDocumentUrl(data.url)
    } catch (err: any) {
      console.error('File upload error:', err)
      setUploadError(err.message || 'Failed to upload document')
    } finally {
      setUploading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  function toggleService(s: string) {
    setServicesNeeded(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (servicesNeeded.length === 0) { setError('Please select at least one service needed.'); return }
    setError('')
    setSubmitting(true)

    if (!isLoggedIn && password) {
      const signupRes = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: requesterEmail, email: requesterEmail, password, role: 'patient' }),
      })
      if (!signupRes.ok) {
        const d = await signupRes.json()
        setError(d.message || 'Signup failed')
        setSubmitting(false)
        return
      }
    }

    // Store patient registration data (using the bookings API for now as a care request)
    try {
      const res = await fetch('/api/patient-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requesterName, requesterEmail, requesterPhone,
          relationToPatient,
          patientName, patientAge: +patientAge, patientGender,
          patientAddress, patientLocation, patientContact,
          emergencyContact, emergencyRelation,
          careDescription, servicesNeeded, diagnosis,
          recentAdmissions, treatmentPlan,
          documentUrl,
        }),
      })

      if (res.ok) {
        setSuccess(true)
      } else {
        const data = await res.json()
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    }
    setSubmitting(false)
  }

  if (success) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-medical-bg flex items-center justify-center p-4">
          <div className="card p-12 max-w-md w-full text-center shadow-glass-lg">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-medical">
              <CheckCircle size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-navy-900">Patient Registered!</h2>
            <p className="text-gray-500 mt-4 leading-relaxed">
              Thank you for registering. You can now browse nurses and schedule care for {patientName}.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a href="/find-nurses" className="btn-primary justify-center">
                <UserCheck size={16} /> Find a Nurse Now
              </a>
              <a href="/" className="btn-secondary justify-center text-sm">
                Back to Home
              </a>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
              <Shield size={13} /> Profile Created Successfully
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-medical-bg py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <Heart size={16} className="text-emerald-500" />
              <span className="text-emerald-600 font-semibold text-xs uppercase tracking-wider">For You & Your Loved Ones</span>
            </div>
            <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">Register as a Patient</h1>
            <p className="text-gray-500 mt-2">Create your patient profile to easily schedule nursing care. Your information helps us match you with the right nurse.</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-0 mb-10 bg-white rounded-2xl p-4 shadow-card border border-gray-100">
            {STEP_LABELS.map((s, i) => (
              <div key={s.num} className="flex items-center flex-1">
                <button
                  onClick={() => { if (s.num < step) setStep(s.num) }}
                  className={`flex items-center gap-2.5 transition-all duration-300 ${s.num < step ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    step > s.num
                      ? 'bg-emerald-500 text-white shadow-medical'
                      : step === s.num
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-medical'
                        : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step > s.num ? <CheckCircle size={18} /> : <s.icon size={18} />}
                  </div>
                  <div className="hidden sm:block">
                    <p className={`text-xs font-semibold uppercase tracking-wider ${step >= s.num ? 'text-emerald-600' : 'text-gray-400'}`}>Step {s.num}</p>
                    <p className={`text-sm font-bold ${step >= s.num ? 'text-navy-900' : 'text-gray-400'}`}>{s.label}</p>
                  </div>
                </button>
                {i < 2 && (
                  <div className={`flex-1 h-0.5 mx-3 rounded-full transition-all duration-500 ${step > s.num ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="card p-8 space-y-6 shadow-glass">

            {/* ── Step 1: Your Details ── */}
            {step === 1 && <>
              <div>
                <h2 className="font-bold text-navy-900 text-lg flex items-center gap-2 mb-1">
                  <User size={18} className="text-emerald-500" /> Your Details
                </h2>
                <p className="text-sm text-gray-500">Tell us who is registering. Are you the patient, or a family member?</p>
              </div>

              <div>
                <label className="label">Your Relation to the Patient *</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-1">
                  {RELATIONS.map(r => (
                    <button key={r} type="button" onClick={() => setRelation(r)}
                      className={`py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                        relationToPatient === r
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-medical'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Your Full Name *</label>
                  <input value={requesterName} onChange={e => setRequesterName(e.target.value)} className="input" placeholder="Your name" required />
                </div>
                <div>
                  <label className="label">Email *</label>
                  <input type="email" value={requesterEmail} onChange={e => setRequesterEmail(e.target.value)} className="input" placeholder="you@example.com" required disabled={isLoggedIn} />
                </div>
                {!isLoggedIn && (
                  <div className="sm:col-span-2">
                    <label className="label">Password * (for login)</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input" placeholder="••••••••" required />
                  </div>
                )}
                <div className="sm:col-span-2">
                  <label className="label">Phone *</label>
                  <input value={requesterPhone} onChange={e => setRequesterPhone(e.target.value)} className="input" placeholder="+91 98765 43210" required />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-xl border border-red-100">{error}</p>}

              <div className="flex justify-end pt-2">
                <button type="button" onClick={() => {
                  if (!requesterName || !requesterEmail || (!isLoggedIn && !password) || !requesterPhone) { setError('Please fill in all required fields including password.'); return }
                  setError(''); setStep(2)
                }} className="btn-primary">Continue →</button>
              </div>
            </>}

            {/* ── Step 2: Patient Information ── */}
            {step === 2 && <>
              <div>
                <h2 className="font-bold text-navy-900 text-lg flex items-center gap-2 mb-1">
                  <Heart size={18} className="text-emerald-500" /> Patient Information
                </h2>
                <p className="text-sm text-gray-500">
                  {relationToPatient === 'Self' ? 'Your personal and contact details.' : `Details of the ${relationToPatient.toLowerCase()} who will receive care.`}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Patient Full Name *</label>
                  <input value={patientName} onChange={e => setPatientName(e.target.value)} className="input"
                    placeholder={relationToPatient === 'Self' ? requesterName || 'Your name' : 'Patient name'} required />
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
                  <label className="label">Home Address *</label>
                  <textarea value={patientAddress} onChange={e => setPatientAddress(e.target.value)} className="input resize-none" rows={2}
                    placeholder="Full home address where nursing care will be provided" required />
                </div>
                <div>
                  <label className="label flex items-center gap-1.5"><MapPin size={14} className="text-emerald-500" /> Area / Location *</label>
                  <select value={patientLocation} onChange={e => setPatientLocation(e.target.value)} className="input" required>
                    {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Patient Contact Number *</label>
                  <input value={patientContact} onChange={e => setPatientContact(e.target.value)} className="input" placeholder="+91 98765 43210" required />
                </div>
                <div>
                  <label className="label flex items-center gap-1.5"><Phone size={14} className="text-red-400" /> Emergency Contact *</label>
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

              {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-xl border border-red-100">{error}</p>}

              <div className="flex justify-between pt-2">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary">← Back</button>
                <button type="button" onClick={() => {
                  if (!patientName || !patientAge || !patientGender || !patientAddress || !patientContact || !emergencyContact || !emergencyRelation) {
                    setError('Please fill in all required fields.'); return
                  }
                  setError(''); setStep(3)
                }} className="btn-primary">Continue →</button>
              </div>
            </>}

            {/* ── Step 3: Care Needs ── */}
            {step === 3 && <>
              <div>
                <h2 className="font-bold text-navy-900 text-lg flex items-center gap-2 mb-1">
                  <FileText size={18} className="text-emerald-500" /> Care Needs
                </h2>
                <p className="text-sm text-gray-500">Help us understand what kind of nursing care is needed.</p>
              </div>

              <div>
                <label className="label">Describe the care needed *</label>
                <textarea value={careDescription} onChange={e => setCareDescription(e.target.value)} className="input resize-none" rows={3}
                  placeholder="Briefly describe the patient's condition and their care requirements..." required />
              </div>

              <div>
                <label className="label">Diagnosis (if known)</label>
                <input value={diagnosis} onChange={e => setDiagnosis(e.target.value)} className="input"
                  placeholder="e.g. Type 2 Diabetes, Post-hip replacement, Chronic kidney disease..." />
              </div>

              <div>
                <label className="label mb-3">Any recent hospital admissions or procedures?</label>
                <div className="flex gap-3">
                  {[true, false].map(v => (
                    <button key={String(v)} type="button" onClick={() => setRecentAdmissions(v)}
                      className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                        recentAdmissions === v ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-500'
                      }`}>
                      {v ? 'Yes' : 'No'}
                    </button>
                  ))}
                </div>
              </div>

              {recentAdmissions && (
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-5">
                  <label className="label text-emerald-800">Discharge summary / Treatment plan</label>
                  <textarea value={treatmentPlan} onChange={e => setTreatmentPlan(e.target.value)} className="input resize-none border-emerald-200" rows={3}
                    placeholder="Enter details from the discharge summary or treatment plan..." />
                </div>
              )}

              <div>
                <label className="label mb-2">Services Needed * (select all that apply)</label>
                <div className="grid sm:grid-cols-2 gap-2">
                  {SERVICES_NEEDED.map(s => (
                    <button key={s} type="button" onClick={() => toggleService(s)}
                      className={`text-left px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
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
              </div>

              {/* Document Upload */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <label className="label">Medical Documents / Prescriptions</label>
                <p className="text-xs text-gray-500 mb-3">Upload any relevant medical records, prescriptions, or pictures (optional).</p>
                
                {documentUrl ? (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200">
                    <FileText size={20} className="text-emerald-500" />
                    <a href={documentUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-sm font-semibold text-emerald-600 hover:underline truncate">
                      View Uploaded Document
                    </a>
                    <button type="button" onClick={() => setDocumentUrl('')} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div 
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 bg-white hover:bg-gray-50'}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload}
                      className="hidden" 
                      accept="image/jpeg,image/png,image/webp,application/pdf" 
                    />
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                      {uploading ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
                    </div>
                    <p className="text-sm font-semibold text-navy-900 mb-1">
                      {uploading ? 'Uploading...' : 'Drag and drop your file here'}
                    </p>
                    <p className="text-xs text-gray-500 mb-4">or click to browse from your device</p>
                    
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:border-emerald-500 hover:text-emerald-600 transition-colors disabled:opacity-50"
                    >
                      Browse Files
                    </button>
                    {uploadError && <p className="text-xs text-red-500 mt-3">{uploadError}</p>}
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm text-amber-800 flex items-start gap-2">
                  <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                  <span><strong>Note:</strong> This is a non-emergency home care service. For medical emergencies, contact local emergency services (108/112) immediately.</span>
                </p>
              </div>

              {/* Patient Consent Form */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-inner">
                <div className="bg-gray-50 border-b border-gray-200 p-4">
                  <h3 className="font-bold text-navy-900 text-base">Patient Consent for Home Nursing Services</h3>
                </div>
                <div className="p-5 max-h-80 overflow-y-auto text-sm text-gray-700 space-y-5 custom-scrollbar">
                  
                  <div>
                    <h4 className="font-bold text-navy-900 mb-1">1. Nature of Service</h4>
                    <p>I understand that I am receiving home-based nursing care services arranged through this platform. These services are provided in a non-hospital setting.</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-navy-900 mb-1">2. Scope of Care</h4>
                    <p className="mb-2">I understand that the nurse will:</p>
                    <ul className="list-disc pl-5 space-y-1 mb-3">
                      <li>Provide basic nursing care</li>
                      <li>Assist with daily activities</li>
                      <li>Administer medications only as prescribed by a doctor</li>
                      <li>Monitor vital signs</li>
                    </ul>
                    <p className="mb-2">I understand that the nurse will NOT:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Diagnose medical conditions</li>
                      <li>Prescribe or change medications</li>
                      <li>Replace hospital-based care</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-navy-900 mb-1">3. Risks & Limitations</h4>
                    <p className="mb-2">I acknowledge that home care has limitations, including but not limited to:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Risk of falls or injury</li>
                      <li>Delay in recognising medical deterioration</li>
                      <li>Limited emergency support compared to a hospital setting</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-navy-900 mb-1">4. Emergency Situations</h4>
                    <p className="mb-2">I understand that this service is NOT for emergency care. In case of symptoms such as:</p>
                    <ul className="list-disc pl-5 space-y-1 mb-2">
                      <li>Chest pain</li>
                      <li>Difficulty breathing</li>
                      <li>Sudden weakness or stroke symptoms</li>
                      <li>Loss of consciousness</li>
                    </ul>
                    <p>I (or my family) will immediately contact emergency services or go to the nearest hospital.</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-navy-900 mb-1">5. Responsibility</h4>
                    <p className="mb-2">I understand that:</p>
                    <ul className="list-disc pl-5 space-y-1 mb-2">
                      <li>The nurse is responsible for the care they provide</li>
                      <li>The platform acts as a service coordinator/connector</li>
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="font-bold text-navy-900 text-base mb-3">Family/Caregiver Acknowledgment</h3>
                    
                    <div className="mb-4">
                      <p className="font-semibold text-gray-900 mb-2">Relationship to Patient: <span className="font-normal text-emerald-600">{relationToPatient}</span></p>
                      
                      <div className="space-y-2 mt-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="consentStatus" 
                            value="direct" 
                            checked={patientConsentStatus === 'direct'} 
                            onChange={() => setPatientConsentStatus('direct')}
                            className="text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>The patient has provided consent directly</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="consentStatus" 
                            value="unable" 
                            checked={patientConsentStatus === 'unable'} 
                            onChange={() => setPatientConsentStatus('unable')}
                            className="text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>The patient is unable to provide consent</span>
                        </label>
                      </div>

                      {patientConsentStatus === 'unable' && (
                        <div className="mt-3">
                          <input 
                            type="text" 
                            placeholder="Reason patient is unable to provide consent..."
                            value={unableReason}
                            onChange={(e) => setUnableReason(e.target.value)}
                            className="input text-sm"
                            required
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border-t border-gray-200 p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div className="flex items-center h-5 mt-0.5">
                      <input
                        type="checkbox"
                        checked={consentAccepted}
                        onChange={(e) => setConsentAccepted(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                        required
                      />
                    </div>
                    <div className="flex-1 text-sm text-gray-700 font-semibold">
                      I have read, understood, and accept the Patient Consent and Acknowledgment terms above. I confirm all provided information is accurate.
                    </div>
                  </label>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-xl border border-red-100">{error}</p>}

              <div className="flex justify-between pt-2">
                <button type="button" onClick={() => setStep(2)} className="btn-secondary">← Back</button>
                <button type="submit" disabled={submitting || servicesNeeded.length === 0 || !careDescription || !consentAccepted || (patientConsentStatus === 'unable' && !unableReason.trim())} className="btn-primary">
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Registering…
                    </span>
                  ) : '✓ Complete Registration'}
                </button>
              </div>
            </>}

          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
