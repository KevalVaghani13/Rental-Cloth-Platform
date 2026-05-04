import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface BackToHomeProps {
  className?: string
  label?: string
}

export function BackToHome({ className, label = "Back to Home" }: BackToHomeProps) {
  return (
    <Link
      to="/"
      className={cn(
        "inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors group",
        className
      )}
    >
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
      {label}
    </Link>
  )
}

export default BackToHome
