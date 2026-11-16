import { useEffect, useMemo, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getMyLoans, calculateRisk, getErrorMessage } from '../api'
import { useAuth } from '../context/AuthContext'
import { formatCurrency, formatDateTime, riskLevelConfig } from '../utils/formatters'
import {
  BarChart3,
  IndianRupee,
  CreditCard,
  ShieldCheck,
  RefreshCw,
  Info,
  AlertTriangle,
  Activity,
} from 'lucide-react'

const initialForm = {
  age: '',
  creditScore: '',
  monthlyDebt: '',
  monthlyExpenses: '',
  employmentYears: '',
  bankAccountAgeYears: '',
  numCreditCards: '',
  missedPaymentsLastYear: '',
  previousDefaults: '',
  creditUtilization: '',
  savingsBalance: '',
  transactionFrequency: '',
}

const numericFields = [
  { name: 'age', label: 'Age', min: 18, max: 100, step: 1, suffix: 'years' },
  { name: 'creditScore', label: 'Credit score', min: 300, max: 850, step: 1 },
  { name: 'monthlyDebt', label: 'Monthly debt obligations', min: 0, step: 0.01, currency: true },
  { name: 'monthlyExpenses', label: 'Typical monthly expenses', min: 0, step: 0.01, currency: true },
  { name: 'employmentYears', label: 'Employment duration', min: 0, max: 82, step: 0.1, suffix: 'years' },
  { name: 'bankAccountAgeYears', label: 'Bank account age', min: 0, max: 100, step: 0.1, suffix: 'years' },
  { name: 'numCreditCards', label: 'Number of credit cards', min: 0, max: 50, step: 1 },
  { name: 'missedPaymentsLastYear', label: 'Missed payments (last 12 months)', min: 0, max: 50, step: 1 },
  { name: 'previousDefaults', label: 'Previous defaults', min: 0, max: 20, step: 1 },
  { name: 'creditUtilization', label: 'Credit utilization', min: 0, max: 100, step: 0.1, suffix: '%' },
  { name: 'savingsBalance', label: 'Savings balance', min: 0, step: 0.01, currency: true },
  { name: 'transactionFrequency', label: 'Transactions per month', min: 0, max: 100, step: 0.1 },
]

export default function RiskAssessment() {
  const { user } = useAuth()
  const location = useLocation()
  const preselectedLoanId = location.state?.loanId
  const [loans, setLoans] = useState([])
  const [selectedLoanId, setSelectedLoanId] = useState(preselectedLoanId ? String(preselectedLoanId) : '')
  const [form, setForm] = useState(initialForm)
  const [result, setResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [loadingLoans, setLoadingLoans] = useState(true)

  useEffect(() => {
    getMyLoans()
      .then(({ data }) => {
        const loanList = Array.isArray(data) ? data : []
        setLoans(loanList)
        if (preselectedLoanId) setSelectedLoanId(String(preselectedLoanId))
        else if (loanList.length) setSelectedLoanId(String(loanList[0].id))
      })
      .catch((err) => toast.error(getErrorMessage(err, 'Failed to fetch loan applications')))
      .finally(() => setLoadingLoans(false))
  }, [preselectedLoanId])

  const selectedLoan = useMemo(
    () => loans.find((loan) => String(loan.id) === String(selectedLoanId)),
    [loans, selectedLoanId],
  )

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!selectedLoanId) {
      toast.error('Please select a loan application.')
      return
    }

    const missing = numericFields.find(({ name }) => form[name] === '' || !Number.isFinite(Number(form[name])))
    if (missing) {
      toast.error(`Please enter a valid value for ${missing.label.toLowerCase()}.`)
      return
    }

    const age = Number(form.age)
    const employmentYears = Number(form.employmentYears)
    if (employmentYears > Math.max(age - 18, 0)) {
      toast.error('Employment duration cannot exceed the number of years since age 18.')
      return
    }

    const payload = Object.fromEntries(numericFields.map(({ name }) => [name, Number(form[name])]))
    setSubmitting(true)
    setResult(null)
    try {
      const { data } = await calculateRisk(selectedLoanId, payload)
      setResult(data)
      toast.success('ML risk assessment completed.')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Risk assessment failed. Please check the borrower inputs and ML service.'))
    } finally {
      setSubmitting(false)
    }
  }

  const riskInfo = result ? (riskLevelConfig[result.riskLevel] || riskLevelConfig.MEDIUM) : null
  const defaultPercent = result?.defaultProbability == null
    ? null
    : Number(result.defaultProbability) * 100
  const score = result?.riskScore ?? 0

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-600 mb-1">
            <BarChart3 className="h-4 w-4" />
            <span>Machine Learning Credit Risk Model</span>
          </div>
          <h1 className="page-title">Credit Risk Assessment</h1>
          <p className="page-subtitle">
            Estimate default probability using the trained borrower-risk model.
          </p>
        </div>
        <Link to="/my-loans" className="btn-secondary self-start sm:self-auto text-xs">
          View All Loans
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7">
          <div className="fintech-card p-6 sm:p-7 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Loan application *
                </label>
                {loadingLoans ? (
                  <p className="text-xs text-slate-400">Loading loan applications...</p>
                ) : loans.length === 0 ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 space-y-2">
                    <p className="font-semibold">No loan applications found.</p>
                    <Link to="/apply-loan" className="inline-block font-bold text-primary-600 hover:underline">
                      Apply for a loan →
                    </Link>
                  </div>
                ) : (
                  <select
                    value={selectedLoanId}
                    onChange={(event) => {
                      setSelectedLoanId(event.target.value)
                      setResult(null)
                    }}
                    className="input-base text-xs font-medium"
                    required
                  >
                    <option value="" disabled>Select a loan application</option>
                    {loans.map((loan) => (
                      <option key={loan.id} value={loan.id}>
                        Loan #{loan.id} — {formatCurrency(loan.loanAmount)} ({loan.tenureMonths} months)
                      </option>
                    ))}
                  </select>
                )}
                {selectedLoan && (
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs">
                    <div>
                      <span className="block text-slate-400">Loan amount</span>
                      <strong className="text-navy-900">{formatCurrency(selectedLoan.loanAmount)}</strong>
                    </div>
                    <div>
                      <span className="block text-slate-400">Tenure</span>
                      <strong className="text-slate-700">{selectedLoan.tenureMonths} months</strong>
                    </div>
                    <div>
                      <span className="block text-slate-400">Employment</span>
                      <strong className="text-slate-700">{user?.employmentType || 'From profile'}</strong>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-5">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="h-4 w-4 text-primary-600" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-navy-900">
                    Borrower information
                  </h2>
                </div>
                <p className="text-[11px] text-slate-500 mb-4">
                  Enter accurate borrower information. These values are declarations unless independently verified.
                  Monetary amounts must be in INR.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {numericFields.map((field) => (
                    <div key={field.name}>
                      <label htmlFor={field.name} className="block text-xs font-medium text-slate-700 mb-1">
                        {field.label} *
                      </label>
                      <div className="relative">
                        {field.currency && (
                          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        )}
                        <input
                          id={field.name}
                          type="number"
                          name={field.name}
                          value={form[field.name]}
                          onChange={handleChange}
                          min={field.min}
                          max={field.max}
                          step={field.step}
                          required
                          placeholder={field.suffix || (field.currency ? 'Amount in INR' : 'Enter value')}
                          className={`input-base text-xs ${field.currency ? 'pl-9' : ''}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-lg bg-blue-50 border border-blue-100 p-3 text-[11px] text-blue-800">
                  Monthly income, employment type, loan amount, loan tenure and existing approved-loan count
                  are retrieved by the backend. Credit utilization is entered as a percentage and converted
                  to the model's 0–1 fraction.
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || loadingLoans || loans.length === 0}
                className="btn-primary w-full py-3 text-sm font-semibold shadow-soft gap-2"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Getting ML prediction...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>Calculate ML risk</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-5">
          {result ? (
            <div className="fintech-card p-6 sm:p-7 space-y-5 border-2 border-slate-200/90 animate-fade-in">
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900">
                  Model assessment
                </h2>
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${riskInfo?.badge}`}>
                  {riskInfo?.label}
                </span>
              </div>

              <div className="text-center py-3">
                <p className="text-xs text-slate-500 mb-2">Estimated probability of default</p>
                <p className="text-5xl font-extrabold text-navy-900 tracking-tight">
                  {defaultPercent?.toFixed(1)}%
                </p>
                <p className="mt-2 text-xs font-semibold text-slate-600">{result.predictionLabel}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                  <span className="block text-[11px] text-slate-500">Model class</span>
                  <strong className="text-sm text-navy-900">{result.prediction}</strong>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                  <span className="block text-[11px] text-slate-500">Inverse probability score</span>
                  <strong className="text-sm text-navy-900">{score}/100</strong>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                  <span className="block text-[11px] text-slate-500">Loan-to-income ratio</span>
                  <strong className="text-sm text-navy-900">{Number(result.loanToIncomeRatio).toFixed(3)}</strong>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                  <span className="block text-[11px] text-slate-500">Debt-to-income ratio</span>
                  <strong className="text-sm text-navy-900">{Number(result.debtToIncomeRatio).toFixed(3)}</strong>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Recommendation
                </span>
                <p className="text-sm font-semibold text-navy-900 leading-snug">{result.recommendation}</p>
                <p className="text-[11px] text-slate-400">
                  Evaluated at: {formatDateTime(result.calculatedAt)}
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 text-[11px] text-amber-900 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  This model output is decision support, not an automatic lending decision. Verify declarations
                  and complete independent underwriting before any loan decision.
                </span>
              </div>
            </div>
          ) : (
            <div className="fintech-card p-8 text-center flex flex-col items-center justify-center min-h-[360px] space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div className="space-y-1 max-w-xs">
                <h3 className="text-base font-bold text-navy-900">Ready to evaluate</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Select a loan and complete all borrower fields to request a prediction from the trained ML model.
                </p>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <Info className="h-3.5 w-3.5" />
                Your authenticated profile and selected loan are loaded securely by the backend.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
