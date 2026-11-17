import { useEffect, useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import { getAdminLoans, updateLoanStatus, getErrorMessage } from '../api'
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  loanStatusConfig,
  riskLevelConfig,
} from '../utils/formatters'
import { TableSkeleton } from '../components/common/Skeleton'
import EmptyState from '../components/common/EmptyState'
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  SlidersHorizontal,
  RefreshCw,
  User,
  Phone,
  Mail,
  IndianRupee,
  Briefcase,
  BarChart3,
  FileText,
  AlertTriangle,
  X,
  ArrowRight,
  TrendingDown,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

export default function OfficerPortal() {
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [riskFilter, setRiskFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('date-desc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Modal review state
  const [selectedLoan, setSelectedLoan] = useState(null)
  const [decisionInterestRate, setDecisionInterestRate] = useState('')
  const [decisionRemarks, setDecisionRemarks] = useState('')
  const [processingDecision, setProcessingDecision] = useState(false)

  useEffect(() => {
    fetchLoans()
  }, [])

  const fetchLoans = async () => {
    setLoading(true)
    try {
      const { data } = await getAdminLoans()
      setLoans(Array.isArray(data) ? data : [])
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to fetch loan applications for review'))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleManualRefresh = () => {
    setRefreshing(true)
    fetchLoans()
  }

  // Open detail review modal
  const handleOpenReview = (loan) => {
    setSelectedLoan(loan)
    setDecisionInterestRate(loan.interestRate ? String(loan.interestRate) : '10.5')
    setDecisionRemarks('')
  }

  // Execute decision (Approve / Reject)
  const handleDecision = async (status, loanToDecide = selectedLoan) => {
    if (!loanToDecide) return

    setProcessingDecision(true)
    try {
      const payload = {
        status,
        interestRate: decisionInterestRate ? Number(decisionInterestRate) : undefined,
        remarks: decisionRemarks.trim() || undefined,
      }

      const { data: updatedLoan } = await updateLoanStatus(loanToDecide.id, payload)

      toast.success(
        `Loan #${loanToDecide.id} has been successfully ${status === 'APPROVED' ? 'approved' : 'rejected'}!`
      )

      // Update in state directly
      setLoans((prev) =>
        prev.map((l) => (l.id === updatedLoan.id ? { ...l, ...updatedLoan } : l))
      )

      // Close modal if open
      setSelectedLoan(null)
    } catch (err) {
      toast.error(getErrorMessage(err, `Failed to update loan status to ${status}`))
    } finally {
      setProcessingDecision(false)
    }
  }

  // Aggregate Counters
  const totalCount = loans.length
  const pendingCount = loans.filter((l) => l.status === 'PENDING').length
  const approvedCount = loans.filter((l) => l.status === 'APPROVED').length
  const rejectedCount = loans.filter((l) => l.status === 'REJECTED').length

  // Filter & Sort
  const filteredLoans = useMemo(() => {
    return loans
      .filter((loan) => {
        // Status filter
        if (statusFilter !== 'ALL' && loan.status !== statusFilter) return false

        // Risk filter
        if (riskFilter !== 'ALL') {
          if (riskFilter === 'NOT_ASSESSED' && loan.hasRiskAssessment) return false
          if (riskFilter !== 'NOT_ASSESSED' && loan.riskLevel !== riskFilter) return false
        }

        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const idMatch = String(loan.id).includes(q)
          const nameMatch = loan.borrowerName?.toLowerCase().includes(q)
          const emailMatch = loan.borrowerEmail?.toLowerCase().includes(q)
          const phoneMatch = loan.borrowerPhone?.includes(q)
          const purposeMatch = loan.purpose?.toLowerCase().includes(q)
          const amountMatch = String(loan.loanAmount).includes(q)

          if (!idMatch && !nameMatch && !emailMatch && !phoneMatch && !purposeMatch && !amountMatch) {
            return false
          }
        }
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return new Date(b.appliedAt || 0) - new Date(a.appliedAt || 0)
        if (sortBy === 'date-asc') return new Date(a.appliedAt || 0) - new Date(b.appliedAt || 0)
        if (sortBy === 'amount-desc') return Number(b.loanAmount || 0) - Number(a.loanAmount || 0)
        if (sortBy === 'amount-asc') return Number(a.loanAmount || 0) - Number(b.loanAmount || 0)
        if (sortBy === 'score-desc') return (b.riskScore ?? -1) - (a.riskScore ?? -1)
        if (sortBy === 'score-asc') return (a.riskScore ?? 999) - (b.riskScore ?? 999)
        return 0
      })
  }, [loans, statusFilter, riskFilter, searchQuery, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredLoans.length / itemsPerPage) || 1
  const paginatedLoans = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredLoans.slice(start, start + itemsPerPage)
  }, [filteredLoans, currentPage])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-navy-900 text-white p-6 sm:p-8 shadow-card-hover border border-navy-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none select-none" />
        <div className="absolute bottom-0 right-1/3 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none select-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 select-none">
              <ShieldCheck className="h-4 w-4" />
              <span>Officer Underwriting & Sanctions</span>
              <span className="text-navy-700">•</span>
              <span className="text-slate-300">Designated Officer: ujjawal@gmail.com</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Loan Approval Portal
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Inspect applicant debt-to-income profiles, review ML credit risk predictions, and sanction or decline loan applications.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 select-none">
            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={refreshing || loading}
              className="btn-secondary !bg-navy-800 !text-white !border-navy-700 hover:!bg-navy-700 !py-2.5 !px-4 text-xs font-semibold gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Queue</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => {
            setStatusFilter('ALL')
            setCurrentPage(1)
          }}
          className={`fintech-card p-4 text-left transition-all ${
            statusFilter === 'ALL'
              ? 'border-primary-500 ring-2 ring-primary-500/20'
              : 'hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Total Queue
            </span>
            <FileText className="h-4 w-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-navy-900 mt-2">{totalCount}</p>
        </button>

        <button
          type="button"
          onClick={() => {
            setStatusFilter('PENDING')
            setCurrentPage(1)
          }}
          className={`fintech-card p-4 text-left transition-all ${
            statusFilter === 'PENDING'
              ? 'border-amber-500 ring-2 ring-amber-500/20'
              : 'hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-amber-700">
              Pending Review
            </span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-900 mt-2">{pendingCount}</p>
        </button>

        <button
          type="button"
          onClick={() => {
            setStatusFilter('APPROVED')
            setCurrentPage(1)
          }}
          className={`fintech-card p-4 text-left transition-all ${
            statusFilter === 'APPROVED'
              ? 'border-emerald-500 ring-2 ring-emerald-500/20'
              : 'hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-emerald-700">
              Approved
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-900 mt-2">{approvedCount}</p>
        </button>

        <button
          type="button"
          onClick={() => {
            setStatusFilter('REJECTED')
            setCurrentPage(1)
          }}
          className={`fintech-card p-4 text-left transition-all ${
            statusFilter === 'REJECTED'
              ? 'border-rose-500 ring-2 ring-rose-500/20'
              : 'hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-rose-700">
              Declined
            </span>
            <XCircle className="h-4 w-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-rose-900 mt-2">{rejectedCount}</p>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="fintech-card p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full lg:w-80">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            placeholder="Search by ID, name, email, purpose..."
            className="input-base pl-10 text-xs"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="input-base text-xs !py-1.5 !w-auto"
          >
            <option value="ALL">All Statuses ({totalCount})</option>
            <option value="PENDING">Pending Only ({pendingCount})</option>
            <option value="APPROVED">Approved ({approvedCount})</option>
            <option value="REJECTED">Rejected ({rejectedCount})</option>
          </select>

          {/* Risk Level filter */}
          <select
            value={riskFilter}
            onChange={(e) => {
              setRiskFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="input-base text-xs !py-1.5 !w-auto"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="LOW">Low Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="NOT_ASSESSED">Not Assessed</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-base text-xs !py-1.5 !w-auto"
          >
            <option value="date-desc">Newest Application</option>
            <option value="date-asc">Oldest Application</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
            <option value="score-desc">Highest Risk Score</option>
            <option value="score-asc">Lowest Risk Score</option>
          </select>
        </div>
      </div>

      {/* Main Underwriting Table */}
      <div className="fintech-card overflow-hidden">
        {loading ? (
          <TableSkeleton rows={5} cols={7} />
        ) : filteredLoans.length === 0 ? (
          <div className="p-8 text-center">
            <EmptyState
              icon={ShieldCheck}
              title={
                searchQuery || statusFilter !== 'ALL' || riskFilter !== 'ALL'
                  ? 'No matching loan applications found'
                  : 'No loan applications in review queue'
              }
              description={
                searchQuery || statusFilter !== 'ALL' || riskFilter !== 'ALL'
                  ? 'Try broadening your search query or clearing filters.'
                  : 'When applicants apply for loans, they will appear in this underwriting queue.'
              }
              actionLabel="Reset Filters"
              onAction={() => {
                setSearchQuery('')
                setStatusFilter('ALL')
                setRiskFilter('ALL')
              }}
            />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full fintech-table">
                <thead>
                  <tr>
                    <th>Loan ID</th>
                    <th>Borrower Profile</th>
                    <th>Loan Request</th>
                    <th>Risk Model Score</th>
                    <th>Status</th>
                    <th>Applied On</th>
                    <th className="text-right">Officer Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLoans.map((loan) => {
                    const statusInfo = loanStatusConfig[loan.status] || {
                      label: loan.status,
                      badge: 'bg-slate-100 text-slate-700 border-slate-200',
                      dot: 'bg-slate-400',
                    }
                    const riskInfo = loan.riskLevel
                      ? riskLevelConfig[loan.riskLevel]
                      : null

                    return (
                      <tr
                        key={loan.id}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        {/* Loan ID */}
                        <td className="font-bold text-navy-900 whitespace-nowrap">
                          #{loan.id}
                        </td>

                        {/* Borrower Profile */}
                        <td>
                          <div className="space-y-0.5">
                            <p className="font-semibold text-navy-900 text-xs">
                              {loan.borrowerName || 'Anonymous Borrower'}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {loan.borrowerEmail || '—'}
                            </p>
                            <div className="flex items-center gap-2 pt-0.5">
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/50">
                                {formatCurrency(loan.borrowerMonthlyIncome)}/mo
                              </span>
                              <span className="text-[10px] text-slate-400 uppercase">
                                {loan.borrowerEmploymentType?.replace('_', ' ') || 'EMPLOYED'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Loan Request */}
                        <td>
                          <div className="space-y-0.5">
                            <p className="font-bold text-navy-900 text-sm">
                              {formatCurrency(loan.loanAmount)}
                            </p>
                            <p className="text-[11px] text-slate-600">
                              {loan.tenureMonths} Months
                              {loan.interestRate ? ` @ ${loan.interestRate}%` : ''}
                            </p>
                            <p className="text-[11px] text-slate-400 max-w-[180px] truncate">
                              {loan.purpose}
                            </p>
                          </div>
                        </td>

                        {/* Risk Assessment Score */}
                        <td>
                          {loan.hasRiskAssessment ? (
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                                  loan.riskLevel === 'LOW'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : loan.riskLevel === 'MEDIUM'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {loan.riskScore}
                              </div>
                              <div>
                                <span
                                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                                    riskInfo?.badge || 'bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  {riskInfo?.label || loan.riskLevel}
                                </span>
                                <p className="text-[10px] text-slate-400 max-w-[150px] truncate mt-0.5">
                                  {loan.recommendation || 'Assessment completed'}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">
                              Not assessed yet
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border select-none ${statusInfo.badge}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`} />
                            {statusInfo.label}
                          </span>
                        </td>

                        {/* Applied On */}
                        <td className="text-slate-500 whitespace-nowrap text-xs">
                          {formatDate(loan.appliedAt)}
                        </td>

                        {/* Actions */}
                        <td className="text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenReview(loan)}
                              className="btn-outline !py-1 !px-2.5 text-xs font-semibold gap-1"
                              title="Full Underwriting Review"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              <span>Review</span>
                            </button>

                            {loan.status === 'PENDING' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleDecision('APPROVED', loan)}
                                  className="p-1 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 transition"
                                  title="Quick Approve"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDecision('REJECTED', loan)}
                                  className="p-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition"
                                  title="Quick Reject"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredLoans.length)} of{' '}
                  {filteredLoans.length} applications
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="px-2 font-semibold text-slate-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                    aria-label="Next Page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Underwriting Review Modal / Drawer */}
      {selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-soft-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                    Underwriting Review
                  </span>
                  <span className="text-xs font-bold text-navy-900">
                    Loan #{selectedLoan.id}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-navy-900 mt-1">
                  Sanction Assessment for {selectedLoan.borrowerName || 'Borrower'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLoan(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Grid Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Card 1: Borrower Profile */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <User className="h-4 w-4 text-primary-500" />
                  <span>Borrower Profile</span>
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Full Name</span>
                    <span className="font-semibold text-navy-900">
                      {selectedLoan.borrowerName || '—'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Email</span>
                    <span className="font-semibold text-navy-900">
                      {selectedLoan.borrowerEmail || '—'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Phone</span>
                    <span className="font-semibold text-navy-900">
                      {selectedLoan.borrowerPhone || '—'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Monthly Income</span>
                    <span className="font-bold text-emerald-700">
                      {formatCurrency(selectedLoan.borrowerMonthlyIncome)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Employment Type</span>
                    <span className="font-semibold text-slate-700 uppercase">
                      {selectedLoan.borrowerEmploymentType?.replace('_', ' ') || 'SALARIED'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Loan Request Specifications */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <IndianRupee className="h-4 w-4 text-primary-500" />
                  <span>Loan Facility Request</span>
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Principal Amount</span>
                    <span className="font-extrabold text-navy-900 text-sm">
                      {formatCurrency(selectedLoan.loanAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Requested Tenure</span>
                    <span className="font-semibold text-navy-900">
                      {selectedLoan.tenureMonths} Months
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Application Status</span>
                    <span className="font-bold text-slate-700">
                      {selectedLoan.status}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Application Date</span>
                    <span className="font-semibold text-slate-700">
                      {formatDate(selectedLoan.appliedAt)}
                    </span>
                  </div>
                  <div className="py-1">
                    <span className="text-slate-500 block mb-0.5">Stated Purpose</span>
                    <span className="font-medium text-slate-800 italic block">
                      "{selectedLoan.purpose}"
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Assessment Findings */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <BarChart3 className="h-4 w-4 text-primary-500" />
                  <span>Automated Risk Engine Score & Findings</span>
                </span>
                {selectedLoan.hasRiskAssessment && (
                  <span className="text-[11px] font-normal text-slate-400">
                    Evaluated on {formatDateTime(selectedLoan.riskCalculatedAt)}
                  </span>
                )}
              </h3>

              {selectedLoan.hasRiskAssessment ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div
                      className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold ${
                        selectedLoan.riskLevel === 'LOW'
                          ? 'bg-emerald-100 text-emerald-800'
                          : selectedLoan.riskLevel === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {selectedLoan.riskScore}
                    </div>
                    <div className="space-y-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="font-bold text-navy-900 text-sm">
                          Risk Tier: {selectedLoan.riskLevel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">
                        "{selectedLoan.recommendation}"
                      </p>
                    </div>
                  </div>

                  {/* Factor breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Avg Balance</span>
                      <span className="font-bold text-navy-900">
                        {formatCurrency(selectedLoan.averageBalance)}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Credit Utilization</span>
                      <span className="font-bold text-navy-900">
                        {selectedLoan.creditUtilization ?? '0'}%
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Active Loans</span>
                      <span className="font-bold text-navy-900">
                        {selectedLoan.existingLoans ?? 0}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Missed Payments</span>
                      <span className="font-bold text-navy-900">
                        {selectedLoan.missedPayments ?? 0}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs">
                  The applicant has not yet calculated a predictive risk assessment for this application. You may still make an underwriting decision based on stated profile details.
                </div>
              )}
            </div>

            {/* Sanction Decision Parameters */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900">
                Officer Underwriting Parameters
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Sanction Interest Rate (% p.a.)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="50"
                    value={decisionInterestRate}
                    onChange={(e) => setDecisionInterestRate(e.target.value)}
                    placeholder="e.g. 10.5"
                    className="input-base text-xs"
                  />
                  <span className="text-[10px] text-slate-400">
                    Benchmark interest applied to sanctioned loan
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Officer Decision Remarks (Optional)
                  </label>
                  <input
                    type="text"
                    value={decisionRemarks}
                    onChange={(e) => setDecisionRemarks(e.target.value)}
                    placeholder="e.g. Approved based on strong debt-to-income ratio"
                    className="input-base text-xs"
                  />
                  <span className="text-[10px] text-slate-400">
                    Reason recorded for compliance ledger
                  </span>
                </div>
              </div>
            </div>

            {/* Decision Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedLoan(null)}
                disabled={processingDecision}
                className="btn-secondary w-full sm:w-auto"
              >
                Close Without Action
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  disabled={processingDecision}
                  onClick={() => handleDecision('REJECTED')}
                  className="btn-secondary !border-rose-200 !text-rose-700 hover:!bg-rose-50 w-full sm:w-auto gap-2"
                >
                  <XCircle className="h-4 w-4 text-rose-500" />
                  <span>Decline Loan</span>
                </button>

                <button
                  type="button"
                  disabled={processingDecision}
                  onClick={() => handleDecision('APPROVED')}
                  className="btn-primary !bg-emerald-600 hover:!bg-emerald-700 w-full sm:w-auto gap-2 shadow-soft"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Sanction & Approve</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
