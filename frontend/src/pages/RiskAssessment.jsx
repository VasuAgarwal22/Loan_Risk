import { useState } from 'react'
import toast from 'react-hot-toast'

export default function RiskAssessment() {
  const [form, setForm] = useState({
    monthlyIncome: '',
    monthlyExpense: '',
    averageBalance: '',
    existingLoans: 0,
    missedPayments: 0,
    creditUtilization: '',
  })

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    // Backend risk assessment endpoints are not implemented yet.
    toast('Risk assessment backend is coming soon. Form is ready!', {
      icon: '🚧',
    })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent-500 to-brand-600 text-white p-7 mb-8 shadow-soft animate-fade-in-up">
        <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10 blur-xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-white animate-pulse-soft" /> Credit profile
          </span>
          <h1 className="font-display text-2xl font-bold mt-3">Risk Assessment</h1>
          <p className="text-brand-50/90 text-sm mt-1">
            Enter your financial details to evaluate your credit risk.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 text-amber-800 text-sm px-4 py-3 mb-6">
        <span className="text-lg leading-none">🚧</span>
        <p>
          This module is a placeholder. The risk assessment backend endpoints are not implemented
          yet — the form is ready to connect once available.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-7 sm:p-8 animate-fade-in-up">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Monthly Income *</label>
              <input
                type="number"
                step="0.01"
                name="monthlyIncome"
                value={form.monthlyIncome}
                onChange={handleChange}
                placeholder="₹ 50000"
                className="input-base"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Monthly Expense</label>
              <input
                type="number"
                step="0.01"
                name="monthlyExpense"
                value={form.monthlyExpense}
                onChange={handleChange}
                placeholder="₹ 30000"
                className="input-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Average Balance</label>
              <input
                type="number"
                step="0.01"
                name="averageBalance"
                value={form.averageBalance}
                onChange={handleChange}
                placeholder="₹ 20000"
                className="input-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Credit Utilization (%)</label>
              <input
                type="number"
                step="0.01"
                name="creditUtilization"
                value={form.creditUtilization}
                onChange={handleChange}
                placeholder="0 - 100"
                className="input-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Existing Loans</label>
              <input
                type="number"
                name="existingLoans"
                value={form.existingLoans}
                onChange={handleChange}
                className="input-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Missed Payments</label>
              <input
                type="number"
                name="missedPayments"
                value={form.missedPayments}
                onChange={handleChange}
                className="input-base"
              />
            </div>
          </div>
          <button type="submit" className="btn-primary">
            Calculate Risk
          </button>
        </form>
      </div>
    </div>
  )
}
