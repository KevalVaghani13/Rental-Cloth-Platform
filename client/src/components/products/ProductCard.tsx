import { Link } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn, getImageUrl } from "@/lib/utils"

export interface Product {
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

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const {
    _id,
    title,
    category,
    pricePerDay,
    securityDeposit,
    images,
    isActive = true,
  } = product

  const imageUrl = getImageUrl(images?.[0])

  return (
    <Card
      variant="interactive"
      className={cn(
        "group overflow-hidden bg-white",
        !isActive && "opacity-60",
        className
      )}
    >
      {}
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={`${title} - ${category} available for rent`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {}
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-slate-700 rounded-full shadow-sm">
          {category}
        </span>

        {}
        {!isActive && (
          <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
            <span className="px-4 py-2 bg-white text-slate-900 text-sm font-semibold rounded-lg">
              Currently Unavailable
            </span>
          </div>
        )}
      </div>

      {}
      <div className="p-4 space-y-3">
        {}
        <h3 className="font-semibold text-slate-900 text-lg leading-tight line-clamp-2 group-hover:text-violet-600 transition-colors">
          {title}
        </h3>

        {}
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-slate-500">Rental Price</span>
            <span className="text-lg font-bold text-violet-600">
              ₹{pricePerDay.toLocaleString("en-IN")}
              <span className="text-sm font-normal text-slate-400">/day</span>
            </span>
          </div>
          
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-slate-500">Security Deposit</span>
            <span className="text-sm font-medium text-slate-700">
              ₹{securityDeposit.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {}
        <Link 
          to={`/products/${_id}`}
          className="block pt-2"
          aria-label={`View details for ${title}`}
        >
          <Button
            variant="outline"
            fullWidth
            className="group-hover:bg-violet-600 group-hover:text-white group-hover:border-violet-600 transition-all"
            disabled={!isActive}
          >
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  )
}

export default ProductCard
