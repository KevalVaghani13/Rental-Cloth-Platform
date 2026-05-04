import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getImageUrl(imagePath: string | undefined): string {
  const placeholder = "/placeholder-product.svg"
  
  if (!imagePath) {
    return placeholder
  }

  
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    
    if (imagePath.includes("localhost:5000/uploads/")) {
      return imagePath.replace(/https?:\/\/localhost:5000/, "")
    }
    return imagePath
  }

  
  if (imagePath.startsWith("/uploads/")) {
    return imagePath
  }

  
  if (!imagePath.startsWith("/")) {
    return `/uploads/products/${imagePath}`
  }

  return imagePath
}
