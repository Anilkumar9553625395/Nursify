import Link from 'next/link'
import Image from 'next/image'
import { Star, Clock, User, DollarSign, Shield, MapPin, Heart } from 'lucide-react'
import type { Nurse } from '@/lib/store'

export default function NurseCard({ nurse }: { nurse: Nurse }) {
  return (
    <Link href={`/nurse/${nurse.id}`} className="block group">
      <div className="rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-card-hover bg-white border border-gray-100">
        {/* Photo — Airbnb style: large rounded image */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-emerald-50 to-sapphire-50 overflow-hidden">
          {nurse.photo ? (
            <Image
              src={nurse.photo}
              alt={nurse.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-medical">
                <span className="text-3xl font-extrabold text-white">
                  {nurse.name.charAt(0)}
                </span>
              </div>
            </div>
          )}
          
          {/* Wishlist heart — Airbnb style */}
          <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform" onClick={(e) => e.preventDefault()}>
            <Heart size={15} className="text-gray-600" />
          </button>

          {/* Verified badge */}
          <div className="absolute bottom-3 left-3">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1 flex items-center gap-1 shadow-sm">
              <Shield size={11} className="text-emerald-600" />
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Verified</span>
            </div>
          </div>
        </div>

        {/* Info — Airbnb style: clean, minimal */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-base text-navy-900 group-hover:text-emerald-600 transition-colors">{nurse.name}</h3>
              {nurse.location && (
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                  <MapPin size={12} /> {nurse.location}
                </p>
              )}
            </div>
            {nurse.rating > 0 && (
              <div className="flex items-center gap-1 text-sm font-semibold text-navy-900 flex-shrink-0">
                <Star size={13} className="text-navy-900" fill="currentColor" />
                {nurse.rating}
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <User size={12} /> {nurse.experience}yr exp
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {nurse.availability}
            </span>
          </div>

          {/* Specializations */}
          <div className="flex flex-wrap gap-1 mt-2.5">
            {nurse.specializations.slice(0, 2).map((s) => (
              <span key={s} className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md">{s}</span>
            ))}
            {nurse.specializations.length > 2 && (
              <span className="text-xs text-gray-400">+{nurse.specializations.length - 2} more</span>
            )}
          </div>

          {/* Price & Action — Airbnb style */}
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
            <div>
              <span className="font-bold text-navy-900">₹{nurse.hourlyRate}</span>
              <span className="text-sm text-gray-500"> / hour</span>
            </div>
            <div className="bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-300">
              Schedule Care
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
