import { useState, useCallback } from "react"
import { ChevronDown, X, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"


export const CATEGORIES = [
  { id: "Saree", label: "Saree" },
  { id: "Lehenga", label: "Lehenga" },
  { id: "Sherwani", label: "Sherwani" },
  { id: "Chaniya Choli", label: "Chaniya Choli" },
  { id: "Other", label: "Other" },
]

export const OCCASIONS = [
  { id: "wedding", label: "Wedding" },
  { id: "navratri", label: "Navratri" },
  { id: "reception", label: "Reception" },
]

export const PRICE_RANGES = [
  { id: "0-500", label: "Under ₹500", min: 0, max: 500 },
  { id: "500-1000", label: "₹500 - ₹1,000", min: 500, max: 1000 },
  { id: "1000-2000", label: "₹1,000 - ₹2,000", min: 1000, max: 2000 },
  { id: "2000-5000", label: "₹2,000 - ₹5,000", min: 2000, max: 5000 },
  { id: "5000+", label: "Above ₹5,000", min: 5000, max: Infinity },
]

export interface FilterState {
  categories: string[]
  occasions: string[]
  priceRange: string | null
}

interface ProductFiltersProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  className?: string
  isMobile?: boolean
  onClose?: () => void
}

interface FilterSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-slate-200 pb-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-2 text-left font-medium text-slate-900 hover:text-violet-600 transition-colors"
        aria-expanded={isOpen}
      >
        {title}
        <ChevronDown
          className={cn(
            "w-4 h-4 text-slate-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          isOpen ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
        )}
      >
        {children}
      </div>
    </div>
  )
}

interface CheckboxItemProps {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function CheckboxItem({ id, label, checked, onChange }: CheckboxItemProps) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-3 py-1.5 cursor-pointer group"
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 focus:ring-offset-0 cursor-pointer"
      />
      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
        {label}
      </span>
    </label>
  )
}

interface RadioItemProps {
  id: string
  name: string
  label: string
  checked: boolean
  onChange: () => void
}

function RadioItem({ id, name, label, checked, onChange }: RadioItemProps) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-3 py-1.5 cursor-pointer group"
    >
      <input
        type="radio"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 border-slate-300 text-violet-600 focus:ring-violet-500 focus:ring-offset-0 cursor-pointer"
      />
      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
        {label}
      </span>
    </label>
  )
}

export function ProductFilters({
  filters,
  onFilterChange,
  className,
  isMobile = false,
  onClose,
}: ProductFiltersProps) {
  const handleCategoryChange = useCallback(
    (categoryId: string, checked: boolean) => {
      const newCategories = checked
        ? [...filters.categories, categoryId]
        : filters.categories.filter((c) => c !== categoryId)
      
      onFilterChange({ ...filters, categories: newCategories })
    },
    [filters, onFilterChange]
  )

  const handleOccasionChange = useCallback(
    (occasionId: string, checked: boolean) => {
      const newOccasions = checked
        ? [...filters.occasions, occasionId]
        : filters.occasions.filter((o) => o !== occasionId)
      
      onFilterChange({ ...filters, occasions: newOccasions })
    },
    [filters, onFilterChange]
  )

  const handlePriceRangeChange = useCallback(
    (priceId: string) => {
      onFilterChange({
        ...filters,
        priceRange: filters.priceRange === priceId ? null : priceId,
      })
    },
    [filters, onFilterChange]
  )

  const clearAllFilters = useCallback(() => {
    onFilterChange({
      categories: [],
      occasions: [],
      priceRange: null,
    })
  }, [onFilterChange])

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.occasions.length > 0 ||
    filters.priceRange !== null

  const activeFilterCount =
    filters.categories.length +
    filters.occasions.length +
    (filters.priceRange ? 1 : 0)

  return (
    <aside
      className={cn(
        "bg-white rounded-xl border border-slate-200 p-5",
        isMobile && "h-full",
        className
      )}
      aria-label="Product filters"
    >
      {}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-700" />
          <h2 className="font-semibold text-slate-900">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-medium rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-sm text-violet-600 hover:text-violet-700 font-medium transition-colors"
            >
              Clear all
            </button>
          )}
          {isMobile && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 hover:bg-slate-100 rounded-lg transition-colors lg:hidden"
              aria-label="Close filters"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          )}
        </div>
      </div>

      {}
      <div className="space-y-4">
        {}
        <FilterSection title="Category">
          <div className="space-y-1">
            {CATEGORIES.map((category) => (
              <CheckboxItem
                key={category.id}
                id={`category-${category.id}`}
                label={category.label}
                checked={filters.categories.includes(category.id)}
                onChange={(checked) => handleCategoryChange(category.id, checked)}
              />
            ))}
          </div>
        </FilterSection>

        {}
        <FilterSection title="Occasion">
          <div className="space-y-1">
            {OCCASIONS.map((occasion) => (
              <CheckboxItem
                key={occasion.id}
                id={`occasion-${occasion.id}`}
                label={occasion.label}
                checked={filters.occasions.includes(occasion.id)}
                onChange={(checked) => handleOccasionChange(occasion.id, checked)}
              />
            ))}
          </div>
        </FilterSection>

        {}
        <FilterSection title="Price Range">
          <div className="space-y-1">
            {PRICE_RANGES.map((price) => (
              <RadioItem
                key={price.id}
                id={`price-${price.id}`}
                name="priceRange"
                label={price.label}
                checked={filters.priceRange === price.id}
                onChange={() => handlePriceRangeChange(price.id)}
              />
            ))}
          </div>
        </FilterSection>
      </div>

      {}
      {isMobile && onClose && (
        <div className="mt-6 pt-4 border-t border-slate-200">
          <Button
            variant="default"
            fullWidth
            onClick={onClose}
          >
            Apply Filters
          </Button>
        </div>
      )}
    </aside>
  )
}

export default ProductFilters
