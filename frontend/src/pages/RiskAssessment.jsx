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

  const inputClass =
    'w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Risk Assessment</h1>
      <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg px-4 py-3 mb-6">
        🚧 This module is a placeholder. The risk assessment backend endpoints are not
        implemented yet — the form is ready to connect once available.
      </div>
      <div className="bg-white rounded-xl shadow p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Monthly Income *</label>
              <input
                type="number"
                step="0.01"
                name="monthlyIncome"
                value={form.monthlyIncome}
                onChange={handleChange}
                placeholder="50000"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Monthly Expense</label>
              <input
                type="number"
                step="0.01"
                name="monthlyExpense"
                value={form.monthlyExpense}
                onChange={handleChange}
                placeholder="30000"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Average Balance</label>
              <input
                type="number"
                step="0.01"
                name="averageBalance"
                value={form.averageBalance}
                onChange={handleChange}
                placeholder="20000"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Credit Utilization (%)</label>
              <input
                type="number"
                step="0.01"
                name="creditUtilization"
                value={form.creditUtilization}
                onChange={handleChange}
                placeholder="0 - 100"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Existing Loans</label>
              <input
                type="number"
                name="existingLoans"
                value={form.existingLoans}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Missed Payments</label>
              <input
                type="number"
                name="missedPayments"
                value={form.missedPayments}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-brand-600 text-white font-semibold py-2.5 rounded-md hover:bg-brand-700"
          >
            Calculate Risk
          </button>
        </form>
      </div>
    </div>
  )
}
