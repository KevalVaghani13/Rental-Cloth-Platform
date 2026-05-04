import { Suspense, lazy } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"


const HomePage = lazy(() => import("./pages/HomePage"))
const ProductListingPage = lazy(() => import("./pages/ProductListingPage"))
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"))
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"))
const MyBookingsPage = lazy(() => import("./pages/MyBookingsPage"))
const ProfilePage = lazy(() => import("./pages/ProfilePage"))
const LoginPage = lazy(() => import("./pages/LoginPage"))
const SignUpPage = lazy(() => import("./pages/SignUpPage"))
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"))


function PageLoader() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center justify-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center animate-pulse">
            <svg
              className="h-6 w-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M16.5 9.4 7.55 4.24" />
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          </div>
        </div>
        <div className="text-center">
          <p className="text-slate-500 text-sm">Loading...</p>
        </div>
      </div>
    </div>
  )
}


const Dashboard = () => {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Welcome to Dashboard
          </h1>
          <p className="text-slate-600 mb-1">Hello, {user?.name}!</p>
          <p className="text-slate-500 text-sm mb-1">{user?.email}</p>
          <span className="inline-block px-3 py-1 bg-violet-100 text-violet-700 text-xs font-medium rounded-full mb-6">
            {user?.role}
          </span>
          <div>
            <button
              onClick={logout}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-violet-500/25 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <PageLoader />
  }

  if (isAuthenticated) {
    
    
    const locationState = location.state as { from?: { pathname: string; state?: unknown } } | null
    const from = locationState?.from
    if (from) {
      return <Navigate to={from.pathname} state={from.state} replace />
    }
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {}
        <Route
          path="/login"
          element={
            <AuthRoute>
              <LoginPage />
            </AuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRoute>
              <SignUpPage />
            </AuthRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthRoute>
              <ForgotPasswordPage />
            </AuthRoute>
          }
        />

        {}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListingPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        
        {}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        
        {}
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />
        
        {}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}

export default App
