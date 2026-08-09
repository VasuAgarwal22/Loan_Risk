import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { getMyLoans, getTransactions, getErrorMessage } from '../api'

const quickActions = [
  {
    to: '/transactions',
    icon: '💳',
    title: 'Transactions',
    desc: 'View your transaction history',
    gradient: 'from-brand-500 to-brand-700',
  },
  {
    to: '/apply-loan',
    icon: '🏦',
    title: 'Apply Loan',
    desc: 'Submit a new loan application',
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    to: '/my-loans',
    icon: '📋',
    title: 'My Loans',
    desc: 'Track your loan applications',
    gradient: 'from-sky-400 to-sky-600',
  },
  {
    to: '/risk-assessment',
    icon: '📊',
    title: 'Risk Assessment',
    desc: 'Check your credit risk profile',
    gradient: 'from-accent-400 to-accent-600',
  },
]

const statusColors = {
  PENDING: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-rose-100 text-rose-700',
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalLoans: 0,
    pendingLoans: 0,
    approvedLoans: 0,
    totalTransactions: 0,
    totalCredit: 0,
    totalDebit: 0,
  })
  const [recentLoans, setRecentLoans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const [loansRes, txnsRes] = await Promise.all([getMyLoans(), getTransactions()])
        const loans = loansRes.data
        const txns = txnsRes.data

        setStats({
          totalLoans: loans.length,
          pendingLoans: loans.filter((l) => l.status === 'PENDING').length,
          approvedLoans: loans.filter((l) => l.status === 'APPROVED').length,
          totalTransactions: txns.length,
          totalCredit: txns
            .filter((t) => t.transactionType === 'CREDIT')
            .reduce((s, t) => s + Number(t.amount || 0), 0),
          totalDebit: txns
            .filter((t) => t.transactionType === 'DEBIT')
            .reduce((s, t) => s + Number(t.amount || 0), 0),
        })
        setRecentLoans(loans.slice(0, 5))
      } catch (err) {
        toast.error(getErrorMessage(err, 'Failed to load dashboard data'))
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const statCards = [
    { label: 'Total Loans', value: stats.totalLoans, icon: '🏦', accent: 'from-brand-500 to-brand-700' },
    { label: 'Pending', value: stats.pendingLoans, icon: '⏳', accent: 'from-amber-400 to-orange-500' },
    { label: 'Approved', value: stats.approvedLoans, icon: '✅', accent: 'from-emerald-400 to-emerald-600' },
    { label: 'Transactions', value: stats.totalTransactions, icon: '💳', accent: 'from-sky-400 to-sky-600' },
  ]

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
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {statCards.map((c) => (
          <div key={c.label} className="glass-card rounded-3xl p-5 animate-fade-in-up">
            <div
              className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${c.accent} text-xl shadow-soft`}
            >
              {c.icon}
            </div>
            <p className="font-display text-2xl font-bold text-slate-900">{c.value}</p>
            <p className="text-sm text-slate-500">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="font-display text-xl font-semibold text-slate-800 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {quickActions.map((card, i) => (
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

      {/* Recent loans */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-semibold text-slate-800">Recent Loan Applications</h2>
        <Link to="/my-loans" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
          View all →
        </Link>
      </div>

      {loading ? (
        <div className="glass-card rounded-3xl p-8 text-center text-slate-500">
          <svg className="h-8 w-8 mx-auto animate-spin text-brand-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <p className="mt-3">Loading loans...</p>
        </div>
      ) : recentLoans.length === 0 ? (
        <div className="glass-card rounded-3xl p-10 text-center animate-fade-in-up">
          <span className="text-4xl">🏦</span>
          <p className="mt-3 text-slate-500">No loan applications yet.</p>
          <Link
            to="/apply-loan"
            className="inline-block mt-3 font-semibold text-brand-600 hover:text-brand-700"
          >
            Apply for your first loan →
          </Link>
        </div>
      ) : (
        <div className="glass-card rounded-3xl overflow-hidden animate-fade-in-up">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-brand-600 to-brand-500 text-white">
                <tr>
                  <th className="text-left px-5 py-3.5 font-semibold">Amount</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Tenure</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Purpose</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Applied</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLoans.map((loan) => (
                  <tr key={loan.id} className="border-t border-slate-100 hover:bg-brand-50/50">
                    <td className="px-5 py-4 font-bold text-slate-800">₹{loan.loanAmount}</td>
                    <td className="px-5 py-4 text-slate-600">{loan.tenureMonths} mo</td>
                    <td className="px-5 py-4 text-slate-600 max-w-[160px] truncate">{loan.purpose}</td>
                    <td className="px-5 py-4 text-slate-600 whitespace-nowrap">
                      {new Date(loan.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[loan.status] || 'bg-slate-100 text-slate-600'}`}
                      >
                        {loan.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
