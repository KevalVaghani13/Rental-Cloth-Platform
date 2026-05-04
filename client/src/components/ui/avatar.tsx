import { cn } from "@/lib/utils"

interface AvatarProps {
  src?: string | null
  alt?: string
  name?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
}

export function Avatar({ src, alt, name, size = "md", className }: AvatarProps) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?"

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name || "Avatar"}
        className={cn(
          "rounded-full object-cover ring-2 ring-white",
          sizeClasses[size],
          className
        )}
      />
    )
  }

  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center font-medium ring-2 ring-white",
        sizeClasses[size],
        className
      )}
      aria-label={name || "User avatar"}
    >
      {initials}
    </div>
  )
}

export default Avatar
