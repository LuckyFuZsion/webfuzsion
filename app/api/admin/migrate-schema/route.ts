import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  // Check authentication
  const authCookie = cookies().get("admin-auth")
  const isAuthenticated = authCookie && authCookie.value === "authenticated"

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const { sourceSchema, targetSchema, tableName } = await request.json()

    // Validate input
    if (!sourceSchema || !targetSchema || !tableName) {
      return NextResponse.json(
        { error: "Missing required parameters: sourceSchema, targetSchema, tableName" },
        { status: 400 },
      )
    }

    // Get Supabase connection details
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Missing Supabase environment variables" }, { status: 500 })
    }

    // Create admin Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Check if both source and target tables exist
    const sourceTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = '${sourceSchema}' AND table_name = '${tableName}'
      )
    `
    const targetTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = '${targetSchema}' AND table_name = '${tableName}'
      )
    `

    const { data: sourceExists, error: sourceError } = await supabase.rpc("execute_sql", {
      query: sourceTableQuery,
    })

    if (sourceError) {
      return NextResponse.json({ error: `Error checking source table: ${sourceError.message}` }, { status: 500 })
    }

    if (!sourceExists?.[0]?.exists) {
      return NextResponse.json({ error: `Source table ${sourceSchema}.${tableName} does not exist` }, { status: 404 })
    }

    const { data: targetExists, error: targetError } = await supabase.rpc("execute_sql", {
      query: targetTableQuery,
    })

    if (targetError) {
      return NextResponse.json({ error: `Error checking target table: ${targetError.message}` }, { status: 500 })
    }

    // If target table doesn't exist, create it with the same structure as source
    if (!targetExists?.[0]?.exists) {
      const createTableQuery = `
        CREATE TABLE ${targetSchema}.${tableName} (LIKE ${sourceSchema}.${tableName} INCLUDING ALL)
      `

      const { error: createError } = await supabase.rpc("execute_sql", {
        query: createTableQuery,
      })

      if (createError) {
        return NextResponse.json({ error: `Error creating target table: ${createError.message}` }, { status: 500 })
      }
    }

    // Get source table data
    const getSourceDataQuery = `SELECT * FROM ${sourceSchema}.${tableName}`
    const { data: sourceData, error: dataError } = await supabase.rpc("execute_sql", {
      query: getSourceDataQuery,
    })

    if (dataError) {
      return NextResponse.json({ error: `Error fetching source data: ${dataError.message}` }, { status: 500 })
    }

    // Migrate data
    let recordsMigrated = 0
    let recordsSkipped = 0

    for (const record of sourceData || []) {
      // Check if record with same ID already exists in target
      const checkExistingQuery = `
        SELECT EXISTS (
          SELECT FROM ${targetSchema}.${tableName} 
          WHERE id = '${record.id}'
        )
      `

      const { data: existingCheck, error: existingError } = await supabase.rpc("execute_sql", {
        query: checkExistingQuery,
      })

      if (existingError) {
        console.error(`Error checking existing record: ${existingError.message}`)
        recordsSkipped++
        continue
      }

      if (existingCheck?.[0]?.exists) {
        recordsSkipped++
        continue
      }

      // Prepare insert query
      const columns = Object.keys(record).filter((key) => record[key] !== null)
      const values = columns.map((col) => {
        const val = record[col]
        if (val === null) return "NULL"
        if (typeof val === "string") return `'${val.replace(/'/g, "''")}'`
        if (typeof val === "object" && val instanceof Date) return `'${val.toISOString()}'`
        if (typeof val === "object") return `'${JSON.stringify(val).replace(/'/g, "''")}'`
        return val
      })

      const insertQuery = `
        INSERT INTO ${targetSchema}.${tableName} (${columns.join(", ")})
        VALUES (${values.join(", ")})
      `

      const { error: insertError } = await supabase.rpc("execute_sql", {
        query: insertQuery,
      })

      if (insertError) {
        console.error(`Error inserting record: ${insertError.message}`)
        recordsSkipped++
      } else {
        recordsMigrated++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Migration from ${sourceSchema}.${tableName} to ${targetSchema}.${tableName} completed`,
      details: {
        recordsMigrated,
        recordsSkipped,
        totalRecords: sourceData?.length || 0,
      },
    })
  } catch (error) {
    console.error("Schema migration error:", error)
    return NextResponse.json(
      { error: `Migration failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
