'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import NurseCard from '@/components/NurseCard'
import { Search, SlidersHorizontal, MapPin, Shield, Activity } from 'lucide-react'
import type { Nurse } from '@/lib/store'
import { LOCATIONS, SPECIALIZATIONS } from '@/lib/constants'

const SORT_OPTIONS = ['Highest Rated', 'Most Experience', 'Lowest Price', 'Highest Price']
const AVAILABILITY_OPTIONS = ['Any', 'Full Time', 'Part Time', 'Flexible', 'Weekends Only']
const LOCATION_OPTIONS = ['All Locations', ...LOCATIONS]

export default function FindNursesPage() {
  const [nurses, setNurses]           = useState<Nurse[]>([])
  const [search, setSearch]           = useState('')
  const [spec, setSpec]               = useState('All')
  const [sort, setSort]               = useState('Highest Rated')
  const [availability, setAvail]      = useState('Any')
  const [location, setLocation]       = useState('All Locations')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetch('/api/nurses').then(r => r.json()).then(data => {
      setNurses(data.nurses || [])
    })
  }, [])

  const filtered = nurses
    .filter(n => {
      const q = search.toLowerCase()
      const matchSearch = !q || n.name.toLowerCase().includes(q) ||
        n.specializations.some(s => s.toLowerCase().includes(q))
      const matchSpec = spec === 'All' || n.specializations.includes(spec)
      const matchAvail = availability === 'Any' || n.availability === availability
      const matchLoc = location === 'All Locations' || n.location === location
      return matchSearch && matchSpec && matchAvail && matchLoc
    })
    .sort((a, b) => {
      if (sort === 'Highest Rated')    return b.rating - a.rating
      if (sort === 'Most Experience')  return b.experience - a.experience
      if (sort === 'Lowest Price')     return a.hourlyRate - b.hourlyRate
      if (sort === 'Highest Price')    return b.hourlyRate - a.hourlyRate
      return 0
    })

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-medical-bg">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 gradient-hero" />
          <div className="absolute inset-0 medical-pattern opacity-50" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={16} className="text-emerald-400" />
              <span className="text-emerald-400 font-semibold text-xs uppercase tracking-wider">All Nurses Verified</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Find Your Nurse</h1>
            <p className="text-gray-300 mt-2 text-base">Browse our network of verified nursing professionals</p>

            {/* Search + sort row */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 pl-11 py-3.5 text-sm font-medium text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-500 transition-all"
                  placeholder="Search by name or specialization..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <select
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/40 sm:w-48"
                value={sort}
                onChange={e => setSort(e.target.value)}
              >
                {SORT_OPTIONS.map(o => <option key={o} className="text-navy-900">{o}</option>)}
              </select>
              <button
                className="border-2 border-white/20 text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-white/10 transition-all flex items-center gap-2 justify-center"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal size={16} /> Filters
              </button>
            </div>

            {/* Extended filters */}
            {showFilters && (
              <div className="mt-4 p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 animate-slide-up">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-1.5">Availability</label>
                    <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/40" value={availability} onChange={e => setAvail(e.target.value)}>
                      {AVAILABILITY_OPTIONS.map(o => <option key={o} className="text-navy-900">{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-1.5">Location</label>
                    <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/40" value={location} onChange={e => setLocation(e.target.value)}>
                      {LOCATION_OPTIONS.map(o => <option key={o} className="text-navy-900">{o}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mt-5">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Specialization</label>
                  <div className="flex flex-wrap gap-2">
                    {['All', ...SPECIALIZATIONS].map(s => (
                      <button
                        key={s}
                        onClick={() => setSpec(s)}
                        className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all duration-300 border ${
                          spec === s
                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-medical'
                            : 'border-white/20 text-gray-300 hover:border-emerald-400/50 hover:text-emerald-300'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
              <Activity size={14} className="text-emerald-500" />
              {filtered.length} nurse{filtered.length !== 1 ? 's' : ''} found
            </p>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                <Search size={28} className="text-gray-300" />
              </div>
              <p className="text-gray-400 font-medium">No nurses match your filters.</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(n => <NurseCard key={n.id} nurse={n} />)}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
