import { cn } from "@/lib/utils"

export type BookingStatus = 
  | "Booked" 
  | "Ready for Pickup" 
  | "Picked" 
  | "Returned" 
  | "Late"
  | "Cancelled"

interface StatusBadgeProps {
  status: BookingStatus
  className?: string
}

const statusConfig: Record<BookingStatus, { bg: string; text: string; dot: string }> = {
  Booked: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  "Ready for Pickup": {
    bg: "bg-orange-50",
    text: "text-orange-700",
    dot: "bg-orange-500",
  },
  Picked: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    dot: "bg-purple-500",
  },
  Returned: {
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-500",
  },
  Late: {
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
  },
  Cancelled: {
    bg: "bg-slate-100",
    text: "text-slate-600",
    dot: "bg-slate-400",
  },
}


export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.Booked

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        config.bg,
        config.text,
        className
      )}
      role="status"
      aria-label={`Booking status: ${status}`}
    >
      <span 
        className={cn("w-1.5 h-1.5 rounded-full", config.dot)} 
        aria-hidden="true" 
      />
      {status}
    </span>
  )
}

export default StatusBadge
