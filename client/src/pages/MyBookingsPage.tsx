import * as React from "react"
import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import { 
  Package, 
  Calendar, 
  Clock, 
  AlertCircle, 
  RefreshCw,
  ShoppingBag 
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { 
  BookingCard, 
  BookingCardSkeleton, 
  CancelBookingModal,
  normalizeBooking,
  type Booking,
  type BookingAPIResponse,
  type BookingStatus 
} from "@/components/bookings"

type TabType = "active" | "past"

const API_URL = "http://localhost:5000/api"


export default function MyBookingsPage() {
  const { token } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>("active")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)
  
  
  const [isReturning, setIsReturning] = useState<string | null>(null)
  const [isPickingUp, setIsPickingUp] = useState<string | null>(null)

  
  const fetchBookings = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/bookings/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch bookings")
      }

      const data: BookingAPIResponse[] = await response.json()
      
      const normalizedBookings = (Array.isArray(data) ? data : []).map(normalizeBooking)
      setBookings(normalizedBookings)
    } catch (err) {
      console.error("Error fetching bookings:", err)
      setError(
        err instanceof Error 
          ? err.message 
          : "Something went wrong. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token) {
      fetchBookings()
    }
  }, [token, fetchBookings])

  
  const filteredBookings = React.useMemo(() => {
    const activeStatuses: BookingStatus[] = ["Booked", "Ready for Pickup", "Picked"]
    const pastStatuses: BookingStatus[] = ["Returned", "Late", "Cancelled"]

    if (activeTab === "active") {
      return bookings.filter((b) => activeStatuses.includes(b.status))
    }
    return bookings.filter((b) => pastStatuses.includes(b.status))
  }, [bookings, activeTab])

  
  const handleCancelClick = (bookingId: string) => {
    const booking = bookings.find((b) => b._id === bookingId)
    if (booking) {
      setBookingToCancel(booking)
      setCancelModalOpen(true)
    }
  }

  
  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return

    setIsCancelling(true)
    try {
      const response = await fetch(
        `${API_URL}/bookings/${bookingToCancel._id}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      if (!response.ok) {
        throw new Error("Failed to cancel booking")
      }

      
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingToCancel._id 
            ? { ...b, status: "Cancelled" as BookingStatus } 
            : b
        )
      )

      setCancelModalOpen(false)
      setBookingToCancel(null)
    } catch (err) {
      console.error("Error cancelling booking:", err)
      
    } finally {
      setIsCancelling(false)
    }
  }

  
  const handleCloseModal = () => {
    if (!isCancelling) {
      setCancelModalOpen(false)
      setBookingToCancel(null)
    }
  }

  
  const handlePickup = async (bookingId: string) => {
    setIsPickingUp(bookingId)
    try {
      const response = await fetch(
        `${API_URL}/bookings/${bookingId}/pickup`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      if (!response.ok) {
        throw new Error("Failed to mark as picked up")
      }

      
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId 
            ? { ...b, status: "Picked" as BookingStatus } 
            : b
        )
      )
    } catch (err) {
      console.error("Error marking as picked up:", err)
    } finally {
      setIsPickingUp(null)
    }
  }

  
  const handleReturn = async (bookingId: string) => {
    setIsReturning(bookingId)
    try {
      const response = await fetch(
        `${API_URL}/bookings/${bookingId}/return`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      if (!response.ok) {
        throw new Error("Failed to return booking")
      }

      
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId 
            ? { ...b, status: "Returned" as BookingStatus } 
            : b
        )
      )
    } catch (err) {
      console.error("Error returning booking:", err)
    } finally {
      setIsReturning(null)
    }
  }

  
  const tabs = [
    {
      id: "active" as TabType,
      label: "Active Bookings",
      icon: Clock,
      count: bookings.filter((b) => 
        ["Booked", "Ready for Pickup", "Picked"].includes(b.status)
      ).length,
    },
    {
      id: "past" as TabType,
      label: "Past Bookings",
      icon: Calendar,
      count: bookings.filter((b) => 
        ["Returned", "Late", "Cancelled"].includes(b.status)
      ).length,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main id="main-content" className="flex-1 pt-20 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center text-white">
                <Package className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                My Bookings
              </h1>
            </div>
            <p className="text-slate-600 ml-13">
              Track and manage your rental bookings
            </p>
          </header>

          {}
          <div 
            className="flex gap-2 mb-6 border-b border-slate-200"
            role="tablist"
            aria-label="Booking filters"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`${tab.id}-panel`}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium",
                    "border-b-2 transition-colors -mb-px",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
                    isActive
                      ? "border-violet-600 text-violet-600"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  )}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span>{tab.label}</span>
                  {!isLoading && (
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        isActive
                          ? "bg-violet-100 text-violet-700"
                          : "bg-slate-100 text-slate-600"
                      )}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {}
          <div
            id={`${activeTab}-panel`}
            role="tabpanel"
            aria-labelledby={activeTab}
          >
            {}
            {isLoading && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <BookingCardSkeleton key={i} />
                ))}
              </div>
            )}

            {}
            {!isLoading && error && (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Failed to Load Bookings
                </h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                  {error}
                </p>
                <Button onClick={fetchBookings} variant="outline">
                  <RefreshCw className="w-4 h-4" aria-hidden="true" />
                  Try Again
                </Button>
              </div>
            )}

            {}
            {!isLoading && !error && filteredBookings.length === 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {activeTab === "active"
                    ? "No Active Bookings"
                    : "No Past Bookings"}
                </h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                  {activeTab === "active"
                    ? "You don't have any active rentals at the moment. Browse our collection to find something you'll love!"
                    : "You don't have any past bookings yet. Your completed and cancelled bookings will appear here."}
                </p>
                {activeTab === "active" && (
                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 hover:scale-[1.02] active:scale-[0.98] h-11 px-6 py-2"
                  >
                    Browse Products
                  </Link>
                )}
              </div>
            )}

            {}
            {!isLoading && !error && filteredBookings.length > 0 && (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    onCancel={handleCancelClick}
                    onPickup={handlePickup}
                    onReturn={handleReturn}
                    isCancelling={
                      isCancelling && bookingToCancel?._id === booking._id
                    }
                    isPickingUp={isPickingUp === booking._id}
                    isReturning={isReturning === booking._id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {}
      <CancelBookingModal
        isOpen={cancelModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmCancel}
        productName={bookingToCancel?.product.name || ""}
        isLoading={isCancelling}
      />
    </div>
  )
}
