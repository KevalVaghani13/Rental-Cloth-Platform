import * as React from "react"
import { cn, getImageUrl } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ImageGalleryProps {
  images: string[]
  productTitle: string
  className?: string
}

export function ImageGallery({ images, productTitle, className }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [isImageLoading, setIsImageLoading] = React.useState(true)

  
  const displayImages = images.length > 0 
    ? images.map(img => getImageUrl(img)) 
    : ["/placeholder-product.svg"]

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))
    setIsImageLoading(true)
  }

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))
    setIsImageLoading(true)
  }

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index)
    setIsImageLoading(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handlePrevious()
    } else if (e.key === "ArrowRight") {
      handleNext()
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {}
      <div
        className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100 group"
        role="img"
        aria-label={`${productTitle} - Image ${selectedIndex + 1} of ${displayImages.length}`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {}
        {isImageLoading && (
          <div className="absolute inset-0 bg-slate-200 animate-pulse" />
        )}

        {}
        <img
          src={displayImages[selectedIndex]}
          alt={`${productTitle} - View ${selectedIndex + 1}`}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isImageLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setIsImageLoading(false)}
          onError={() => setIsImageLoading(false)}
        />

        {}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-slate-700 hover:bg-white hover:scale-105 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-slate-700 hover:bg-white hover:scale-105 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {}
        {displayImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm font-medium">
            {selectedIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all duration-200",
                selectedIndex === index
                  ? "ring-2 ring-violet-600 ring-offset-2"
                  : "opacity-60 hover:opacity-100"
              )}
              aria-label={`View image ${index + 1}`}
              aria-current={selectedIndex === index ? "true" : "false"}
            >
              <img
                src={image}
                alt={`${productTitle} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageGallery
