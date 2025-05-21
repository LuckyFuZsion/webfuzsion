-- Create schema
CREATE SCHEMA IF NOT EXISTS invoice_system;

-- Create customers table
CREATE TABLE IF NOT EXISTS invoice_system.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'United Kingdom',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_customers_email ON invoice_system.customers(email);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoice_system.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL,
  project_name TEXT NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5, 2) NOT NULL DEFAULT 20.00,
  tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  notes TEXT,
  terms TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE
);

-- Create index on invoice_number and status for faster lookups
CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoice_system.invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoice_system.invoices(status);

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS invoice_system.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL,
  description TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on invoice_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_system.invoice_items(invoice_id);

-- Add foreign key constraints
ALTER TABLE invoice_system.invoices 
ADD CONSTRAINT IF NOT EXISTS fk_customer 
FOREIGN KEY (customer_id) 
REFERENCES invoice_system.customers(id) 
ON DELETE CASCADE;

ALTER TABLE invoice_system.invoice_items 
ADD CONSTRAINT IF NOT EXISTS fk_invoice 
FOREIGN KEY (invoice_id) 
REFERENCES invoice_system.invoices(id) 
ON DELETE CASCADE;

-- Create a function to check if the invoice system is set up
CREATE OR REPLACE FUNCTION public.check_invoice_system_setup()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM information_schema.schemata 
    WHERE schema_name = 'invoice_system'
  );
END;
$$ LANGUAGE plpgsql;

-- Create a function to set up the invoice system
CREATE OR REPLACE FUNCTION public.setup_invoice_system()
RETURNS VOID AS $$
BEGIN
  -- Create schema
  CREATE SCHEMA IF NOT EXISTS invoice_system;
  
  -- Create customers table
  CREATE TABLE IF NOT EXISTS invoice_system.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    city TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'United Kingdom',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Create invoices table
  CREATE TABLE IF NOT EXISTS invoice_system.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT NOT NULL UNIQUE,
    customer_id UUID NOT NULL,
    project_name TEXT NOT NULL,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
    tax_rate DECIMAL(5, 2) NOT NULL DEFAULT 20.00,
    tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    notes TEXT,
    terms TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    paid_at TIMESTAMP WITH TIME ZONE
  );
  
  -- Create invoice_items table
  CREATE TABLE IF NOT EXISTS invoice_system.invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL,
    description TEXT NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
END;
$$ LANGUAGE plpgsql;
