import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import TransactionForm from '../components/TransactionForm'
import { addTransaction, getErrorMessage } from '../api'
import {
  PlusCircle,
  ArrowLeft,
  Receipt,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'

export default function AddTransaction() {
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (payload) => {
    setSubmitting(true)
    try {
      await addTransaction(payload)
      toast.success('Transaction successfully recorded!')
      navigate('/transactions')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to record transaction'))
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/transactions"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-900 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Transactions</span>
        </Link>
        <span className="text-xs text-slate-400">Financial Ledger Entry</span>
      </div>

      <div className="fintech-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <PlusCircle className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-navy-900">
              Record New Transaction
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Log credits and expenses to keep your behavioral cashflow ledger up to date
            </p>
          </div>
        </div>

        <TransactionForm
          onSubmit={handleSubmit}
          submitting={submitting}
          onCancel={() => navigate('/transactions')}
        />
      </div>

      {/* Trust Notice */}
      <div className="rounded-2xl bg-slate-100/70 border border-slate-200/60 p-4 flex items-center gap-3 text-xs text-slate-500">
        <ShieldCheck className="h-5 w-5 text-primary-500 shrink-0" />
        <p>
          Recorded transactions directly feed into the automated debt-to-income and cash flow analysis algorithms during loan risk assessments.
        </p>
      </div>
    </div>
  )
}
