import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form)
      toast.success('Login successful!')
      navigate('/')
    } catch (err) {
      const msg =
        err.response?.data?.message || err.response?.data?.error || 'Invalid credentials. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-4xl overflow-hidden shadow-soft-lg animate-fade-in-up">
        {/* Left brand panel */}
        <div className="relative hidden md:flex flex-col justify-between bg-gradient-to-br from-brand-700 via-brand-600 to-accent-500 text-white p-10">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-xl" />
          <div className="absolute bottom-10 left-6 text-7xl opacity-20 animate-float select-none">🏦</div>
          <div className="relative">
            <span className="text-5xl">🏦</span>
            <h2 className="font-display text-3xl font-bold mt-4 leading-tight">
              Smarter credit decisions, faster.
            </h2>
          </div>
          <div className="relative space-y-4">
            {[
              { icon: '💳', text: 'Track every transaction effortlessly' },
              { icon: '📊', text: 'Understand your credit risk profile' },
              { icon: '🏦', text: 'Apply for loans with confidence' },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3 text-brand-50/90">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-lg">
                  {f.icon}
                </span>
                <span className="text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right form */}
        <div className="bg-white/90 backdrop-blur-xl p-8 sm:p-10">
          <div className="text-center mb-8 md:hidden">
            <span className="text-4xl">🏦</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 text-sm mt-1">Login to access your account</p>

          <form onSubmit={handleSubmit} className="space-y-5 mt-8">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">✉️</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input-base pl-11"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔒</span>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-base pl-11"
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
