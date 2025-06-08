-- First, check if invoice_system schema exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'invoice_system') THEN
    -- Create tables in public schema if they don't exist
    
    -- Create customers table in public schema
    CREATE TABLE IF NOT EXISTS public.customers (
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
    CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
    
    -- Create invoices table in public schema
    CREATE TABLE IF NOT EXISTS public.invoices (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      invoice_number TEXT NOT NULL UNIQUE,
      customer_id UUID NOT NULL,
      project_name TEXT NOT NULL,
      issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
      due_date DATE NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
      tax_rate DECIMAL(5, 2) DEFAULT 20.00,
      tax_amount DECIMAL(10, 2) DEFAULT 0,
      discount_amount DECIMAL(10, 2) DEFAULT 0,
      total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
      notes TEXT,
      terms TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      paid_at TIMESTAMP WITH TIME ZONE
    );
    
    -- Create index on invoice_number and status for faster lookups
    CREATE INDEX IF NOT EXISTS idx_invoices_number ON public.invoices(invoice_number);
    CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
    
    -- Create invoice_items table in public schema
    CREATE TABLE IF NOT EXISTS public.invoice_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      invoice_id UUID NOT NULL,
      description TEXT NOT NULL,
      quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
      unit_price DECIMAL(10, 2) NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      discount_percentage DECIMAL DEFAULT 0,
      discount_amount DECIMAL DEFAULT 0,
      original_amount DECIMAL DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Create index on invoice_id for faster lookups
    CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON public.invoice_items(invoice_id);
    
    -- Add foreign key constraints
    ALTER TABLE public.invoices 
    ADD CONSTRAINT IF NOT EXISTS fk_customer 
    FOREIGN KEY (customer_id) 
    REFERENCES public.customers(id) 
    ON DELETE CASCADE;
    
    ALTER TABLE public.invoice_items 
    ADD CONSTRAINT IF NOT EXISTS fk_invoice 
    FOREIGN KEY (invoice_id) 
    REFERENCES public.invoices(id) 
    ON DELETE CASCADE;
    
    -- Copy data from invoice_system to public if there's any data
    -- Customers
    INSERT INTO public.customers (id, name, email, phone, address, city, postal_code, country, created_at, updated_at)
    SELECT id, name, email, phone, address, city, postal_code, country, created_at, updated_at
    FROM invoice_system.customers
    ON CONFLICT (id) DO NOTHING;
    
    -- Invoices
    INSERT INTO public.invoices (id, invoice_number, customer_id, project_name, issue_date, due_date, status, subtotal, tax_rate, tax_amount, discount_amount, total_amount, notes, terms, created_at, updated_at, paid_at)
    SELECT id, invoice_number, customer_id, project_name, issue_date, due_date, status, subtotal, tax_rate, tax_amount, discount_amount, total_amount, notes, terms, created_at, updated_at, paid_at
    FROM invoice_system.invoices
    ON CONFLICT (id) DO NOTHING;
    
    -- Invoice Items
    INSERT INTO public.invoice_items (id, invoice_id, description, quantity, unit_price, amount, discount_percentage, discount_amount, original_amount, created_at, updated_at)
    SELECT id, invoice_id, description, quantity, unit_price, amount, 
           COALESCE(discount_percentage, 0), 
           COALESCE(discount_amount, 0), 
           COALESCE(original_amount, quantity * unit_price), 
           created_at, updated_at
    FROM invoice_system.invoice_items
    ON CONFLICT (id) DO NOTHING;
    
    -- Drop invoice_system schema and all its objects
    DROP SCHEMA invoice_system CASCADE;
    
    RAISE NOTICE 'Migration from invoice_system to public schema completed successfully';
  ELSE
    RAISE NOTICE 'invoice_system schema does not exist, no migration needed';
  END IF;
END $$;
