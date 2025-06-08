"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface TraceData {
  traceId: string
  spanName: string
  duration: number
  status: "OK" | "ERROR"
  timestamp: string
  attributes: Record<string, any>
}

export default function MonitoringPage() {
  const [traces, setTraces] = useState<TraceData[]>([])
  const [loading, setLoading] = useState(false)

  const fetchTraces = async () => {
    setLoading(true)
    try {
      // This would connect to your observability platform
      // For now, we'll show a placeholder
      console.log("Fetching traces from observability platform...")

      // Placeholder data
      const mockTraces: TraceData[] = [
        {
          traceId: "trace-001",
          spanName: "contact-form-submission",
          duration: 245,
          status: "OK",
          timestamp: new Date().toISOString(),
          attributes: {
            "contact.service": "web-design",
            "email.success": true,
          },
        },
        {
          traceId: "trace-002",
          spanName: "send-email",
          duration: 1200,
          status: "ERROR",
          timestamp: new Date(Date.now() - 300000).toISOString(),
          attributes: {
            "email.to": "contact@webfuzsion.co.uk",
            "error.message": "SMTP connection failed",
          },
        },
      ]

      setTraces(mockTraces)
    } catch (error) {
      console.error("Failed to fetch traces:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTraces()
  }, [])

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Application Monitoring</h1>
        <Button onClick={fetchTraces} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Error Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.1%</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245ms</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Traces</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {traces.map((trace) => (
              <div key={trace.traceId} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{trace.spanName}</span>
                    <Badge variant={trace.status === "OK" ? "default" : "destructive"}>{trace.status}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Duration: {trace.duration}ms | {new Date(trace.timestamp).toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Trace ID: {trace.traceId}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">
                    {Object.entries(trace.attributes)
                      .slice(0, 2)
                      .map(([key, value]) => (
                        <div key={key} className="text-muted-foreground">
                          {key}: {String(value)}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
