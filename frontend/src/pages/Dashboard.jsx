import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { testAuth } from '../api'

const cards = [
  {
    to: '/transactions',
    icon: '💳',
    title: 'Transactions',
    desc: 'View your transaction history',
    gradient: 'from-brand-500 to-brand-700',
  },
  {
    to: '/add-transaction',
    icon: '➕',
    title: 'Add Transaction',
    desc: 'Record a new transaction',
    gradient: 'from-emerald-400 to-emerald-600',
  },
  {
    to: '/apply-loan',
    icon: '🏦',
    title: 'Apply Loan',
    desc: 'Submit a new loan application',
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    to: '/risk-assessment',
    icon: '📊',
    title: 'Risk Assessment',
    desc: 'Check your credit risk profile',
    gradient: 'from-accent-400 to-accent-600',
  },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [jwtStatus, setJwtStatus] = useState('Checking JWT...')

  useEffect(() => {
    testAuth()
      .then(() => setJwtStatus('✅ JWT authentication working'))
      .catch(() => setJwtStatus('❌ JWT check failed'))
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-brand-700 via-brand-600 to-accent-500 text-white p-8 sm:p-12 mb-12 shadow-soft-lg animate-fade-in-up">
        <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-accent-400/30 blur-2xl" />
        <div className="absolute top-8 right-10 text-6xl opacity-20 animate-float select-none">💰</div>

        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-soft" />
            Smart credit insights
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mt-4">
            Welcome{user?.fullName ? `, ${user.fullName} ` : ' Back '}👋
          </h1>
          <p className="mt-3 max-w-xl text-brand-50/90">
            Manage your transactions, apply for loans, and understand your credit risk — all in
            one place.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-soft"></span>
            {jwtStatus}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, i) => (
          <Link
            key={card.to}
            to={card.to}
            style={{ animationDelay: `${i * 80}ms` }}
            className="group relative overflow-hidden glass-card rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft animate-fade-in-up"
          >
            <div
              className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient} text-2xl shadow-soft transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
            >
              {card.icon}
            </div>
            <h3 className="font-display text-lg font-semibold text-slate-900">{card.title}</h3>
            <p className="text-sm text-slate-500 mt-1">{card.desc}</p>
            <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-brand-600 opacity-0 transition-all duration-300 group-hover:opacity-100">
              <span>Open</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
