import { useState } from 'react'
import toast from 'react-hot-toast'
import {
  IndianRupee,
  ArrowDownLeft,
  ArrowUpRight,
  Store,
  FileText,
  Tag,
  CheckCircle2,
  Clock,
  XCircle,
  PlusCircle,
} from 'lucide-react'

const initialForm = {
  amount: '',
  transactionType: 'DEBIT',
  transactionCategory: 'OTHER',
  transactionStatus: 'SUCCESS',
  merchant: '',
  description: '',
}

const typeOptions = [
  {
    id: 'DEBIT',
    label: 'Debit (Expense)',
    icon: ArrowUpRight,
    color: 'text-rose-600 bg-rose-50 border-rose-200',
    activeColor: 'bg-rose-500 text-white border-rose-500 shadow-sm',
  },
  {
    id: 'CREDIT',
    label: 'Credit (Income)',
    icon: ArrowDownLeft,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    activeColor: 'bg-emerald-500 text-white border-emerald-500 shadow-sm',
  },
]

const statusOptions = [
  { id: 'SUCCESS', label: 'Success', icon: CheckCircle2 },
  { id: 'PENDING', label: 'Pending', icon: Clock },
  { id: 'FAILED', label: 'Failed', icon: XCircle },
]

const categoryOptions = [
  { value: 'SALARY', label: 'Salary / Income' },
  { value: 'FOOD', label: 'Food & Dining' },
  { value: 'RENT', label: 'Rent & Housing' },
  { value: 'SHOPPING', label: 'Shopping & Retail' },
  { value: 'MEDICAL', label: 'Medical & Health' },
  { value: 'EDUCATION', label: 'Education & Tuition' },
  { value: 'ENTERTAINMENT', label: 'Entertainment & Leisure' },
  { value: 'INVESTMENT', label: 'Investment & Mutual Funds' },
  { value: 'BILL', label: 'Utilities & Bills' },
  { value: 'OTHER', label: 'General / Other' },
]

export default function TransactionForm({ onSubmit, submitting, onCancel }) {
  const [form, setForm] = useState(initialForm)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const amt = Number(form.amount)
    if (isNaN(amt) || amt <= 0) {
      toast.error('Please enter a valid positive amount.')
      return
    }

    const payload = {
      amount: amt,
      transactionType: form.transactionType,
      transactionCategory: form.transactionCategory,
      transactionStatus: form.transactionStatus,
      description: form.description ? form.description.trim() : undefined,
      merchant: form.merchant ? form.merchant.trim() : undefined,
    }

    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Type Selector (CREDIT vs DEBIT Tabs) */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
          Transaction Type *
        </label>
        <div className="grid grid-cols-2 gap-3">
          {typeOptions.map((t) => {
            const Icon = t.icon
            const isSelected = form.transactionType === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, transactionType: t.id }))}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                  isSelected ? t.activeColor : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{t.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Amount and Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Amount */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Amount (₹) *
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <IndianRupee className="h-4 w-4" />
            </div>
            <input
              type="number"
              step="0.01"
              min="0.01"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="e.g. 5,000.00"
              className="input-base pl-10 text-base font-semibold"
              required
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Category *
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Tag className="h-4 w-4" />
            </div>
            <select
              name="transactionCategory"
              value={form.transactionCategory}
              onChange={handleChange}
              className="input-base pl-10 text-xs font-medium"
              required
            >
              {categoryOptions.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Merchant and Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Merchant / Recipient */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Merchant or Counterparty
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Store className="h-4 w-4" />
            </div>
            <input
              type="text"
              name="merchant"
              value={form.merchant}
              onChange={handleChange}
              placeholder="e.g. Amazon, Google, HDFC Bank"
              className="input-base pl-10 text-xs"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Transaction Status *
          </label>
          <select
            name="transactionStatus"
            value={form.transactionStatus}
            onChange={handleChange}
            className="input-base text-xs font-medium"
            required
          >
            {statusOptions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Descriptive Notes */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
          Descriptive Notes / Remarks
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute top-3 left-3.5 text-slate-400">
            <FileText className="h-4 w-4" />
          </div>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={2}
            placeholder="Add context or purpose for this transaction (optional)"
            className="input-base pl-10 text-xs pt-2.5"
          />
        </div>
      </div>

      {/* Form Action Controls */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="btn-secondary"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary gap-2 min-w-[160px]"
        >
          {submitting ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <span>Recording...</span>
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4" />
              <span>Record Transaction</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}
