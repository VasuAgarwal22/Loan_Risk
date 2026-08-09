import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import AddTransaction from './pages/AddTransaction'
import ApplyLoan from './pages/ApplyLoan'
import MyLoans from './pages/MyLoans'
import RiskAssessment from './pages/RiskAssessment'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="border-t border-white/20 mt-10">
        <div className="h-px bg-gradient-to-r from-transparent via-brand-400/50 to-transparent" />
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <span className="text-sm text-slate-500">
            Loan Risk Predictor · Spring Boot + React
          </span>
          <span className="text-xs text-slate-400">
            Built with <span className="text-brand-500">♥</span> for smarter credit decisions
          </span>
        </div>
      </footer>
    </div>
  )
}
