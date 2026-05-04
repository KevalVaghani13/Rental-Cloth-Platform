import * as React from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { 
  BookingSummary, 
  PriceBreakdown, 
  ConfirmationModal 
} from "@/components/checkout"
import { useAuth } from "@/context/AuthContext"
import { 
  ArrowLeft, 
  AlertCircle, 
  ShoppingBag,
  CheckCircle,
  RefreshCw
} from "lucide-react"






interface BookingData {
  productId: string
  productName: string
  productImage: string
  category: string
  startDate: string 
  endDate: string 
  pricePerDay: number
  securityDeposit: number
  vendorName?: string
}


interface BookingResponse {
  message?: string
  booking?: {
    _id: string
    status: string
    product?: {
      title: string
      pricePerDay: number
      images: string[]
    }
  }
  totalAmount?: number
}






function calculateRentalDays(start: Date, end: Date): number {
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays + 1 
}


function validateDates(start: Date, end: Date): { isValid: boolean; error?: string } {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (start < today) {
    return { isValid: false, error: "Start date cannot be in the past" }
  }

  if (end < start) {
    return { isValid: false, error: "End date cannot be before start date" }
  }

  const maxDays = 30 
  const days = calculateRentalDays(start, end)
  if (days > maxDays) {
    return { isValid: false, error: `Maximum rental period is ${maxDays} days` }
  }

  return { isValid: true }
}






function ErrorState({ 
  message, 
  onBack 
}: { 
  message: string
  onBack: () => void 
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl font-semibold text-slate-900 mb-2">
            Unable to Process Checkout
          </h1>
          <p className="text-slate-600 mb-6">{message}</p>
          <Button onClick={onBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Products
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}


function SuccessState({ bookingId }: { bookingId?: string }) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          {}
          <div className="w-20 h-20 mx-auto mb-6 bg-emerald-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-slate-600 mb-2">
            Your rental has been successfully booked.
          </p>
          {bookingId && (
            <p className="text-sm text-slate-500 mb-8">
              Booking ID: <span className="font-mono font-medium">{bookingId}</span>
            </p>
          )}

          {}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate("/my-bookings")}
              leftIcon={<ShoppingBag className="w-4 h-4" />}
            >
              View My Bookings
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}






export function CheckoutPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, token } = useAuth()

  
  
  

  
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [bookingId, setBookingId] = React.useState<string | undefined>()

  
  const isSubmittingRef = React.useRef(false)

  
  
  

  
  const bookingData = location.state as BookingData | null

  
  const startDate = bookingData?.startDate ? new Date(bookingData.startDate) : null
  const endDate = bookingData?.endDate ? new Date(bookingData.endDate) : null

  
  const rentalDays = startDate && endDate ? calculateRentalDays(startDate, endDate) : 0

  
  const dateValidation = startDate && endDate 
    ? validateDates(startDate, endDate) 
    : { isValid: false, error: "Rental dates are required" }

  
  const hasRequiredData = Boolean(
    bookingData?.productId &&
    bookingData?.productName &&
    bookingData?.pricePerDay &&
    bookingData?.securityDeposit &&
    startDate &&
    endDate
  )

  
  const canProceed = hasRequiredData && dateValidation.isValid && isAuthenticated

  
  
  

  
  const TAX_RATE = 18 
  const SERVICE_FEE = 99 

  
  const pricePerDay = bookingData?.pricePerDay || 0
  const securityDeposit = bookingData?.securityDeposit || 0
  const rentalSubtotal = pricePerDay * rentalDays
  const taxAmount = (rentalSubtotal * TAX_RATE) / 100
  const totalPayable = rentalSubtotal + SERVICE_FEE + taxAmount + securityDeposit

  
  
  

  
  const submitBooking = async (): Promise<BookingResponse> => {
    const API_URL = "http://localhost:5000/api"

    const response = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: bookingData?.productId,
        startDate: bookingData?.startDate,
        endDate: bookingData?.endDate,
        totalAmount: totalPayable,
        rentalDays: rentalDays,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to create booking")
    }

    return data
  }

  
  
  

  
  const handleConfirmClick = () => {
    setSubmitError(null)
    setIsModalOpen(true)
  }

  
  const handleModalClose = () => {
    if (!isSubmitting) {
      setIsModalOpen(false)
    }
  }

  
  const handleConfirmBooking = async () => {
    
    if (isSubmittingRef.current) return
    isSubmittingRef.current = true

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const result = await submitBooking()

      
      if (result.booking) {
        setBookingId(result.booking._id)
        setIsSuccess(true)
        setIsModalOpen(false)
      } else {
        throw new Error(result.message || "Booking failed")
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An unexpected error occurred. Please try again."
      setSubmitError(errorMessage)
      setIsModalOpen(false)
    } finally {
      setIsSubmitting(false)
      isSubmittingRef.current = false
    }
  }

  
  const handleBack = () => {
    navigate("/products")
  }

  
  const handleBackToProduct = () => {
    if (bookingData?.productId) {
      navigate(`/products/${bookingData.productId}`)
    } else {
      navigate("/products")
    }
  }

  
  
  

  
  if (isSuccess) {
    return <SuccessState bookingId={bookingId} />
  }

  
  if (!bookingData || !hasRequiredData) {
    return (
      <ErrorState
        message="No booking information found. Please select a product and rental dates first."
        onBack={handleBack}
      />
    )
  }

  
  if (!isAuthenticated) {
    return (
      <ErrorState
        message="Please log in to complete your booking."
        onBack={() => navigate("/login", { state: { from: location } })}
      />
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {}
      <Navbar />

      {}
      <main id="main-content" className="flex-1 pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {}
          <div className="mb-6 sm:mb-8">
            {}
            <button
              onClick={handleBackToProduct}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-4 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="text-sm font-medium">Back to Product</span>
            </button>

            {}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Checkout
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Review and confirm your rental booking
                </p>
              </div>
            </div>
          </div>

          {}
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-800">Booking Failed</p>
                <p className="text-sm text-red-600 mt-1">{submitError}</p>
              </div>
              <button
                onClick={handleConfirmClick}
                className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          )}

          {}
          {!dateValidation.isValid && dateValidation.error && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Invalid Dates</p>
                <p className="text-sm text-amber-600 mt-1">{dateValidation.error}</p>
              </div>
            </div>
          )}

          {}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            {}
            <div className="lg:col-span-3 space-y-6">
              <BookingSummary
                productImage={bookingData.productImage}
                productName={bookingData.productName}
                category={bookingData.category}
                startDate={startDate!}
                endDate={endDate!}
                totalDays={rentalDays}
                vendorName={bookingData.vendorName}
              />

              {}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h3 className="font-semibold text-slate-900 mb-3">
                  Rental Terms & Conditions
                </h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Product must be returned in the same condition</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Security deposit refunded within 3-5 business days after return</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Late returns may incur additional charges</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Damage to the product may result in deposit deduction</span>
                  </li>
                </ul>
              </div>
            </div>

            {}
            <div className="lg:col-span-2 space-y-6">
              {}
              <PriceBreakdown
                pricePerDay={pricePerDay}
                rentalDays={rentalDays}
                securityDeposit={securityDeposit}
                taxRate={TAX_RATE}
                serviceFee={SERVICE_FEE}
              />

              {}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <Button
                  fullWidth
                  size="lg"
                  onClick={handleConfirmClick}
                  disabled={!canProceed || isSubmitting}
                  loading={isSubmitting}
                  className="mb-3"
                >
                  {isSubmitting ? "Processing..." : "Confirm Booking"}
                </Button>

                {}
                {!canProceed && (
                  <p className="text-xs text-center text-slate-500">
                    {!isAuthenticated
                      ? "Please log in to continue"
                      : !dateValidation.isValid
                      ? dateValidation.error
                      : "Complete all required fields to continue"}
                  </p>
                )}

                {}
                <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                  <p className="text-xs text-slate-500">
                    🔒 Secure checkout • Your data is protected
                  </p>
                </div>
              </div>

              {}
              <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl border border-violet-100 p-5">
                <h4 className="font-semibold text-slate-900 mb-2">Need Help?</h4>
                <p className="text-sm text-slate-600 mb-3">
                  Have questions about your rental? Contact our support team.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
                >
                  Contact Support →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {}
      <Footer />

      {}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleConfirmBooking}
        productName={bookingData.productName}
        totalAmount={totalPayable}
        startDate={startDate!}
        endDate={endDate!}
        isLoading={isSubmitting}
      />
    </div>
  )
}

export default CheckoutPage
