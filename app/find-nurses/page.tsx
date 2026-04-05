'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import NurseCard from '@/components/NurseCard'
import { Search, SlidersHorizontal, MapPin } from 'lucide-react'
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
    fetch('/api/nurses').then(r => r.json()).then(setNurses)
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
      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Find Your Nurse</h1>
            <p className="text-gray-500 mt-1">Browse our verified nursing professionals</p>

            {/* Search + sort row */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="input pl-10"
                  placeholder="Search by name or specialization..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <select
                className="input sm:w-44"
                value={sort}
                onChange={e => setSort(e.target.value)}
              >
                {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
              <button
                className="btn-secondary"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal size={16} /> Filters
              </button>
            </div>

            {/* Extended filters */}
            {showFilters && (
              <div className="mt-4 p-5 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="label">Availability</label>
                    <select className="input" value={availability} onChange={e => setAvail(e.target.value)}>
                      {AVAILABILITY_OPTIONS.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Location</label>
                    <select className="input" value={location} onChange={e => setLocation(e.target.value)}>
                      {LOCATION_OPTIONS.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="label">Specialization</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {['All', ...SPECIALIZATIONS].map(s => (
                      <button
                        key={s}
                        onClick={() => setSpec(s)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                          spec === s
                            ? 'bg-teal-600 text-white border-teal-600'
                            : 'border-gray-200 text-gray-600 hover:border-teal-400'
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-sm text-gray-500 mb-5">{filtered.length} nurse{filtered.length !== 1 ? 's' : ''} found</p>
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">No nurses match your filters.</div>
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
