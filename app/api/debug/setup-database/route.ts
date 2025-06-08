import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
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

    // Create tables
    const tables: Record<string, any> = {}

    // Create blog_posts table
    const { error: blogError } = await supabase.from("blog_posts").select("id").limit(1)

    if (blogError && blogError.code === "PGRST301") {
      // Table doesn't exist, create it
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

      tables.blog_posts = {
        success: !createBlogError,
        message: createBlogError ? createBlogError.message : "Created successfully",
      }
    } else {
      tables.blog_posts = {
        success: true,
        message: "Table already exists",
      }
    }

    // Create customers table
    const { error: customersError } = await supabase.from("customers").select("id").limit(1)

    if (customersError && customersError.code === "PGRST301") {
      // Table doesn't exist, create it
      const { error: createCustomersError } = await supabase.rpc("execute_sql", {
        query: `
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
          
          CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
        `,
      })

      tables.customers = {
        success: !createCustomersError,
        message: createCustomersError ? createCustomersError.message : "Created successfully",
      }
    } else {
      tables.customers = {
        success: true,
        message: "Table already exists",
      }
    }

    // Create invoices table
    const { error: invoicesError } = await supabase.from("invoices").select("id").limit(1)

    if (invoicesError && invoicesError.code === "PGRST301") {
      // Table doesn't exist, create it
      const { error: createInvoicesError } = await supabase.rpc("execute_sql", {
        query: `
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
          
          CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);
          CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
        `,
      })

      tables.invoices = {
        success: !createInvoicesError,
        message: createInvoicesError ? createInvoicesError.message : "Created successfully",
      }
    } else {
      tables.invoices = {
        success: true,
        message: "Table already exists",
      }
    }

    // Create invoice_items table
    const { error: invoiceItemsError } = await supabase.from("invoice_items").select("id").limit(1)

    if (invoiceItemsError && invoiceItemsError.code === "PGRST301") {
      // Table doesn't exist, create it
      const { error: createInvoiceItemsError } = await supabase.rpc("execute_sql", {
        query: `
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
          
          CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);
        `,
      })

      tables.invoice_items = {
        success: !createInvoiceItemsError,
        message: createInvoiceItemsError ? createInvoiceItemsError.message : "Created successfully",
      }
    } else {
      tables.invoice_items = {
        success: true,
        message: "Table already exists",
      }
    }

    // Add foreign key constraints
    const { error: constraintsError } = await supabase.rpc("execute_sql", {
      query: `
        -- Add foreign key constraints if they don't exist
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'fk_customer' AND table_name = 'invoices'
          ) THEN
            ALTER TABLE invoices 
            ADD CONSTRAINT fk_customer 
            FOREIGN KEY (customer_id) 
            REFERENCES customers(id) 
            ON DELETE CASCADE;
          END IF;
          
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'fk_invoice' AND table_name = 'invoice_items'
          ) THEN
            ALTER TABLE invoice_items 
            ADD CONSTRAINT fk_invoice 
            FOREIGN KEY (invoice_id) 
            REFERENCES invoices(id) 
            ON DELETE CASCADE;
          END IF;
        END
        $$;
      `,
    })

    tables.constraints = {
      success: !constraintsError,
      message: constraintsError ? constraintsError.message : "Added successfully",
    }

    // Create execute_sql function if it doesn't exist
    const { error: functionError } = await supabase.rpc("execute_sql", {
      query: `
        -- Create function to execute SQL if it doesn't exist
        CREATE OR REPLACE FUNCTION execute_sql(query TEXT)
        RETURNS VOID AS $$
        BEGIN
          EXECUTE query;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `,
    })

    tables.execute_sql_function = {
      success: !functionError,
      message: functionError ? functionError.message : "Created successfully",
    }

    return NextResponse.json({
      success: Object.values(tables).every((t: any) => t.success),
      message: "Database setup completed",
      tables,
    })
  } catch (error) {
    console.error("Database setup error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Database setup failed",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
