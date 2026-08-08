import { useState } from 'react'
import toast from 'react-hot-toast'

const initialForm = {
  amount: '',
  transactionType: 'DEBIT',
  transactionCategory: 'OTHER',
  transactionStatus: 'SUCCESS',
  merchant: '',
  description: '',
  balanceAfterTransaction: '',
}

const typeOptions = ['CREDIT', 'DEBIT']
const statusOptions = ['SUCCESS', 'FAILED', 'PENDING']
const categoryOptions = [
  'SALARY',
  'FOOD',
  'RENT',
  'SHOPPING',
  'MEDICAL',
  'EDUCATION',
  'ENTERTAINMENT',
  'INVESTMENT',
  'BILL',
  'OTHER',
]

export default function TransactionForm({ onSubmit, submitting }) {
  const [form, setForm] = useState(initialForm)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.amount || Number(form.amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    const payload = {
      amount: Number(form.amount),
      transactionType: form.transactionType,
      transactionCategory: form.transactionCategory,
      description: form.description || undefined,
      merchant: form.merchant || undefined,
      balanceAfterTransaction: form.balanceAfterTransaction
        ? Number(form.balanceAfterTransaction)
        : Number(form.amount),
      transactionStatus: form.transactionStatus,
    }
    onSubmit(payload)
    setForm(initialForm)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount *</label>
          <input
            type="number"
            step="0.01"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="₹ 0.00"
            className="input-base"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Balance After Transaction</label>
          <input
            type="number"
            step="0.01"
            name="balanceAfterTransaction"
            value={form.balanceAfterTransaction}
            onChange={handleChange}
            placeholder="₹ 0.00"
            className="input-base"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Type</label>
          <select name="transactionType" value={form.transactionType} onChange={handleChange} className="input-base">
            {typeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
          <select name="transactionCategory" value={form.transactionCategory} onChange={handleChange} className="input-base">
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
          <select name="transactionStatus" value={form.transactionStatus} onChange={handleChange} className="input-base">
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Merchant</label>
          <input
            type="text"
            name="merchant"
            value={form.merchant}
            onChange={handleChange}
            placeholder="e.g. Amazon, TCS"
            className="input-base"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="2"
          placeholder="Add a short description"
          className="input-base"
        />
      </div>
      <button type="submit" disabled={submitting} className="btn-primary">
        {submitting ? (
          <span className="inline-flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Saving...
          </span>
        ) : (
          'Add Transaction'
        )}
      </button>
    </form>
  )
}
