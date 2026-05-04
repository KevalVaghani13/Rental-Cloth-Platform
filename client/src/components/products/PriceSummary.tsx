import * as React from "react"
import { cn } from "@/lib/utils"
import { Calculator, Calendar, Shield, Tag } from "lucide-react"

interface PriceSummaryProps {
  pricePerDay: number
  securityDeposit: number
  startDate: Date | null
  endDate: Date | null
  className?: string
}

export function PriceSummary({
  pricePerDay,
  securityDeposit,
  startDate,
  endDate,
  className,
}: PriceSummaryProps) {
  
  const rentalDays = React.useMemo(() => {
    if (!startDate || !endDate) return 0
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays 
  }, [startDate, endDate])

  
  const rentalCost = pricePerDay * rentalDays

  
  const totalAmount = rentalCost + securityDeposit

  
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`
  }

  
  const formatDate = (date: Date | null) => {
    if (!date) return "—"
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    })
  }

  const hasValidRange = startDate && endDate && rentalDays > 0

  return (
    <div
      className={cn(
        "bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 overflow-hidden",
        className
      )}
    >
      {}
      <div className="bg-white px-5 py-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-violet-600" />
          <h3 className="text-lg font-semibold text-slate-900">Price Summary</h3>
        </div>
      </div>

      {}
      <div className="p-5 space-y-4">
        {}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-4 h-4" />
            <span>Selected Period</span>
          </div>
          <span className="font-medium text-slate-900">
            {hasValidRange
              ? `${formatDate(startDate)} - ${formatDate(endDate)}`
              : "Not selected"}
          </span>
        </div>

        {}
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Number of Days</span>
          <span className="font-medium text-slate-900">
            {rentalDays > 0 ? `${rentalDays} day${rentalDays > 1 ? "s" : ""}` : "—"}
          </span>
        </div>

        {}
        <div className="border-t border-slate-200 pt-4">
          {}
          <div className="flex items-center justify-between text-sm mb-3">
            <div className="flex items-center gap-2 text-slate-600">
              <Tag className="w-4 h-4" />
              <span>Price per day</span>
            </div>
            <span className="font-medium text-slate-900">
              {formatCurrency(pricePerDay)}
            </span>
          </div>

          {}
          {hasValidRange && (
            <div className="flex items-center justify-between text-sm mb-3 bg-white rounded-lg px-3 py-2">
              <span className="text-slate-600">
                {formatCurrency(pricePerDay)} × {rentalDays} days
              </span>
              <span className="font-semibold text-violet-600">
                {formatCurrency(rentalCost)}
              </span>
            </div>
          )}

          {}
          <div className="flex items-center justify-between text-sm mb-3">
            <div className="flex items-center gap-2 text-slate-600">
              <Shield className="w-4 h-4" />
              <span>Security Deposit</span>
              <span className="text-xs text-slate-400">(Refundable)</span>
            </div>
            <span className="font-medium text-slate-900">
              {formatCurrency(securityDeposit)}
            </span>
          </div>
        </div>

        {}
        <div className="border-t border-slate-300 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-slate-900">
              Total Amount
            </span>
            <div className="text-right">
              <span className="text-2xl font-bold text-violet-600">
                {hasValidRange ? formatCurrency(totalAmount) : "—"}
              </span>
              {hasValidRange && (
                <p className="text-xs text-slate-500 mt-0.5">
                  Including refundable deposit
                </p>
              )}
            </div>
          </div>
        </div>

        {}
        {!hasValidRange && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            <p className="text-sm text-amber-700">
              Select rental dates to see the total price
            </p>
          </div>
        )}

        {}
        {hasValidRange && (
          <div className="bg-violet-50 border border-violet-200 rounded-lg px-4 py-3">
            <p className="text-sm text-violet-700">
              <span className="font-medium">Note:</span> Security deposit of{" "}
              {formatCurrency(securityDeposit)} will be refunded after the product
              is returned in good condition.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PriceSummary
