import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  X, 
  AlertTriangle, 
  CheckCircle, 
  Calendar,
  CreditCard,
  ArrowRight
} from "lucide-react"


export interface ConfirmationModalProps {
  
  isOpen: boolean
  
  onClose: () => void
  
  onConfirm: () => void
  
  productName: string
  
  totalAmount: number
  
  startDate: Date
  
  endDate: Date
  
  isLoading?: boolean
  
  currencySymbol?: string
}


export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  productName,
  totalAmount,
  startDate,
  endDate,
  isLoading = false,
  currencySymbol = "₹",
}: ConfirmationModalProps) {
  
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen && !isLoading) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, isLoading, onClose])

  
  if (!isOpen) return null

  
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  
  const formatCurrency = (amount: number): string => {
    return `${currencySymbol}${amount.toLocaleString("en-IN")}`
  }

  
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
    >
      {}
      <div
        className={cn(
          "absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {}
      <div
        className={cn(
          "relative w-full max-w-md bg-white rounded-2xl shadow-xl transform transition-all duration-300",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}
      >
        {}
        <button
          onClick={onClose}
          disabled={isLoading}
          className={cn(
            "absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
          aria-label="Close confirmation modal"
        >
          <X className="w-5 h-5" />
        </button>

        {}
        <div className="px-6 pt-6 pb-4 text-center">
          {}
          <div className="w-16 h-16 mx-auto mb-4 bg-violet-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-violet-600" />
          </div>

          <h2
            id="confirmation-modal-title"
            className="text-xl font-semibold text-slate-900"
          >
            Confirm Your Booking
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Please review your booking details before confirming
          </p>
        </div>

        {}
        <div className="px-6 pb-4">
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            {}
            <div className="text-center pb-3 border-b border-slate-200">
              <p className="text-sm text-slate-500">Product</p>
              <p className="font-medium text-slate-900 line-clamp-2">{productName}</p>
            </div>

            {}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Rental Period</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="font-medium text-slate-900">{formatDate(startDate)}</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <span className="font-medium text-slate-900">{formatDate(endDate)}</span>
            </div>

            {}
            <div className="pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-600">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-sm">Total Amount</span>
                </div>
                <span className="text-lg font-bold text-violet-600">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="px-6 pb-4">
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              By confirming, you agree to our rental terms and conditions. The booking
              cannot be cancelled once confirmed.
            </p>
          </div>
        </div>

        {}
        <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            fullWidth
            onClick={onClose}
            disabled={isLoading}
            className="order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            fullWidth
            onClick={onConfirm}
            loading={isLoading}
            className="order-1 sm:order-2"
          >
            {isLoading ? "Processing..." : "Confirm Booking"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
