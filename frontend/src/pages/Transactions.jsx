import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getTransactions } from '../api'

const typeColors = {
  CREDIT: 'bg-green-100 text-green-700',
  DEBIT: 'bg-red-100 text-red-700',
}

const statusColors = {
  SUCCESS: 'bg-green-100 text-green-700',
  FAILED: 'bg-red-100 text-red-700',
  PENDING: 'bg-amber-100 text-amber-700',
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
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-500">
        Loading transactions...
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Transaction History</h1>
        <Link
          to="/add-transaction"
          className="bg-brand-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-700"
        >
          + Add Transaction
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <span className="text-4xl">💳</span>
          <p className="mt-4 text-slate-500">No transactions yet.</p>
          <Link
            to="/add-transaction"
            className="inline-block mt-4 text-brand-600 font-medium hover:underline"
          >
            Add your first transaction
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-4 py-3 font-medium">Category</th>
                <th className="text-left px-4 py-3 font-medium">Merchant</th>
                <th className="text-left px-4 py-3 font-medium">Amount</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-slate-600">
                    {new Date(t.transactionDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${typeColors[t.transactionType]}`}>
                      {t.transactionType}
                    </span>
                    <span className="text-slate-600 ml-2">{t.transactionCategory}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{t.merchant || '—'}</td>
                  <td className="px-4 py-3 font-semibold">₹{t.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusColors[t.transactionStatus]}`}>
                      {t.transactionStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
