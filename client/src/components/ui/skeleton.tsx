import * as React from "react"
import { cn } from "@/lib/utils"

const skeletonVariants = {
  text: "h-4 w-full rounded",
  title: "h-6 w-3/4 rounded",
  avatar: "h-10 w-10 rounded-full",
  thumbnail: "h-20 w-20 rounded-lg",
  button: "h-10 w-24 rounded-lg",
  card: "h-48 w-full rounded-xl",
  image: "h-40 w-full rounded-lg",
}

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof skeletonVariants
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "text", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "animate-pulse bg-slate-200",
          skeletonVariants[variant],
          className
        )}
        aria-hidden="true"
        {...props}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"


const SkeletonCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border border-slate-200 bg-white p-4 space-y-4",
      className
    )}
    aria-label="Loading content"
    {...props}
  >
    <Skeleton variant="image" />
    <div className="space-y-2">
      <Skeleton variant="title" />
      <Skeleton variant="text" />
      <Skeleton variant="text" className="w-2/3" />
    </div>
    <div className="flex justify-between items-center pt-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton variant="button" />
    </div>
  </div>
))
SkeletonCard.displayName = "SkeletonCard"


const SkeletonList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { lines?: number }
>(({ className, lines = 3, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-3", className)}
    aria-label="Loading content"
    {...props}
  >
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton 
        key={i} 
        variant="text" 
        className={i === lines - 1 ? "w-2/3" : "w-full"}
      />
    ))}
  </div>
))
SkeletonList.displayName = "SkeletonList"


const SkeletonUser = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-3", className)}
    aria-label="Loading user"
    {...props}
  >
    <Skeleton variant="avatar" />
    <div className="space-y-2 flex-1">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-3 w-32" />
    </div>
  </div>
))
SkeletonUser.displayName = "SkeletonUser"

export { Skeleton, SkeletonCard, SkeletonList, SkeletonUser }
