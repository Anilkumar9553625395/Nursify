import Link from 'next/link'
import Image from 'next/image'
import { Star, Clock, User, DollarSign } from 'lucide-react'
import type { Nurse } from '@/lib/store'

export default function NurseCard({ nurse }: { nurse: Nurse }) {
  return (
    <div className="card hover:shadow-md transition-shadow duration-200 flex flex-col">
      {/* Photo */}
      <div className="relative h-52 bg-teal-50">
        {nurse.photo ? (
          <Image
            src={nurse.photo}
            alt={nurse.name}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl font-bold text-teal-300">
              {nurse.name.charAt(0)}
            </span>
          </div>
        )}
        {/* Rating badge */}
        {nurse.rating > 0 && (
          <div className="absolute top-3 right-3 bg-white rounded-full px-2.5 py-1 flex items-center gap-1 shadow text-sm font-semibold">
            <Star size={12} className="text-yellow-400" fill="#facc15" />
            {nurse.rating}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-gray-900">{nurse.name}</h3>

        <div className="flex gap-4 mt-1 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <User size={13} /> {nurse.experience}yr exp
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} /> {nurse.availability}
          </span>
        </div>

        {/* Specializations */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {nurse.specializations.slice(0, 3).map((s) => (
            <span key={s} className="badge-teal">{s}</span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 mt-4">
          <div className="flex items-center gap-1 text-teal-700 font-bold">
            <DollarSign size={15} />
            ${nurse.hourlyRate}/hr
          </div>
          <Link href={`/nurse/${nurse.id}`} className="btn-primary text-sm px-4 py-2">
            View Profile
          </Link>
        </div>
      </div>
    </div>
  )
}
