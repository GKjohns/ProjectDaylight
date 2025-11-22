-- Alternative migration: Create test_notes table with SIMPLIFIED RLS policies
-- This uses a more permissive approach that works better with the Supabase client

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own notes" ON public.test_notes;
DROP POLICY IF EXISTS "Users can insert their own notes" ON public.test_notes;
DROP POLICY IF EXISTS "Users can update their own notes" ON public.test_notes;
DROP POLICY IF EXISTS "Users can delete their own notes" ON public.test_notes;

-- Create simplified policies for authenticated users
CREATE POLICY "Enable read for authenticated users only"
  ON public.test_notes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users only"
  ON public.test_notes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for authenticated users only"
  ON public.test_notes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for authenticated users only"
  ON public.test_notes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Verify RLS is enabled
ALTER TABLE public.test_notes ENABLE ROW LEVEL SECURITY;

