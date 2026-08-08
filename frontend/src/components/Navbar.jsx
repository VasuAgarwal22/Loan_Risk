import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/transactions', label: 'Transactions' },
  { to: '/add-transaction', label: 'Add Transaction' },
  { to: '/apply-loan', label: 'Apply Loan' },
  { to: '/risk-assessment', label: 'Risk Check' },
]

export default function Navbar() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-white/15 text-white shadow-inner'
        : 'text-brand-100 hover:bg-white/10 hover:text-white'
    }`

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-xl shadow-soft-lg transition-transform group-hover:scale-105">
            🏦
          </span>
          <span className="font-display text-lg font-bold text-white leading-tight">
            Loan Risk
            <span className="block text-[11px] font-medium tracking-widest text-brand-300 uppercase">
              Predictor
            </span>
          </span>
        </NavLink>

        {user && (
          <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-xl p-1">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-full pl-1 pr-3 py-1">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-accent-400 text-xs font-bold text-white">
                {(user.fullName || 'U').charAt(0).toUpperCase()}
              </span>
              <span className="text-sm text-brand-100">{user.fullName || 'User'}</span>
            </div>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
            >
              Login
            </NavLink>
          )}

          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden rounded-lg p-2 text-brand-100 hover:bg-white/10"
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && user && (
        <div className="md:hidden border-t border-white/10 bg-slate-900/95 px-4 py-3 space-y-1 animate-fade-in-up">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-white/15 text-white' : 'text-brand-100 hover:bg-white/10'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}
