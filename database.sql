-- ==============================================================================
-- KOYITECH AFRICA WAITLIST - SUPABASE SQL SCHEMA
-- ==============================================================================
-- Instructions: Copy and paste this entire file into your Supabase SQL Editor
-- and click "Run" to automatically set up your database table and security!
-- ==============================================================================

-- 1. Create the waitlist table
CREATE TABLE IF NOT EXISTS public.waitlist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  email text NOT NULL UNIQUE,
  name text,
  phone text
);

-- 2. If the table already exists from earlier, ensure the new columns are added
ALTER TABLE public.waitlist ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.waitlist ADD COLUMN IF NOT EXISTS phone text;

-- 3. Set up Row Level Security (RLS) to protect your data
-- This ensures people can submit the form, but only the admin (using the Service Role Key) can view the data.
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist so we can recreate them cleanly
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.waitlist;
DROP POLICY IF EXISTS "Allow admin read" ON public.waitlist;

-- 4. Allow anyone to submit the waitlist form
CREATE POLICY "Allow anonymous insert" ON public.waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 5. Restrict viewing the waitlist to authenticated users/admins
CREATE POLICY "Allow admin read" ON public.waitlist
  FOR SELECT
  TO authenticated
  USING (true);
