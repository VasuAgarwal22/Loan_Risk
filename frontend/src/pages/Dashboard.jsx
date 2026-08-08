import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { testAuth } from '../api'

const cards = [
  { to: '/transactions', icon: '💳', title: 'Transactions', desc: 'View your transaction history' },
  { to: '/add-transaction', icon: '➕', title: 'Add Transaction', desc: 'Record a new transaction' },
  { to: '/apply-loan', icon: '🏦', title: 'Apply Loan', desc: 'Submit a new loan application' },
  { to: '/risk-assessment', icon: '📊', title: 'Risk Assessment', desc: 'Check your credit risk profile' },
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-2xl p-8 mb-8">
        <h1 className="text-3xl font-bold">
          Welcome{user?.fullName ? `, ${user.fullName}` : ' Back'} 👋
        </h1>
        <p className="mt-2 opacity-90">
          Manage your transactions, apply for loans, and understand your credit risk.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg text-sm">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
          {jwtStatus}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition border border-slate-200"
          >
            <span className="text-3xl">{card.icon}</span>
            <h3 className="font-semibold text-lg mt-3">{card.title}</h3>
            <p className="text-slate-500 text-sm mt-1">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
