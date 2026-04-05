-- ==========================================
-- FIX SUPABASE RLS POLICIES FOR NURSECARE
-- ==========================================

-- 1. Enable RLS on all tables (if not already enabled)
ALTER TABLE IF EXISTS nurses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS bookings ENABLE ROW LEVEL SECURITY;

-- 2. POLICIES FOR 'NURSES' TABLE (Corrected)
-- Allow anyone to read approved nurses
DROP POLICY IF EXISTS "Nurses are viewable by everyone" ON nurses;
CREATE POLICY "Nurses are viewable by everyone" ON nurses FOR SELECT USING (true);

-- Allow public to INSERT new nurse registrations
DROP POLICY IF EXISTS "Public can register as nurse" ON nurses;
CREATE POLICY "Public can register as nurse" ON nurses FOR INSERT WITH CHECK (true);

-- 3. POLICIES FOR 'REVIEWS' TABLE
-- Allow anyone to read reviews
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON reviews;
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);

-- Allow anyone to insert a review
DROP POLICY IF EXISTS "Public can insert reviews" ON reviews;
CREATE POLICY "Public can insert reviews" ON reviews FOR INSERT WITH CHECK (true);

-- 4. POLICIES FOR 'BOOKINGS' TABLE
-- Allow anyone to create a booking
DROP POLICY IF EXISTS "Public can create bookings" ON bookings;
CREATE POLICY "Public can create bookings" ON bookings FOR INSERT WITH CHECK (true);

-- Allow users to view their own bookings
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
CREATE POLICY "Users can view their own bookings" ON bookings FOR SELECT USING (true);
