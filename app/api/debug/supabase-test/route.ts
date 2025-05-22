import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  // Log all environment variables (names only, not values)
  const envVarNames = Object.keys(process.env).sort()

  // Check specifically for Supabase variables
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey =
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

  let connectionResult = "Not attempted"
  const allEnvVars = {}

  // Only include database-related env vars in the output
  envVarNames.forEach((name) => {
    if (name.includes("SUPABASE") || name.includes("POSTGRES") || name.includes("DATABASE")) {
      allEnvVars[name] = {
        exists: true,
        length: process.env[name]?.length || 0,
      }
    }
  })

  // Try to connect if we have the minimum required variables
  if (supabaseUrl && supabaseKey) {
    try {
      console.log(`Attempting Supabase connection to: ${supabaseUrl.substring(0, 15)}...`)

      const supabase = createClient(supabaseUrl, supabaseKey)

      // Try a simple query that should work on any Supabase project
      const { data, error } = await supabase.from("_prisma_migrations").select("count(*)").limit(1).maybeSingle()

      if (error) {
        connectionResult = `Error: ${error.message} (${error.code})`
      } else {
        connectionResult = `Success! Response: ${JSON.stringify(data)}`
      }
    } catch (e) {
      connectionResult = `Exception: ${e instanceof Error ? e.message : String(e)}`
    }
  } else {
    connectionResult = `Missing required variables. URL: ${Boolean(supabaseUrl)}, Key: ${Boolean(supabaseKey)}`
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    databaseVariables: allEnvVars,
    envVarCount: envVarNames.length,
    supabaseVariablesFound: {
      url: Boolean(supabaseUrl),
      key: Boolean(supabaseKey),
    },
    connectionResult,
  })
}
