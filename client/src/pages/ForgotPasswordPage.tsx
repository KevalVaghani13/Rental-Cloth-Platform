import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { Mail, Lock, Package, CheckCircle, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BackToHome } from "@/components/ui/back-to-home"
import { PasswordStrength } from "@/components/ui/password-strength"
import { cn } from "@/lib/utils"

type Step = "email" | "verify" | "reset" | "success"

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [resetToken, setResetToken] = useState("")

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email")
      }

      setStep("verify")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError("")

    
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault()
    const otpCode = otp.join("")

    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit code")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: otpCode }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Invalid OTP")
      }

      setResetToken(data.resetToken)
      setStep("reset")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault()

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            resetToken,
            newPassword,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password")
      }

      setStep("success")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const resendOtp = async () => {
    setIsLoading(true)
    setError("")
    setOtp(["", "", "", "", "", ""])

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-violet-600 to-indigo-700 p-12 relative overflow-hidden">
        {}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>

        <div className="relative z-10 flex flex-col justify-center max-w-md">
          {}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">RentEase</span>
          </Link>

          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Reset Your
            <br />
            Password
          </h1>

          <p className="text-lg text-white/90 leading-relaxed mb-8">
            Don't worry, it happens to the best of us. We'll help you get back
            into your account in no time.
          </p>

          {}
          <div className="space-y-4">
            {[
              "Secure Reset Process",
              "Email Verification",
              "Quick Recovery",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-white/90">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12 bg-slate-50">
        <div className="w-full max-w-md mx-auto">
          {}
          <BackToHome className="mb-8 lg:hidden" />

          {}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Package className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">RentEase</span>
          </Link>

          {}
          {step === "email" && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-violet-100 rounded-2xl flex items-center justify-center">
                  <Mail className="h-8 w-8 text-violet-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Forgot Password?
                </h2>
                <p className="text-slate-600">
                  Enter your email and we'll send you a verification code
                </p>
              </div>

              {error && (
                <div
                  className="flex items-center gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                  role="alert"
                >
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleEmailSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
                      aria-hidden="true"
                    />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setError("")
                      }}
                      placeholder="Enter your email"
                      required
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" fullWidth loading={isLoading}>
                  Send Verification Code
                </Button>
              </form>

              <p className="mt-8 text-center text-slate-600">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="font-medium text-violet-600 hover:text-violet-700"
                >
                  Sign In
                </Link>
              </p>
            </>
          )}

          {}
          {step === "verify" && (
            <>
              <button
                onClick={() => setStep("email")}
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-violet-100 rounded-2xl flex items-center justify-center">
                  <Lock className="h-8 w-8 text-violet-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Enter Verification Code
                </h2>
                <p className="text-slate-600">
                  We sent a code to{" "}
                  <span className="font-medium">{email}</span>
                </p>
              </div>

              {error && (
                <div
                  className="flex items-center gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                  role="alert"
                >
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label className="sr-only">Verification code</label>
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-14 text-center text-xl font-semibold rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                        aria-label={`Digit ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <Button type="submit" size="lg" fullWidth loading={isLoading}>
                  Verify Code
                </Button>
              </form>

              <p className="mt-6 text-center text-slate-600">
                Didn't receive the code?{" "}
                <button
                  onClick={resendOtp}
                  disabled={isLoading}
                  className="font-medium text-violet-600 hover:text-violet-700 disabled:opacity-50"
                >
                  Resend
                </button>
              </p>
            </>
          )}

          {}
          {step === "reset" && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-violet-100 rounded-2xl flex items-center justify-center">
                  <Lock className="h-8 w-8 text-violet-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Create New Password
                </h2>
                <p className="text-slate-600">
                  Your new password must be different from previous passwords
                </p>
              </div>

              {error && (
                <div
                  className="flex items-center gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                  role="alert"
                >
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
                      aria-hidden="true"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value)
                        setError("")
                      }}
                      placeholder="Enter new password"
                      required
                      className="w-full h-12 pl-11 pr-12 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {newPassword && (
                    <PasswordStrength password={newPassword} className="mt-3" />
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
                      aria-hidden="true"
                    />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        setError("")
                      }}
                      placeholder="Confirm new password"
                      required
                      className={cn(
                        "w-full h-12 pl-11 pr-12 rounded-xl border bg-white text-slate-900 placeholder:text-slate-400",
                        "focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all",
                        confirmPassword && newPassword !== confirmPassword
                          ? "border-red-500"
                          : "border-slate-200"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button type="submit" size="lg" fullWidth loading={isLoading}>
                  Reset Password
                </Button>
              </form>
            </>
          )}

          {}
          {step === "success" && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Password Reset Successful!
              </h2>
              <p className="text-slate-600 mb-8">
                Your password has been changed successfully. You can now sign in
                with your new password.
              </p>
              <Link to="/login">
                <Button size="lg" fullWidth>
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
