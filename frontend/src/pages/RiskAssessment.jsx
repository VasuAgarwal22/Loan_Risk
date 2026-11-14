import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getMyLoans, calculateRisk, getErrorMessage } from '../api'
import { useAuth } from '../context/AuthContext'
import {
  formatCurrency,
  formatDateTime,
  riskLevelConfig,
} from '../utils/formatters'
import {
  BarChart3,
  IndianRupee,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  FileText,
  HelpCircle,
  ShieldCheck,
  TrendingDown,
  ArrowRight,
  RefreshCw,
  Info,
} from 'lucide-react'

export default function RiskAssessment() {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const preselectedLoanId = location.state?.loanId

  const [loans, setLoans] = useState([])
  const [selectedLoanId, setSelectedLoanId] = useState(preselectedLoanId ? String(preselectedLoanId) : '')
  const [form, setForm] = useState({
    monthlyIncome: '',
    monthlyExpense: '0',
    averageBalance: '0',
    existingLoans: '0',
    missedPayments: '0',
    creditUtilization: '15',
  })
  const [result, setResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [loadingLoans, setLoadingLoans] = useState(true)

  // Fetch loans and select the target one
  useEffect(() => {
    getMyLoans()
      .then(({ data }) => {
        const loanList = Array.isArray(data) ? data : []
        setLoans(loanList)
        if (preselectedLoanId) {
          setSelectedLoanId(String(preselectedLoanId))
        } else if (loanList.length > 0) {
          setSelectedLoanId(String(loanList[0].id))
        }
      })
      .catch((err) => toast.error(getErrorMessage(err, 'Failed to fetch loan applications')))
      .finally(() => setLoadingLoans(false))
  }, [preselectedLoanId])

  // Prefill financial fields from the authenticated user's profile where available
  useEffect(() => {
    if (user?.monthlyIncome) {
      setForm((prev) => ({
        ...prev,
        monthlyIncome: String(user.monthlyIncome),
      }))
    }
  }, [user])

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const selectedLoan = loans.find((l) => String(l.id) === String(selectedLoanId))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedLoanId) {
      toast.error('Please select an active loan application to assess.')
      return
    }

    const income = Number(form.monthlyIncome)
    if (isNaN(income) || income <= 0) {
      toast.error('Monthly Income must be a positive number.')
      return
    }

    const utilization = Number(form.creditUtilization)
    if (isNaN(utilization) || utilization < 0 || utilization > 100) {
      toast.error('Credit Utilization must be between 0% and 100%.')
      return
    }

    setSubmitting(true)
    setResult(null)
    try {
      const payload = {
        monthlyIncome: income,
        monthlyExpense: Number(form.monthlyExpense) || 0,
        averageBalance: Number(form.averageBalance) || 0,
        existingLoans: Number(form.existingLoans) || 0,
        missedPayments: Number(form.missedPayments) || 0,
        creditUtilization: utilization,
      }
      const { data } = await calculateRisk(selectedLoanId, payload)
      setResult(data)
      toast.success('Risk assessment successfully evaluated!')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Risk assessment computation failed'))
    } finally {
      setSubmitting(false)
    }
  }

  // Circular gauge calculations
  const score = result?.riskScore ?? 0
  const radius = 64
  const strokeWidth = 10
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference
  const riskInfo = result ? (riskLevelConfig[result.riskLevel] || riskLevelConfig.MEDIUM) : null

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-600 mb-1">
            <BarChart3 className="h-4 w-4" />
            <span>Credit Risk Decisioning Model</span>
          </div>
          <h1 className="page-title">Credit Risk Assessment</h1>
          <p className="page-subtitle">
            Evaluate borrower default probability using behavioral cash flow and debt obligations
          </p>
        </div>

        <Link to="/my-loans" className="btn-secondary self-start sm:self-auto text-xs">
          View All Loans
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Loan Selector */}
        <div className="lg:col-span-7 space-y-6">
          <div className="fintech-card p-6 sm:p-7 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Loan Application Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Select Loan Application to Assess *
                </label>
                {loadingLoans ? (
                  <p className="text-xs text-slate-400">Loading loan applications...</p>
                ) : loans.length === 0 ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 space-y-2">
                    <p className="font-semibold">No active loan applications found.</p>
                    <p>You must apply for a loan first before assessing credit risk.</p>
                    <Link
                      to="/apply-loan"
                      className="inline-block font-bold text-primary-600 hover:underline"
                    >
                      Apply for a loan now →
                    </Link>
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={selectedLoanId}
                      onChange={(e) => {
                        setSelectedLoanId(e.target.value)
                        setResult(null)
                      }}
                      className="input-base text-xs font-medium"
                      required
                    >
                      <option value="" disabled>
                        Choose a loan application
                      </option>
                      {loans.map((loan) => (
                        <option key={loan.id} value={loan.id}>
                          Loan #{loan.id} — {formatCurrency(loan.loanAmount)} ({loan.tenureMonths} mo) — {loan.purpose}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Selected Loan Details Preview Card */}
                {selectedLoan && (
                  <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Sanction Amount</span>
                      <span className="font-bold text-navy-900 text-sm">
                        {formatCurrency(selectedLoan.loanAmount)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Tenure</span>
                      <span className="font-semibold text-slate-700">
                        {selectedLoan.tenureMonths} Months
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Status</span>
                      <span className="font-semibold text-slate-700">
                        {selectedLoan.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Purpose</span>
                      <span className="font-semibold text-slate-700 max-w-[120px] truncate block">
                        {selectedLoan.purpose}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Financial Inputs Form Grid */}
              <div className="pt-2 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-3">
                  Borrower Financial Profile
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Monthly Income */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Monthly Income (₹) *
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <IndianRupee className="h-3.5 w-3.5" />
                      </div>
                      <input
                        type="number"
                        step="1"
                        min="1"
                        name="monthlyIncome"
                        value={form.monthlyIncome}
                        onChange={handleChange}
                        placeholder="₹ 50,000"
                        className="input-base pl-9 text-xs"
                        required
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">Auto-filled from user profile</span>
                  </div>

                  {/* Monthly Expenses */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Monthly Expenses (₹)
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <IndianRupee className="h-3.5 w-3.5" />
                      </div>
                      <input
                        type="number"
                        step="1"
                        min="0"
                        name="monthlyExpense"
                        value={form.monthlyExpense}
                        onChange={handleChange}
                        placeholder="Auto-computed"
                        className="input-base pl-9 text-xs"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">Auto-analyzed by backend ledger</span>
                  </div>

                  {/* Average Account Balance */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Average Account Balance (₹)
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <IndianRupee className="h-3.5 w-3.5" />
                      </div>
                      <input
                        type="number"
                        step="1"
                        min="0"
                        name="averageBalance"
                        value={form.averageBalance}
                        onChange={handleChange}
                        placeholder="Auto-computed"
                        className="input-base pl-9 text-xs"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">Current liquid reserves</span>
                  </div>

                  {/* Credit Utilization */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Credit Utilization (0 - 100%)
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <CreditCard className="h-3.5 w-3.5" />
                      </div>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        name="creditUtilization"
                        value={form.creditUtilization}
                        onChange={handleChange}
                        placeholder="e.g. 25"
                        className="input-base pl-9 text-xs"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">Active credit card / line usage</span>
                  </div>

                  {/* Existing Loans */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Existing Active Loans
                    </label>
                    <input
                      type="number"
                      min="0"
                      name="existingLoans"
                      value={form.existingLoans}
                      onChange={handleChange}
                      placeholder="0"
                      className="input-base text-xs"
                    />
                    <span className="text-[10px] text-slate-400">Number of ongoing obligations</span>
                  </div>

                  {/* Missed Payments */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Missed / Defaulted Payments
                    </label>
                    <input
                      type="number"
                      min="0"
                      name="missedPayments"
                      value={form.missedPayments}
                      onChange={handleChange}
                      placeholder="0"
                      className="input-base text-xs"
                    />
                    <span className="text-[10px] text-slate-400">Late payments in past 24 months</span>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting || loans.length === 0}
                  className="btn-primary w-full py-3 text-sm font-semibold shadow-soft gap-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Computing Predictive Risk Score...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      <span>Calculate Risk Profile</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Assessment Result Dashboard */}
        <div className="lg:col-span-5 space-y-6">
          {result ? (
            <div className="fintech-card p-6 sm:p-7 space-y-6 border-2 border-slate-200/90 shadow-card-hover animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: riskInfo?.color }}
                  />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900">
                    Assessment Evaluation
                  </h3>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${riskInfo?.badge}`}
                >
                  {riskInfo?.label}
                </span>
              </div>

              {/* Prominent Circular Score Gauge */}
              <div className="flex flex-col items-center justify-center py-4">
                <div className="relative flex items-center justify-center">
                  <svg className="w-44 h-44 transform -rotate-90">
                    <circle
                      cx="88"
                      cy="88"
                      r={radius}
                      stroke="currentColor"
                      strokeWidth={strokeWidth}
                      className="text-slate-100"
                      fill="transparent"
                    />
                    <circle
                      cx="88"
                      cy="88"
                      r={radius}
                      stroke={riskInfo?.color || '#315EF5'}
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-4xl font-extrabold text-navy-900 tracking-tight">
                      {score}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Out of 100
                    </span>
                  </div>
                </div>

                <p className="mt-2 text-xs text-slate-500 font-medium">
                  {score >= 70
                    ? 'Prime Risk Profile'
                    : score >= 40
                    ? 'Moderate Risk Profile'
                    : 'Elevated Risk Profile'}
                </p>
              </div>

              {/* Recommendation Card */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Official Model Recommendation
                </span>
                <p className="text-sm font-semibold text-navy-900 leading-snug">
                  {result.recommendation}
                </p>
                <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1">
                  <span>Evaluated at:</span>
                  <span className="font-medium text-slate-600">
                    {formatDateTime(result.calculatedAt)}
                  </span>
                </div>
              </div>

              {/* Factors Considered */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Scoring Breakdown Factors
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600">Base Baseline Score</span>
                    <span className="font-semibold text-slate-800">100 pts</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600">Credit Utilization Penalty</span>
                    <span className={`font-semibold ${Number(form.creditUtilization) > 50 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {Number(form.creditUtilization) > 80 ? '-20 pts' : Number(form.creditUtilization) > 50 ? '-10 pts' : '0 pts'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600">Missed Payments Penalty</span>
                    <span className={`font-semibold ${Number(form.missedPayments) > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      -{Number(form.missedPayments) * 10} pts
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-600">Existing Loans Penalty</span>
                    <span className="font-semibold text-slate-700">
                      -{Number(form.existingLoans) * 5} pts
                    </span>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="rounded-xl bg-slate-100/70 p-3 text-[11px] text-slate-500 flex items-start gap-2">
                <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  The risk score is a statistical probability estimation. Loan sanctions remain subject to underwriting review and verification.
                </span>
              </div>
            </div>
          ) : (
            <div className="fintech-card p-8 text-center flex flex-col items-center justify-center min-h-[360px] space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div className="space-y-1 max-w-xs">
                <h3 className="text-base font-bold text-navy-900">
                  Ready to Evaluate
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Select a loan application and submit the financial metrics to generate a real-time risk assessment score.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
