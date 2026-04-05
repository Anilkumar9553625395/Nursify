import { supabase } from './supabase'

export type Availability = 'Full Time' | 'Part Time' | 'Flexible' | 'Weekends Only'
export type BookingType = 'hourly' | 'daily'
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'
export type NurseStatus = 'pending' | 'approved' | 'rejected'

export interface Review {
  id: string
  nurseId: string
  patientName: string
  rating: number
  comment: string
  date: string
}

export interface Nurse {
  id: string
  name: string
  email: string
  phone: string
  photo?: string
  experience: number
  hourlyRate: number
  dailyRate: number
  availability: Availability
  specializations: string[]
  languages: string[]
  qualifications: string
  bio: string
  location: string
  regNumber: string
  regState: string
  status: NurseStatus
  rating: number
  reviewCount: number
  reviews?: Review[]
  createdAt: string
}

export interface Booking {
  id: string
  nurseId: string
  nurseName: string
  patientName: string
  patientEmail: string
  patientPhone: string
  bookingType: BookingType
  hours?: number
  days?: number
  startDate: string
  endDate?: string
  totalCost: number
  status: BookingStatus
  notes?: string
  createdAt: string
}

// ── Nurse helpers ─────────────────────────────────────────────────────────────

export async function getAllNurses(): Promise<Nurse[]> {
  const { data, error } = await supabase
    .from('nurses')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []).map(mapNurse)
}

export async function getApprovedNurses(): Promise<Nurse[]> {
  const { data, error } = await supabase
    .from('nurses')
    .select('*')
    .eq('status', 'approved')
    .order('rating', { ascending: false })

  if (error) throw error
  return (data || []).map(mapNurse)
}

export async function getNurseById(id: string): Promise<Nurse | null> {
  const { data, error } = await supabase
    .from('nurses')
    .select('*, reviews(*)')
    .eq('id', id)
    .single()

  console.log('getNurseById data:', data)
  console.log('getNurseById error:', error)
  if (error) return null
  return mapNurse(data)
}

export async function addNurse(nurse: Omit<Nurse, 'id' | 'createdAt' | 'status' | 'rating' | 'reviewCount' | 'reviews'>): Promise<Nurse> {
  const { data, error } = await supabase
    .from('nurses')
    .insert({
      name: nurse.name,
      email: nurse.email,
      phone: nurse.phone,
      photo: nurse.photo,
      experience: nurse.experience,
      hourly_rate: nurse.hourlyRate,
      daily_rate: nurse.dailyRate,
      availability: nurse.availability,
      specializations: nurse.specializations,
      languages: nurse.languages,
      qualifications: nurse.qualifications,
      bio: nurse.bio,
      location: nurse.location,
      registration_number: nurse.regNumber,
      registration_state: nurse.regState,
      status: 'pending'
    })
    .select()
    .single()

  if (error) throw error
  return mapNurse(data)
}

export async function updateNurseStatus(id: string, status: NurseStatus): Promise<Nurse | null> {
  const { data, error } = await supabase
    .from('nurses')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) return null
  return mapNurse(data)
}

export async function addReview(nurse_id: string, review: Omit<Review, 'id' | 'nurseId' | 'date'>): Promise<Nurse> {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      nurse_id: nurse_id,
      patient_name: review.patientName,
      rating: review.rating,
      comment: review.comment
    })
    .select()
    .single()

  if (error) throw error

  // Trigger update for nurse rating/review count
  await updateNurseAggregates(nurse_id)

  // Return the fully updated nurse object with reviews
  const updatedNurse = await getNurseById(nurse_id)
  if (!updatedNurse) throw new Error('Failed to fetch updated nurse')
  return updatedNurse
}

async function updateNurseAggregates(nurseId: string) {
  const { data: reviews } = await supabase.from('reviews').select('rating').eq('nurse_id', nurseId)
  if (!reviews || reviews.length === 0) return

  const count = reviews.length
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / count

  await supabase
    .from('nurses')
    .update({ rating: Math.round(avg * 10) / 10, review_count: count })
    .eq('id', nurseId)
}

// ── Booking helpers ───────────────────────────────────────────────────────────

export async function getAllBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []).map(mapBooking)
}

export async function getBookingsByEmail(email: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('patient_email', email)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []).map(mapBooking)
}

export async function addBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      nurse_id: booking.nurseId,
      nurse_name: booking.nurseName,
      patient_name: booking.patientName,
      patient_email: booking.patientEmail,
      patient_phone: booking.patientPhone,
      booking_type: booking.bookingType,
      hours: booking.hours,
      days: booking.days,
      start_date: booking.startDate,
      end_date: booking.endDate,
      total_cost: booking.totalCost,
      notes: booking.notes,
      status: 'pending'
    })
    .select()
    .single()

  if (error) throw error
  return mapBooking(data)
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<Booking | null> {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) return null
  return mapBooking(data)
}

// ── Mappers ──────────────────────────────────────────────────────────────────

function mapNurse(row: any): Nurse {
  const reviews = row.reviews ? row.reviews.map(mapReview) : undefined
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    photo: row.photo,
    experience: row.experience,
    hourlyRate: row.hourly_rate,
    dailyRate: row.daily_rate,
    availability: row.availability,
    specializations: row.specializations || [],
    languages: row.languages || [],
    qualifications: row.qualifications,
    bio: row.bio,
    location: row.location || 'Not Specified',
    regNumber: row.registration_number || 'N/A',
    regState: row.registration_state || 'N/A',
    status: row.status,
    rating: row.rating,
    reviewCount: row.review_count,
    reviews,
    createdAt: row.created_at,
  }
}

function mapReview(row: any): Review {
  return {
    id: row.id,
    nurseId: row.nurse_id,
    patientName: row.patient_name,
    rating: row.rating,
    comment: row.comment,
    date: row.created_at ? new Date(row.created_at).toLocaleDateString() : 'Just now',
  }
}

function mapBooking(row: any): Booking {
  return {
    id: row.id,
    nurseId: row.nurse_id,
    nurseName: row.nurse_name,
    patientName: row.patient_name,
    patientEmail: row.patient_email,
    patientPhone: row.patient_phone,
    bookingType: row.booking_type,
    hours: row.hours,
    days: row.days,
    startDate: row.start_date,
    endDate: row.end_date,
    totalCost: row.total_cost,
    status: row.status,
    notes: row.notes,
    createdAt: row.created_at,
  }
}
