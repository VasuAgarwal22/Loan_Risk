import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../api'
import {
  ShieldCheck,
  User,
  Mail,
  Lock,
  Phone,
  IndianRupee,
  Briefcase,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'

const employmentTypes = [
  { value: 'SALARIED', label: 'Salaried Professional' },
  { value: 'SELF_EMPLOYED', label: 'Self-Employed' },
  { value: 'BUSINESS', label: 'Business Owner' },
  { value: 'STUDENT', label: 'Student' },
  { value: 'UNEMPLOYED', label: 'Unemployed' },
]

export default function Register() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    monthlyIncome: '',
    employmentType: 'SALARIED',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Client validations
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters.')
      return
    }

    const cleanPhone = form.phoneNumber.trim()
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      toast.error('Please enter a valid 10-digit Indian phone number starting with 6-9.')
      return
    }

    if (Number(form.monthlyIncome) <= 0) {
      toast.error('Monthly income must be greater than zero.')
      return
    }

    setLoading(true)
    try {
      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        phoneNumber: cleanPhone,
        monthlyIncome: Number(form.monthlyIncome),
        employmentType: form.employmentType,
      }
      await register(payload)
      toast.success('Registration successful! Please sign in with your credentials.')
      navigate('/login')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Registration failed. Please check your details.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-card-hover border border-slate-200/80 grid md:grid-cols-2">
        {/* Left: Enterprise Branding Panel */}
        <div className="relative hidden md:flex flex-col justify-between bg-navy-900 text-white p-10 lg:p-12 overflow-hidden">
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
                Empowering Faster, Smarter Lending Decisions
              </h2>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-sm">
                Join thousands of individuals and financial analysts evaluating creditworthiness with automated AI-driven risk models.
              </p>
            </div>
          </div>

          {/* Onboarding Checklist */}
          <div className="relative z-10 space-y-4 my-8">
            {[
              'Transparent risk score with instant credit health feedback',
              'Fast-track loan application processing and history tracker',
              'Automated cash flow categorization and expense analytics',
              'Strict bank-level security & privacy compliance',
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-slate-200">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Security Assurance */}
          <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Zero-obligation onboarding</span>
            <span className="text-slate-300 font-medium">Free Tier Available</span>
          </div>
        </div>

        {/* Right: Registration Form */}
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
              Create an Account
            </h1>
            <p className="text-sm text-slate-500 mt-1.5">
              Set up your profile to manage loans and evaluate risk
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Vasu Agarwal"
                  className="input-base pl-10"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Email Address *
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
                  placeholder="name@example.com"
                  className="input-base pl-10"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min 8 characters"
                    className="input-base pl-10 pr-9"
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Mobile Number *
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    placeholder="10-digit mobile"
                    maxLength={10}
                    className="input-base pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Income & Employment Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Monthly Income *
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <IndianRupee className="h-4 w-4" />
                  </div>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    name="monthlyIncome"
                    value={form.monthlyIncome}
                    onChange={handleChange}
                    placeholder="50,000"
                    className="input-base pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Employment Type *
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <select
                    name="employmentType"
                    value={form.employmentType}
                    onChange={handleChange}
                    className="input-base pl-10"
                    required
                  >
                    {employmentTypes.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm font-semibold shadow-soft hover:shadow-soft-lg gap-2 mt-2"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              Already registered?{' '}
              <Link
                to="/login"
                className="font-semibold text-primary-600 hover:text-primary-700 hover:underline transition"
              >
                Sign in to your account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
