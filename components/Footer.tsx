import { Heart } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-white font-semibold">
            <span className="w-7 h-7 bg-teal-600 rounded-lg flex items-center justify-center">
              <Heart size={14} className="text-white" fill="white" />
            </span>
            NurseCare
          </Link>
          <p className="text-sm">© {new Date().getFullYear()} NurseCare. Quality healthcare at your doorstep.</p>
          <div className="flex gap-4 text-sm">
            <Link href="/find-nurses" className="hover:text-white transition">Find Nurses</Link>
            <Link href="/register"    className="hover:text-white transition">Join as Nurse</Link>
            <Link href="/bookings"    className="hover:text-white transition">My Bookings</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
