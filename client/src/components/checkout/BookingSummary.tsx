import * as React from "react"
import { cn, getImageUrl } from "@/lib/utils"
import { Calendar, Tag, Store, Clock, Image as ImageIcon } from "lucide-react"


export interface BookingSummaryProps {
  
  productImage: string
  
  productName: string
  
  category: string
  
  startDate: Date
  
  endDate: Date
  
  totalDays: number
  
  vendorName?: string
  
  className?: string
}


export function BookingSummary({
  productImage,
  productName,
  category,
  startDate,
  endDate,
  totalDays,
  vendorName,
  className,
}: BookingSummaryProps) {
  
  const [imageError, setImageError] = React.useState(false)

  
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  
  const getDateRangeText = (): string => {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`
  }

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden",
        className
      )}
    >
      {}
      <div className="px-5 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <h2 className="text-lg font-semibold text-slate-900">Booking Summary</h2>
        <p className="text-sm text-slate-500 mt-0.5">Review your rental details</p>
      </div>

      {}
      <div className="p-5">
        {}
        <div className="flex gap-4">
          {}
          <div className="relative w-24 h-32 sm:w-32 sm:h-40 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100">
            {imageError ? (
              
              <div className="w-full h-full flex items-center justify-center bg-slate-100">
                <ImageIcon className="w-8 h-8 text-slate-400" />
              </div>
            ) : (
              <img
                src={getImageUrl(productImage)}
                alt={productName}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            )}
            {}
            <span className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-sm text-xs font-medium text-slate-700 rounded-full shadow-sm">
              {category}
            </span>
          </div>

          {}
          <div className="flex-1 min-w-0 space-y-3">
            {}
            <div>
              <h3 className="font-semibold text-slate-900 text-base sm:text-lg leading-tight line-clamp-2">
                {productName}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-sm text-slate-500">{category}</span>
              </div>
            </div>

            {}
            {vendorName && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Store className="w-4 h-4 text-violet-500" />
                <span>{vendorName}</span>
              </div>
            )}
          </div>
        </div>

        {}
        <div className="mt-5 pt-5 border-t border-slate-100">
          {}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-violet-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-500 mb-0.5">Rental Period</p>
              <p className="font-medium text-slate-900">{getDateRangeText()}</p>
            </div>
          </div>

          {}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-500 mb-0.5">Duration</p>
              <p className="font-medium text-slate-900">
                {totalDays} {totalDays === 1 ? "day" : "days"}
              </p>
            </div>
          </div>
        </div>

        {}
        <div className="mt-5 p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <p className="text-sm text-blue-700">
            <span className="font-medium">Note:</span> Please ensure the product is returned
            by {formatDate(endDate)} to avoid late fees.
          </p>
        </div>
      </div>
    </div>
  )
}

export default BookingSummary
