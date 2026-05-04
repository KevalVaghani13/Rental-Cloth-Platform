import { useState, useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Search,
  ArrowRight,
  CreditCard,
  Users,
  RefreshCw,
  Truck,
  CheckCircle,
  Camera,
  Car,
  Home as HomeIcon,
  Gamepad2,
  Wrench,
  Shirt,
} from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { StarRating } from "@/components/ui/star-rating"
import { cn } from "@/lib/utils"


function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      }
    },
    [searchQuery, navigate]
  )

  return (
    <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      {}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-200 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-medium mb-6">
              <span>✨</span>
              <span>Trusted by 10,000+ renters</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Rent Anything You Need,{" "}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Anytime, Anywhere
              </span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              A secure platform to rent and lend items with trust, insurance, and
              easy payments. Save money, reduce waste, and get what you need when
              you need it.
            </p>

            {}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="relative max-w-md mx-auto lg:mx-0">
                <label htmlFor="hero-search" className="sr-only">
                  Search for items to rent
                </label>
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="hero-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cameras, tools, vehicles..."
                  className="w-full h-14 pl-12 pr-32 rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  size="default"
                >
                  Search
                </Button>
              </div>
            </form>

            {}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <Link to="/products">
                <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Browse Items
                </Button>
              </Link>
              <Link to="/vendor/register">
                <Button variant="outline-subtle" size="lg">
                  Become a Vendor
                </Button>
              </Link>
            </div>

            {}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8">
              {[
                { number: "5,000+", label: "Products" },
                { number: "500+", label: "Vendors" },
                { number: "10,000+", label: "Happy Renters" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-slate-900">
                    {stat.number}
                  </div>
                  <div className="text-sm text-slate-500 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {}
          <div className="hidden lg:block relative">
            <div className="relative">
              {}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-400/20 to-indigo-400/20 rounded-3xl blur-2xl scale-110" />

              {}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop"
                  alt="People exchanging rental items"
                  className="w-full h-auto object-cover"
                  loading="eager"
                />
              </div>

              {}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {["JD", "MK", "AS"].map((initials, i) => (
                      <Avatar key={i} name={initials} size="sm" />
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <StarRating rating={5} size="sm" />
                    </div>
                    <p className="text-xs text-slate-500">1,200+ reviews</p>
                  </div>
                </div>
              </div>

              {}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 animate-float-delayed">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">100%</p>
                    <p className="text-xs text-slate-500">Satisfaction</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


function CategoriesSection() {
  const categories = [
    { icon: Wrench, label: "Tools", slug: "tools", color: "bg-orange-100 text-orange-600" },
    { icon: Gamepad2, label: "Electronics", slug: "electronics", color: "bg-blue-100 text-blue-600" },
    { icon: Car, label: "Vehicles", slug: "vehicles", color: "bg-green-100 text-green-600" },
    { icon: Camera, label: "Cameras", slug: "cameras", color: "bg-purple-100 text-purple-600" },
    { icon: HomeIcon, label: "Furniture", slug: "furniture", color: "bg-amber-100 text-amber-600" },
    { icon: Shirt, label: "Fashion", slug: "fashion", color: "bg-pink-100 text-pink-600" },
  ]

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Browse by Category
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Find exactly what you need from our wide range of rental categories
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/category/${category.slug}`}
              className="group"
            >
              <Card variant="interactive" padding="default" className="text-center">
                <div
                  className={cn(
                    "w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                    category.color
                  )}
                >
                  <category.icon className="h-7 w-7" />
                </div>
                <p className="font-medium text-slate-900 group-hover:text-violet-600 transition-colors">
                  {category.label}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}


function FeaturesSection() {
  const features = [
    {
      icon: CreditCard,
      title: "Secure Payments",
      description:
        "Your transactions are protected with bank-level security and encryption.",
      color: "bg-violet-100 text-violet-600",
    },
    {
      icon: Users,
      title: "Verified Vendors",
      description:
        "All vendors are verified and reviewed by our community for your peace of mind.",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: RefreshCw,
      title: "Easy Returns",
      description:
        "Hassle-free returns with flexible policies. We make renting simple.",
      color: "bg-amber-100 text-amber-600",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description:
        "Quick pickup or delivery options available for your convenience.",
      color: "bg-pink-100 text-pink-600",
    },
  ]

  return (
    <section id="features" className="py-16 lg:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Why Choose RentEase?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            We've built the most reliable rental marketplace with features
            designed for your convenience.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.title}
              variant="elevated"
              className="p-6 text-center lg:text-left"
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto lg:mx-0",
                  feature.color
                )}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}


function HowItWorksSection() {
  const steps = [
    {
      icon: Search,
      number: "01",
      title: "Search Items",
      description:
        "Browse our wide catalog of products. Filter by category, price, or location to find exactly what you need.",
    },
    {
      icon: CheckCircle,
      number: "02",
      title: "Rent & Pay Securely",
      description:
        "Select your rental dates, review the terms, and complete your booking with our secure payment system.",
    },
    {
      icon: RefreshCw,
      number: "03",
      title: "Return or Extend",
      description:
        "Return the item when done or easily extend your rental period. Flexible options for your needs.",
    },
  ]

  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Renting has never been easier. Get started in three simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative text-center">
              {}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-violet-300 to-transparent" />
              )}

              <Card variant="elevated" className="p-6 relative">
                <span className="inline-block px-3 py-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold rounded-full mb-4">
                  {step.number}
                </span>
                <div className="w-16 h-16 mx-auto mb-4 bg-violet-100 rounded-2xl flex items-center justify-center">
                  <step.icon className="h-8 w-8 text-violet-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Photographer",
      avatar: null,
      rating: 5,
      quote:
        "RentEase has been a game-changer for my photography business. I can rent high-end equipment without the huge upfront cost.",
    },
    {
      name: "Michael Chen",
      role: "DIY Enthusiast",
      avatar: null,
      rating: 5,
      quote:
        "Finally found a reliable place to rent tools for my home projects. The verification process gives me peace of mind.",
    },
    {
      name: "Emily Davis",
      role: "Event Planner",
      avatar: null,
      rating: 5,
      quote:
        "The variety of items available is incredible. From furniture to electronics - RentEase has everything I need for events.",
    },
  ]

  return (
    <section className="py-16 lg:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Join thousands of satisfied renters who trust RentEase
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} variant="elevated" className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar name={testimonial.name} size="lg" />
                <div>
                  <p className="font-semibold text-slate-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
              <StarRating rating={testimonial.rating} className="mb-4" />
              <p className="text-slate-600 leading-relaxed italic">
                "{testimonial.quote}"
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}


function CTASection() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-violet-600 to-indigo-700 relative overflow-hidden">
      {}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
          Ready to Start Renting?
        </h2>
        <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
          Join thousands of smart renters who save money and reduce waste. Sign
          up now and get access to exclusive deals!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register">
            <Button
              variant="white"
              size="lg"
              rightIcon={<ArrowRight className="h-5 w-5" />}
              className="w-full sm:w-auto"
            >
              Start Renting
            </Button>
          </Link>
          <Link to="/vendor/register">
            <Button
              variant="outline-white"
              size="lg"
              className="w-full sm:w-auto"
            >
              List Your Items
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}


export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <CategoriesSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
