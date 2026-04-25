'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { CheckCircle, Plus, X, MapPin, Shield, UserPlus, FileText, Stethoscope, Upload, Camera, Loader2 } from 'lucide-react'
import { LOCATIONS, SPECIALIZATIONS } from '@/lib/constants'

const STEP_LABELS = [
  { num: 1, label: 'Personal Info', icon: UserPlus },
  { num: 2, label: 'Professional Details', icon: Stethoscope },
  { num: 3, label: 'Bio & Review', icon: FileText },
]

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Form fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [experience, setExperience] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')
  const [dailyRate, setDailyRate] = useState('')
  const [availability, setAvail] = useState('Flexible')
  const [specs, setSpecs] = useState<string[]>([])
  const [languages, setLanguages] = useState<string[]>(['English'])
  const [langInput, setLangInput] = useState('')
  const [qualifications, setQuals] = useState('')
  const [bio, setBio] = useState('')
  const [photo, setPhoto] = useState('')
  const [location, setLocation] = useState(LOCATIONS[0])
  const [otherSpec, setOtherSpec] = useState('')
  const [regNumber, setRegNumber] = useState('')
  const [regState, setRegState] = useState('')

  // Photo upload state
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [useUrl, setUseUrl] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.user) {
          if (data.user.role !== 'nurse') {
            setError('Only users with the "Nurse" role can register as a nurse.')
          }
          setEmail(data.user.email)
        }
      })
  }, [])

  async function handlePhotoUpload(file: File) {
    setUploadError('')
    setUploading(true)

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file)
    setPreviewUrl(localPreview)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('name', name || 'Nurse')

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()

      if (res.ok && data.url) {
        setPhoto(data.url)
        setUploadError('')
      } else if (data.fallbackUrl) {
        // Storage not configured — use avatar fallback
        setPhoto(data.fallbackUrl)
        setUploadError('Storage not configured yet. Using generated avatar.')
      } else {
        setUploadError(data.error || 'Upload failed')
        setPreviewUrl('')
      }
    } catch {
      setUploadError('Network error. Please try again.')
      setPreviewUrl('')
    }
    setUploading(false)
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handlePhotoUpload(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) handlePhotoUpload(file)
  }

  function toggleSpec(s: string) {
    setSpecs(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  function addLang() {
    if (langInput.trim() && !languages.includes(langInput.trim())) {
      setLanguages(prev => [...prev, langInput.trim()])
      setLangInput('')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (specs.length === 0) { setError('Please select at least one specialization.'); return }
    setError('')
    setSubmitting(true)
    const res = await fetch('/api/nurses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, email, phone, photo,
        experience: +experience,
        hourlyRate: +hourlyRate,
        dailyRate: +dailyRate,
        availability,
        specializations: specs.includes('Others') && otherSpec ? [...specs.filter(s => s !== 'Others'), otherSpec] : specs,
        languages, qualifications, bio,
        location,
        regNumber, regState,
      }),
    })
    if (res.ok) setSuccess(true)
    else {
      const data = await res.json()
      setError(data.error || 'Something went wrong. Please try again.')
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
            <h2 className="text-2xl font-extrabold text-navy-900">Registration Submitted!</h2>
            <p className="text-gray-500 mt-4 leading-relaxed">
              Your profile is under review. Our team will verify your credentials and
              approve your listing within 1–2 business days.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
              <Shield size={13} /> Verification in Progress
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
              <Shield size={16} className="text-emerald-500" />
              <span className="text-emerald-600 font-semibold text-xs uppercase tracking-wider">Verified Healthcare Platform</span>
            </div>
            <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">Register as a Nurse</h1>
            <p className="text-gray-500 mt-2">Join India&apos;s trusted nursing care network. Your profile will be reviewed and verified.</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-0 mb-10 bg-white rounded-2xl p-4 shadow-card border border-gray-100">
            {STEP_LABELS.map((s, i) => (
              <div key={s.num} className="flex items-center flex-1">
                <button
                  onClick={() => {
                    if (s.num < step) setStep(s.num)
                  }}
                  className={`flex items-center gap-2.5 transition-all duration-300 ${s.num < step ? 'cursor-pointer' : 'cursor-default'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${step > s.num
                      ? 'bg-emerald-500 text-white shadow-medical'
                      : step === s.num
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-medical'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                    {step > s.num ? <CheckCircle size={18} /> : <s.icon size={18} />}
                  </div>
                  <div className="hidden sm:block">
                    <p className={`text-xs font-semibold uppercase tracking-wider ${step >= s.num ? 'text-emerald-600' : 'text-gray-400'
                      }`}>Step {s.num}</p>
                    <p className={`text-sm font-bold ${step >= s.num ? 'text-navy-900' : 'text-gray-400'}`}>{s.label}</p>
                  </div>
                </button>
                {i < 2 && (
                  <div className={`flex-1 h-0.5 mx-3 rounded-full transition-all duration-500 ${step > s.num ? 'bg-emerald-500' : 'bg-gray-200'
                    }`} />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="card p-8 space-y-6 shadow-glass">
            {/* Step 1 */}
            {step === 1 && <>
              <div>
                <label className="label">Profile Photo * <span className="text-red-500 text-xs">(mandatory)</span></label>

                {/* Toggle between upload and URL */}
                <div className="flex gap-2 mb-3">
                  <button type="button" onClick={() => setUseUrl(false)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${!useUrl ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}>
                    <Upload size={12} className="inline mr-1" /> Upload Photo
                  </button>
                  <button type="button" onClick={() => setUseUrl(true)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${useUrl ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}>
                    Paste URL
                  </button>
                </div>

                {!useUrl ? (
                  <div className="flex gap-4 items-start">
                    {/* Upload area */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={e => e.preventDefault()}
                      onDrop={handleDrop}
                      className={`flex-1 border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${uploading ? 'border-emerald-400 bg-emerald-50' :
                          photo && !uploadError ? 'border-emerald-400 bg-emerald-50/50' :
                            'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/30'
                        }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 size={28} className="text-emerald-500 animate-spin" />
                          <p className="text-sm text-emerald-600 font-medium">Uploading...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                            <Camera size={22} className="text-gray-400" />
                          </div>
                          <p className="text-sm font-semibold text-navy-900">Click to upload or drag & drop</p>
                          <p className="text-xs text-gray-400">JPEG, PNG or WebP · Max 5MB</p>
                        </div>
                      )}
                    </div>

                    {/* Preview */}
                    {(previewUrl || photo) && (
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-200 shadow-sm flex-shrink-0">
                        <Image
                          src={previewUrl || photo}
                          alt="Preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        {photo && (
                          <div className="absolute bottom-0 inset-x-0 bg-emerald-500 text-white text-[9px] font-bold text-center py-0.5">
                            ✓ Uploaded
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  /* URL fallback */
                  <input value={photo} onChange={e => setPhoto(e.target.value)} className="input" placeholder="https://…" />
                )}

                {uploadError && (
                  <p className="text-xs text-amber-600 mt-2 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">{uploadError}</p>
                )}
                {!photo && !uploading && (
                  <p className="text-xs text-gray-400 mt-2">A professional photo is required for your profile listing.</p>
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name *</label>
                  <input value={name} onChange={e => setName(e.target.value)} className="input" placeholder="Jane Smith" required />
                </div>
                <div>
                  <label className="label">Email *</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="jane@email.com" required />
                </div>
                <div>
                  <label className="label">Phone *</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} className="input" placeholder="+91 98765 43210" required />
                </div>
                <div>
                  <label className="label">Years of Experience *</label>
                  <input type="number" min={0} max={50} value={experience} onChange={e => setExperience(e.target.value)} className="input" placeholder="5" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="label flex items-center gap-2"><MapPin size={15} className="text-emerald-500" /> Primary Service Area *</label>
                  <select value={location} onChange={e => setLocation(e.target.value)} className="input" required>
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <p className="text-xs text-gray-400 mt-1.5">Select the primary area where you are available to provide care.</p>
                </div>
                <div className="sm:col-span-1">
                  <label className="label flex items-center gap-2"><Shield size={14} className="text-emerald-500" /> Nurse Council Reg. No. *</label>
                  <input value={regNumber} onChange={e => setRegNumber(e.target.value)} className="input" placeholder="INC-12345" required />
                </div>
                <div className="sm:col-span-1">
                  <label className="label">Registration State *</label>
                  <input value={regState} onChange={e => setRegState(e.target.value)} className="input" placeholder="e.g. Maharashtra" required />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-xl border border-red-100">{error}</p>}
              <div className="flex justify-end pt-2">
                <button type="button" onClick={() => {
                  if (!name || !email || !phone || !experience || !regNumber || !regState || !photo) setError('Please fill in all required fields marked with *, including profile photo.')
                  else { setError(''); setStep(2) }
                }}
                  className="btn-primary">Next Step →</button>
              </div>
            </>}

            {/* Step 2 */}
            {step === 2 && <>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Hourly Rate ($) *</label>
                  <input type="number" min={10} value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} className="input" placeholder="35" required />
                </div>
                <div>
                  <label className="label">Daily Rate ($)</label>
                  <input type="number" min={50} value={dailyRate} onChange={e => setDailyRate(e.target.value)} className="input" placeholder="250" />
                </div>
              </div>
              <div>
                <label className="label">Availability</label>
                <select value={availability} onChange={e => setAvail(e.target.value)} className="input">
                  {['Flexible', 'Full Time', 'Part Time', 'Weekends Only'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Specializations * (select all that apply)</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {SPECIALIZATIONS.map((s: string) => (
                    <button key={s} type="button" onClick={() => toggleSpec(s)}
                      className={`px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all duration-300 ${specs.includes(s) ? 'bg-emerald-500 text-white border-emerald-500 shadow-medical' : 'border-gray-200 text-gray-600 hover:border-emerald-400 hover:text-emerald-600'
                        }`}>{s}</button>
                  ))}
                </div>
                {specs.includes('Others') && (
                  <div className="mt-4">
                    <label className="label text-emerald-700">Please specify your specialization *</label>
                    <input value={otherSpec} onChange={e => setOtherSpec(e.target.value)}
                      className="input border-emerald-200 focus:ring-emerald-500" placeholder="e.g. Parkinson's Specialized Care" required />
                  </div>
                )}
              </div>
              <div>
                <label className="label">Languages</label>
                <div className="flex gap-2">
                  <input value={langInput} onChange={e => setLangInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addLang())}
                    className="input flex-1" placeholder="Type a language and press Enter" />
                  <button type="button" onClick={addLang} className="btn-secondary px-4">
                    <Plus size={16} /> Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {languages.map(l => (
                    <span key={l} className="badge-emerald flex items-center gap-1.5 pr-2">
                      {l}
                      <button type="button" onClick={() => setLanguages(p => p.filter(x => x !== l))} className="hover:text-red-500 transition-colors">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-xl border border-red-100">{error}</p>}
              <div className="flex justify-between pt-2">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary">← Back</button>
                <button type="button" onClick={() => setStep(3)} disabled={!hourlyRate || specs.length === 0}
                  className="btn-primary">Next Step →</button>
              </div>
            </>}

            {/* Step 3 */}
            {step === 3 && <>
              <div>
                <label className="label">Qualifications & Education *</label>
                <input value={qualifications} onChange={e => setQuals(e.target.value)} className="input"
                  placeholder="BSN, RN – University Name (Year)" required />
              </div>
              <div>
                <label className="label">Professional Bio *</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={5}
                  className="input resize-none" placeholder="Tell patients about your experience, approach to care, and what makes you stand out…" required />
                <p className="text-xs text-gray-400 mt-1.5">{bio.length}/500 characters</p>
              </div>
              {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-xl border border-red-100">{error}</p>}
              <div className="flex justify-between pt-2">
                <button type="button" onClick={() => setStep(2)} className="btn-secondary">← Back</button>
                <button type="submit" disabled={submitting || !qualifications || !bio} className="btn-primary">
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting…
                    </span>
                  ) : '✓ Submit Registration'}
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
