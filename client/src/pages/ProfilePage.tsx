import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import { 
  Mail, 
  Calendar, 
  Package,
  ShoppingBag,
  ChevronRight,
  AlertCircle,
  RefreshCw
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { 
  BookingCard, 
  BookingCardSkeleton,
  normalizeBooking,
  type Booking,
  type BookingAPIResponse
} from "@/components/bookings"

const API_URL = "http://localhost:5000/api"


export default function ProfilePage() {
  const { user, token } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  
  const fetchBookings = useCallback(async () => {
    if (!token) return

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
    fetchBookings()
  }, [fetchBookings])

  
  const activeBookings = bookings
    .filter((b) => ["Booked", "Ready for Pickup", "Picked"].includes(b.status))
    .slice(0, 3)

  
  const stats = {
    totalBookings: bookings.length,
    activeBookings: bookings.filter((b) => 
      ["Booked", "Ready for Pickup", "Picked"].includes(b.status)
    ).length,
    completedBookings: bookings.filter((b) => b.status === "Returned").length,
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main id="main-content" className="flex-1 pt-20 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
            {}
            <div className="h-32 bg-gradient-to-r from-violet-600 to-indigo-600" />
            
            {}
            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
                {}
                <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                </div>

                {}
                <div className="flex-1 sm:pb-2">
                  <h1 className="text-2xl font-bold text-slate-900">
                    {user?.name || "User"}
                  </h1>
                  <span className="inline-block mt-1 px-3 py-1 bg-violet-100 text-violet-700 text-xs font-medium rounded-full">
                    {user?.role || "CUSTOMER"}
                  </span>
                </div>
              </div>

              {}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Email</p>
                    <p className="text-sm font-medium text-slate-900">
                      {user?.email || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Account Type</p>
                    <p className="text-sm font-medium text-slate-900">
                      {user?.role || "Customer"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats.totalBookings}
                  </p>
                  <p className="text-sm text-slate-500">Total Bookings</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats.activeBookings}
                  </p>
                  <p className="text-sm text-slate-500">Active Rentals</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats.completedBookings}
                  </p>
                  <p className="text-sm text-slate-500">Completed</p>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Recent Bookings
              </h2>
              <Link
                to="/my-bookings"
                className="text-sm font-medium text-violet-600 hover:text-violet-700 flex items-center gap-1"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="p-6">
              {}
              {isLoading && (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <BookingCardSkeleton key={i} />
                  ))}
                </div>
              )}

              {}
              {!isLoading && error && (
                <div className="text-center py-8">
                  <div className="w-14 h-14 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-7 h-7 text-red-600" />
                  </div>
                  <p className="text-slate-600 mb-4">{error}</p>
                  <Button onClick={fetchBookings} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </Button>
                </div>
              )}

              {}
              {!isLoading && !error && activeBookings.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-14 h-14 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-7 h-7 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    No Active Bookings
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Start renting to see your bookings here!
                  </p>
                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-xl h-10 px-5"
                  >
                    Browse Products
                  </Link>
                </div>
              )}

              {}
              {!isLoading && !error && activeBookings.length > 0 && (
                <div className="space-y-4">
                  {activeBookings.map((booking) => (
                    <BookingCard
                      key={booking._id}
                      booking={booking}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
