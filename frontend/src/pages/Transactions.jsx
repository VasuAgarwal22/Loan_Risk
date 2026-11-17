import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getTransactions, getErrorMessage } from '../api'
import {
  formatCurrency,
  formatDate,
  transactionStatusConfig,
} from '../utils/formatters'
import { TableSkeleton } from '../components/common/Skeleton'
import EmptyState from '../components/common/EmptyState'
import {
  Receipt,
  PlusCircle,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Utensils,
  Home,
  ShoppingBag,
  HeartPulse,
  GraduationCap,
  Tv,
  Coins,
  ReceiptText,
  Tag,
} from 'lucide-react'

// Category Icons
const categoryIcons = {
  SALARY: Briefcase,
  FOOD: Utensils,
  RENT: Home,
  SHOPPING: ShoppingBag,
  MEDICAL: HeartPulse,
  EDUCATION: GraduationCap,
  ENTERTAINMENT: Tv,
  INVESTMENT: Coins,
  BILL: ReceiptText,
  OTHER: Tag,
}

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('date-desc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    setLoading(true)
    try {
      const { data } = await getTransactions()
      setTransactions(Array.isArray(data) ? data : [])
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to fetch transactions'))
    } finally {
      setLoading(false)
    }
  }

  // Calculate summaries
  const totalCount = transactions.length
  const totalCredits = transactions
    .filter((t) => t.transactionType === 'CREDIT')
    .reduce((s, t) => s + Number(t.amount || 0), 0)
  const totalDebits = transactions
    .filter((t) => t.transactionType === 'DEBIT')
    .reduce((s, t) => s + Number(t.amount || 0), 0)
  const netBalance = totalCredits - totalDebits

  // Filter & Sort
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        // Type filter
        if (typeFilter !== 'ALL' && t.transactionType !== typeFilter) return false
        // Category filter
        if (categoryFilter !== 'ALL' && t.transactionCategory !== categoryFilter) return false
        // Status filter
        if (statusFilter !== 'ALL' && t.transactionStatus !== statusFilter) return false
        // Search query (merchant, description, amount, id)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const merchantMatch = t.merchant?.toLowerCase().includes(q)
          const descMatch = t.description?.toLowerCase().includes(q)
          const catMatch = t.transactionCategory?.toLowerCase().includes(q)
          const amountMatch = String(t.amount).includes(q)
          if (!merchantMatch && !descMatch && !catMatch && !amountMatch) return false
        }
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.transactionDate || 0) - new Date(a.transactionDate || 0)
        }
        if (sortBy === 'date-asc') {
          return new Date(a.transactionDate || 0) - new Date(b.transactionDate || 0)
        }
        if (sortBy === 'amount-desc') {
          return Number(b.amount || 0) - Number(a.amount || 0)
        }
        if (sortBy === 'amount-asc') {
          return Number(a.amount || 0) - Number(b.amount || 0)
        }
        return 0
      })
  }, [transactions, typeFilter, categoryFilter, statusFilter, searchQuery, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredTransactions.slice(start, start + itemsPerPage)
  }, [filteredTransactions, currentPage])

  // All distinct categories present
  const availableCategories = useMemo(() => {
    const set = new Set(transactions.map((t) => t.transactionCategory).filter(Boolean))
    return Array.from(set).sort()
  }, [transactions])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-600 mb-1">
            <Receipt className="h-4 w-4" />
            <span>Financial Ledger</span>
          </div>
          <h1 className="page-title">Transaction History</h1>
          <p className="page-subtitle">
            Detailed record of incoming credits, outgoing expenses, and net cashflow
          </p>
        </div>

        <Link
          to="/add-transaction"
          className="btn-primary gap-2 self-start sm:self-auto shadow-soft"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Record Transaction</span>
        </Link>
      </div>

      {/* Top 3 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="fintech-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Transactions
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <Receipt className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-navy-900 mt-2">
            {totalCount}
          </p>
          <p className="text-xs text-slate-400 mt-1">Logged financial activities</p>
        </div>

        <div className="fintech-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Total Inflow (Credits)
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ArrowDownLeft className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-700 mt-2">
            +{formatCurrency(totalCredits)}
          </p>
          <p className="text-xs text-slate-400 mt-1">Salaries, deposits & returns</p>
        </div>

        <div className="fintech-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-700">
              Total Outflow (Debits)
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-rose-700 mt-2">
            −{formatCurrency(totalDebits)}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Net: {netBalance >= 0 ? '+' : ''}{formatCurrency(netBalance)}
          </p>
        </div>
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
            placeholder="Search merchant, category, amount..."
            className="input-base pl-10 text-xs"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="input-base text-xs !py-1.5 !w-auto"
          >
            <option value="ALL">All Types</option>
            <option value="CREDIT">Credits (+) Only</option>
            <option value="DEBIT">Debits (−) Only</option>
          </select>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="input-base text-xs !py-1.5 !w-auto"
          >
            <option value="ALL">All Categories</option>
            {availableCategories.map((c) => (
              <option key={c} value={c}>
                {c.replace('_', ' ')}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="input-base text-xs !py-1.5 !w-auto"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUCCESS">Success</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>

          {/* Sorting */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-base text-xs !py-1.5 !w-auto"
          >
            <option value="date-desc">Newest Date</option>
            <option value="date-asc">Oldest Date</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Main Transactions Table */}
      <div className="fintech-card overflow-hidden">
        {loading ? (
          <TableSkeleton rows={6} cols={6} />
        ) : filteredTransactions.length === 0 ? (
          <div className="p-8 text-center">
            <EmptyState
              icon={Receipt}
              title={
                searchQuery || typeFilter !== 'ALL' || categoryFilter !== 'ALL'
                  ? 'No matching transactions'
                  : 'No transactions recorded'
              }
              description={
                searchQuery || typeFilter !== 'ALL' || categoryFilter !== 'ALL'
                  ? 'No entries match your selected criteria. Try adjusting filters.'
                  : 'Start tracking your financial transactions to generate cash flow insights.'
              }
              actionLabel={
                searchQuery || typeFilter !== 'ALL' || categoryFilter !== 'ALL'
                  ? 'Reset All Filters'
                  : 'Add First Transaction'
              }
              onAction={() => {
                setTypeFilter('ALL')
                setCategoryFilter('ALL')
                setStatusFilter('ALL')
                setSearchQuery('')
              }}
              actionLink={
                !searchQuery && typeFilter === 'ALL' && categoryFilter === 'ALL'
                  ? '/add-transaction'
                  : undefined
              }
            />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full fintech-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category & Type</th>
                    <th>Merchant / Recipient</th>
                    <th>Description</th>
                    <th className="text-right">Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions.map((t) => {
                    const isCredit = t.transactionType === 'CREDIT'
                    const statusInfo = transactionStatusConfig[t.transactionStatus] || {
                      label: t.transactionStatus,
                      badge: 'bg-slate-100 text-slate-700 border-slate-200',
                      dot: 'bg-slate-400',
                    }
                    const CatIcon = categoryIcons[t.transactionCategory] || Tag

                    return (
                      <tr
                        key={t.id}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        {/* Date */}
                        <td className="text-slate-600 whitespace-nowrap text-xs">
                          {formatDate(t.transactionDate)}
                        </td>

                        {/* Category & Type */}
                        <td>
                          <div className="flex items-center gap-2">
                            <div
                              className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                                isCredit
                                  ? 'bg-emerald-50 text-emerald-600'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              <CatIcon className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <span className="font-semibold text-navy-900 block text-xs">
                                {t.transactionCategory?.replace('_', ' ') || 'OTHER'}
                              </span>
                              <span
                                className={`text-[10px] font-bold tracking-wider uppercase ${
                                  isCredit ? 'text-emerald-600' : 'text-slate-400'
                                }`}
                              >
                                {t.transactionType}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Merchant */}
                        <td className="font-medium text-slate-700 text-xs">
                          {t.merchant || '—'}
                        </td>

                        {/* Description */}
                        <td className="max-w-[200px] truncate text-slate-500 text-xs">
                          {t.description || '—'}
                        </td>

                        {/* Amount */}
                        <td
                          className={`text-right font-extrabold whitespace-nowrap ${
                            isCredit ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {isCredit ? '+' : '−'}
                          {formatCurrency(t.amount)}
                        </td>

                        {/* Status */}
                        <td>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusInfo.badge}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`} />
                            {statusInfo.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of{' '}
                  {filteredTransactions.length} transactions
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
