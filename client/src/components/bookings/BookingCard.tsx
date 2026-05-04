import { useState } from "react"
import { Link } from "react-router-dom"
import { Calendar, Eye, X, RotateCcw, Package, ImageOff } from "lucide-react"
import { cn, getImageUrl } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { StatusBadge, type BookingStatus } from "./StatusBadge"


export interface BookingAPIResponse {
  _id: string
  product: {
    _id: string
    title: string
    category: string
    images: string[]
    pricePerDay: number
  }
  startDate: string
  endDate: string
  rentalAmount: number
  depositAmount: number
  status: string
}


export interface Booking {
  _id: string
  product: {
    _id: string
    name: string
    category: string
    images: string[]
  }
  startDate: string
  endDate: string
  totalPrice: number
  status: BookingStatus
}


export function normalizeBooking(apiBooking: BookingAPIResponse): Booking {
  
  const statusMap: Record<string, BookingStatus> = {
    "BOOKED": "Booked",
    "CONFIRMED": "Ready for Pickup",
    "PICKED_UP": "Picked",
    "RETURNED": "Returned",
    "CANCELLED": "Cancelled",
    "LATE_RETURN": "Late",
  }

  return {
    _id: apiBooking._id,
    product: {
      _id: apiBooking.product?._id || "",
      name: apiBooking.product?.title || "Unknown Product",
      category: apiBooking.product?.category || "Other",
      images: apiBooking.product?.images || [],
    },
    startDate: apiBooking.startDate,
    endDate: apiBooking.endDate,
    totalPrice: (apiBooking.rentalAmount || 0) + (apiBooking.depositAmount || 0),
    status: statusMap[apiBooking.status] || "Booked",
  }
}

interface BookingCardProps {
  booking: Booking
  onCancel?: (bookingId: string) => void
  onReturn?: (bookingId: string) => void
  onPickup?: (bookingId: string) => void
  isCancelling?: boolean
  isReturning?: boolean
  isPickingUp?: boolean
  className?: string
}


export function BookingCard({ 
  booking, 
  onCancel,
  onReturn,
  onPickup,
  isCancelling = false,
  isReturning = false,
  isPickingUp = false,
  className 
}: BookingCardProps) {
  const { _id, product, startDate, endDate, totalPrice, status } = booking
  const [imageError, setImageError] = useState(false)

  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  
  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString("en-IN")}`
  }

  
  const productImageUrl = getImageUrl(product.images?.[0])

  const canCancel = status === "Booked"
  const canPickup = status === "Booked" || status === "Ready for Pickup"
  const canReturn = status === "Picked"

  return (
    <article
      className={cn(
        "bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden",
        "hover:shadow-md transition-shadow duration-200",
        className
      )}
      aria-labelledby={`booking-${_id}-title`}
    >
      <div className="flex flex-col sm:flex-row">
        {}
        <div className="sm:w-40 md:w-48 flex-shrink-0">
          <div className="aspect-square sm:h-full relative bg-slate-100">
            {!imageError && productImageUrl ? (
              <img
                src={productImageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100">
                <ImageOff className="w-12 h-12 text-slate-300" />
              </div>
            )}
            {}
            <div className="absolute top-2 left-2 sm:hidden">
              <StatusBadge status={status} />
            </div>
          </div>
        </div>

        {}
        <div className="flex-1 p-4 sm:p-5 flex flex-col">
          {}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wide">
                {product.category}
              </p>
              <h3 
                id={`booking-${_id}-title`}
                className="text-lg font-semibold text-slate-900 truncate"
              >
                {product.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Booking ID: {_id.slice(-8).toUpperCase()}
              </p>
            </div>
            {}
            <div className="hidden sm:block flex-shrink-0">
              <StatusBadge status={status} />
            </div>
          </div>

          {}
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
            <Calendar className="w-4 h-4 text-slate-400" aria-hidden="true" />
            <span>
              {formatDate(startDate)} — {formatDate(endDate)}
            </span>
          </div>

          {}
          <div className="mt-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {}
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Total Paid</p>
              <p className="text-xl font-bold text-slate-900">
                {formatCurrency(totalPrice)}
              </p>
            </div>

            {}
            <div className="flex items-center gap-2 flex-wrap">
              {canCancel && onCancel && (
                <Button
                  variant="outline-subtle"
                  size="sm"
                  onClick={() => onCancel(_id)}
                  disabled={isCancelling}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
                  aria-label={`Cancel booking for ${product.name}`}
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden xs:inline">Cancel</span>
                </Button>
              )}
              {canPickup && onPickup && (
                <Button
                  variant="outline-subtle"
                  size="sm"
                  onClick={() => onPickup(_id)}
                  disabled={isPickingUp}
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 hover:border-purple-200"
                  aria-label={`Mark as picked up for ${product.name}`}
                >
                  <Package className="w-4 h-4" aria-hidden="true" />
                  <span>Pickup</span>
                </Button>
              )}
              {canReturn && onReturn && (
                <Button
                  variant="outline-subtle"
                  size="sm"
                  onClick={() => onReturn(_id)}
                  disabled={isReturning}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50 hover:border-green-200"
                  aria-label={`Return ${product.name}`}
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>Return</span>
                </Button>
              )}
              <Link
                to={`/products/${product._id}`}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 border-2 border-slate-200 bg-white text-slate-700 hover:bg-violet-600 hover:text-white hover:border-violet-600 h-9 px-4"
                aria-label={`View details for ${product.name}`}
              >
                <Eye className="w-4 h-4" aria-hidden="true" />
                <span>View</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}


export function BookingCardSkeleton() {
  return (
    <div 
      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-pulse"
      aria-label="Loading booking"
    >
      <div className="flex flex-col sm:flex-row">
        {}
        <div className="sm:w-40 md:w-48 flex-shrink-0">
          <div className="aspect-square sm:h-full bg-slate-200" />
        </div>

        {}
        <div className="flex-1 p-4 sm:p-5">
          {}
          <div className="h-3 w-16 bg-slate-200 rounded mb-2" />
          {}
          <div className="h-5 w-3/4 bg-slate-200 rounded mb-2" />
          {}
          <div className="h-3 w-24 bg-slate-200 rounded mb-4" />
          {}
          <div className="h-4 w-48 bg-slate-200 rounded mb-4" />
          {}
          <div className="flex items-center justify-between mt-auto pt-2">
            <div>
              <div className="h-3 w-16 bg-slate-200 rounded mb-1" />
              <div className="h-6 w-20 bg-slate-200 rounded" />
            </div>
            <div className="h-9 w-28 bg-slate-200 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingCard
