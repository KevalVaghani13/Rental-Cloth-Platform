import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { X, AlertTriangle } from "lucide-react"

interface CancelBookingModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  productName: string
  isLoading?: boolean
}


export function CancelBookingModal({
  isOpen,
  onClose,
  onConfirm,
  productName,
  isLoading = false,
}: CancelBookingModalProps) {
  
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
      aria-labelledby="cancel-modal-title"
      onClick={handleBackdropClick}
    >
      {}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        aria-hidden="true" 
      />

      {}
      <div
        className={cn(
          "relative bg-white rounded-2xl shadow-2xl w-full max-w-md",
          "transform transition-all duration-200",
          "animate-in fade-in-0 zoom-in-95"
        )}
      >
        {}
        <button
          onClick={onClose}
          disabled={isLoading}
          className={cn(
            "absolute top-4 right-4 p-2 rounded-full",
            "text-slate-400 hover:text-slate-600 hover:bg-slate-100",
            "transition-colors focus:outline-none focus-visible:ring-2",
            "focus-visible:ring-violet-500",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          {}
          <div className="w-14 h-14 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-red-600" />
          </div>

          {}
          <h2
            id="cancel-modal-title"
            className="text-xl font-bold text-slate-900 text-center mb-2"
          >
            Cancel Booking?
          </h2>

          {}
          <p className="text-slate-600 text-center mb-6">
            Are you sure you want to cancel your booking for{" "}
            <span className="font-semibold text-slate-900">{productName}</span>?
            This action cannot be undone.
          </p>

          {}
          <div className="flex gap-3">
            <Button
              variant="outline-subtle"
              fullWidth
              onClick={onClose}
              disabled={isLoading}
            >
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              fullWidth
              onClick={onConfirm}
              loading={isLoading}
            >
              Yes, Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CancelBookingModal
