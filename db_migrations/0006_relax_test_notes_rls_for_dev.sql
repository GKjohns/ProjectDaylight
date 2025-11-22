-- Dev-only migration: Relax RLS on test_notes so the src app can always insert/read
-- This table is only for testing Supabase connectivity in development.

-- Drop existing restrictive policies if they exist
DROP POLICY IF EXISTS "Enable read for authenticated users only" ON public.test_notes;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.test_notes;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.test_notes;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.test_notes;
DROP POLICY IF EXISTS "Users can view their own notes" ON public.test_notes;
DROP POLICY IF EXISTS "Users can insert their own notes" ON public.test_notes;
DROP POLICY IF EXISTS "Users can update their own notes" ON public.test_notes;
DROP POLICY IF EXISTS "Users can delete their own notes" ON public.test_notes;

-- Single permissive policy for all operations in dev
CREATE POLICY "Dev allow all on test_notes"
  ON public.test_notes
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Ensure RLS stays enabled (policy still evaluated, but always passes)
ALTER TABLE public.test_notes ENABLE ROW LEVEL SECURITY;


