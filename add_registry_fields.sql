-- ==========================================
-- ADD NURSE COUNCIL REGISTRATION FIELDS
-- ==========================================

ALTER TABLE IF EXISTS nurses 
ADD COLUMN IF NOT EXISTS registration_number TEXT,
ADD COLUMN IF NOT EXISTS registration_state TEXT;

-- (Optional) Update existing records to show 'Pending Verification'
UPDATE nurses SET registration_number = 'PENDING' WHERE registration_number IS NULL;
UPDATE nurses SET registration_state = 'Not Specified' WHERE registration_state IS NULL;
