// ── WhatsApp Business Link ──
// Replace this with your actual WhatsApp Business link
export const WHATSAPP_LINK = 'https://wa.me/919553625395'

export const LOCATIONS = [
  'Banjara Hills',
  'Jubilee Hills',
  'Kukatpally',
  'Gachibowli',
  'HITEC City',
  'Madhapur',
  'Kondapur',
  'Secunderabad',
  'LB Nagar',
  'Dilsukhnagar',
  'Ameerpet',
  'Begumpet',
  'Miyapur',
  'Manikonda',
  'Uppal',
  'Kompally',
  'Attapur',
  'Malkajgiri',
  'Shamshabad',
  'Bowenpally',
]

// ── Clinical Skills & Services ──
// Single source of truth — used for nurse skills, patient service selection, and homepage
export const CLINICAL_SKILLS = [
  'Vitals Monitoring',
  'Medication Administration (As per Prescription/Discharge Summary)',
  'IM Injections',
  'Basic Wound Dressing',
  'Updating Family',
  'Simple IV Infusion (Existing Line, Stable Patient)',
  'IV Cannulation (Routine, Non-Difficult)',
  'Urinary Catheter Care (Simple Cases)',
  'Tracheostomy Care',
  'NG / Ryles Tube Feeding',
  'Oxygen Therapy (Continuous/High Flow)',
  'Complex Wound Care (Aseptic)',
  'Complicated Post-Surgical Cases Care',
  'Physiotherapy',
  'Elder Care',
  'Pediatric Care',
  'Palliative Care',
  'Maternity Care',
  'Others',
]

// Short descriptions for homepage & tooltips
export const SKILL_DESCRIPTIONS: Record<string, string> = {
  'Vitals Monitoring': 'Regular monitoring of BP, pulse, temperature, SpO2, and blood sugar levels.',
  'Medication Administration (As per Prescription/Discharge Summary)': 'Safe and timely medication delivery as per doctor\'s prescription or discharge plan.',
  'IM Injections': 'Intramuscular injection administration with proper technique and site rotation.',
  'Basic Wound Dressing': 'Cleaning, dressing, and monitoring of simple surgical or injury wounds.',
  'Updating Family': 'Regular health status updates and clear communication with patient family members.',
  'Simple IV Infusion (Existing Line, Stable Patient)': 'IV fluid and medication infusion through an existing line for stable patients.',
  'IV Cannulation (Routine, Non-Difficult)': 'Inserting IV cannula for routine, non-difficult vein access.',
  'Urinary Catheter Care (Simple Cases)': 'Catheter hygiene, drainage monitoring, and infection prevention for simple cases.',
  'Tracheostomy Care': 'Airway care including cleaning, suctioning, and infection prevention.',
  'NG / Ryles Tube Feeding': 'Feeding support, tube maintenance, and aspiration prevention.',
  'Oxygen Therapy (Continuous/High Flow)': 'Safe oxygen administration and monitoring saturation levels.',
  'Complex Wound Care (Aseptic)': 'Sterile wound care preventing infections during all clinical activities.',
  'Complicated Post-Surgical Cases Care': 'Comprehensive post-operative nursing for complex surgical recoveries.',
  'Physiotherapy': 'At-home physiotherapy for post-surgery rehab, mobility, and pain management.',
  'Elder Care': 'Compassionate care for elderly including mobility, hygiene, and daily living assistance.',
  'Pediatric Care': 'Specialized nursing care for infants and children.',
  'Palliative Care': 'Comfort-focused care for patients with serious or life-limiting conditions.',
  'Maternity Care': 'Pre and post-natal nursing support for mothers and newborns.',
  'Others': 'Other specialized nursing or medical care services not listed above.',
}

// Backward-compatible exports
export const SPECIALIZATIONS = CLINICAL_SKILLS
export const SERVICES_NEEDED = CLINICAL_SKILLS

export const RELATIONS = [
  'Self',
  'Son',
  'Daughter',
  'Spouse',
  'Father',
  'Mother',
  'Sibling',
  'Guardian',
  'Other',
]
