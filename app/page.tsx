import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  Shield, Timer, Star, Heart, Activity, Stethoscope,
  Baby, Brain, Pill, Bone, Leaf, ChevronRight, Search, UserPlus,
  CheckCircle2, Play, PhoneIncoming
} from 'lucide-react'

const stats = [
  { label: 'Home Care', value: 89 },
  { label: 'Senior Care', value: 86 },
  { label: 'Personal Care', value: 82 },
  { label: 'Health Consultation', value: 86 },
]

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative bg-white pt-16 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-[#0a0b2e] leading-[1.1]">
              We Provide <span className="text-[#f84b6d]">Home Care</span> Service For Your Family
            </h1>
            <p className="mt-8 text-lg text-gray-500 max-w-xl leading-relaxed">
              Find experienced, verified nurses for personalized home care in India. Book qualified professionals by the hour or day with complete transparency.
            </p>
            <div className="mt-10 flex flex-wrap gap-5 items-center">
              <Link href="/find-nurses" className="bg-[#f84b6d] hover:bg-[#e63e5d] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-rose-200 transition-all flex items-center gap-2">
                Contact Us
              </Link>
              <button className="flex items-center gap-3 text-[#0a0b2e] font-bold hover:text-[#f84b6d] transition-colors">
                <div className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center">
                  <Play size={18} fill="currentColor" />
                </div>
                Watch Intro
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="relative w-full aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl z-20">
              <Image 
                src="/hero.png"
                alt="Nursing Care"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Markers ── */}
      <section className="bg-[#0a0b2e] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-10">
          {[
            { icon: CheckCircle2, title: 'Satisfaction Guarantee', desc: 'We ensure high-quality care with a focus on patient comfort and recovery speed.' },
            { icon: UserPlus, title: 'Professional Nurse', desc: 'Every nurse on our platform is verified through the Nursing Council.' },
            { icon: Timer, title: 'Low Cost Service', desc: 'Get transparent, competitive pricing by the hour or day without hidden fees.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center text-[#f84b6d] transition-transform group-hover:scale-110">
                <Icon size={48} strokeWidth={1} />
              </div>
              <h3 className="text-white text-xl font-bold mb-3">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── About & Progress ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-20 items-start">
          <div className="grid grid-cols-2 gap-4">
             <div className="w-full h-80 rounded-3xl overflow-hidden relative shadow-lg">
                <Image src="/about.png" fill className="object-cover" alt="Care" />
             </div>
             <div className="w-full h-64 rounded-3xl overflow-hidden relative shadow-lg mt-10">
                <Image src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=400" fill className="object-cover" alt="Care 2" />
             </div>
          </div>
          <div>
            <span className="text-[#f84b6d] font-bold text-sm uppercase tracking-wider">About Nursera</span>
            <h2 className="text-4xl font-extrabold text-[#0a0b2e] mt-4 leading-tight">
              We Take Care of <br /> Your Problems Carefully
            </h2>
            <p className="text-gray-500 mt-6 leading-relaxed mb-10">
              Nursecare provides supportive, compassionate and highly qualified nurses for all your nursing and medical needs across major Indian cities.
            </p>
            
            <div className="space-y-6">
              {stats.map(s => (
                <div key={s.label}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-[#0a0b2e]">{s.label}</span>
                    <span className="text-[#f84b6d] font-bold text-sm">{s.value}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#f84b6d] h-full rounded-full" style={{ width: `${s.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex items-center gap-6">
               <div className="bg-[#0a0b2e] text-white p-4 rounded-xl flex items-center gap-4 shadow-xl">
                  <div className="w-10 h-10 bg-[#f84b6d] rounded-full flex items-center justify-center">
                     <PhoneIncoming size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Emergency Call</p>
                    <p className="font-bold">+91 95536 25395</p>
                  </div>
               </div>
               <button className="bg-[#f84b6d] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#e63e5d] transition-all">
                  Book Now
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-[#f84b6d] font-bold text-sm uppercase tracking-wider">Our Services</span>
              <h2 className="text-4xl font-extrabold text-[#0a0b2e] mt-4">What Service We Provide</h2>
            </div>
            <Link href="/find-nurses" className="bg-[#f84b6d] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#e63e5d] transition-all">
              All Services
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Home Care', img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400' },
              { title: 'Senior Care', img: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=400' },
              { title: 'Health Consultation', img: 'https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=400' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm group hover:shadow-xl transition-all duration-500">
                <div className="relative h-64">
                   <Image src={s.img} alt={s.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-10 text-center relative">
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#f84b6d] rounded-full flex items-center justify-center border-4 border-white shadow-lg text-white">
                      <Heart size={24} fill="currentColor" />
                   </div>
                   <h3 className="text-2xl font-bold text-[#0a0b2e] mt-2">{s.title}</h3>
                   <p className="text-gray-500 mt-4 text-sm leading-relaxed">
                     High-quality compassionate medical support provided directly in your home.
                   </p>
                   <Link href="/find-nurses" className="inline-flex items-center gap-2 text-[#f84b6d] font-bold mt-6 hover:gap-3 transition-all">
                     Read More <ChevronRight size={16} />
                   </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
