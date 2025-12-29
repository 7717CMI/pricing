'use client'

import { useDashboardStore } from '@/lib/store'

export function YearRangeSlider() {
  const { data, filters, updateFilters } = useDashboardStore()

  if (!data) return null

  const { start_year, forecast_year, base_year } = data.metadata

  // Ensure we have valid year values
  if (!start_year || !forecast_year || !base_year) {
    return null
  }

  const [minYear, maxYear] = filters.yearRange

  // Cap the maximum year at Month 12 (start_year + 11)
  const maxAllowedYear = Math.min(forecast_year, start_year + 11)

  // Helper function to convert year to month label
  // 2020 → "Month 1", 2021 → "Month 2", etc.
  const yearToMonth = (year: number) => `Month ${year - start_year + 1}`

  const handleMinChange = (value: number) => {
    if (value <= maxYear) {
      updateFilters({ yearRange: [value, maxYear] })
    }
  }

  const handleMaxChange = (value: number) => {
    if (value >= minYear) {
      updateFilters({ yearRange: [minYear, value] })
    }
  }

  const setPredefinedRange = (range: 'historical' | 'forecast' | 'all') => {
    switch (range) {
      case 'historical':
        updateFilters({ yearRange: [start_year, Math.min(base_year, maxAllowedYear)] })
        break
      case 'forecast':
        updateFilters({ yearRange: [Math.min(base_year + 1, maxAllowedYear), maxAllowedYear] })
        break
      case 'all':
        updateFilters({ yearRange: [start_year, maxAllowedYear] })
        break
    }
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-black">
        Year Range
      </label>

      {/* Predefined Range Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setPredefinedRange('historical')}
          className="px-3 py-1 text-xs bg-gray-100 text-black rounded hover:bg-gray-200"
        >
          Historical
        </button>
        <button
          onClick={() => setPredefinedRange('forecast')}
          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          Forecast
        </button>
        <button
          onClick={() => setPredefinedRange('all')}
          className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
        >
          All Years
        </button>
      </div>

      {/* Year Range Display */}
      <div className="text-center py-2 bg-blue-50 rounded-md">
        <span className="text-lg font-semibold text-blue-900">
          {yearToMonth(Math.min(minYear, maxAllowedYear))} - {yearToMonth(Math.min(maxYear, maxAllowedYear))}
        </span>
        <span className="text-xs text-blue-600 ml-2">
          ({Math.min(maxYear, maxAllowedYear) - Math.min(minYear, maxAllowedYear) + 1} months)
        </span>
      </div>

      {/* Dual Range Slider */}
      <div className="px-2">
        <div className="relative pt-2 pb-4">
          {/* Min Slider */}
          <div className="relative mb-8">
            <label className="text-xs text-black mb-1 block">From:</label>
            <input
              type="range"
              min={start_year}
              max={maxAllowedYear}
              value={Math.min(minYear, maxAllowedYear)}
              onChange={(e) => handleMinChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="absolute -bottom-5 left-0 text-xs text-black">{yearToMonth(start_year)}</span>
            <span className="absolute -bottom-5 right-0 text-xs text-black">{yearToMonth(maxAllowedYear)}</span>
          </div>

          {/* Max Slider */}
          <div className="relative">
            <label className="text-xs text-black mb-1 block">To:</label>
            <input
              type="range"
              min={start_year}
              max={maxAllowedYear}
              value={Math.min(maxYear, maxAllowedYear)}
              onChange={(e) => handleMaxChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Base Year Indicator */}
      <div className="text-xs text-black text-center">
        Base Year: <span className="font-medium text-black">{yearToMonth(Math.min(base_year, maxAllowedYear))}</span>
      </div>
    </div>
  )
}

