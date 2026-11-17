import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  ShieldCheck,
  LayoutDashboard,
  Receipt,
  PlusCircle,
  FilePlus,
  Files,
  BarChart3,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User as UserIcon,
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: Receipt },
  { to: '/add-transaction', label: 'Add Transaction', icon: PlusCircle },
  { to: '/apply-loan', label: 'Apply Loan', icon: FilePlus },
  { to: '/my-loans', label: 'My Loans', icon: Files },
  { to: '/risk-assessment', label: 'Risk Assessment', icon: BarChart3 },
]

export default function Navbar() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setProfileDropdownOpen(false)
  }, [location.pathname])

  // Click outside to close profile dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const userInitials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U'

  return (
    <header className="sticky top-0 z-50 bg-navy-900 border-b border-navy-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <NavLink to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 text-white shadow-soft transition-transform group-hover:scale-105">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-white block leading-none">
                ApexRisk
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-primary-300">
                Loan Management
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation Links */}
          {user && (
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 ${
                        isActive
                          ? 'bg-primary-500 text-white shadow-sm'
                          : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{item.label}</span>
                  </NavLink>
                )
              })}
            </nav>
          )}

          {/* User Profile & Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                {/* User Dropdown Trigger */}
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-navy-800/80 border border-navy-700/60 hover:bg-navy-800 transition focus:outline-none"
                  aria-expanded={profileDropdownOpen}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-500/20 text-primary-400 text-xs font-bold border border-primary-500/30">
                    {userInitials}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-white leading-none truncate max-w-[120px]">
                      {user.fullName || 'User'}
                    </p>
                    <p className="text-[10px] text-slate-400 leading-none mt-1">
                      {user.employmentType ? user.employmentType.replace('_', ' ') : 'Account'}
                    </p>
                  </div>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                      profileDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Profile Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white text-slate-800 shadow-dropdown border border-slate-200/90 py-1.5 z-50 animate-fade-in-up">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-semibold text-navy-900 truncate">
                        {user.fullName || 'Authenticated User'}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {user.email || 'user@apexrisk.com'}
                      </p>
                    </div>

                    <div className="py-1">
                      <div className="px-4 py-1.5 text-[11px] text-slate-500 flex justify-between">
                        <span>Role</span>
                        <span className="font-semibold text-slate-700">
                          {user.role || 'USER'}
                        </span>
                      </div>
                      {user.monthlyIncome && (
                        <div className="px-4 py-1.5 text-[11px] text-slate-500 flex justify-between">
                          <span>Reported Income</span>
                          <span className="font-semibold text-navy-900">
                            ₹{Number(user.monthlyIncome).toLocaleString('en-IN')}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to="/login"
                className="btn-primary !py-2 !px-4 text-xs font-semibold"
              >
                Sign In
              </NavLink>
            )}

            {/* Mobile Hamburger Button */}
            {user && (
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-navy-800 focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && user && (
        <div className="lg:hidden bg-navy-950 border-t border-navy-800 px-4 pt-3 pb-4 space-y-1.5 animate-fade-in-up">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-primary-500 text-white'
                      : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}

          <div className="pt-3 mt-2 border-t border-navy-800 flex justify-between items-center px-2">
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-slate-400" />
              <span className="text-xs text-slate-300 truncate max-w-[180px]">
                {user.fullName || user.email}
              </span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
