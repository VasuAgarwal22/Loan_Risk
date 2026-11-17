import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react'

export const DESIGNATED_OFFICER_EMAIL = 'ujjawal@gmail.com'

export default function OfficerRoute({ children }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const isDesignatedOfficer =
    user?.email?.toLowerCase() === DESIGNATED_OFFICER_EMAIL.toLowerCase() &&
    (user?.role === 'BANK_OFFICER' || user?.role === 'ADMIN')

  if (!isDesignatedOfficer) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="fintech-card p-8 sm:p-10 space-y-5">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-navy-900">
              Admin & Officer Portal Access Restricted
            </h1>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              This administrative underwriting portal is strictly designated for authorized Bank Officer{' '}
              <span className="font-semibold text-navy-900 bg-slate-100 px-2 py-0.5 rounded">
                {DESIGNATED_OFFICER_EMAIL}
              </span>
              .
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-600 text-left space-y-2 max-w-md mx-auto">
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <Lock className="h-4 w-4 text-amber-500" />
              <span>Officer Credentials</span>
            </div>
            <p className="text-slate-500">
              Please sign in with the designated officer account:
            </p>
            <div className="bg-slate-900 text-slate-200 p-3 rounded-lg text-xs space-y-1 font-mono">
              <p><span className="text-slate-400">Email:</span> {DESIGNATED_OFFICER_EMAIL}</p>
              <p><span className="text-slate-400">Password:</span> 12345678</p>
              <p><span className="text-slate-400">Role:</span> BANK_OFFICER</p>
            </div>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <Link to="/" className="btn-secondary gap-2 text-xs">
              <ArrowLeft className="h-4 w-4" />
              <span>Customer Dashboard</span>
            </Link>
            <Link to="/login" className="btn-primary gap-2 text-xs">
              <span>Sign in as Officer</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return children
}
