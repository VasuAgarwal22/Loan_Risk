import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { applyForLoan, getErrorMessage } from '../api'
import { formatCurrency } from '../utils/formatters'
import {
  FilePlus,
  IndianRupee,
  Calendar,
  FileText,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Info,
  Calculator,
} from 'lucide-react'

const tenurePresets = [12, 24, 36, 48, 60]

export default function ApplyLoan() {
  const [form, setForm] = useState({
    loanAmount: '',
    tenureMonths: '24',
    purpose: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleTenurePreset = (months) => {
    setForm((prev) => ({ ...prev, tenureMonths: String(months) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const amount = Number(form.loanAmount)
    const tenure = Number(form.tenureMonths)

    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid positive loan amount.')
      return
    }

    if (isNaN(tenure) || tenure < 1) {
      toast.error('Repayment tenure must be at least 1 month.')
      return
    }

    if (!form.purpose.trim()) {
      toast.error('Please specify the purpose of the loan.')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        loanAmount: amount,
        tenureMonths: tenure,
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

  // Estimated simple EMI for reference (standard indicative 10.5% rate)
  const principal = Number(form.loanAmount) || 0
  const tenureMonths = Number(form.tenureMonths) || 12
  const annualRate = 10.5
  const monthlyRate = annualRate / 12 / 100
  const estimatedEmi =
    principal > 0 && tenureMonths > 0
      ? Math.round(
          (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
            (Math.pow(1 + monthlyRate, tenureMonths) - 1)
        )
      : 0

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
      {/* Top Breadcrumb / Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/my-loans"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-900 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to My Loans</span>
        </Link>
        <span className="text-xs text-slate-400">Step 1 of 1 · Credit Request</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Application Form */}
        <div className="lg:col-span-2 fintech-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <FilePlus className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-navy-900">
                Loan Application Form
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Submit your credit requirement for automated risk evaluation
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Loan Amount */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Desired Loan Amount (₹) *
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <IndianRupee className="h-4 w-4" />
                </div>
                <input
                  type="number"
                  step="1000"
                  min="1000"
                  name="loanAmount"
                  value={form.loanAmount}
                  onChange={handleChange}
                  placeholder="e.g. 2,50,000"
                  className="input-base pl-10 text-base font-semibold"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Enter the total principal amount you wish to borrow
              </p>
            </div>

            {/* Repayment Tenure */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Repayment Tenure (Months) *
                </label>
                <span className="text-xs font-semibold text-primary-600">
                  {form.tenureMonths || 0} Months
                </span>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Calendar className="h-4 w-4" />
                </div>
                <input
                  type="number"
                  min="1"
                  max="120"
                  name="tenureMonths"
                  value={form.tenureMonths}
                  onChange={handleChange}
                  placeholder="24"
                  className="input-base pl-10"
                  required
                />
              </div>

              {/* Preset buttons */}
              <div className="flex flex-wrap gap-2 mt-2.5">
                {tenurePresets.map((months) => (
                  <button
                    key={months}
                    type="button"
                    onClick={() => handleTenurePreset(months)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
                      Number(form.tenureMonths) === months
                        ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {months} mo
                  </button>
                ))}
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Purpose of Loan *
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute top-3 left-3.5 text-slate-400">
                  <FileText className="h-4 w-4" />
                </div>
                <textarea
                  name="purpose"
                  value={form.purpose}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g. Working capital expansion, home improvement, educational fees"
                  className="input-base pl-10 pt-2.5"
                  required
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate('/my-loans')}
                className="btn-secondary"
                disabled={submitting}
              >
                Cancel
              </button>
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
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Application</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar: Financial Summary & Estimation Card */}
        <div className="space-y-6">
          <div className="fintech-card p-6 bg-slate-900 text-white space-y-4">
            <div className="flex items-center gap-2 text-primary-400">
              <Calculator className="h-5 w-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider">
                Indicative Estimation
              </h3>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs text-slate-300 pb-2 border-b border-navy-800">
                <span>Requested Principal</span>
                <span className="font-semibold text-white">
                  {principal > 0 ? formatCurrency(principal) : '₹0'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-300 pb-2 border-b border-navy-800">
                <span>Tenure Duration</span>
                <span className="font-semibold text-white">
                  {tenureMonths} Months
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-300 pb-2 border-b border-navy-800">
                <span>Benchmark Rate</span>
                <span className="font-semibold text-emerald-400">
                  {annualRate}% p.a.
                </span>
              </div>
              <div className="pt-2">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                  Estimated Monthly EMI
                </span>
                <span className="text-2xl font-bold text-white tracking-tight mt-0.5 block">
                  {estimatedEmi > 0 ? formatCurrency(estimatedEmi) : '—'}
                </span>
              </div>
            </div>
          </div>

          <div className="fintech-card p-5 bg-primary-50/50 border-primary-200/60 space-y-3">
            <div className="flex items-center gap-2 text-primary-700">
              <ShieldCheck className="h-5 w-5" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Automated Risk Check
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Once submitted, your loan application is immediately eligible for our multi-factor Risk Assessment model to evaluate approval odds.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
