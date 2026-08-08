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

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-brand-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-2xl">🏦</span>
          <span>Loan Risk Predictor</span>
        </NavLink>

        {user && (
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive ? 'bg-brand-700 text-white' : 'text-brand-100 hover:bg-brand-500'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          {user && (
            <span className="hidden sm:block text-sm text-brand-100">
              👋 {user.fullName || 'User'}
            </span>
          )}
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-white text-brand-600 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-slate-100"
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              className="bg-white text-brand-600 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-slate-100"
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  )
}
