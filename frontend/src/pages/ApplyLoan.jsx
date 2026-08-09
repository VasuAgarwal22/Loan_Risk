import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { applyForLoan, getErrorMessage } from '../api'

export default function ApplyLoan() {
  const [form, setForm] = useState({
    loanAmount: '',
    tenureMonths: '',
    purpose: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = {
        loanAmount: Number(form.loanAmount),
        tenureMonths: Number(form.tenureMonths),
        purpose: form.purpose.trim(),
      }
      await applyForLoan(payload)
      toast.success('Loan application submitted successfully!')
      navigate('/my-loans')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to submit loan application'))
      setSubmitting(false)
    }
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

      <div className="glass-card rounded-3xl p-7 sm:p-8 animate-fade-in-up">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Loan Amount *</label>
              <input
                type="number"
                step="0.01"
                min="1"
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
                min="1"
                name="tenureMonths"
                value={form.tenureMonths}
                onChange={handleChange}
                placeholder="24"
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
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Application'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
