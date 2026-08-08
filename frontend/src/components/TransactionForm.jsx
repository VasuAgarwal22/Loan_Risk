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

  const inputClass =
    'w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Amount *</label>
          <input
            type="number"
            step="0.01"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Balance After Transaction</label>
          <input
            type="number"
            step="0.01"
            name="balanceAfterTransaction"
            value={form.balanceAfterTransaction}
            onChange={handleChange}
            placeholder="0.00"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select name="transactionType" value={form.transactionType} onChange={handleChange} className={inputClass}>
            {typeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select name="transactionCategory" value={form.transactionCategory} onChange={handleChange} className={inputClass}>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select name="transactionStatus" value={form.transactionStatus} onChange={handleChange} className={inputClass}>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Merchant</label>
          <input
            type="text"
            name="merchant"
            value={form.merchant}
            onChange={handleChange}
            placeholder="e.g. Amazon, TCS"
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="2"
          placeholder="Add a short description"
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-brand-600 text-white font-semibold py-2.5 rounded-md hover:bg-brand-700 disabled:opacity-50"
      >
        {submitting ? 'Saving...' : 'Add Transaction'}
      </button>
    </form>
  )
}
