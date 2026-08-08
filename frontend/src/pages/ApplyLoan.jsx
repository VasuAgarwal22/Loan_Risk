import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ApplyLoan() {
  const [form, setForm] = useState({
    loanAmount: '',
    tenureMonths: '',
    interestRate: '',
    purpose: '',
  })

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    // Backend loan application endpoints are not implemented yet.
    toast('Loan application backend is coming soon. Form is ready!', {
      icon: '🚧',
    })
  }

  const inputClass =
    'w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Apply for a Loan</h1>
      <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg px-4 py-3 mb-6">
        🚧 This module is a placeholder. The loan application backend endpoints are not
        implemented yet — the form is ready to connect once available.
      </div>
      <div className="bg-white rounded-xl shadow p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Loan Amount *</label>
              <input
                type="number"
                step="0.01"
                name="loanAmount"
                value={form.loanAmount}
                onChange={handleChange}
                placeholder="100000"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tenure (Months) *</label>
              <input
                type="number"
                name="tenureMonths"
                value={form.tenureMonths}
                onChange={handleChange}
                placeholder="24"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Interest Rate (%) *</label>
              <input
                type="number"
                step="0.01"
                name="interestRate"
                value={form.interestRate}
                onChange={handleChange}
                placeholder="10.5"
                className={inputClass}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Purpose *</label>
            <textarea
              name="purpose"
              value={form.purpose}
              onChange={handleChange}
              rows="3"
              placeholder="e.g. Home renovation"
              className={inputClass}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-brand-600 text-white font-semibold py-2.5 rounded-md hover:bg-brand-700"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  )
}
