"use client"

interface DateRangeOption {
  label: string
  value: {
    startDate: string
    endDate: string
  }
}

interface DateRangeSelectorProps {
  selectedRange: string
  onRangeChange: (range: string) => void
}

export default function DateRangeSelector({ selectedRange, onRangeChange }: DateRangeSelectorProps) {
  const dateRanges: Record<string, DateRangeOption> = {
    "7days": {
      label: "Last 7 days",
      value: {
        startDate: "7daysAgo",
        endDate: "today",
      },
    },
    "30days": {
      label: "Last 30 days",
      value: {
        startDate: "30daysAgo",
        endDate: "today",
      },
    },
    "90days": {
      label: "Last 90 days",
      value: {
        startDate: "90daysAgo",
        endDate: "today",
      },
    },
    thisMonth: {
      label: "This month",
      value: {
        startDate: "firstDayOfMonth",
        endDate: "today",
      },
    },
    lastMonth: {
      label: "Last month",
      value: {
        startDate: "firstDayOfLastMonth",
        endDate: "lastDayOfLastMonth",
      },
    },
    thisYear: {
      label: "This year",
      value: {
        startDate: "firstDayOfYear",
        endDate: "today",
      },
    },
  }

  return (
    <div className="flex items-center">
      <label htmlFor="dateRange" className="mr-2 text-sm font-medium">
        Date Range:
      </label>
      <select
        id="dateRange"
        value={selectedRange}
        onChange={(e) => onRangeChange(e.target.value)}
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {Object.entries(dateRanges).map(([key, { label }]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}
