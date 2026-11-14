import React, { useState } from 'react'
import { formatCurrency } from '../../utils/formatters'
import { ArrowDownLeft, ArrowUpRight, TrendingUp, PieChart as PieIcon, Layers } from 'lucide-react'

/**
 * Credit vs Debit Comparison Card & Visual Bar
 */
export function CreditDebitComparisonChart({ totalCredit = 0, totalDebit = 0 }) {
  const totalVolume = totalCredit + totalDebit
  const creditPercent = totalVolume > 0 ? Math.round((totalCredit / totalVolume) * 100) : 50
  const debitPercent = totalVolume > 0 ? 100 - creditPercent : 50
  const netCashflow = totalCredit - totalDebit

  return (
    <div className="fintech-card p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-navy-900">Cash Flow Ratio</h3>
              <p className="text-xs text-slate-500">Credits vs. Debits volume</p>
            </div>
          </div>
          <span
            className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${
              netCashflow >= 0
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                : 'bg-rose-50 text-rose-700 border border-rose-200/60'
            }`}
          >
            Net: {netCashflow >= 0 ? '+' : ''}{formatCurrency(netCashflow)}
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-2 mt-4">
          <div className="h-4 w-full rounded-full bg-slate-100 overflow-hidden flex p-0.5">
            <div
              style={{ width: `${totalVolume > 0 ? creditPercent : 0}%` }}
              className="h-full bg-emerald-500 rounded-l-full transition-all duration-500 relative group"
              title={`Credit: ${creditPercent}%`}
            />
            <div
              style={{ width: `${totalVolume > 0 ? debitPercent : 0}%` }}
              className="h-full bg-rose-500 rounded-r-full transition-all duration-500 relative group"
              title={`Debit: ${debitPercent}%`}
            />
          </div>

          <div className="flex justify-between text-xs text-slate-500 pt-1 font-medium">
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
              Income ({creditPercent}%)
            </span>
            <span className="flex items-center gap-1 text-rose-700">
              <span className="h-2 w-2 rounded-full bg-rose-500 inline-block" />
              Expenses ({debitPercent}%)
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-100">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 mt-0.5">
            <ArrowDownLeft className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Total Inflow</p>
            <p className="text-base font-bold text-navy-900">{formatCurrency(totalCredit)}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 mt-0.5">
            <ArrowUpRight className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Total Outflow</p>
            <p className="text-base font-bold text-navy-900">{formatCurrency(totalDebit)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Category Distribution (Interactive Donut & Progress Bars)
 */
export function CategoryDistributionChart({ transactions = [] }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  // Aggregate by category
  const categoryTotals = {}
  let totalSpent = 0

  transactions.forEach((t) => {
    const cat = t.transactionCategory || 'OTHER'
    const amt = Number(t.amount || 0)
    categoryTotals[cat] = (categoryTotals[cat] || 0) + amt
    totalSpent += amt
  })

  const categories = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5) // Top 5 categories

  const colorPalette = ['#315EF5', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#64748B']

  if (categories.length === 0) {
    return (
      <div className="fintech-card p-6 flex flex-col items-center justify-center text-center h-full min-h-[220px]">
        <PieIcon className="h-8 w-8 text-slate-300 mb-2" />
        <p className="text-sm font-medium text-slate-600">No Category Data</p>
        <p className="text-xs text-slate-400 mt-0.5">Add transactions to see distribution</p>
      </div>
    )
  }

  return (
    <div className="fintech-card p-6 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <PieIcon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-navy-900">Spending by Category</h3>
            <p className="text-xs text-slate-500">Top expenditure sectors</p>
          </div>
        </div>
        <span className="text-xs text-slate-500 font-medium">Top {categories.length}</span>
      </div>

      <div className="space-y-3.5 my-2">
        {categories.map((item, idx) => {
          const color = colorPalette[idx % colorPalette.length]
          const isHovered = hoveredIndex === idx

          return (
            <div
              key={item.category}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`transition-all duration-150 rounded-lg p-1.5 -mx-1.5 ${
                isHovered ? 'bg-slate-50' : ''
              }`}
            >
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-slate-700 flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full inline-block"
                    style={{ backgroundColor: color }}
                  />
                  {item.category.replace('_', ' ')}
                </span>
                <span className="text-slate-500">
                  <span className="font-bold text-navy-900">{formatCurrency(item.amount)}</span>{' '}
                  <span className="text-slate-400 text-[11px]">({item.percentage}%)</span>
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
        <span>Total Analyzed</span>
        <span className="font-bold text-navy-900">{formatCurrency(totalSpent)}</span>
      </div>
    </div>
  )
}

/**
 * Loan Status Distribution
 */
export function LoanStatusChart({ loans = [] }) {
  const total = loans.length
  const pending = loans.filter((l) => l.status === 'PENDING').length
  const approved = loans.filter((l) => l.status === 'APPROVED').length
  const rejected = loans.filter((l) => l.status === 'REJECTED').length

  const pendingPct = total > 0 ? Math.round((pending / total) * 100) : 0
  const approvedPct = total > 0 ? Math.round((approved / total) * 100) : 0
  const rejectedPct = total > 0 ? 100 - pendingPct - approvedPct : 0

  return (
    <div className="fintech-card p-6 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-navy-900">Loan Status Breakdown</h3>
            <p className="text-xs text-slate-500">{total} total applications</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
          {total} Total
        </span>
      </div>

      {total === 0 ? (
        <div className="py-8 text-center text-slate-400 text-sm">
          No loan applications recorded yet
        </div>
      ) : (
        <div className="space-y-4 my-2">
          {/* Multi-segment bar */}
          <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden flex">
            {approved > 0 && (
              <div
                style={{ width: `${approvedPct}%` }}
                className="bg-emerald-500 h-full transition-all duration-500"
                title={`Approved: ${approved}`}
              />
            )}
            {pending > 0 && (
              <div
                style={{ width: `${pendingPct}%` }}
                className="bg-amber-500 h-full transition-all duration-500"
                title={`Pending: ${pending}`}
              />
            )}
            {rejected > 0 && (
              <div
                style={{ width: `${rejectedPct}%` }}
                className="bg-rose-500 h-full transition-all duration-500"
                title={`Rejected: ${rejected}`}
              />
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 text-center">
            <div className="rounded-xl bg-emerald-50/60 p-3 border border-emerald-100">
              <p className="text-xs font-medium text-emerald-700">Approved</p>
              <p className="text-xl font-bold text-emerald-900 mt-1">{approved}</p>
              <p className="text-[11px] text-emerald-600 font-medium">{approvedPct}%</p>
            </div>
            <div className="rounded-xl bg-amber-50/60 p-3 border border-amber-100">
              <p className="text-xs font-medium text-amber-700">Pending</p>
              <p className="text-xl font-bold text-amber-900 mt-1">{pending}</p>
              <p className="text-[11px] text-amber-600 font-medium">{pendingPct}%</p>
            </div>
            <div className="rounded-xl bg-rose-50/60 p-3 border border-rose-100">
              <p className="text-xs font-medium text-rose-700">Rejected</p>
              <p className="text-xl font-bold text-rose-900 mt-1">{rejected}</p>
              <p className="text-[11px] text-rose-600 font-medium">{rejectedPct}%</p>
            </div>
          </div>
        </div>
      )}

      <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
        <span>Approval Rate</span>
        <span className="font-bold text-navy-900">
          {total > 0 ? `${approvedPct}%` : 'N/A'}
        </span>
      </div>
    </div>
  )
}
