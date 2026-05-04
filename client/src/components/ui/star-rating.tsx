import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeClasses = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
}

export function StarRating({ rating, maxRating = 5, size = "md", className }: StarRatingProps) {
  return (
    <div 
      className={cn("flex items-center gap-0.5", className)}
      role="img"
      aria-label={`Rating: ${rating} out of ${maxRating} stars`}
    >
      {Array.from({ length: maxRating }).map((_, index) => {
        const isFilled = index < Math.floor(rating)
        const isHalfFilled = index === Math.floor(rating) && rating % 1 !== 0

        return (
          <Star
            key={index}
            className={cn(
              sizeClasses[size],
              isFilled
                ? "fill-yellow-400 text-yellow-400"
                : isHalfFilled
                ? "fill-yellow-400/50 text-yellow-400"
                : "fill-slate-200 text-slate-200"
            )}
            aria-hidden="true"
          />
        )
      })}
    </div>
  )
}

export default StarRating
