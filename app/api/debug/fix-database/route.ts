import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const repair = url.searchParams.get("repair") || "all"

  try {
    // Get Supabase credentials from environment variables
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing Supabase credentials",
          missingVars: {
            supabaseUrl: !supabaseUrl,
            supabaseKey: !supabaseKey,
          },
        },
        { status: 500 },
      )
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Create tables based on repair parameter
    const results: Record<string, any> = {}

    if (repair === "blog" || repair === "all") {
      // Create blog_posts table
      const { error: blogError } = await supabase.rpc("execute_sql", {
        query: `
          CREATE TABLE IF NOT EXISTS blog_posts (
            id SERIAL PRIMARY KEY,
            slug TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            date TEXT NOT NULL,
            excerpt TEXT NOT NULL,
            content TEXT NOT NULL,
            author TEXT NOT NULL,
            image TEXT,
            tags TEXT[],
            reading_time TEXT,
            category TEXT,
            published BOOLEAN DEFAULT false,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
          
          -- Create function to execute SQL if it doesn't exist
          CREATE OR REPLACE FUNCTION execute_sql(query TEXT)
          RETURNS VOID AS $$
          BEGIN
            EXECUTE query;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
        `,
      })

      results.blog = {
        success: !blogError,
        message: blogError ? blogError.message : "Blog table created successfully",
      }
    }

    if (repair === "invoices" || repair === "all") {
      // Create invoice tables directly in public schema
      const { error: invoiceError } = await supabase.rpc("execute_sql", {
        query: `
          -- Create customers table
          CREATE TABLE IF NOT EXISTS customers (
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
          CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
          
          -- Create invoices table
          CREATE TABLE IF NOT EXISTS invoices (
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
          CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);
          CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
          
          -- Create invoice_items table
          CREATE TABLE IF NOT EXISTS invoice_items (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            invoice_id UUID NOT NULL,
            description TEXT NOT NULL,
            quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
            unit_price DECIMAL(10, 2) NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            discount_percentage DECIMAL(5, 2) DEFAULT 0,
            discount_amount DECIMAL(10, 2) DEFAULT 0,
            original_amount DECIMAL(10, 2),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          -- Create index on invoice_id for faster lookups
          CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);
          
          -- Add foreign key constraints
          ALTER TABLE invoices 
          DROP CONSTRAINT IF EXISTS fk_customer;
          
          ALTER TABLE invoices 
          ADD CONSTRAINT fk_customer 
          FOREIGN KEY (customer_id) 
          REFERENCES customers(id) 
          ON DELETE CASCADE;
          
          ALTER TABLE invoice_items 
          DROP CONSTRAINT IF EXISTS fk_invoice;
          
          ALTER TABLE invoice_items 
          ADD CONSTRAINT fk_invoice 
          FOREIGN KEY (invoice_id) 
          REFERENCES invoices(id) 
          ON DELETE CASCADE;
        `,
      })

      results.invoices = {
        success: !invoiceError,
        message: invoiceError ? invoiceError.message : "Invoice tables created successfully",
      }
    }

    return NextResponse.json({
      success: Object.values(results).every((r: any) => r.success),
      message: "Database repair completed",
      results,
    })
  } catch (error) {
    console.error("Database repair error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Database repair failed",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
