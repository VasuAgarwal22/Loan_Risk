import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import OfficerRoute from './components/OfficerRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import AddTransaction from './pages/AddTransaction'
import ApplyLoan from './pages/ApplyLoan'
import MyLoans from './pages/MyLoans'
import RiskAssessment from './pages/RiskAssessment'
import OfficerPortal from './pages/OfficerPortal'
import { ShieldCheck, Lock } from 'lucide-react'

export default function App() {
  const location = useLocation()

  // Ensure no unwanted residual text selection remains when navigating or loading
  useEffect(() => {
    if (typeof window !== 'undefined' && window.getSelection) {
      const selection = window.getSelection()
      if (selection && selection.removeAllRanges) {
        selection.removeAllRanges()
      }
    }
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col bg-surface text-slate-800">
      <Navbar />
      <main className="flex-1 pb-16">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-transaction"
            element={
              <ProtectedRoute>
                <AddTransaction />
              </ProtectedRoute>
            }
          />
          <Route
            path="/apply-loan"
            element={
              <ProtectedRoute>
                <ApplyLoan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-loans"
            element={
              <ProtectedRoute>
                <MyLoans />
              </ProtectedRoute>
            }
          />
          <Route
            path="/risk-assessment"
            element={
              <ProtectedRoute>
                <RiskAssessment />
              </ProtectedRoute>
            }
          />
          {/* Bank Officer & Administrator Underwriting Portal */}
          <Route
            path="/officer-portal"
            element={
              <OfficerRoute>
                <OfficerPortal />
              </OfficerRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <OfficerRoute>
                <OfficerPortal />
              </OfficerRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Enterprise Fintech Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary-500" />
            <span className="font-semibold text-navy-900">ApexRisk Intelligence</span>
            <span>· Credit Risk Assessment & Automated Lending</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <Lock className="h-3 w-3" />
              256-bit SSL Protected
            </span>
            <span>•</span>
            <span>RBI/NBFC Compliant Principles</span>
            <span>•</span>
            <span>&copy; {new Date().getFullYear()} All Rights Reserved</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
