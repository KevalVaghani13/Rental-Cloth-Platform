import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Calendar, X } from "lucide-react"

export interface DateRange {
  startDate: Date | null
  endDate: Date | null
}

interface DateRangePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
  disabledDates?: Date[]
  minDate?: Date
  className?: string
}


const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

const isDateInRange = (date: Date, start: Date | null, end: Date | null): boolean => {
  if (!start || !end) return false
  const dateTime = date.getTime()
  return dateTime > start.getTime() && dateTime < end.getTime()
}

const isDateDisabled = (date: Date, disabledDates: Date[], minDate?: Date): boolean => {
  
  if (minDate && date < minDate) {
    return true
  }
  
  return disabledDates.some((d) => isSameDay(date, d))
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate()
}

const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay()
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function DateRangePicker({
  value,
  onChange,
  disabledDates = [],
  minDate = new Date(),
  className,
}: DateRangePickerProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const [currentMonth, setCurrentMonth] = React.useState(today.getMonth())
  const [currentYear, setCurrentYear] = React.useState(today.getFullYear())
  const [selectingEnd, setSelectingEnd] = React.useState(false)
  const [hoverDate, setHoverDate] = React.useState<Date | null>(null)

  
  const normalizedMinDate = React.useMemo(() => {
    const min = new Date(minDate)
    min.setHours(0, 0, 0, 0)
    return min
  }, [minDate])

  
  const normalizedDisabledDates = React.useMemo(() => {
    return disabledDates.map((d) => {
      const normalized = new Date(d)
      normalized.setHours(0, 0, 0, 0)
      return normalized
    })
  }, [disabledDates])

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date, normalizedDisabledDates, normalizedMinDate)) {
      return
    }

    if (!selectingEnd || !value.startDate) {
      
      onChange({ startDate: date, endDate: null })
      setSelectingEnd(true)
    } else {
      
      if (date < value.startDate) {
        
        onChange({ startDate: date, endDate: value.startDate })
      } else {
        onChange({ startDate: value.startDate, endDate: date })
      }
      setSelectingEnd(false)
    }
  }

  const handleClear = () => {
    onChange({ startDate: null, endDate: null })
    setSelectingEnd(false)
    setHoverDate(null)
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth)
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
    const days: React.ReactNode[] = []

    
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />)
    }

    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day)
      date.setHours(0, 0, 0, 0)
      
      const isDisabled = isDateDisabled(date, normalizedDisabledDates, normalizedMinDate)
      const isToday = isSameDay(date, today)
      const isStart = value.startDate && isSameDay(date, value.startDate)
      const isEnd = value.endDate && isSameDay(date, value.endDate)
      const isSelected = isStart || isEnd
      
      
      const effectiveEnd = value.endDate || (selectingEnd && hoverDate ? hoverDate : null)
      const inRange = value.startDate && effectiveEnd && isDateInRange(date, value.startDate, effectiveEnd)
      const inHoverRange = selectingEnd && value.startDate && hoverDate && !value.endDate &&
        isDateInRange(date, value.startDate, hoverDate)

      days.push(
        <button
          key={day}
          type="button"
          disabled={isDisabled}
          onClick={() => handleDateClick(date)}
          onMouseEnter={() => setHoverDate(date)}
          onMouseLeave={() => setHoverDate(null)}
          className={cn(
            "h-10 w-10 rounded-lg text-sm font-medium transition-all duration-150",
            "focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-1",
            isDisabled && "text-slate-300 cursor-not-allowed line-through",
            !isDisabled && !isSelected && "hover:bg-violet-100 text-slate-700",
            isToday && !isSelected && "border border-violet-400",
            isSelected && "bg-violet-600 text-white hover:bg-violet-700",
            (inRange || inHoverRange) && !isSelected && "bg-violet-100 text-violet-700",
            isStart && value.endDate && "rounded-r-none",
            isEnd && value.startDate && "rounded-l-none"
          )}
          aria-label={`${isDisabled ? "Unavailable: " : ""}${formatDate(date)}`}
          aria-pressed={isSelected || undefined}
        >
          {day}
        </button>
      )
    }

    return days
  }

  
  const isPrevDisabled = 
    currentYear < normalizedMinDate.getFullYear() ||
    (currentYear === normalizedMinDate.getFullYear() && currentMonth <= normalizedMinDate.getMonth())

  return (
    <div className={cn("space-y-4", className)}>
      {}
      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <Calendar className="w-5 h-5 text-violet-600 flex-shrink-0" />
        <div className="flex-1 flex items-center gap-2 text-sm">
          <span
            className={cn(
              "px-3 py-1.5 rounded-lg font-medium transition-colors",
              value.startDate
                ? "bg-violet-100 text-violet-700"
                : "bg-slate-200 text-slate-500"
            )}
          >
            {value.startDate ? formatDate(value.startDate) : "Start Date"}
          </span>
          <span className="text-slate-400">→</span>
          <span
            className={cn(
              "px-3 py-1.5 rounded-lg font-medium transition-colors",
              value.endDate
                ? "bg-violet-100 text-violet-700"
                : selectingEnd
                ? "bg-amber-100 text-amber-700 animate-pulse"
                : "bg-slate-200 text-slate-500"
            )}
          >
            {value.endDate
              ? formatDate(value.endDate)
              : selectingEnd
              ? "Select End Date"
              : "End Date"}
          </span>
        </div>
        {(value.startDate || value.endDate) && (
          <button
            onClick={handleClear}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            aria-label="Clear selection"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
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
          <h3 className="text-lg font-semibold text-slate-900">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </h3>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAY_NAMES.map((day) => (
            <div
              key={day}
              className="h-10 flex items-center justify-center text-xs font-medium text-slate-500"
            >
              {day}
            </div>
          ))}
        </div>

        {}
        <div className="grid grid-cols-7 gap-1" role="grid" aria-label="Calendar">
          {renderCalendarDays()}
        </div>

        {}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 bg-violet-600 rounded" />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 bg-violet-100 rounded" />
            <span>In Range</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 bg-slate-200 rounded line-through flex items-center justify-center text-slate-400">
              
            </span>
            <span>Unavailable</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DateRangePicker
