-- Make user_id nullable for test_notes table to allow testing without authentication
-- This is for development testing only

ALTER TABLE public.test_notes 
ALTER COLUMN user_id DROP NOT NULL;

-- Add a comment to indicate this is a test-only table
COMMENT ON TABLE public.test_notes IS 'Development test table for Supabase connectivity testing. Not for production use.';
COMMENT ON COLUMN public.test_notes.user_id IS 'User ID - nullable for testing purposes';
