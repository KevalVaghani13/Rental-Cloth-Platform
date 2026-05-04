import { useState, useEffect, useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import { 
  Package, 
  Menu, 
  User, 
  LogOut, 
  LayoutDashboard,
  ChevronDown,
  ShoppingBag
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { DropdownMenu, DropdownItem, DropdownDivider, MobileMenu } from "@/components/ui/dropdown"
import { cn } from "@/lib/utils"

interface NavbarProps {
  className?: string
}

export function Navbar({ className }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = useCallback(() => {
    logout()
    navigate("/")
  }, [logout, navigate])

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#features", label: "Features" },
  ]

  return (
    <>
      {}
      <a 
        href="#main-content" 
        className="skip-to-content"
      >
        Skip to main content
      </a>

      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled 
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200" 
            : "bg-white/80 backdrop-blur-sm",
          className
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {}
            <Link 
              to="/" 
              className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-lg"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center text-white">
                <Package className="h-4 w-4" />
              </div>
              <span className="text-xl font-bold text-slate-900">RentEase</span>
            </Link>

            {}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                link.to ? (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded px-2 py-1"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded px-2 py-1"
                  >
                    {link.label}
                  </a>
                )
              ))}
            </div>

            {}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated && user ? (
                <DropdownMenu
                  trigger={
                    <div className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer">
                      <Avatar name={user.name} size="sm" />
                      <ChevronDown className="h-4 w-4 text-slate-500" />
                    </div>
                  }
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-medium text-slate-900">{user.name}</p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                  <DropdownItem 
                    icon={<User className="h-4 w-4" />}
                    onClick={() => navigate("/profile")}
                  >
                    Profile
                  </DropdownItem>
                  <DropdownItem 
                    icon={<ShoppingBag className="h-4 w-4" />}
                    onClick={() => navigate("/my-bookings")}
                  >
                    My Bookings
                  </DropdownItem>
                  {user.role !== 'CUSTOMER' && (
                    <DropdownItem 
                      icon={<LayoutDashboard className="h-4 w-4" />}
                      onClick={() => navigate("/dashboard")}
                    >
                      Dashboard
                    </DropdownItem>
                  )}
                  <DropdownDivider />
                  <DropdownItem 
                    icon={<LogOut className="h-4 w-4" />}
                    destructive
                    onClick={handleLogout}
                  >
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="h-6 w-6 text-slate-700" />
            </button>
          </div>
        </div>

        {}
        <MobileMenu isOpen={isMenuOpen} onClose={closeMenu}>
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              link.to ? (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={closeMenu}
                  className="px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={closeMenu}
                  className="px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              )
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            {isAuthenticated && user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-4 py-2">
                  <Avatar name={user.name} size="md" />
                  <div>
                    <p className="font-medium text-slate-900">{user.name}</p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                </div>
                <Link
                  to="/my-bookings"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  <ShoppingBag className="h-5 w-5" />
                  My Bookings
                </Link>
                {user.role !== 'CUSTOMER' && (
                  <Link
                    to="/dashboard"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    Dashboard
                  </Link>
                )}
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  <User className="h-5 w-5" />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    closeMenu()
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 px-4">
                <Link to="/login" onClick={closeMenu}>
                  <Button variant="outline" fullWidth>
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={closeMenu}>
                  <Button fullWidth>
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </MobileMenu>
      </nav>
    </>
  )
}

export default Navbar
