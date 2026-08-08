import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import TransactionForm from '../components/TransactionForm'
import { addTransaction } from '../api'

export default function AddTransaction() {
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (payload) => {
    setSubmitting(true)
    try {
      await addTransaction(payload)
      toast.success('Transaction added successfully!')
      navigate('/transactions')
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to add transaction'
      toast.error(Array.isArray(msg) ? msg[0] : msg)
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-accent-500 text-white p-7 mb-8 shadow-soft animate-fade-in-up">
        <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10 blur-xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-white animate-pulse-soft" /> New entry
          </span>
          <h1 className="font-display text-2xl font-bold mt-3">Add Transaction</h1>
          <p className="text-brand-50/90 text-sm mt-1">
            Record income or expenses to keep your history up to date.
          </p>
        </div>
      </div>
      <div className="glass-card rounded-3xl p-7 sm:p-8 animate-fade-in-up">
        <TransactionForm onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </div>
  )
}
