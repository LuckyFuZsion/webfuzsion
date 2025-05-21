import type React from "react"
interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  change?: {
    value: number
    isPositive: boolean
  }
}

export default function StatsCard({ title, value, icon, change }: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${change.isPositive ? "text-green-500" : "text-red-500"}`}>
                {change.isPositive ? "+" : "-"}
                {Math.abs(change.value)}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs. previous period</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">{icon}</div>
      </div>
    </div>
  )
}
