-- Create email_logs table
CREATE TABLE IF NOT EXISTS public.email_logs (
  id SERIAL PRIMARY KEY,
  invoice_id TEXT NOT NULL,
  recipient TEXT NOT NULL,
  cc TEXT,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_logs_invoice_id ON public.email_logs(invoice_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON public.email_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON public.email_logs(status); 