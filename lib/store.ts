import { supabase } from './supabase'

export type Availability = 'Full Time' | 'Part Time' | 'Flexible' | 'Weekends Only'
export type BookingType = 'hourly' | 'daily'
export type BookingStatus = 'pending' | 'assigned' | 'completed' | 'confirmed' | 'cancelled'
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
  photo: string
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
  adminComments?: string
  createdAt: string
}

export interface Booking {
  id: string
  nurseId: string
  nurseName: string
  // Requester info
  requesterName: string
  requesterEmail: string
  requesterPhone: string
  relationToPatient: string
  // Patient info
  patientName: string
  patientAge: number
  patientGender: string
  patientAddress: string
  patientLocation: string
  patientContact: string
  emergencyContact: string
  emergencyRelation: string
  // Clinical info
  diagnosis: string
  clinicalNotes: string
  recentAdmissions: boolean
  treatmentPlan: string
  servicesNeeded: string[]
  // Decision capacity & consent
  canMakeDecisions: boolean
  understandsLimitations?: boolean
  consentSignedBy: 'patient' | 'relative'
  relativeRelation?: string
  relativeAadhar?: string
  noConsentReason?: string
  // Booking details
  bookingType: BookingType
  hours?: number
  days?: number
  startDate: string
  endDate?: string
  totalCost: number
  status: BookingStatus
  notes?: string
  documents?: string
  createdAt: string
}

// Legacy alias to avoid breaking existing pages that import the old field names
export type { Booking as CareRequest }

// ── Nurse helpers ─────────────────────────────────────────────────────────────

export async function getAllNurses(page: number = 1, pageSize: number = 100): Promise<{ nurses: Nurse[], count: number }> {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await supabase
    .from('nurses')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error
  return {
    nurses: (data || []).map(mapNurse),
    count: count || 0
  }
}

export async function getApprovedNurses(page: number = 1, pageSize: number = 12): Promise<{ nurses: Nurse[], count: number }> {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await supabase
    .from('nurses')
    .select('*', { count: 'exact' })
    .eq('status', 'approved')
    .order('rating', { ascending: false })
    .range(from, to)

  if (error) throw error
  return {
    nurses: (data || []).map(mapNurse),
    count: count || 0
  }
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

export async function updateNurse(id: string, updates: Partial<Nurse>): Promise<Nurse | null> {
  const dbUpdates: any = {}
  if (updates.name !== undefined) dbUpdates.name = updates.name
  if (updates.phone !== undefined) dbUpdates.phone = updates.phone
  if (updates.photo !== undefined) dbUpdates.photo = updates.photo
  if (updates.experience !== undefined) dbUpdates.experience = updates.experience
  if (updates.hourlyRate !== undefined) dbUpdates.hourly_rate = updates.hourlyRate
  if (updates.dailyRate !== undefined) dbUpdates.daily_rate = updates.dailyRate
  if (updates.availability !== undefined) dbUpdates.availability = updates.availability
  if (updates.specializations !== undefined) dbUpdates.specializations = updates.specializations
  if (updates.languages !== undefined) dbUpdates.languages = updates.languages
  if (updates.qualifications !== undefined) dbUpdates.qualifications = updates.qualifications
  if (updates.bio !== undefined) dbUpdates.bio = updates.bio
  if (updates.location !== undefined) dbUpdates.location = updates.location

  const { data, error } = await supabase
    .from('nurses')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Supabase updateNurse error:', error)
    return null
  }
  return mapNurse(data)
}

export async function updateNurseStatus(id: string, status: NurseStatus, adminComments?: string): Promise<Nurse | null> {
  const { data, error } = await supabase
    .from('nurses')
    .update({ 
      status,
      admin_comments: adminComments
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Supabase updateNurseStatus error:', error)
    return null
  }
  return mapNurse(data)
}

export async function getNurseByEmail(email: string): Promise<Nurse | null> {
  const { data, error } = await supabase
    .from('nurses')
    .select('*, reviews(*)')
    .eq('email', email)
    .single()

  if (error || !data) return null
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

export async function getBookingsByNurseId(nurseId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('nurse_id', nurseId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []).map(mapBooking)
}

export async function getBookingsByEmail(email: string): Promise<Booking[]> {
  // Try patient_email first (existing DB column)
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('patient_email', email)
    .order('created_at', { ascending: false })

  if (!error && data && data.length > 0) {
    return data.map(mapBooking)
  }

  // Fallback: try requester_email (new column, may not exist yet)
  const { data: data2 } = await supabase
    .from('bookings')
    .select('*')
    .eq('requester_email', email)
    .order('created_at', { ascending: false })

  if (data2 && data2.length > 0) {
    return data2.map(mapBooking)
  }

  // Return whatever we got (could be empty)
  return (data || []).map(mapBooking)
}

export async function addBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<Booking> {
  // Store extended clinical data as JSON in notes for backward compatibility
  // (the DB may not have all the new columns yet)
  const extendedData = JSON.stringify({
    relationToPatient: booking.relationToPatient,
    patientAge: booking.patientAge,
    patientGender: booking.patientGender,
    patientAddress: booking.patientAddress,
    patientLocation: booking.patientLocation,
    patientContact: booking.patientContact,
    emergencyContact: booking.emergencyContact,
    emergencyRelation: booking.emergencyRelation,
    diagnosis: booking.diagnosis,
    clinicalNotes: booking.clinicalNotes,
    recentAdmissions: booking.recentAdmissions,
    treatmentPlan: booking.treatmentPlan,
    servicesNeeded: booking.servicesNeeded,
    canMakeDecisions: booking.canMakeDecisions,
    understandsLimitations: booking.understandsLimitations,
    consentSignedBy: booking.consentSignedBy,
    relativeRelation: booking.relativeRelation,
    relativeAadhar: booking.relativeAadhar,
    noConsentReason: booking.noConsentReason,
    additionalNotes: booking.notes,
    documents: booking.documents,
  })

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      nurse_id: booking.nurseId,
      nurse_name: booking.nurseName,
      patient_name: booking.patientName,
      patient_email: booking.requesterEmail,
      patient_phone: booking.requesterPhone || '',
      booking_type: booking.bookingType,
      hours: booking.hours,
      days: booking.days,
      start_date: booking.startDate,
      end_date: booking.endDate,
      total_cost: booking.totalCost,
      notes: extendedData,
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

export async function getBookingById(id: string): Promise<Booking | null> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
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
    photo: row.photo || '',
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
    adminComments: row.admin_comments || '',
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
  // Try to parse extended data from notes (JSON)
  let ext: any = {}
  if (row.notes) {
    try { ext = JSON.parse(row.notes) } catch { ext = {} }
  }

  return {
    id: row.id,
    nurseId: row.nurse_id,
    nurseName: row.nurse_name,
    requesterName: row.requester_name || row.patient_name || '',
    requesterEmail: row.requester_email || row.patient_email || '',
    requesterPhone: row.requester_phone || row.patient_phone || '',
    relationToPatient: row.relation_to_patient || ext.relationToPatient || 'Self',
    patientName: row.patient_name || '',
    patientAge: row.patient_age || ext.patientAge || 0,
    patientGender: row.patient_gender || ext.patientGender || '',
    patientAddress: row.patient_address || ext.patientAddress || '',
    patientLocation: row.patient_location || ext.patientLocation || '',
    patientContact: row.patient_contact || ext.patientContact || '',
    emergencyContact: row.emergency_contact || ext.emergencyContact || '',
    emergencyRelation: row.emergency_relation || ext.emergencyRelation || '',
    diagnosis: row.diagnosis || ext.diagnosis || '',
    clinicalNotes: row.clinical_notes || ext.clinicalNotes || '',
    recentAdmissions: row.recent_admissions ?? ext.recentAdmissions ?? false,
    treatmentPlan: row.treatment_plan || ext.treatmentPlan || '',
    servicesNeeded: row.services_needed || ext.servicesNeeded || [],
    canMakeDecisions: row.can_make_decisions ?? ext.canMakeDecisions ?? true,
    understandsLimitations: row.understands_limitations ?? ext.understandsLimitations,
    consentSignedBy: row.consent_signed_by || ext.consentSignedBy || 'patient',
    relativeRelation: row.relative_relation || ext.relativeRelation,
    relativeAadhar: row.relative_aadhar || ext.relativeAadhar,
    noConsentReason: row.no_consent_reason || ext.noConsentReason,
    bookingType: row.booking_type,
    hours: row.hours,
    days: row.days,
    startDate: row.start_date,
    endDate: row.end_date,
    totalCost: row.total_cost,
    status: row.status,
    notes: ext.additionalNotes || (typeof row.notes === 'string' && !row.notes.startsWith('{') ? row.notes : ''),
    documents: row.documents || ext.documents || '',
    createdAt: row.created_at,
  }
}
