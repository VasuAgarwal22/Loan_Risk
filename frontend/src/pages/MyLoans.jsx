import { useEffect, useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getMyLoans, getErrorMessage } from '../api'
import {
  formatCurrency,
  formatDate,
  loanStatusConfig,
} from '../utils/formatters'
import { TableSkeleton } from '../components/common/Skeleton'
import EmptyState from '../components/common/EmptyState'
import {
  Files,
  FilePlus,
  BarChart3,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

export default function MyLoans() {
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('date-desc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8
  const navigate = useNavigate()

  useEffect(() => {
    loadLoans()
  }, [])

  const loadLoans = async () => {
    setLoading(true)
    try {
      const { data } = await getMyLoans()
      setLoans(Array.isArray(data) ? data : [])
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to fetch loan applications'))
    } finally {
      setLoading(false)
    }
  }

  // Calculate status counters
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
        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase()
          const idMatch = String(loan.id).includes(query)
          const purposeMatch = loan.purpose?.toLowerCase().includes(query)
          const amountMatch = String(loan.loanAmount).includes(query)
          if (!idMatch && !purposeMatch && !amountMatch) return false
        }
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.appliedAt || 0) - new Date(a.appliedAt || 0)
        }
        if (sortBy === 'date-asc') {
          return new Date(a.appliedAt || 0) - new Date(b.appliedAt || 0)
        }
        if (sortBy === 'amount-desc') {
          return Number(b.loanAmount || 0) - Number(a.loanAmount || 0)
        }
        if (sortBy === 'amount-asc') {
          return Number(a.loanAmount || 0) - Number(b.loanAmount || 0)
        }
        return 0
      })
  }, [loans, statusFilter, searchQuery, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredLoans.length / itemsPerPage) || 1
  const paginatedLoans = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredLoans.slice(start, start + itemsPerPage)
  }, [filteredLoans, currentPage])

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status)
    setCurrentPage(1)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-600 mb-1">
            <Files className="h-4 w-4" />
            <span>Loan Portfolio Management</span>
          </div>
          <h1 className="page-title">My Loan Applications</h1>
          <p className="page-subtitle">
            Manage, filter, and run credit assessments on your submitted loan requests
          </p>
        </div>
        <Link
          to="/apply-loan"
          className="btn-primary gap-2 self-start sm:self-auto shadow-soft"
        >
          <FilePlus className="h-4 w-4" />
          <span>Apply for New Loan</span>
        </Link>
      </div>

      {/* Top Portfolio Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => handleStatusFilterChange('ALL')}
          className={`fintech-card p-4 text-left transition-all ${
            statusFilter === 'ALL'
              ? 'border-primary-500 ring-2 ring-primary-500/20'
              : 'hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Total Applications
            </span>
            <FileText className="h-4 w-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-navy-900 mt-2">{totalCount}</p>
        </button>

        <button
          type="button"
          onClick={() => handleStatusFilterChange('PENDING')}
          className={`fintech-card p-4 text-left transition-all ${
            statusFilter === 'PENDING'
              ? 'border-amber-500 ring-2 ring-amber-500/20'
              : 'hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-amber-700">
              Pending
            </span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-900 mt-2">{pendingCount}</p>
        </button>

        <button
          type="button"
          onClick={() => handleStatusFilterChange('APPROVED')}
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
          onClick={() => handleStatusFilterChange('REJECTED')}
          className={`fintech-card p-4 text-left transition-all ${
            statusFilter === 'REJECTED'
              ? 'border-rose-500 ring-2 ring-rose-500/20'
              : 'hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-rose-700">
              Rejected
            </span>
            <XCircle className="h-4 w-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-rose-900 mt-2">{rejectedCount}</p>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="fintech-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
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
            placeholder="Search by ID, purpose, amount..."
            className="input-base pl-10 text-xs"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="input-base text-xs !py-1.5 !w-auto"
            >
              <option value="ALL">All Statuses ({totalCount})</option>
              <option value="PENDING">Pending ({pendingCount})</option>
              <option value="APPROVED">Approved ({approvedCount})</option>
              <option value="REJECTED">Rejected ({rejectedCount})</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-base text-xs !py-1.5 !w-auto"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Loan Table */}
      <div className="fintech-card overflow-hidden">
        {loading ? (
          <TableSkeleton rows={5} cols={8} />
        ) : filteredLoans.length === 0 ? (
          <div className="p-8 text-center">
            <EmptyState
              icon={Files}
              title={
                searchQuery || statusFilter !== 'ALL'
                  ? 'No matching loans found'
                  : 'No loan applications found'
              }
              description={
                searchQuery || statusFilter !== 'ALL'
                  ? 'Try adjusting your search criteria or resetting filters.'
                  : 'You have not submitted any loan applications yet. Submit your first request to evaluate risk.'
              }
              actionLabel={
                searchQuery || statusFilter !== 'ALL'
                  ? 'Reset Filters'
                  : 'Apply for Loan'
              }
              onAction={() => {
                setSearchQuery('')
                setStatusFilter('ALL')
                if (!searchQuery && statusFilter === 'ALL') {
                  navigate('/apply-loan')
                }
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
                    <th>Loan Amount</th>
                    <th>Tenure</th>
                    <th>Interest Rate</th>
                    <th>Purpose</th>
                    <th>Applied Date</th>
                    <th>Status</th>
                    <th className="text-right">Risk Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLoans.map((loan) => {
                    const statusInfo = loanStatusConfig[loan.status] || {
                      label: loan.status,
                      badge: 'bg-slate-100 text-slate-700 border-slate-200',
                      dot: 'bg-slate-400',
                    }

                    return (
                      <tr
                        key={loan.id}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="font-bold text-navy-900">#{loan.id}</td>
                        <td className="font-extrabold text-navy-900">
                          {formatCurrency(loan.loanAmount)}
                        </td>
                        <td>
                          <span className="font-medium text-slate-700">
                            {loan.tenureMonths} Months
                          </span>
                        </td>
                        <td>
                          <span className="font-semibold text-slate-600">
                            {loan.interestRate ? `${loan.interestRate}%` : 'Standard'}
                          </span>
                        </td>
                        <td className="max-w-[220px] truncate text-slate-600">
                          {loan.purpose}
                        </td>
                        <td className="text-slate-500 whitespace-nowrap">
                          {formatDate(loan.appliedAt)}
                        </td>
                        <td>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusInfo.badge}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`} />
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="text-right">
                          <button
                            type="button"
                            onClick={() =>
                              navigate('/risk-assessment', {
                                state: { loanId: loan.id },
                              })
                            }
                            className="btn-outline !py-1 !px-3 text-xs font-semibold gap-1.5"
                            title="Calculate risk score for this loan"
                          >
                            <BarChart3 className="h-3.5 w-3.5" />
                            <span>Assess</span>
                          </button>
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
                  {filteredLoans.length} entries
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
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
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
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
    </div>
  )
}
