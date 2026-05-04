import { cn } from "@/lib/utils"
import { Check, X } from "lucide-react"

interface PasswordStrengthProps {
  password: string
  className?: string
}

interface Requirement {
  label: string
  test: (password: string) => boolean
}

const requirements: Requirement[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "Contains uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "Contains lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "Contains number", test: (p) => /\d/.test(p) },
  { label: "Contains special character", test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
]

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const passedCount = requirements.filter((req) => req.test(password)).length
  const strength = passedCount / requirements.length

  const getStrengthColor = () => {
    if (strength <= 0.2) return "bg-red-500"
    if (strength <= 0.4) return "bg-orange-500"
    if (strength <= 0.6) return "bg-yellow-500"
    if (strength <= 0.8) return "bg-lime-500"
    return "bg-green-500"
  }

  const getStrengthLabel = () => {
    if (strength <= 0.2) return "Very Weak"
    if (strength <= 0.4) return "Weak"
    if (strength <= 0.6) return "Fair"
    if (strength <= 0.8) return "Good"
    return "Strong"
  }

  if (!password) return null

  return (
    <div className={cn("space-y-3", className)}>
      {}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-600">Password strength</span>
          <span className={cn(
            "font-medium",
            strength <= 0.4 ? "text-red-600" : strength <= 0.6 ? "text-yellow-600" : "text-green-600"
          )}>
            {getStrengthLabel()}
          </span>
        </div>
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={cn("h-full transition-all duration-300 rounded-full", getStrengthColor())}
            style={{ width: `${strength * 100}%` }}
            role="progressbar"
            aria-valuenow={passedCount}
            aria-valuemin={0}
            aria-valuemax={requirements.length}
            aria-label="Password strength"
          />
        </div>
      </div>

      {}
      <ul className="grid grid-cols-1 gap-1.5 text-xs" aria-label="Password requirements">
        {requirements.map((req) => {
          const passed = req.test(password)
          return (
            <li
              key={req.label}
              className={cn(
                "flex items-center gap-2 transition-colors",
                passed ? "text-green-600" : "text-slate-500"
              )}
            >
              {passed ? (
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              <span>{req.label}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default PasswordStrength
