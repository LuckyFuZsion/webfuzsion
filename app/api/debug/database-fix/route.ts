import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: Request) {
  // Get URL parameters
  const url = new URL(request.url)
  const action = url.searchParams.get("action")
  const repair = url.searchParams.get("repair")

  // Results object
  const results: any = {
    timestamp: new Date().toISOString(),
    connectionStatus: {},
    tableStatus: {},
    repairs: {},
  }

  // Extract connection variables
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ""

  // Check if we have the minimum required variables
  results.connectionVariables = {
    supabaseUrl: Boolean(supabaseUrl),
    supabaseKey: Boolean(supabaseKey),
  }

  if (!supabaseUrl || !supabaseKey) {
    results.connectionStatus = {
      success: false,
      message: "Missing required connection variables",
    }
    return NextResponse.json(results)
  }

  try {
    // Create Supabase client with service role key for admin operations
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Test connection with a simple query
    const { data: testData, error: testError } = await supabase.from("_prisma_migrations").select("id").limit(1)

    if (testError) {
      // If _prisma_migrations doesn't exist, try another approach
      const { data: testData2, error: testError2 } = await supabase
        .from("pg_catalog.pg_tables")
        .select("tablename")
        .limit(1)

      if (testError2) {
        results.connectionStatus = {
          success: false,
          message: `Connection error: ${testError2.message}`,
        }
        return NextResponse.json(results)
      }
    }

    results.connectionStatus = {
      success: true,
      message: "Connection successful",
    }

    // Check if tables exist
    const { data: invoiceTableExists, error: invoiceError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_name", "invoices")
      .limit(1)

    const { data: blogTableExists, error: blogError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_name", "blog_posts")
      .limit(1)

    results.tableStatus = {
      invoices: {
        exists: invoiceTableExists && invoiceTableExists.length > 0,
        error: invoiceError ? invoiceError.message : null,
      },
      blogPosts: {
        exists: blogTableExists && blogTableExists.length > 0,
        error: blogError ? blogError.message : null,
      },
    }

    // Perform repairs if requested
    if (action === "repair") {
      if (repair === "blog" || repair === "all") {
        const { error: createBlogError } = await supabase.rpc("execute_sql", {
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
          `,
        })

        results.repairs.blog = {
          success: !createBlogError,
          message: createBlogError ? createBlogError.message : "Blog table created successfully",
        }
      }

      if (repair === "invoices" || repair === "all") {
        const { error: createInvoiceError } = await supabase.rpc("execute_sql", {
          query: `
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
          `,
        })

        results.repairs.invoices = {
          success: !createInvoiceError,
          message: createInvoiceError ? createInvoiceError.message : "Invoice tables created successfully",
        }
      }
    }

    return NextResponse.json(results)
  } catch (e) {
    results.connectionStatus = {
      success: false,
      message: `Exception: ${e instanceof Error ? e.message : String(e)}`,
    }
    return NextResponse.json(results)
  }
}
