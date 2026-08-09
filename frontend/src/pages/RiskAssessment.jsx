import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getMyLoans, calculateRisk, getErrorMessage } from '../api'
import { useAuth } from '../context/AuthContext'

const riskColors = {
  LOW: { badge: 'bg-emerald-100 text-emerald-700', ring: 'from-emerald-500 to-emerald-600', label: 'Low Risk' },
  MEDIUM: { badge: 'bg-amber-100 text-amber-700', ring: 'from-amber-500 to-orange-500', label: 'Medium Risk' },
  HIGH: { badge: 'bg-rose-100 text-rose-700', ring: 'from-rose-500 to-red-600', label: 'High Risk' },
}

export default function RiskAssessment() {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const preselectedLoanId = location.state?.loanId

  const [loans, setLoans] = useState([])
  const [selectedLoanId, setSelectedLoanId] = useState(preselectedLoanId || '')
  const [form, setForm] = useState({
    monthlyIncome: '',
    monthlyExpense: '',
    averageBalance: '',
    existingLoans: 0,
    missedPayments: 0,
    creditUtilization: '',
  })
  const [result, setResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [loadingLoans, setLoadingLoans] = useState(true)

  useEffect(() => {
    getMyLoans()
      .then(({ data }) => {
        setLoans(data)
        if (!selectedLoanId && data.length > 0) {
          setSelectedLoanId(data[0].id)
        }
      })
      .catch((err) => toast.error(getErrorMessage(err, 'Failed to load loans')))
      .finally(() => setLoadingLoans(false))
  }, [])

  // Prefill financial fields from the logged-in user's profile where available.
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        monthlyIncome: user.monthlyIncome ?? '',
      }))
    }
  }, [user])

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedLoanId) {
      toast.error('Please select a loan application to assess.')
      return
    }
    setSubmitting(true)
    setResult(null)
    try {
      // Backend auto-computes income/expense/balance/existingLoans from the
      // user's data. We still send all required fields (values are overridden
      // server-side for the computed ones).
      const payload = {
        monthlyIncome: Number(form.monthlyIncome) || 0,
        monthlyExpense: Number(form.monthlyExpense) || 0,
        averageBalance: Number(form.averageBalance) || 0,
        existingLoans: Number(form.existingLoans) || 0,
        missedPayments: Number(form.missedPayments) || 0,
        creditUtilization: Number(form.creditUtilization) || 0,
      }
      const { data } = await calculateRisk(selectedLoanId, payload)
      setResult(data)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Risk assessment failed'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent-500 to-brand-600 text-white p-7 mb-8 shadow-soft animate-fade-in-up">
        <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10 blur-xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-white animate-pulse-soft" /> Credit profile
          </span>
          <h1 className="font-display text-2xl font-bold mt-3">Risk Assessment</h1>
          <p className="text-brand-50/90 text-sm mt-1">
            Evaluate your credit risk for a selected loan application.
          </p>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-7 sm:p-8 animate-fade-in-up">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Loan Application *
            </label>
            {loadingLoans ? (
              <p className="text-sm text-slate-400">Loading loans...</p>
            ) : loans.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                You have no loan applications yet.{' '}
                <button
                  type="button"
                  onClick={() => navigate('/apply-loan')}
                  className="font-semibold text-brand-600 hover:text-brand-700"
                >
                  Apply for a loan
                </button>{' '}
                first.
              </div>
            ) : (
              <select
                name="selectedLoanId"
                value={selectedLoanId}
                onChange={(e) => setSelectedLoanId(e.target.value)}
                className="input-base"
                required
              >
                <option value="" disabled>
                  Select a loan application
                </option>
                {loans.map((loan) => (
                  <option key={loan.id} value={loan.id}>
                    #{loan.id} · ₹{loan.loanAmount} · {loan.purpose}
                  </option>
                ))}
              </select>
            )}
          </div>

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
                placeholder="Auto-computed"
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
                placeholder="Auto-computed"
                className="input-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Credit Utilization (%)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
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
                min="0"
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
                min="0"
                name="missedPayments"
                value={form.missedPayments}
                onChange={handleChange}
                className="input-base"
              />
            </div>
          </div>
          <button type="submit" disabled={submitting || loans.length === 0} className="btn-primary">
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Calculating...
              </span>
            ) : (
              'Calculate Risk'
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="mt-8 glass-card rounded-3xl p-7 sm:p-8 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div
              className={`flex h-32 w-32 shrink-0 flex-col items-center justify-center rounded-full bg-gradient-to-br ${riskColors[result.riskLevel]?.ring || 'from-slate-500 to-slate-600'} text-white shadow-soft`}
            >
              <span className="text-3xl font-bold font-display">{result.riskScore}</span>
              <span className="text-[11px] uppercase tracking-wider opacity-90">Risk Score</span>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${riskColors[result.riskLevel]?.badge || 'bg-slate-100 text-slate-600'}`}
              >
                {riskColors[result.riskLevel]?.label || result.riskLevel}
              </span>
              <p className="mt-3 text-slate-600">{result.recommendation}</p>
              <p className="mt-2 text-xs text-slate-400">
                Calculated on {new Date(result.calculatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
