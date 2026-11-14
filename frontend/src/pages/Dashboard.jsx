import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { getMyLoans, getTransactions, getErrorMessage } from '../api'
import {
  formatCurrency,
  formatDate,
  getTimeOfDayGreeting,
  loanStatusConfig,
} from '../utils/formatters'
import StatCard from '../components/common/StatCard'
import {
  CreditDebitComparisonChart,
  CategoryDistributionChart,
  LoanStatusChart,
} from '../components/common/Charts'
import { CardSkeleton, TableSkeleton } from '../components/common/Skeleton'
import EmptyState from '../components/common/EmptyState'
import {
  FileText,
  Clock,
  CheckCircle2,
  Receipt,
  Scale,
  PlusCircle,
  FilePlus,
  Files,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles,
} from 'lucide-react'

const quickActions = [
  {
    to: '/apply-loan',
    icon: FilePlus,
    title: 'Apply for Loan',
    desc: 'Submit a new credit request',
    color: 'bg-primary-50 text-primary-600 border-primary-100 hover:border-primary-300',
  },
  {
    to: '/my-loans',
    icon: Files,
    title: 'View My Loans',
    desc: 'Track status and active tenure',
    color: 'bg-sky-50 text-sky-600 border-sky-100 hover:border-sky-300',
  },
  {
    to: '/transactions',
    icon: Receipt,
    title: 'Transactions',
    desc: 'Manage entries and cashflow',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:border-emerald-300',
  },
  {
    to: '/risk-assessment',
    icon: BarChart3,
    title: 'Risk Assessment',
    desc: 'Run scoring engine on loans',
    color: 'bg-amber-50 text-amber-600 border-amber-100 hover:border-amber-300',
  },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalLoans: 0,
    pendingLoans: 0,
    approvedLoans: 0,
    totalTransactions: 0,
    totalCredit: 0,
    totalDebit: 0,
  })
  const [loans, setLoans] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const [loansRes, txnsRes] = await Promise.all([getMyLoans(), getTransactions()])
      const loansData = Array.isArray(loansRes.data) ? loansRes.data : []
      const txnsData = Array.isArray(txnsRes.data) ? txnsRes.data : []

      const totalCredit = txnsData
        .filter((t) => t.transactionType === 'CREDIT')
        .reduce((sum, t) => sum + Number(t.amount || 0), 0)

      const totalDebit = txnsData
        .filter((t) => t.transactionType === 'DEBIT')
        .reduce((sum, t) => sum + Number(t.amount || 0), 0)

      setStats({
        totalLoans: loansData.length,
        pendingLoans: loansData.filter((l) => l.status === 'PENDING').length,
        approvedLoans: loansData.filter((l) => l.status === 'APPROVED').length,
        totalTransactions: txnsData.length,
        totalCredit,
        totalDebit,
      })
      setLoans(loansData)
      setTransactions(txnsData)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to load dashboard metrics'))
    } finally {
      setLoading(false)
    }
  }

  const greeting = getTimeOfDayGreeting()
  const formattedToday = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  const recentLoans = loans.slice(0, 5)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-navy-900 text-white p-6 sm:p-8 lg:p-10 shadow-card-hover border border-navy-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none select-none" />
        <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none select-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-300 select-none">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Credit Management Hub</span>
              <span className="text-navy-700">•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Calendar className="h-3 w-3" />
                {formattedToday}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              {greeting}, {user?.fullName || 'Valued Member'} 👋
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Here is an overview of your active loan applications, liquidity ratio, and behavioral credit health indicators.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 select-none">
            <Link
              to="/apply-loan"
              className="btn-primary !py-2.5 !px-4 text-xs font-semibold gap-2 shadow-soft"
            >
              <FilePlus className="h-4 w-4" />
              <span>Apply for Loan</span>
            </Link>
            <Link
              to="/add-transaction"
              className="btn-secondary !bg-navy-800 !text-white !border-navy-700 hover:!bg-navy-700 !py-2.5 !px-4 text-xs font-semibold gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Log Transaction</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 5 Primary KPI Summary Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-navy-900 tracking-tight">
            Financial Indicators
          </h2>
          <span className="text-xs text-slate-500 select-none">Live summary</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              icon={FileText}
              title="Total Loans"
              value={stats.totalLoans}
              subtitle="All-time submitted applications"
              accent="navy"
            />
            <StatCard
              icon={Clock}
              title="Pending Loans"
              value={stats.pendingLoans}
              subtitle="Awaiting review & decision"
              accent="amber"
            />
            <StatCard
              icon={CheckCircle2}
              title="Approved Loans"
              value={stats.approvedLoans}
              subtitle="Sanctioned credit facilities"
              accent="emerald"
            />
            <StatCard
              icon={Receipt}
              title="Transactions"
              value={stats.totalTransactions}
              subtitle="Total logged ledger events"
              accent="primary"
            />
            <StatCard
              icon={Scale}
              title="Inflow vs Outflow"
              value={`${formatCurrency(stats.totalCredit)}`}
              subtitle={`Expenses: ${formatCurrency(stats.totalDebit)}`}
              accent="sky"
            />
          </div>
        )}
      </div>

      {/* Financial Analytics Section (Interactive Charts) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-navy-900 tracking-tight">
              Financial & Risk Analytics
            </h2>
            <p className="text-xs text-slate-500">Data visualization derived from your account records</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CreditDebitComparisonChart
            totalCredit={stats.totalCredit}
            totalDebit={stats.totalDebit}
          />
          <CategoryDistributionChart transactions={transactions} />
          <LoanStatusChart loans={loans} />
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div>
        <h2 className="text-base font-bold text-navy-900 tracking-tight mb-4 select-none">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.to}
                to={action.to}
                className="group fintech-card p-5 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between select-none"
              >
                <div>
                  <div
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border ${action.color} mb-4 transition-transform group-hover:scale-105`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-navy-900 group-hover:text-primary-600 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{action.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-primary-600">
                  <span>Open Module</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Loan Applications Table */}
      <div className="fintech-card overflow-hidden">
        <div className="p-5 sm:px-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-navy-900 tracking-tight">
              Recent Loan Applications
            </h2>
            <p className="text-xs text-slate-500">Track and assess recent credit requests</p>
          </div>
          <Link
            to="/my-loans"
            className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition select-none"
          >
            <span>View All Applications</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <TableSkeleton rows={4} cols={6} />
        ) : recentLoans.length === 0 ? (
          <div className="p-8 text-center">
            <EmptyState
              icon={FileText}
              title="No loan applications yet"
              description="You have not submitted any loan applications. Apply for a loan to get an automated credit risk decision."
              actionLabel="Apply for Loan"
              actionLink="/apply-loan"
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full fintech-table">
              <thead>
                <tr>
                  <th>Loan ID</th>
                  <th>Amount</th>
                  <th>Tenure</th>
                  <th>Purpose</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentLoans.map((loan) => {
                  const statusInfo = loanStatusConfig[loan.status] || {
                    label: loan.status,
                    badge: 'bg-slate-100 text-slate-700 border-slate-200',
                    dot: 'bg-slate-400',
                  }
                  return (
                    <tr key={loan.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="font-semibold text-navy-900">#{loan.id}</td>
                      <td className="font-bold text-navy-900">
                        {formatCurrency(loan.loanAmount)}
                      </td>
                      <td>{loan.tenureMonths} Months</td>
                      <td className="max-w-[200px] truncate text-slate-600">
                        {loan.purpose}
                      </td>
                      <td className="text-slate-500 whitespace-nowrap">
                        {formatDate(loan.appliedAt)}
                      </td>
                      <td>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border select-none ${statusInfo.badge}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`} />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="text-right select-none">
                        <Link
                          to="/risk-assessment"
                          state={{ loanId: loan.id }}
                          className="btn-outline !py-1 !px-3 text-xs font-semibold gap-1"
                        >
                          <BarChart3 className="h-3.5 w-3.5" />
                          <span>Assess</span>
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
