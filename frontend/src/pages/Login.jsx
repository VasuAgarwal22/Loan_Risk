import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../api'
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  LockKeyhole,
} from 'lucide-react'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form)
      toast.success('Welcome back!')
      navigate('/')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Invalid credentials. Please verify your email and password.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-card-hover border border-slate-200/80 grid md:grid-cols-2">
        {/* Left: Enterprise Branding Panel */}
        <div className="relative hidden md:flex flex-col justify-between bg-navy-900 text-white p-10 lg:p-12 overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Logo */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500 text-white shadow-soft">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white block">
                  ApexRisk
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-primary-300">
                  Credit Intelligence
                </span>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
                Enterprise Credit Risk Assessment & Lending
              </h2>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-sm">
                Real-time loan decisioning, cash flow behavioral analytics, and predictive credit scoring designed for modern financial governance.
              </p>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="relative z-10 space-y-4 my-8">
            <div className="flex items-center gap-3.5 text-sm text-slate-200 bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-500/20 text-primary-400">
                <TrendingUp className="h-4 w-4" />
              </div>
              <span>Multi-variable behavioral cashflow analytics</span>
            </div>

            <div className="flex items-center gap-3.5 text-sm text-slate-200 bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <FileCheck2 className="h-4 w-4" />
              </div>
              <span>Instant loan application status & tenure tracking</span>
            </div>

            <div className="flex items-center gap-3.5 text-sm text-slate-200 bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                <LockKeyhole className="h-4 w-4" />
              </div>
              <span>Bank-grade 256-bit encrypted authentication</span>
            </div>
          </div>

          {/* Bottom Security Footer */}
          <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>SOC-2 & ISO 27001 Compliant</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Systems Operational
            </span>
          </div>
        </div>

        {/* Right: Modern Login Form */}
        <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <div className="md:hidden flex items-center gap-2.5 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 text-white shadow-soft">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold text-navy-900 block leading-none">
                ApexRisk
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-primary-600">
                Credit Intelligence
              </span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-navy-900">
              Sign In to Your Account
            </h1>
            <p className="text-sm text-slate-500 mt-1.5">
              Enter your credentials to access your financial dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Work or Personal Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="input-base pl-10"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-base pl-10 pr-10"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm font-semibold shadow-soft hover:shadow-soft-lg gap-2"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account yet?{' '}
              <Link
                to="/register"
                className="font-semibold text-primary-600 hover:text-primary-700 hover:underline transition"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
