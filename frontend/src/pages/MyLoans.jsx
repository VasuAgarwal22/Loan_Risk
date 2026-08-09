import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getMyLoans, getErrorMessage } from '../api'

const statusColors = {
  PENDING: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-rose-100 text-rose-700',
}

const statusIcons = {
  PENDING: '⏳',
  APPROVED: '✅',
  REJECTED: '❌',
}

export default function MyLoans() {
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLoans()
  }, [])

  const loadLoans = async () => {
    try {
      const { data } = await getMyLoans()
      setLoans(data)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to load loans'))
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 flex flex-col items-center gap-3 text-slate-500">
        <svg className="h-8 w-8 animate-spin text-brand-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        Loading loans...
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="page-header flex items-center gap-2">
            <span className="text-2xl">🏦</span> My Loans
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {loans.length} application{loans.length === 1 ? '' : 's'} found
          </p>
        </div>
        <Link to="/apply-loan" className="btn-primary !w-auto !px-5 !py-2.5">
          + Apply for Loan
        </Link>
      </div>

      {loans.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center animate-fade-in-up">
          <span className="text-5xl">🏦</span>
          <p className="mt-4 text-slate-500">No loan applications yet.</p>
          <Link
            to="/apply-loan"
            className="inline-block mt-4 font-semibold text-brand-600 hover:text-brand-700"
          >
            Apply for your first loan →
          </Link>
        </div>
      ) : (
        <div className="glass-card rounded-3xl overflow-hidden animate-fade-in-up">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-brand-600 to-brand-500 text-white">
                <tr>
                  <th className="text-left px-5 py-3.5 font-semibold">ID</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Amount</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Tenure</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Interest</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Purpose</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Applied</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Status</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Risk</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr
                    key={loan.id}
                    className="border-t border-slate-100 transition-colors hover:bg-brand-50/50"
                  >
                    <td className="px-5 py-4 text-slate-500">#{loan.id}</td>
                    <td className="px-5 py-4 font-bold text-slate-800">₹{loan.loanAmount}</td>
                    <td className="px-5 py-4 text-slate-600">{loan.tenureMonths} mo</td>
                    <td className="px-5 py-4 text-slate-600">{loan.interestRate}%</td>
                    <td className="px-5 py-4 text-slate-600 max-w-[160px] truncate">{loan.purpose}</td>
                    <td className="px-5 py-4 text-slate-600 whitespace-nowrap">
                      {new Date(loan.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[loan.status] || 'bg-slate-100 text-slate-600'}`}
                      >
                        <span>{statusIcons[loan.status]}</span>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        to="/risk-assessment"
                        state={{ loanId: loan.id }}
                        className="inline-block rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-700"
                      >
                        Assess
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
