'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { CheckCircle, Plus, X, MapPin } from 'lucide-react'
import { LOCATIONS, SPECIALIZATIONS } from '@/lib/constants'

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Form fields
  const [name, setName]             = useState('')
  const [email, setEmail]           = useState('')
  const [phone, setPhone]           = useState('')
  const [experience, setExperience] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')
  const [dailyRate, setDailyRate]   = useState('')
  const [availability, setAvail]    = useState('Flexible')
  const [specs, setSpecs]           = useState<string[]>([])
  const [languages, setLanguages]   = useState<string[]>(['English'])
  const [langInput, setLangInput]   = useState('')
  const [qualifications, setQuals]  = useState('')
  const [bio, setBio]               = useState('')
  const [photo, setPhoto]           = useState('')
  const [location, setLocation]     = useState(LOCATIONS[0])
  const [otherSpec, setOtherSpec]   = useState('')
  const [regNumber, setRegNumber]   = useState('')
  const [regState, setRegState]     = useState('')

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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="card p-12 max-w-md w-full text-center">
            <CheckCircle size={60} className="text-teal-500 mx-auto mb-5" />
            <h2 className="text-2xl font-bold text-gray-900">Registration Submitted!</h2>
            <p className="text-gray-500 mt-3 leading-relaxed">
              Your profile is under review. Our admin team will verify your details and
              approve your listing within 1–2 business days.
            </p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-gray-900">Register as a Nurse</h1>
          <p className="text-gray-500 mt-1 mb-8">Fill in your details to join our platform. Admin will review and approve your profile.</p>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[1,2,3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  step >= s ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>{s}</div>
                {s < 3 && <div className={`h-0.5 w-16 transition-all ${step > s ? 'bg-teal-600' : 'bg-gray-200'}`} />}
              </div>
            ))}
            <div className="ml-4 text-sm text-gray-500">
              Step {step}: {step === 1 ? 'Personal Info' : step === 2 ? 'Professional Details' : 'Bio & Review'}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="card p-8 space-y-5">
            {/* Step 1 */}
            {step === 1 && <>
              <div>
                <label className="label">Profile Photo URL (optional)</label>
                <input value={photo} onChange={e => setPhoto(e.target.value)} className="input" placeholder="https://…" />
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
                  <input value={phone} onChange={e => setPhone(e.target.value)} className="input" placeholder="+1 234 567 890" required />
                </div>
                <div>
                  <label className="label">Years of Experience *</label>
                  <input type="number" min={0} max={50} value={experience} onChange={e => setExperience(e.target.value)} className="input" placeholder="5" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="label flex items-center gap-2"><MapPin size={15} /> Primary Service Area *</label>
                  <select value={location} onChange={e => setLocation(e.target.value)} className="input" required>
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <p className="text-xs text-gray-400 mt-1.5">Select the primary area where you are available to provide care.</p>
                </div>
                <div className="sm:col-span-1">
                  <label className="label">Nurse Council Reg. No. *</label>
                  <input value={regNumber} onChange={e => setRegNumber(e.target.value)} className="input" placeholder="INC-12345" required />
                </div>
                <div className="sm:col-span-1">
                  <label className="label">Registration State *</label>
                  <input value={regState} onChange={e => setRegState(e.target.value)} className="input" placeholder="e.g. Maharashtra" required />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="button" onClick={() => {
                  if (!name || !email || !phone || !experience || !regNumber || !regState) setError('Please fill in all required fields marked with *')
                  else { setError(''); setStep(2) }
                }}
                  className="btn-primary">Next →</button>
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
                  {['Flexible','Full Time','Part Time','Weekends Only'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Specializations * (select all that apply)</label>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {SPECIALIZATIONS.map((s: string) => (
                    <button key={s} type="button" onClick={() => toggleSpec(s)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                        specs.includes(s) ? 'bg-teal-600 text-white border-teal-600' : 'border-gray-200 text-gray-600 hover:border-teal-400'
                      }`}>{s}</button>
                  ))}
                </div>
                {specs.includes('Others') && (
                  <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
                    <label className="label text-teal-700">Please specify your situation/specialization *</label>
                    <input value={otherSpec} onChange={e => setOtherSpec(e.target.value)} 
                      className="input border-teal-200 focus:ring-teal-500" placeholder="e.g. Parkinson's Specialized Care" required />
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
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {languages.map(l => (
                    <span key={l} className="badge-teal flex items-center gap-1">
                      {l}
                      <button type="button" onClick={() => setLanguages(p => p.filter(x => x !== l))}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between pt-2">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary">← Back</button>
                <button type="button" onClick={() => setStep(3)} disabled={!hourlyRate || specs.length === 0}
                  className="btn-primary">Next →</button>
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
                <p className="text-xs text-gray-400 mt-1">{bio.length}/500 characters</p>
              </div>
              {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg">{error}</p>}
              <div className="flex justify-between pt-2">
                <button type="button" onClick={() => setStep(2)} className="btn-secondary">← Back</button>
                <button type="submit" disabled={submitting || !qualifications || !bio} className="btn-primary">
                  {submitting ? 'Submitting…' : '✓ Submit Registration'}
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
