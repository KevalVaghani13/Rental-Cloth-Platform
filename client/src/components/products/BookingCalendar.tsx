import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Calendar,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Info,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react"





type DateStatus = "available" | "booked" | "blocked"

interface AvailabilityEntry {
  date: string 
  status: DateStatus
}

interface BookingCalendarProps {
  
  productId: string
  
  pricePerDay: number
  
  onDateChange: (startDate: Date | null, endDate: Date | null) => void
  
  className?: string
}

interface TooltipState {
  visible: boolean
  message: string
  x: number
  y: number
}






const createDateOnly = (dateInput: Date | string): Date => {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  return result
}


const toDateString = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}


const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}


const isDateInRange = (
  date: Date,
  start: Date | null,
  end: Date | null
): boolean => {
  if (!start || !end) return false
  const dateTime = date.getTime()
  return dateTime > start.getTime() && dateTime < end.getTime()
}


const isBefore = (date1: Date, date2: Date): boolean => {
  return date1.getTime() < date2.getTime()
}


const calculateDaysBetween = (start: Date, end: Date): number => {
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays + 1 
}


const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}


const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}


const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate()
}


const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay()
}





const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]





const CalendarSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse" aria-label="Loading calendar">
    {}
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
      <div className="h-5 w-5 bg-slate-200 rounded" />
      <div className="flex-1 flex items-center gap-2 mx-4">
        <div className="h-8 w-24 bg-slate-200 rounded-lg" />
        <div className="h-4 w-4 bg-slate-200 rounded" />
        <div className="h-8 w-24 bg-slate-200 rounded-lg" />
      </div>
      <div className="h-8 w-8 bg-slate-200 rounded" />
    </div>

    {}
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      {}
      <div className="flex items-center justify-between mb-4">
        <div className="h-8 w-8 bg-slate-200 rounded-lg" />
        <div className="h-6 w-32 bg-slate-200 rounded" />
        <div className="h-8 w-8 bg-slate-200 rounded-lg" />
      </div>

      {}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-10 flex items-center justify-center">
            <div className="h-4 w-8 bg-slate-200 rounded" />
          </div>
        ))}
      </div>

      {}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            className="h-10 w-10 bg-slate-100 rounded-lg mx-auto"
          />
        ))}
      </div>

      {}
      <div className="mt-4 pt-4 border-t border-slate-100 flex gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-slate-200 rounded" />
            <div className="h-3 w-12 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  </div>
)





interface TooltipProps {
  tooltip: TooltipState
}

const Tooltip: React.FC<TooltipProps> = ({ tooltip }) => {
  if (!tooltip.visible) return null

  return (
    <div
      className="fixed z-50 px-3 py-2 text-xs font-medium text-white bg-slate-800 rounded-lg shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full"
      style={{ left: tooltip.x, top: tooltip.y - 8 }}
      role="tooltip"
    >
      {tooltip.message}
      <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800" />
    </div>
  )
}





export function BookingCalendar({
  productId,
  pricePerDay,
  onDateChange,
  className,
}: BookingCalendarProps) {
  
  
  
  const today = React.useMemo(() => createDateOnly(new Date()), [])

  const [currentMonth, setCurrentMonth] = React.useState(today.getMonth())
  const [currentYear, setCurrentYear] = React.useState(today.getFullYear())

  const [startDate, setStartDate] = React.useState<Date | null>(null)
  const [endDate, setEndDate] = React.useState<Date | null>(null)
  const [selectingEnd, setSelectingEnd] = React.useState(false)
  const [hoverDate, setHoverDate] = React.useState<Date | null>(null)

  const [availability, setAvailability] = React.useState<
    Map<string, DateStatus>
  >(new Map())
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const [tooltip, setTooltip] = React.useState<TooltipState>({
    visible: false,
    message: "",
    x: 0,
    y: 0,
  })

  const [focusedDate, setFocusedDate] = React.useState<Date | null>(null)

  
  
  
  const calendarRef = React.useRef<HTMLDivElement>(null)

  
  
  
  const fetchAvailability = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/availability/${productId}`)

      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? "Product availability not found"
            : `Failed to fetch availability (${response.status})`
        )
      }

      const data: AvailabilityEntry[] = await response.json()

      const availabilityMap = new Map<string, DateStatus>()
      data.forEach((entry) => {
        
        const dateKey = entry.date.split("T")[0]
        availabilityMap.set(dateKey, entry.status)
      })

      setAvailability(availabilityMap)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load availability"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [productId])

  
  React.useEffect(() => {
    fetchAvailability()
  }, [fetchAvailability])

  
  
  
  const getDateStatus = React.useCallback(
    (date: Date): DateStatus => {
      const dateKey = toDateString(date)
      return availability.get(dateKey) || "available"
    },
    [availability]
  )

  const isDateDisabled = React.useCallback(
    (date: Date): boolean => {
      
      if (isBefore(date, today)) return true

      const status = getDateStatus(date)
      return status === "booked" || status === "blocked"
    },
    [today, getDateStatus]
  )

  const getDisabledReason = React.useCallback(
    (date: Date): string | null => {
      if (isBefore(date, today)) return "Past date"

      const status = getDateStatus(date)
      if (status === "booked") return "Already booked"
      if (status === "blocked") return "Not available"

      return null
    },
    [today, getDateStatus]
  )

  
  
  
  const rangeContainsUnavailable = React.useCallback(
    (start: Date, end: Date): boolean => {
      const current = createDateOnly(start)
      const endDate = createDateOnly(end)

      while (current <= endDate) {
        if (isDateDisabled(current)) {
          return true
        }
        current.setDate(current.getDate() + 1)
      }

      return false
    },
    [isDateDisabled]
  )

  
  
  
  const clearSelection = React.useCallback(() => {
    setStartDate(null)
    setEndDate(null)
    setSelectingEnd(false)
    setHoverDate(null)
    onDateChange(null, null)
  }, [onDateChange])

  const handleDateClick = React.useCallback(
    (date: Date, event?: React.MouseEvent) => {
      const disabled = isDateDisabled(date)
      const reason = getDisabledReason(date)

      
      if (disabled && reason && event) {
        const rect = (event.target as HTMLElement).getBoundingClientRect()
        setTooltip({
          visible: true,
          message: reason,
          x: rect.left + rect.width / 2,
          y: rect.top,
        })

        
        setTimeout(() => {
          setTooltip((prev) => ({ ...prev, visible: false }))
        }, 2000)
        return
      }

      if (disabled) return

      if (!selectingEnd || !startDate) {
        
        setStartDate(date)
        setEndDate(null)
        setSelectingEnd(true)
      } else {
        
        let newStart = startDate
        let newEnd = date

        
        if (isBefore(date, startDate)) {
          newStart = date
          newEnd = startDate
        }

        
        if (rangeContainsUnavailable(newStart, newEnd)) {
          
          if (event) {
            const rect = (event.target as HTMLElement).getBoundingClientRect()
            setTooltip({
              visible: true,
              message: "Range includes unavailable dates",
              x: rect.left + rect.width / 2,
              y: rect.top,
            })
            setTimeout(() => {
              setTooltip((prev) => ({ ...prev, visible: false }))
            }, 2000)
          }

          
          clearSelection()
          return
        }

        
        setStartDate(newStart)
        setEndDate(newEnd)
        setSelectingEnd(false)
        onDateChange(newStart, newEnd)
      }
    },
    [
      startDate,
      selectingEnd,
      isDateDisabled,
      getDisabledReason,
      rangeContainsUnavailable,
      clearSelection,
      onDateChange,
    ]
  )

  
  
  
  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((prev) => prev - 1)
    } else {
      setCurrentMonth((prev) => prev - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((prev) => prev + 1)
    } else {
      setCurrentMonth((prev) => prev + 1)
    }
  }

  const isPrevDisabled =
    currentYear < today.getFullYear() ||
    (currentYear === today.getFullYear() && currentMonth <= today.getMonth())

  
  
  
  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (!focusedDate) {
        
        setFocusedDate(today)
        return
      }

      let newDate = createDateOnly(focusedDate)

      switch (event.key) {
        case "ArrowLeft":
          newDate.setDate(newDate.getDate() - 1)
          event.preventDefault()
          break
        case "ArrowRight":
          newDate.setDate(newDate.getDate() + 1)
          event.preventDefault()
          break
        case "ArrowUp":
          newDate.setDate(newDate.getDate() - 7)
          event.preventDefault()
          break
        case "ArrowDown":
          newDate.setDate(newDate.getDate() + 7)
          event.preventDefault()
          break
        case "Enter":
        case " ":
          handleDateClick(focusedDate)
          event.preventDefault()
          return
        case "Escape":
          clearSelection()
          event.preventDefault()
          return
        default:
          return
      }

      
      if (newDate.getMonth() !== currentMonth) {
        setCurrentMonth(newDate.getMonth())
        setCurrentYear(newDate.getFullYear())
      }

      setFocusedDate(newDate)
    },
    [focusedDate, today, currentMonth, handleDateClick, clearSelection]
  )

  
  
  
  const totalDays = React.useMemo(() => {
    if (!startDate || !endDate) return 0
    return calculateDaysBetween(startDate, endDate)
  }, [startDate, endDate])

  const totalPrice = React.useMemo(() => {
    return totalDays * pricePerDay
  }, [totalDays, pricePerDay])

  const availabilityStats = React.useMemo(() => {
    let bookedCount = 0
    let blockedCount = 0

    availability.forEach((status) => {
      if (status === "booked") bookedCount++
      if (status === "blocked") blockedCount++
    })

    return {
      bookedCount,
      blockedCount,
      totalUnavailable: bookedCount + blockedCount,
    }
  }, [availability])

  
  
  
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth)
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
    const days: React.ReactNode[] = []

    
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-10"
          aria-hidden="true"
        />
      )
    }

    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = createDateOnly(new Date(currentYear, currentMonth, day))
      const dateKey = toDateString(date)
      const status = getDateStatus(date)
      const disabled = isDateDisabled(date)
      const isPast = isBefore(date, today)

      const isToday = isSameDay(date, today)
      const isStart = startDate && isSameDay(date, startDate)
      const isEnd = endDate && isSameDay(date, endDate)
      const isSelected = isStart || isEnd

      
      const effectiveEnd =
        endDate || (selectingEnd && hoverDate ? hoverDate : null)
      const inRange =
        startDate &&
        effectiveEnd &&
        isDateInRange(date, startDate, effectiveEnd)
      const inHoverRange =
        selectingEnd &&
        startDate &&
        hoverDate &&
        !endDate &&
        isDateInRange(date, startDate, hoverDate)

      const isFocused = focusedDate && isSameDay(date, focusedDate)

      days.push(
        <button
          key={dateKey}
          type="button"
          disabled={disabled}
          onClick={(e) => handleDateClick(date, e)}
          onMouseEnter={() => !disabled && setHoverDate(date)}
          onMouseLeave={() => setHoverDate(null)}
          onFocus={() => setFocusedDate(date)}
          tabIndex={isFocused ? 0 : -1}
          className={cn(
            "h-10 w-10 rounded-lg text-sm font-medium transition-all duration-150 relative",
            "focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-1",
            
            isPast && "text-slate-300 cursor-not-allowed",
            status === "booked" &&
              !isPast &&
              "bg-red-100 text-red-400 cursor-not-allowed",
            status === "blocked" &&
              !isPast &&
              "bg-slate-100 text-slate-400 cursor-not-allowed",
            
            status === "available" &&
              !disabled &&
              !isSelected &&
              "bg-green-50 text-green-700 hover:bg-green-100",
            
            isToday && !isSelected && "ring-2 ring-violet-400 ring-inset",
            
            isSelected && "bg-violet-600 text-white hover:bg-violet-700",
            
            (inRange || inHoverRange) &&
              !isSelected &&
              !disabled &&
              "bg-violet-100 text-violet-700",
            
            isStart && endDate && "rounded-r-none",
            isEnd && startDate && "rounded-l-none"
          )}
          aria-label={`${disabled ? "Unavailable: " : ""}${formatDate(date)}${
            status !== "available" ? ` (${status})` : ""
          }`}
          aria-pressed={isSelected || undefined}
          aria-disabled={disabled}
          data-date={dateKey}
        >
          {day}
          {}
          {(status === "booked" || status === "blocked") && !isPast && (
            <span
              className={cn(
                "absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full",
                status === "booked" ? "bg-red-400" : "bg-slate-400"
              )}
              aria-hidden="true"
            />
          )}
        </button>
      )
    }

    return days
  }

  
  
  

  
  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-violet-600" />
          <h3 className="text-lg font-semibold text-slate-900">
            Select Rental Dates
          </h3>
        </div>
        <CalendarSkeleton />
      </div>
    )
  }

  
  if (error) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-violet-600" />
          <h3 className="text-lg font-semibold text-slate-900">
            Select Rental Dates
          </h3>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-red-800 mb-1">
                Failed to load availability
              </p>
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={fetchAvailability}
                className="mt-2 text-sm font-medium text-red-700 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {}
      <Tooltip tooltip={tooltip} />

      {}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-violet-600" />
          <h3 className="text-lg font-semibold text-slate-900">
            Select Rental Dates
          </h3>
        </div>
        <button
          onClick={fetchAvailability}
          className="p-2 rounded-lg text-slate-500 hover:text-violet-600 hover:bg-violet-50 transition-all"
          aria-label="Refresh availability"
          title="Refresh availability"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {}
      {availabilityStats.totalUnavailable > 0 && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-700">
            <span className="font-medium">
              {availabilityStats.totalUnavailable}
            </span>{" "}
            date(s) are unavailable
            {availabilityStats.bookedCount > 0 && (
              <span> ({availabilityStats.bookedCount} booked)</span>
            )}
          </p>
        </div>
      )}

      {}
      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <Calendar className="w-5 h-5 text-violet-600 flex-shrink-0" />
        <div className="flex-1 flex items-center gap-2 text-sm">
          <span
            className={cn(
              "px-3 py-1.5 rounded-lg font-medium transition-colors",
              startDate
                ? "bg-violet-100 text-violet-700"
                : "bg-slate-200 text-slate-500"
            )}
          >
            {startDate ? formatDate(startDate) : "Start Date"}
          </span>
          <span className="text-slate-400">→</span>
          <span
            className={cn(
              "px-3 py-1.5 rounded-lg font-medium transition-colors",
              endDate
                ? "bg-violet-100 text-violet-700"
                : selectingEnd
                ? "bg-amber-100 text-amber-700 animate-pulse"
                : "bg-slate-200 text-slate-500"
            )}
          >
            {endDate
              ? formatDate(endDate)
              : selectingEnd
              ? "Select End Date"
              : "End Date"}
          </span>
        </div>
        {(startDate || endDate) && (
          <button
            onClick={clearSelection}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            aria-label="Clear selection"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {}
      <div
        ref={calendarRef}
        className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
        onKeyDown={handleKeyDown}
        role="application"
        aria-label="Rental date picker calendar"
      >
        {}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePreviousMonth}
            disabled={isPrevDisabled}
            className={cn(
              "p-2 rounded-lg transition-colors",
              isPrevDisabled
                ? "text-slate-300 cursor-not-allowed"
                : "text-slate-600 hover:bg-slate-100"
            )}
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h4 className="text-lg font-semibold text-slate-900">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </h4>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {}
        <div className="grid grid-cols-7 gap-1 mb-2" role="row">
          {WEEKDAY_NAMES.map((day) => (
            <div
              key={day}
              className="h-10 flex items-center justify-center text-xs font-medium text-slate-500"
              role="columnheader"
            >
              {day}
            </div>
          ))}
        </div>

        {}
        <div
          className="grid grid-cols-7 gap-1"
          role="grid"
          aria-label="Calendar"
        >
          {renderCalendarDays()}
        </div>

        {}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 bg-green-50 border border-green-200 rounded" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 bg-violet-600 rounded" />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 bg-violet-100 rounded" />
            <span>In Range</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 bg-red-100 rounded relative">
              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-400 rounded-full" />
            </span>
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 bg-slate-100 rounded relative">
              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-slate-400 rounded-full" />
            </span>
            <span>Blocked</span>
          </div>
        </div>
      </div>

      {}
      {startDate && endDate && (
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-violet-700">
                <span className="font-medium">{totalDays}</span> day
                {totalDays !== 1 ? "s" : ""} rental
              </p>
              <p className="text-xs text-violet-600 mt-1">
                {formatCurrency(pricePerDay)} × {totalDays} day
                {totalDays !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-violet-800">
                {formatCurrency(totalPrice)}
              </p>
              <p className="text-xs text-violet-600">Total</p>
            </div>
          </div>
        </div>
      )}

      {}
      {startDate && endDate && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-700 font-medium">
            Selected dates are available!
          </p>
        </div>
      )}

      {}
      {!startDate && (
        <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <Info className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <p className="text-sm text-slate-600">
            Click on a date to start selecting your rental period
          </p>
        </div>
      )}

      {startDate && !endDate && (
        <div className="flex items-center gap-2 p-3 bg-violet-50 border border-violet-200 rounded-lg animate-pulse">
          <Info className="w-4 h-4 text-violet-600 flex-shrink-0" />
          <p className="text-sm text-violet-700">
            Now select an end date for your rental period
          </p>
        </div>
      )}
    </div>
  )
}

export default BookingCalendar
