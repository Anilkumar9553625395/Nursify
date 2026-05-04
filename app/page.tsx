import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  Shield, Star, Heart, Activity, Stethoscope,
  UserCheck, ChevronRight, Search, UserPlus,
  CheckCircle2, PhoneIncoming, Clock, Users, ArrowRight, Sparkles, MapPin,
  Pill, Scissors, Thermometer, Syringe, Droplets, Wind, Eye, Baby, ShieldCheck
} from 'lucide-react'
import { CLINICAL_SKILLS, SKILL_DESCRIPTIONS } from '@/lib/constants'

const stats = [
  { label: 'Quality Verified',    value: '100%',     icon: Shield },
  { label: 'Serving Now',         value: 'Hyderabad',icon: MapPin },
  { label: 'Coming Soon',         value: 'All India',icon: Sparkles },
  { label: 'Patient Focus',       value: 'Top Tier', icon: Heart },
]

// Map each clinical skill to an icon and color for the homepage
const SKILL_ICONS: Record<string, { icon: any; color: string }> = {
  'Vitals Monitoring':                    { icon: Activity,     color: 'from-emerald-400 to-emerald-600' },
  'Medication Administration (As per Prescription/Discharge Summary)': { icon: Pill, color: 'from-sapphire-400 to-sapphire-600' },
  'IM Injections':                        { icon: Syringe,      color: 'from-navy-700 to-navy-900' },
  'Basic Wound Dressing':                 { icon: Scissors,     color: 'from-amber-400 to-amber-600' },
  'Updating Family':                      { icon: Users,        color: 'from-emerald-500 to-emerald-700' },
  'Simple IV Infusion (Existing Line, Stable Patient)': { icon: Droplets, color: 'from-sapphire-500 to-sapphire-700' },
  'IV Cannulation (Routine, Non-Difficult)': { icon: Syringe,   color: 'from-emerald-600 to-emerald-800' },
  'Urinary Catheter Care (Simple Cases)': { icon: ShieldCheck,  color: 'from-amber-500 to-amber-700' },
  'Tracheostomy Care':                    { icon: Wind,         color: 'from-red-400 to-red-600' },
  'NG / Ryles Tube Feeding':              { icon: Stethoscope,  color: 'from-purple-500 to-purple-700' },
  'Oxygen Therapy (Continuous/High Flow)':{ icon: Wind,         color: 'from-sapphire-400 to-sapphire-600' },
  'Complex Wound Care (Aseptic)':         { icon: Thermometer,  color: 'from-red-500 to-red-700' },
  'Complicated Post-Surgical Cases Care': { icon: Scissors,     color: 'from-navy-700 to-navy-900' },
  'Physiotherapy':                        { icon: Activity,     color: 'from-purple-500 to-purple-700' },
  'Elder Care':                           { icon: Heart,        color: 'from-emerald-400 to-emerald-600' },
  'Pediatric Care':                       { icon: Baby,         color: 'from-pink-400 to-pink-600' },
  'Palliative Care':                      { icon: Heart,        color: 'from-amber-400 to-amber-600' },
  'Maternity Care':                       { icon: Baby,         color: 'from-pink-500 to-pink-700' },
  'Others':                               { icon: Activity,     color: 'from-gray-400 to-gray-600' },
}

const services = CLINICAL_SKILLS.map(skill => ({
  title: skill,
  desc: SKILL_DESCRIPTIONS[skill] || '',
  icon: SKILL_ICONS[skill]?.icon || Activity,
  color: SKILL_ICONS[skill]?.color || 'from-gray-400 to-gray-600',
}))

const trustMarkers = [
  { icon: Shield,        title: 'Licensed & Verified',      desc: 'Every nurse is verified through the Indian Nursing Council with background checks.' },
  { icon: Clock,         title: 'Available 24/7',            desc: 'Round-the-clock nursing care for emergencies and scheduled visits.' },
  { icon: CheckCircle2,  title: 'Satisfaction Guaranteed',   desc: 'We ensure high-quality care focused on patient comfort and recovery.' },
]

const progressStats = [
  { label: 'Home Care',           value: 95 },
  { label: 'Senior Care',         value: 92 },
  { label: 'Post-Surgery Care',   value: 88 },
]

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 medical-pattern" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-sapphire-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 grid lg:grid-cols-2 gap-16 items-center">
          <div className="z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="pulse-dot" />
              <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">Trusted Healthcare Partner</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Professional{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-500">
                Home Nursing
              </span>{' '}
              Care
            </h1>

            <p className="mt-4 text-2xl font-semibold text-emerald-300/90">
              For you and your loved ones.
            </p>

            <p className="mt-5 text-lg text-gray-300 max-w-xl leading-relaxed">
              Find experienced, verified nurses for personalized home care across Hyderabad. Schedule qualified professionals by the hour or day with complete transparency.
            </p>

            <div className="mt-10 flex flex-wrap gap-4 items-center">
              <Link href="/find-nurses" className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-medical hover:shadow-lg transition-all duration-300 flex items-center gap-3 active:scale-[0.97]">
                <Search size={20} />
                Schedule Care
              </Link>
              <Link href="/register" className="border-2 border-white/20 hover:border-emerald-400/50 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center gap-3 hover:bg-white/5">
                <UserPlus size={20} />
                Join as Nurse
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-navy-900 flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">{String.fromCharCode(64 + i)}</span>
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <span className="text-white font-bold">2,000+</span>{' '}
                  <span className="text-gray-400">families trust us</span>
                </div>
              </div>
              <div className="h-6 w-px bg-white/20 hidden sm:block" />
              <div className="flex items-center gap-1.5">
                <Star size={14} className="text-amber-400" fill="#fbbf24" />
                <span className="text-white font-bold text-sm">4.9</span>
                <span className="text-gray-400 text-sm">average rating</span>
              </div>
            </div>
          </div>

          {/* Hero Right — Decorative cards instead of image */}
          <div className="relative hidden lg:block">
            {/* Main decorative area with gradient */}
            <div className="relative w-full aspect-[4/3] rounded-3xl bg-gradient-to-br from-emerald-500/20 via-sapphire-500/10 to-navy-800/30 backdrop-blur-sm z-10 border border-white/10 shadow-2xl overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 medical-pattern opacity-30" />
              <div className="relative text-center p-8">
                <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-medical mb-6">
                  <Heart size={48} className="text-white" fill="white" />
                </div>
                <p className="text-white/90 font-extrabold text-2xl tracking-tight">Trusted Home Care</p>
                <p className="text-emerald-300 text-sm mt-2 font-medium">For You & Your Loved Ones</p>
              </div>
            </div>

            {/* Floating card - Stats */}
            <div className="absolute -bottom-6 -left-6 z-20 bg-white/95 backdrop-blur-xl rounded-2xl p-5 shadow-glass-lg border border-white/50 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-medical">
                  <Activity size={22} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Quality Promise</p>
                  <p className="text-2xl font-extrabold text-navy-900">100%</p>
                </div>
              </div>
            </div>

            {/* Floating card - Location */}
            <div className="absolute -top-4 -right-4 z-20 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-glass-lg border border-white/50 animate-float" style={{ animationDelay: '1.5s' }}>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-emerald-500" />
                <span className="font-bold text-navy-900 text-sm">Hyderabad</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Expanding Soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="relative -mt-8 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-glass-lg border border-gray-100/50 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="p-6 md:p-8 text-center group">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors duration-300">
                  <Icon size={22} className="text-emerald-600" />
                </div>
                <p className="text-2xl md:text-3xl font-extrabold text-navy-900">{value}</p>
                <p className="text-sm text-gray-500 font-medium mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Markers ── */}
      <section className="py-24 bg-medical-bg medical-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-label justify-center">Why Choose Nursify</span>
            <h2 className="section-title mt-4">Healthcare You Can Trust</h2>
            <p className="section-subtitle mx-auto">Every nurse on our platform undergoes rigorous verification to ensure the highest quality of care for you and your loved ones.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {trustMarkers.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card-hover p-8 text-center group">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center group-hover:from-emerald-100 group-hover:to-emerald-200 transition-all duration-500">
                  <Icon size={28} className="text-emerald-600" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About & Progress ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-20 items-start">
          <div className="grid grid-cols-2 gap-4">
             <div className="w-full rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-8 text-white shadow-glass flex flex-col justify-end">
               <Shield size={32} className="mb-4 opacity-80" />
               <p className="text-4xl font-extrabold">100%</p>
               <p className="text-emerald-100 font-medium mt-1">Verified Caregivers</p>
             </div>
             <div className="w-full rounded-3xl bg-gradient-to-br from-navy-800 to-navy-900 p-8 text-white shadow-glass mt-10 flex flex-col justify-end">
               <Heart size={32} className="mb-4 opacity-80" />
               <p className="text-4xl font-extrabold">Top</p>
               <p className="text-gray-300 font-medium mt-1">Quality Standards</p>
             </div>
             <div className="w-full rounded-3xl bg-gradient-to-br from-sapphire-500 to-sapphire-700 p-8 text-white shadow-glass flex flex-col justify-end">
               <MapPin size={32} className="mb-4 opacity-80" />
               <p className="text-4xl font-extrabold">HYD</p>
               <p className="text-sapphire-100 font-medium mt-1">Serving Hyderabad</p>
             </div>
             <div className="w-full rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 p-8 text-white shadow-glass mt-[-20px] flex flex-col justify-end">
               <Sparkles size={32} className="mb-4 opacity-80" />
               <p className="text-4xl font-extrabold">Soon</p>
               <p className="text-amber-100 font-medium mt-1">All India Launch</p>
             </div>
          </div>

          <div>
            <span className="section-label">About Nursify</span>
            <h2 className="section-title mt-4">
              Compassionate Care,<br />Professional Expertise
            </h2>
            <p className="text-gray-500 mt-6 leading-relaxed mb-10">
              Nursify brings together qualified, compassionate nurses for all your nursing and medical needs across Hyderabad. Every professional is verified through the Nursing Council — because your family deserves the best care.
            </p>
            
            <div className="space-y-5">
              {progressStats.map(s => (
                <div key={s.label}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm text-navy-900">{s.label}</span>
                    <span className="text-emerald-600 font-bold text-sm">{s.value}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full rounded-full transition-all duration-1000" style={{ width: `${s.value}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex items-center gap-5 flex-wrap">
               <a href="https://wa.me/919553625395" target="_blank" rel="noopener noreferrer" className="bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 text-navy-900 p-4 rounded-2xl flex items-center gap-4 group">
                  <div className="w-11 h-11 bg-gray-200 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                     <PhoneIncoming size={20} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Emergency Line</p>
                    <p className="font-bold text-lg tracking-tight group-hover:text-emerald-600 transition-colors">+91 95536 25395</p>
                  </div>
               </a>
               <Link href="/find-nurses" className="btn-primary px-8 py-3.5 text-base">
                 Schedule Care <ArrowRight size={18} />
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services — Airbnb-style cards ── */}
      <section className="py-24 gradient-medical">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div>
              <span className="section-label">Our Services</span>
              <h2 className="section-title mt-4">What We Provide</h2>
              <p className="section-subtitle">Comprehensive nursing services for you and your loved ones.</p>
            </div>
            <Link href="/find-nurses" className="btn-primary flex-shrink-0">
              All Services <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((s, i) => (
              <div key={i} className="card-hover p-5 group">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <s.icon size={20} className="text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-bold text-navy-900 group-hover:text-emerald-600 transition-colors mb-1.5 leading-snug">{s.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 medical-pattern opacity-50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-8 border border-white/10">
            <Sparkles size={14} className="text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-300">Start Your Care Journey</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            Quality Nursing Care<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-500">For You & Your Loved Ones</span>
          </h2>
          
          <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Join thousands of families across Hyderabad who trust Nursify for professional, compassionate home healthcare. Schedule your first consultation today.
          </p>
          
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/find-nurses" className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-medical hover:shadow-lg transition-all duration-300 flex items-center gap-3 active:scale-[0.97]">
              <Search size={20} /> Schedule Care
            </Link>
            <Link href="/register" className="border-2 border-white/20 hover:border-emerald-400/50 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center gap-3 hover:bg-white/5">
              <UserPlus size={20} /> Join Our Team
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
