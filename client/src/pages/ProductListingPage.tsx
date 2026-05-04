import { useState, useEffect, useCallback, useMemo } from "react"
import { Link, useSearchParams } from "react-router-dom"
import {
  Search,
  Package,
  Filter,
  X,
  User,
  ShoppingBag,
  AlertCircle,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { DropdownMenu, DropdownItem, DropdownDivider } from "@/components/ui/dropdown"
import {
  ProductCard,
  ProductFilters,
  ProductGridSkeleton,
  PRICE_RANGES,
  type Product,
  type FilterState,
} from "@/components/products"
import { cn } from "@/lib/utils"

const API_URL = "http://localhost:5000/api"


function ProductNavbar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log("Searching for:", searchQuery)
  }

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200"
          : "bg-white border-b border-slate-100"
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {}
          <Link
            to="/"
            className="flex items-center gap-2 flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-lg"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Package className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-slate-900 hidden sm:block">
              RentEase
            </span>
          </Link>

          {}
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-xl hidden md:block"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="search"
                placeholder="Search traditional clothes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-full border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 focus:bg-white transition-all"
                aria-label="Search products"
              />
            </div>
          </form>

          {}
          <div className="flex items-center gap-3">
            {}
            <button
              type="button"
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors md:hidden"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-slate-600" />
            </button>

            {}
            {isAuthenticated ? (
              <DropdownMenu
                trigger={
                  <button
                    className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                    aria-label="User menu"
                  >
                    <Avatar
                      name={user?.name || "User"}
                      size="sm"
                      className="ring-2 ring-white"
                    />
                    <span className="text-sm font-medium text-slate-700 hidden lg:block">
                      {user?.name?.split(" ")[0]}
                    </span>
                  </button>
                }
                align="right"
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <Link to="/dashboard">
                  <DropdownItem>
                    <User className="w-4 h-4" />
                    Dashboard
                  </DropdownItem>
                </Link>
                <Link to="/orders">
                  <DropdownItem>
                    <ShoppingBag className="w-4 h-4" />
                    My Orders
                  </DropdownItem>
                </Link>
                <DropdownDivider />
                <DropdownItem onClick={logout} className="text-red-600">
                  <LogOut className="w-4 h-4" />
                  Logout
                </DropdownItem>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}


function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <ShoppingBag className="w-10 h-10 text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        No products available
      </h3>
      <p className="text-slate-500 max-w-md mb-6">
        We couldn't find any products matching your criteria. Try adjusting your filters or check back later.
      </p>
      <Link to="/">
        <Button variant="outline">Back to Home</Button>
      </Link>
    </div>
  )
}


function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-10 h-10 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        Something went wrong
      </h3>
      <p className="text-slate-500 max-w-md mb-6">{message}</p>
      <Button onClick={onRetry}>Try Again</Button>
    </div>
  )
}


function ActiveFilters({
  filters,
  onRemove,
  onClearAll,
}: {
  filters: FilterState
  onRemove: (type: keyof FilterState, value?: string) => void
  onClearAll: () => void
}) {
  const hasFilters =
    filters.categories.length > 0 ||
    filters.occasions.length > 0 ||
    filters.priceRange !== null

  if (!hasFilters) return null

  const getPriceLabel = (priceId: string) => {
    const price = PRICE_RANGES.find((p) => p.id === priceId)
    return price?.label || priceId
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-sm text-slate-500 mr-2">Active filters:</span>
      
      {filters.categories.map((category) => (
        <button
          key={category}
          onClick={() => onRemove("categories", category)}
          className="inline-flex items-center gap-1 px-3 py-1 bg-violet-100 text-violet-700 text-sm font-medium rounded-full hover:bg-violet-200 transition-colors"
        >
          {category}
          <X className="w-3 h-3" />
        </button>
      ))}
      
      {filters.occasions.map((occasion) => (
        <button
          key={occasion}
          onClick={() => onRemove("occasions", occasion)}
          className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full hover:bg-indigo-200 transition-colors"
        >
          {occasion.charAt(0).toUpperCase() + occasion.slice(1)}
          <X className="w-3 h-3" />
        </button>
      ))}
      
      {filters.priceRange && (
        <button
          onClick={() => onRemove("priceRange")}
          className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full hover:bg-emerald-200 transition-colors"
        >
          {getPriceLabel(filters.priceRange)}
          <X className="w-3 h-3" />
        </button>
      )}
      
      <button
        onClick={onClearAll}
        className="text-sm text-slate-500 hover:text-slate-700 underline underline-offset-2"
      >
        Clear all
      </button>
    </div>
  )
}


export function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  
  const [filters, setFilters] = useState<FilterState>(() => ({
    categories: searchParams.get("categories")?.split(",").filter(Boolean) || [],
    occasions: searchParams.get("occasions")?.split(",").filter(Boolean) || [],
    priceRange: searchParams.get("price") || null,
  }))

  
  const fetchProducts = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/products`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }

      const data = await response.json()
      
      setProducts(Array.isArray(data) ? data : data.products || [])
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching products"
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  
  useEffect(() => {
    const params = new URLSearchParams()
    
    if (filters.categories.length > 0) {
      params.set("categories", filters.categories.join(","))
    }
    if (filters.occasions.length > 0) {
      params.set("occasions", filters.occasions.join(","))
    }
    if (filters.priceRange) {
      params.set("price", filters.priceRange)
    }
    
    setSearchParams(params, { replace: true })
  }, [filters, setSearchParams])

  
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      
      if (filters.categories.length > 0) {
        if (!filters.categories.includes(product.category)) {
          return false
        }
      }

      
      if (filters.occasions.length > 0) {
        const productOccasions = product.occasionTags?.map((tag) =>
          tag.toLowerCase()
        ) || []
        const hasMatchingOccasion = filters.occasions.some((occasion) =>
          productOccasions.includes(occasion)
        )
        if (!hasMatchingOccasion) {
          return false
        }
      }

      
      if (filters.priceRange) {
        const priceRange = PRICE_RANGES.find((p) => p.id === filters.priceRange)
        if (priceRange) {
          if (
            product.pricePerDay < priceRange.min ||
            product.pricePerDay > priceRange.max
          ) {
            return false
          }
        }
      }

      return true
    })
  }, [products, filters])

  
  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
  }, [])

  
  const handleRemoveFilter = useCallback(
    (type: keyof FilterState, value?: string) => {
      setFilters((prev) => {
        if (type === "priceRange") {
          return { ...prev, priceRange: null }
        }
        return {
          ...prev,
          [type]: (prev[type] as string[]).filter((v) => v !== value),
        }
      })
    },
    []
  )

  
  const handleClearAllFilters = useCallback(() => {
    setFilters({
      categories: [],
      occasions: [],
      priceRange: null,
    })
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      {}
      <ProductNavbar />

      {}
      <main className="pt-20 pb-12" id="main-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Traditional Clothes
              </h1>
              <p className="text-slate-500 mt-1">
                Discover beautiful traditional attire for every occasion
              </p>
            </div>

            {}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors lg:hidden"
            >
              <Filter className="w-4 h-4" />
              Filters
              {(filters.categories.length > 0 ||
                filters.occasions.length > 0 ||
                filters.priceRange) && (
                <span className="px-1.5 py-0.5 bg-violet-600 text-white text-xs rounded-full">
                  {filters.categories.length +
                    filters.occasions.length +
                    (filters.priceRange ? 1 : 0)}
                </span>
              )}
            </button>
          </div>

          {}
          <div className="flex gap-8">
            {}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <ProductFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </div>

            {}
            <div className="flex-1 min-w-0">
              {}
              <ActiveFilters
                filters={filters}
                onRemove={handleRemoveFilter}
                onClearAll={handleClearAllFilters}
              />

              {}
              {!isLoading && !error && (
                <p className="text-sm text-slate-500 mb-6">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
              )}

              {}
              {isLoading && <ProductGridSkeleton count={8} />}

              {}
              {error && <ErrorState message={error} onRetry={fetchProducts} />}

              {}
              {!isLoading && !error && filteredProducts.length === 0 && (
                <EmptyState />
              )}

              {}
              {!isLoading && !error && filteredProducts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {}
      {isMobileFilterOpen && (
        <>
          {}
          <div
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setIsMobileFilterOpen(false)}
            aria-hidden="true"
          />
          
          {}
          <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white z-50 lg:hidden overflow-y-auto">
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              isMobile
              onClose={() => setIsMobileFilterOpen(false)}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default ProductListingPage
