"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdminHeader } from "@/app/admin/components/admin-header"
import { AlertCircle, Database, ArrowRightLeft, Check, X, Loader2 } from "lucide-react"

export default function DatabaseFixPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [diagnosticData, setDiagnosticData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isMigrating, setIsMigrating] = useState(false)
  const [migrationResult, setMigrationResult] = useState<any>(null)

  useEffect(() => {
    const checkDatabase = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/debug/database-diagnostics")

        if (!response.ok) {
          throw new Error(`Diagnostic check failed: ${response.status}`)
        }

        const data = await response.json()
        setDiagnosticData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred")
        console.error("Database check error:", err)
      } finally {
        setIsLoading(false)
      }
    }

    checkDatabase()
  }, [])

  const migrateData = async (sourceSchema: string, targetSchema: string) => {
    try {
      setIsMigrating(true)
      setMigrationResult(null)

      const response = await fetch("/api/admin/migrate-schema", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceSchema,
          targetSchema,
          tableName: "invoices",
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Migration failed")
      }

      setMigrationResult({
        success: true,
        message: result.message || "Migration completed successfully",
        details: result.details || {},
      })

      // Refresh diagnostic data
      const diagResponse = await fetch("/api/debug/database-diagnostics")
      if (diagResponse.ok) {
        const diagData = await diagResponse.json()
        setDiagnosticData(diagData)
      }
    } catch (err) {
      setMigrationResult({
        success: false,
        message: err instanceof Error ? err.message : "Migration failed",
      })
      console.error("Migration error:", err)
    } finally {
      setIsMigrating(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-8">
          <AdminHeader />

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Database Schema Fix</h1>
            <p className="text-gray-300">Resolve duplicate tables across different schemas</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
              <span className="ml-3">Checking database schemas...</span>
            </div>
          ) : error ? (
            <div className="bg-red-500/20 border border-red-500/50 text-white p-6 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
                <div>
                  <h3 className="font-medium">Error</h3>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-amber-500/20 border border-amber-500/50 text-white p-6 rounded-lg mb-6">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5 mr-2" />
                  <div>
                    <h3 className="font-medium">Schema Issue Detected</h3>
                    <p className="text-sm mt-1">
                      You have duplicate <code className="bg-black/30 px-1 py-0.5 rounded">invoices</code> tables in
                      different schemas. This can cause confusion and data inconsistency.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Schema Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-lg">public.invoices</h3>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                        {diagnosticData?.schemaIssues?.details?.invoices?.public?.exists ? "Exists" : "Not Found"}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-2">
                      Records: {diagnosticData?.schemaIssues?.details?.invoices?.public?.count || 0}
                    </p>
                    <p className="text-sm text-gray-400">
                      This is the default schema where most applications look for tables.
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-lg">invoice_system.invoices</h3>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                        {diagnosticData?.schemaIssues?.details?.invoices?.invoice_system?.exists
                          ? "Exists"
                          : "Not Found"}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-2">
                      Records: {diagnosticData?.schemaIssues?.details?.invoices?.invoice_system?.count || 0}
                    </p>
                    <p className="text-sm text-gray-400">
                      This is the schema created by our invoice system setup script.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Resolve Schema Issue</h2>
                <p className="text-gray-300 mb-6">
                  Choose which schema you want to keep and migrate data to. This will consolidate all records into one
                  schema.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button
                    onClick={() => migrateData("invoice_system", "public")}
                    disabled={isMigrating}
                    className="bg-brand-blue hover:bg-brand-blue/80 text-white p-4 rounded-lg flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
                  >
                    {isMigrating ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <ArrowRightLeft className="h-5 w-5" />
                    )}
                    <span>Migrate from invoice_system to public</span>
                  </button>

                  <button
                    onClick={() => migrateData("public", "invoice_system")}
                    disabled={isMigrating}
                    className="bg-purple-600 hover:bg-purple-500 text-white p-4 rounded-lg flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
                  >
                    {isMigrating ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <ArrowRightLeft className="h-5 w-5" />
                    )}
                    <span>Migrate from public to invoice_system</span>
                  </button>
                </div>
              </div>

              {migrationResult && (
                <div
                  className={`p-6 rounded-lg mb-6 ${
                    migrationResult.success
                      ? "bg-green-500/20 border border-green-500/50"
                      : "bg-red-500/20 border border-red-500/50"
                  }`}
                >
                  <div className="flex items-start">
                    {migrationResult.success ? (
                      <Check className="h-5 w-5 text-green-400 mt-0.5 mr-2" />
                    ) : (
                      <X className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
                    )}
                    <div>
                      <h3 className="font-medium">{migrationResult.success ? "Success" : "Error"}</h3>
                      <p className="text-sm mt-1">{migrationResult.message}</p>

                      {migrationResult.details && (
                        <div className="mt-3 text-sm">
                          <p>Records migrated: {migrationResult.details.recordsMigrated || 0}</p>
                          <p>Records already existing: {migrationResult.details.recordsSkipped || 0}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-brand-purple/10 border border-purple-500/30 rounded-lg p-4 mt-8">
                <div className="flex items-start gap-3">
                  <Database className="h-5 w-5 text-purple-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-white">Recommendation</h3>
                    <p className="text-gray-300 text-sm mt-1">
                      We recommend migrating to the <code className="bg-black/30 px-1 py-0.5 rounded">public</code>{" "}
                      schema as it's the default schema that most applications look for tables in. This will ensure
                      better compatibility with various tools and libraries.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
