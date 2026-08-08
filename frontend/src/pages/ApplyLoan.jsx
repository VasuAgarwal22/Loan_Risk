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

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 text-white p-7 mb-8 shadow-soft animate-fade-in-up">
        <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10 blur-xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-white animate-pulse-soft" /> New application
          </span>
          <h1 className="font-display text-2xl font-bold mt-3">Apply for a Loan</h1>
          <p className="text-amber-50/90 text-sm mt-1">
            Tell us what you need and we'll help you get started.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 text-amber-800 text-sm px-4 py-3 mb-6">
        <span className="text-lg leading-none">🚧</span>
        <p>
          This module is a placeholder. The loan application backend endpoints are not implemented
          yet — the form is ready to connect once available.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-7 sm:p-8 animate-fade-in-up">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Loan Amount *</label>
              <input
                type="number"
                step="0.01"
                name="loanAmount"
                value={form.loanAmount}
                onChange={handleChange}
                placeholder="₹ 100000"
                className="input-base"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tenure (Months) *</label>
              <input
                type="number"
                name="tenureMonths"
                value={form.tenureMonths}
                onChange={handleChange}
                placeholder="24"
                className="input-base"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Interest Rate (%) *</label>
              <input
                type="number"
                step="0.01"
                name="interestRate"
                value={form.interestRate}
                onChange={handleChange}
                placeholder="10.5"
                className="input-base"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Purpose *</label>
            <textarea
              name="purpose"
              value={form.purpose}
              onChange={handleChange}
              rows="3"
              placeholder="e.g. Home renovation"
              className="input-base"
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Submit Application
          </button>
        </form>
      </div>
    </div>
  )
}
