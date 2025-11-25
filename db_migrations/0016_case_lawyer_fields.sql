-- 0016_case_lawyer_fields.sql
-- Add optional lawyer metadata to cases so we can email summaries later.
-- Run this in your Supabase project's SQL editor.

------------------------------------------------------------
-- Add lawyer fields to cases
------------------------------------------------------------

alter table public.cases
  add column if not exists lawyer_name text;

alter table public.cases
  add column if not exists lawyer_email text;

-- No RLS changes needed; existing "Users can manage own cases" policy
-- continues to gate access to these new columns.


