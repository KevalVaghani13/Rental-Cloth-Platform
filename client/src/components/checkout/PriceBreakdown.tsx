import { cn } from "@/lib/utils"
import { 
  Calculator, 
  Tag, 
  Shield, 
  Receipt, 
  Percent,
  CheckCircle,
  Info
} from "lucide-react"


export interface PriceBreakdownProps {
  
  pricePerDay: number
  
  rentalDays: number
  
  securityDeposit: number
  
  taxRate?: number
  
  serviceFee?: number
  
  discount?: number
  
  currencySymbol?: string
  
  className?: string
}


export function PriceBreakdown({
  pricePerDay,
  rentalDays,
  securityDeposit,
  taxRate = 0,
  serviceFee = 0,
  discount = 0,
  currencySymbol = "₹",
  className,
}: PriceBreakdownProps) {
  
  const formatCurrency = (amount: number): string => {
    return `${currencySymbol}${amount.toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`
  }

  
  const rentalSubtotal = pricePerDay * rentalDays

  
  const taxAmount = taxRate > 0 ? (rentalSubtotal * taxRate) / 100 : 0

  
  const subtotalBeforeDeposit = rentalSubtotal + serviceFee + taxAmount - discount

  
  const totalPayable = subtotalBeforeDeposit + securityDeposit

  
  const hasValidData = rentalDays > 0 && pricePerDay > 0

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden",
        className
      )}
    >
      {}
      <div className="px-5 py-4 border-b border-slate-200 bg-gradient-to-r from-violet-50 to-indigo-50">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-violet-600" />
          <h2 className="text-lg font-semibold text-slate-900">Price Breakdown</h2>
        </div>
      </div>

      {}
      <div className="p-5 space-y-4">
        {}
        <div className="space-y-3">
          {}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-600">
              <Tag className="w-4 h-4" />
              <span className="text-sm">Rental price per day</span>
            </div>
            <span className="text-sm font-medium text-slate-900">
              {formatCurrency(pricePerDay)}
            </span>
          </div>

          {}
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 pl-6">Number of days</span>
            <span className="text-sm font-medium text-slate-900">
              × {rentalDays} {rentalDays === 1 ? "day" : "days"}
            </span>
          </div>

          {}
          <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2.5">
            <span className="text-sm font-medium text-slate-700">Rental Subtotal</span>
            <span className="text-base font-semibold text-violet-600">
              {hasValidData ? formatCurrency(rentalSubtotal) : "—"}
            </span>
          </div>
        </div>

        {}
        <div className="border-t border-slate-200" />

        {}
        <div className="space-y-3">
          {}
          {serviceFee > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <Receipt className="w-4 h-4" />
                <span className="text-sm">Service Fee</span>
              </div>
              <span className="text-sm font-medium text-slate-900">
                {formatCurrency(serviceFee)}
              </span>
            </div>
          )}

          {}
          {taxRate > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <Percent className="w-4 h-4" />
                <span className="text-sm">Tax ({taxRate}%)</span>
              </div>
              <span className="text-sm font-medium text-slate-900">
                {hasValidData ? formatCurrency(taxAmount) : "—"}
              </span>
            </div>
          )}

          {}
          {discount > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Discount Applied</span>
              </div>
              <span className="text-sm font-medium text-emerald-600">
                -{formatCurrency(discount)}
              </span>
            </div>
          )}

          {}
          <div className="flex items-center justify-between bg-amber-50 rounded-lg px-3 py-2.5">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-600" />
              <div>
                <span className="text-sm font-medium text-slate-700">Security Deposit</span>
                <span className="text-xs text-amber-600 ml-1">(Refundable)</span>
              </div>
            </div>
            <span className="text-sm font-semibold text-slate-900">
              {formatCurrency(securityDeposit)}
            </span>
          </div>
        </div>

        {}
        <div className="border-t-2 border-slate-200" />

        {}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl px-4 py-4 -mx-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-violet-100">Total Payable</span>
              <p className="text-xs text-violet-200 mt-0.5">
                Including refundable deposit
              </p>
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-white">
              {hasValidData ? formatCurrency(totalPayable) : "—"}
            </span>
          </div>
        </div>

        {}
        <div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
          <Info className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-700">
            The security deposit of {formatCurrency(securityDeposit)} will be refunded
            within 3-5 business days after the product is returned in good condition.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PriceBreakdown
