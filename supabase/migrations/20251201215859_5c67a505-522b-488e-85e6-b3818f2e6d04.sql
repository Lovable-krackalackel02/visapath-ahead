-- Create leads table for storing signup data
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  university TEXT NOT NULL,
  selected_plan TEXT NOT NULL CHECK (selected_plan IN ('free', 'premium')),
  name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting leads (anyone can sign up)
CREATE POLICY "Anyone can insert leads"
  ON public.leads
  FOR INSERT
  WITH CHECK (true);

-- Create policy for selecting leads (only authenticated users can view)
CREATE POLICY "Authenticated users can view leads"
  ON public.leads
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Create an index on created_at for faster queries
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);

-- Create an index on selected_plan for analytics
CREATE INDEX idx_leads_selected_plan ON public.leads(selected_plan);

-- Enable realtime for the leads table
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;