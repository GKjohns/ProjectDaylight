-- Clean up test_notes table and related objects
-- Run this when you're done testing Supabase connectivity

-- Drop the test_notes table (CASCADE will drop related policies and triggers)
DROP TABLE IF EXISTS public.test_notes CASCADE;

-- Drop the test-specific trigger function
-- (Production tables use set_updated_at, so this is safe to remove)
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Verification queries (run these after to confirm cleanup):
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE '%test%';
-- SELECT policyname FROM pg_policies WHERE tablename = 'test_notes';
