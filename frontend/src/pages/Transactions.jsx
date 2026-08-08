import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getTransactions } from '../api'

const typeColors = {
  CREDIT: 'bg-emerald-100 text-emerald-700',
  DEBIT: 'bg-rose-100 text-rose-700',
}

const statusColors = {
  SUCCESS: 'bg-emerald-100 text-emerald-700',
  FAILED: 'bg-rose-100 text-rose-700',
  PENDING: 'bg-amber-100 text-amber-700',
}

const typeIcon = {
  CREDIT: '+',
  DEBIT: '−',
}

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      const { data } = await getTransactions()
      setTransactions(data)
    } catch {
      toast.error('Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 flex flex-col items-center gap-3 text-slate-500">
        <svg className="h-8 w-8 animate-spin text-brand-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        Loading transactions...
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="page-header flex items-center gap-2">
            <span className="text-2xl">💳</span> Transaction History
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {transactions.length} record{transactions.length === 1 ? '' : 's'} found
          </p>
        </div>
        <Link
          to="/add-transaction"
          className="btn-primary !w-auto !px-5 !py-2.5"
        >
          + Add Transaction
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center animate-fade-in-up">
          <span className="text-5xl">💳</span>
          <p className="mt-4 text-slate-500">No transactions yet.</p>
          <Link
            to="/add-transaction"
            className="inline-block mt-4 font-semibold text-brand-600 hover:text-brand-700"
          >
            Add your first transaction →
          </Link>
        </div>
      ) : (
        <div className="glass-card rounded-3xl overflow-hidden animate-fade-in-up">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-brand-600 to-brand-500 text-white">
                <tr>
                  <th className="text-left px-5 py-3.5 font-semibold">Date</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Category</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Merchant</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Amount</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr
                    key={t.id}
                    className="border-t border-slate-100 transition-colors hover:bg-brand-50/50"
                  >
                    <td className="px-5 py-4 text-slate-600 whitespace-nowrap">
                      {new Date(t.transactionDate).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${typeColors[t.transactionType]}`}
                      >
                        <span className="font-bold">{typeIcon[t.transactionType]}</span>
                        {t.transactionType}
                      </span>
                      <span className="text-slate-500 ml-2 text-xs">{t.transactionCategory}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{t.merchant || '—'}</td>
                    <td
                      className={`px-5 py-4 font-bold ${
                        t.transactionType === 'CREDIT' ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {t.transactionType === 'CREDIT' ? '₹' : '−₹'}
                      {t.amount}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[t.transactionStatus]}`}
                      >
                        {t.transactionStatus}
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
