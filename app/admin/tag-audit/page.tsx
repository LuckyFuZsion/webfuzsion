"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Info } from "lucide-react"

// Mock data to avoid any API calls during build
const MOCK_DATA = {
  tags: [
    {
      name: "Google Analytics",
      type: "Analytics",
      lastModified: "2023-09-15",
      modifiedBy: "Admin",
      status: "active",
      impact: "medium",
      size: "42KB",
    },
    {
      name: "Facebook Pixel",
      type: "Marketing",
      lastModified: "2023-09-10",
      modifiedBy: "Admin",
      status: "active",
      impact: "high",
      size: "56KB",
    },
    {
      name: "HotJar",
      type: "Analytics",
      lastModified: "2023-08-22",
      modifiedBy: "Admin",
      status: "paused",
      impact: "high",
      size: "78KB",
    },
  ],
  recommendations: [
    "Consolidate analytics tags to reduce redundant data collection",
    "Consider removing or optimizing HotJar due to high performance impact",
    "Update Facebook Pixel to use the latest version for better performance",
  ],
}

export default function TagAuditPage() {
  const [loading, setLoading] = useState(true)
  const [auditData, setAuditData] = useState(MOCK_DATA)
  const [liveScripts, setLiveScripts] = useState<any[]>([])

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)

      // Only run browser-specific code on the client
      if (typeof window !== "undefined") {
        try {
          const scripts = Array.from(document.getElementsByTagName("script"))
          const filteredScripts = scripts
            .map((script) => {
              const src = script.src || "inline"
              const isThirdParty = src !== "inline" && !src.includes(window.location.hostname)
              const category = src.includes("google")
                ? "Google"
                : src.includes("facebook")
                  ? "Facebook"
                  : src.includes("analytics")
                    ? "Analytics"
                    : src.includes("tag")
                      ? "Tag Manager"
                      : isThirdParty
                        ? "Third-Party"
                        : "First-Party"

              return {
                src,
                isThirdParty,
                category,
                async: script.async,
                defer: script.defer,
                type: script.type || "text/javascript",
              }
            })
            .filter((script) => script.isThirdParty)

          setLiveScripts(filteredScripts)
        } catch (err) {
          console.error("Error analyzing scripts:", err)
        }
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Tag Manager Audit</h1>

      {loading ? (
        <p>Loading audit data...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Total Tags</CardTitle>
                <CardDescription>Tags in your GTM container</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{auditData.tags.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">High Impact Tags</CardTitle>
                <CardDescription>Tags that significantly affect performance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-red-600">
                  {auditData.tags.filter((tag) => tag.impact === "high").length}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Total Script Size</CardTitle>
                <CardDescription>Combined size of all third-party scripts</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">
                  {auditData.tags.reduce((acc, tag) => {
                    const size = Number.parseInt(tag.size.replace("KB", "")) || 0
                    return acc + size
                  }, 0)}
                  KB
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>GTM Tags</CardTitle>
              <CardDescription>Tags configured in your Google Tag Manager container</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead>Modified By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Performance Impact</TableHead>
                    <TableHead>Size</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditData.tags.map((tag, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{tag.name}</TableCell>
                      <TableCell>{tag.type}</TableCell>
                      <TableCell>{tag.lastModified}</TableCell>
                      <TableCell>{tag.modifiedBy}</TableCell>
                      <TableCell>
                        <Badge variant={tag.status === "active" ? "default" : "secondary"}>{tag.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getImpactColor(tag.impact)}>{tag.impact}</Badge>
                      </TableCell>
                      <TableCell>{tag.size}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Live Third-Party Scripts</CardTitle>
              <CardDescription>Scripts currently loaded on this page</CardDescription>
            </CardHeader>
            <CardContent>
              {liveScripts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Async</TableHead>
                      <TableHead>Defer</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {liveScripts.map((script, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium max-w-xs truncate">{script.src}</TableCell>
                        <TableCell>{script.category}</TableCell>
                        <TableCell>
                          {script.async ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                        </TableCell>
                        <TableCell>
                          {script.defer ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                        </TableCell>
                        <TableCell>{script.type}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p>No third-party scripts detected on this page.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
              <CardDescription>Suggestions to improve tag performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {auditData.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
