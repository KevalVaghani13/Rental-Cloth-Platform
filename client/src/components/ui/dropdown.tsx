import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface DropdownMenuProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: "left" | "right"
  className?: string
}

export function DropdownMenu({ trigger, children, align = "right", className }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "Escape":
        setIsOpen(false)
        triggerRef.current?.focus()
        break
      case "ArrowDown":
        event.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        }
        break
    }
  }

  return (
    <div ref={dropdownRef} className={cn("relative", className)} onKeyDown={handleKeyDown}>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-lg"
      >
        {trigger}
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute top-full mt-2 min-w-[200px] bg-white rounded-xl border border-slate-200 shadow-lg py-2 z-50",
            "animate-in fade-in-0 zoom-in-95 duration-200",
            align === "right" ? "right-0" : "left-0"
          )}
          role="menu"
          aria-orientation="vertical"
        >
          {children}
        </div>
      )}
    </div>
  )
}

interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
  destructive?: boolean
}

export function DropdownItem({ 
  children, 
  icon, 
  destructive, 
  className,
  ...props 
}: DropdownItemProps) {
  return (
    <button
      className={cn(
        "w-full px-4 py-2 text-left text-sm flex items-center gap-3 transition-colors",
        "hover:bg-slate-50 focus:bg-slate-50 focus:outline-none",
        destructive ? "text-red-600 hover:bg-red-50" : "text-slate-700",
        className
      )}
      role="menuitem"
      {...props}
    >
      {icon && <span className="w-4 h-4" aria-hidden="true">{icon}</span>}
      {children}
    </button>
  )
}

export function DropdownDivider() {
  return <div className="my-1 border-t border-slate-100" role="separator" />
}


interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function MobileMenu({ isOpen, onClose, children }: MobileMenuProps) {
  
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 lg:hidden"
      aria-modal="true"
      role="dialog"
    >
      {}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <span className="font-semibold text-slate-900">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-4" role="navigation">
          {children}
        </nav>
      </div>
    </div>
  )
}
