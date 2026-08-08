import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const employmentTypes = ['SALARIED', 'SELF_EMPLOYED', 'BUSINESS', 'STUDENT', 'UNEMPLOYED']

export default function Register() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    monthlyIncome: '',
    employmentType: 'SALARIED',
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...form,
        monthlyIncome: Number(form.monthlyIncome),
      }
      await register(payload)
      toast.success('Registration successful! Please login.')
      navigate('/login')
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Registration failed. Please check your details.'
      toast.error(Array.isArray(msg) ? msg[0] : msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-4xl overflow-hidden shadow-soft-lg animate-fade-in-up">
        {/* Left brand panel */}
        <div className="relative hidden md:flex flex-col justify-between bg-gradient-to-br from-emerald-600 via-teal-600 to-brand-600 text-white p-10">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-xl" />
          <div className="absolute bottom-10 right-6 text-7xl opacity-20 animate-float select-none">📝</div>
          <div className="relative">
            <span className="text-5xl">📝</span>
            <h2 className="font-display text-3xl font-bold mt-4 leading-tight">
              Join Loan Risk Predictor.
            </h2>
            <p className="mt-3 text-brand-50/90 text-sm">
              Create your account and unlock personalized credit insights.
            </p>
          </div>
          <div className="relative inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm w-fit">
            <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse-soft" />
            Free & secure · Takes under a minute
          </div>
        </div>

        {/* Right form */}
        <div className="bg-white/90 backdrop-blur-xl p-8 sm:p-10">
          <div className="text-center mb-6 md:hidden">
            <span className="text-4xl">📝</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Create Account</h1>
          <p className="text-slate-500 text-sm mt-1">Join Loan Risk Predictor</p>

          <form onSubmit={handleSubmit} className="space-y-4 mt-7">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Vasu Agarwal"
                className="input-base"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input-base"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min 8 characters"
                  className="input-base"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number *</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  placeholder="10 digit mobile"
                  className="input-base"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Monthly Income *</label>
                <input
                  type="number"
                  step="0.01"
                  name="monthlyIncome"
                  value={form.monthlyIncome}
                  onChange={handleChange}
                  placeholder="50000"
                  className="input-base"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Employment Type *</label>
                <select name="employmentType" value={form.employmentType} onChange={handleChange} className="input-base">
                  {employmentTypes.map((t) => (
                    <option key={t} value={t}>
                      {t.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Creating...
                </span>
              ) : (
                'Register'
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
