-- Migration: 0018_exports_table.sql
-- Description: Add exports table for persisting generated exports
-- Date: 2025-11-26

-- Create the updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create exports table
CREATE TABLE IF NOT EXISTS public.exports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- User-editable fields
  title text NOT NULL,
  markdown_content text NOT NULL,
  
  -- Export configuration
  focus text NOT NULL DEFAULT 'full-timeline',
  
  -- Lightweight metadata as JSONB (generation context)
  -- Stores: case_title, court_name, recipient, overview_notes,
  --         include_evidence_index, include_overview, include_ai_summary,
  --         events_count, evidence_count, ai_summary_included
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add comment
COMMENT ON TABLE public.exports IS 'User-generated exports/reports with metadata about generation context';
COMMENT ON COLUMN public.exports.metadata IS 'Lightweight JSON storing generation preferences and counts (case_title, court_name, recipient, events_count, evidence_count, etc.)';

-- Create index for user lookups
CREATE INDEX IF NOT EXISTS exports_user_id_idx ON public.exports(user_id);
CREATE INDEX IF NOT EXISTS exports_created_at_idx ON public.exports(created_at DESC);

-- Enable RLS
ALTER TABLE public.exports ENABLE ROW LEVEL SECURITY;

-- RLS policies: users can only access their own exports
CREATE POLICY "Users can view their own exports"
  ON public.exports
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own exports"
  ON public.exports
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exports"
  ON public.exports
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exports"
  ON public.exports
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER exports_updated_at
  BEFORE UPDATE ON public.exports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

