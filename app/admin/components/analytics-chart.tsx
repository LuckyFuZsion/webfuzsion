"use client"

import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"

interface AnalyticsChartProps {
  type: "line" | "bar" | "pie" | "doughnut"
  data: {
    labels: string[]
    data: number[]
  }
  title: string
  height?: number
  colors?: string[]
}

export default function AnalyticsChart({ type, data, title, height = 300, colors }: AnalyticsChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    const defaultColors = [
      "rgba(75, 192, 192, 0.6)",
      "rgba(54, 162, 235, 0.6)",
      "rgba(255, 206, 86, 0.6)",
      "rgba(255, 99, 132, 0.6)",
      "rgba(153, 102, 255, 0.6)",
    ]

    const chartColors = colors || defaultColors

    const chartData = {
      labels: data.labels,
      datasets: [
        {
          label: title,
          data: data.data,
          backgroundColor: type === "line" ? chartColors[0] : chartColors,
          borderColor: type === "line" ? chartColors[0] : chartColors,
          borderWidth: 1,
          fill: type === "line" ? false : undefined,
          tension: type === "line" ? 0.4 : undefined,
        },
      ],
    }

    chartInstance.current = new Chart(ctx, {
      type,
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: type !== "line" && type !== "bar",
            position: "bottom",
          },
          title: {
            display: true,
            text: title,
            font: {
              size: 16,
            },
          },
        },
        scales:
          type === "line" || type === "bar"
            ? {
                y: {
                  beginAtZero: true,
                },
              }
            : undefined,
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, title, type, colors])

  return (
    <div style={{ height: `${height}px`, width: "100%" }}>
      <canvas ref={chartRef} />
    </div>
  )
}
