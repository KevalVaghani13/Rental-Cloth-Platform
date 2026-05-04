import * as React from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { ImageGallery } from "@/components/products/ImageGallery"
import { BookingCalendar } from "@/components/products/BookingCalendar"
import { type DateRange } from "@/components/products/DateRangePicker"
import { PriceSummary } from "@/components/products/PriceSummary"
import {
  ArrowLeft,
  Store,
  MapPin,
  Tag,
  Ruler,
  AlertCircle,
  CheckCircle,
  ShoppingBag,
  Sparkles,
  Clock,
  Shield,
} from "lucide-react"


interface Product {
  _id: string
  title: string
  category: string
  description?: string
  pricePerDay: number
  securityDeposit: number
  images: string[]
  sizes?: string[]
  occasionTags?: string[]
  isActive?: boolean
  vendor?: {
    shopName: string
    address: string
  }
}


function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {}
        <Skeleton className="h-10 w-32 rounded-lg mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {}
          <div className="space-y-4">
            <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="w-20 h-20 rounded-lg flex-shrink-0" />
              ))}
            </div>
          </div>

          {}
          <div className="space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-3/4 rounded-lg" />
            </div>

            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))}
            </div>

            <div className="space-y-3">
              <Skeleton className="h-6 w-40 rounded-lg" />
              <Skeleton className="h-6 w-48 rounded-lg" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
            </div>

            <div className="pt-4 border-t border-slate-200">
              <Skeleton className="h-6 w-32 rounded-lg mb-4" />
              <Skeleton className="h-80 w-full rounded-xl" />
            </div>

            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}


function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Something went wrong
        </h2>
        <p className="text-slate-600 mb-6">{message}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <Button onClick={onRetry} variant="default">
              Try Again
            </Button>
          )}
          <Link to="/products">
            <Button variant="outline">Back to Products</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}


function UnavailableProduct({ productTitle }: { productTitle: string }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-amber-800 mb-1">
            Currently Unavailable
          </h3>
          <p className="text-amber-700 text-sm">
            "{productTitle}" is currently not available for rental. Please check
            back later or browse other products.
          </p>
        </div>
      </div>
    </div>
  )
}


export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  
  const [product, setProduct] = React.useState<Product | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [dateRange, setDateRange] = React.useState<DateRange>({
    startDate: null,
    endDate: null,
  })

  
  const fetchProduct = React.useCallback(async () => {
    if (!id) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/products/${id}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Product not found")
        }
        throw new Error("Failed to fetch product details")
      }
      const data = await response.json()
      setProduct(data.product || data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [id])

  React.useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  
  const isValidDateRange = dateRange.startDate && dateRange.endDate

  
  const handleBookNow = () => {
    if (!isValidDateRange || !product) return

    
    navigate("/checkout", {
      state: {
        productId: product._id,
        productName: product.title,
        productImage: product.images?.[0] || "/placeholder-product.svg",
        category: product.category,
        startDate: dateRange.startDate?.toISOString(),
        endDate: dateRange.endDate?.toISOString(),
        pricePerDay: product.pricePerDay,
        securityDeposit: product.securityDeposit,
        vendorName: product.vendor?.shopName,
      },
    })
  }

  
  if (isLoading) {
    return <ProductDetailSkeleton />
  }

  
  if (error) {
    return <ErrorMessage message={error} onRetry={fetchProduct} />
  }

  
  if (!product) {
    return <ErrorMessage message="Product not found" />
  }

  const isProductAvailable = product.isActive !== false

  return (
    <div className="min-h-screen bg-slate-50">
      {}
      <Navbar />

      {}
      <main id="main-content" className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {}
          <nav aria-label="Breadcrumb" className="mb-6">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-violet-600 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span className="font-medium">Back to Products</span>
            </Link>
          </nav>

          {}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <ImageGallery
                images={product.images}
                productTitle={product.title}
              />

              {}
              <div className="hidden lg:grid grid-cols-3 gap-3 mt-4">
                <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
                  <Clock className="w-5 h-5 text-violet-600 mx-auto mb-1" />
                  <p className="text-xs text-slate-500">Quick Delivery</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
                  <Shield className="w-5 h-5 text-violet-600 mx-auto mb-1" />
                  <p className="text-xs text-slate-500">Quality Assured</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
                  <Sparkles className="w-5 h-5 text-violet-600 mx-auto mb-1" />
                  <p className="text-xs text-slate-500">Premium Fabric</p>
                </div>
              </div>
            </div>

            {}
            <div className="space-y-6">
              {}
              {!isProductAvailable && (
                <UnavailableProduct productTitle={product.title} />
              )}

              {}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-100 text-violet-700 text-sm font-medium rounded-full">
                  <Tag className="w-3.5 h-3.5" />
                  {product.category}
                </span>
                {product.isActive !== false && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Available
                  </span>
                )}
              </div>

              {}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
                {product.title}
              </h1>

            {}
            {product.sizes && product.sizes.length > 0 && (
              <div className="flex items-center gap-3">
                <Ruler className="w-5 h-5 text-slate-400" />
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <span
                      key={size}
                      className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {}
            {product.occasionTags && product.occasionTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.occasionTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-700 text-sm font-medium rounded-full border border-violet-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-slate-600">Rental Price</span>
                <div className="text-right">
                  <span className="text-3xl font-bold text-violet-600">
                    ₹{product.pricePerDay.toLocaleString("en-IN")}
                  </span>
                  <span className="text-slate-500 ml-1">/day</span>
                </div>
              </div>
              <div className="flex items-baseline justify-between pt-3 border-t border-slate-100">
                <span className="text-slate-600">Security Deposit</span>
                <span className="text-lg font-semibold text-slate-900">
                  ₹{product.securityDeposit.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {}
            {product.vendor && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">
                      {product.vendor.shopName}
                    </h3>
                    {product.vendor.address && (
                      <p className="text-sm text-slate-600 flex items-start gap-1.5">
                        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        {product.vendor.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {}
            {product.description && (
              <div className="prose prose-slate max-w-none">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Description
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {}
            {isProductAvailable && (
              <>
                <div className="pt-6 border-t border-slate-200">
                  <BookingCalendar
                    productId={id || ""}
                    pricePerDay={product.pricePerDay}
                    onDateChange={(startDate, endDate) => {
                      setDateRange({ startDate, endDate })
                    }}
                  />
                </div>

                {}
                <PriceSummary
                  pricePerDay={product.pricePerDay}
                  securityDeposit={product.securityDeposit}
                  startDate={dateRange.startDate}
                  endDate={dateRange.endDate}
                />

                {}
                <div className="space-y-3">
                  <Button
                    onClick={handleBookNow}
                    disabled={!isValidDateRange}
                    size="xl"
                    fullWidth
                    leftIcon={<ShoppingBag className="w-5 h-5" />}
                    className="sticky bottom-4 lg:relative lg:bottom-auto shadow-xl shadow-violet-500/20"
                  >
                    {!dateRange.startDate || !dateRange.endDate
                      ? "Select Dates to Book"
                      : "Proceed to Checkout"
                    }
                  </Button>

                  {}
                  {!dateRange.startDate && !dateRange.endDate && (
                    <p className="text-center text-sm text-slate-500">
                      Select your rental dates above to proceed
                    </p>
                  )}
                </div>
              </>
            )}

            {}
            {!isProductAvailable && (
              <Link to="/products" className="block">
                <Button variant="outline" size="lg" fullWidth>
                  Browse Other Products
                </Button>
              </Link>
            )}
          </div>
        </div>

        {}
        <div className="lg:hidden grid grid-cols-3 gap-3 mt-8">
          <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
            <Clock className="w-5 h-5 text-violet-600 mx-auto mb-1" />
            <p className="text-xs text-slate-500">Quick Delivery</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
            <Shield className="w-5 h-5 text-violet-600 mx-auto mb-1" />
            <p className="text-xs text-slate-500">Quality Assured</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
            <Sparkles className="w-5 h-5 text-violet-600 mx-auto mb-1" />
            <p className="text-xs text-slate-500">Premium Fabric</p>
          </div>
        </div>
        </div>
      </main>

      {}
      <Footer />
    </div>
  )
}
