import api from './axios'

// ---- Auth ----
export const registerUser = (data) => api.post('/auth/register', data)
export const loginUser = (data) => api.post('/auth/login', data)
export const getCurrentUser = () => api.get('/auth/me')

// ---- Transactions ----
export const getTransactions = () => api.get('/transactions')
export const addTransaction = (data) => api.post('/transactions', data)

// ---- Loans ----
export const applyForLoan = (data) => api.post('/loans', data)
export const getMyLoans = () => api.get('/loans')

// ---- Risk Assessment ----
export const calculateRisk = (loanId, data) => api.post(`/risk/${loanId}`, data)

// ---- Admin / Officer Portal ----
export const getAdminLoans = () => api.get('/admin/loans')
export const updateLoanStatus = (loanId, data) => api.put(`/admin/loans/${loanId}/status`, data)

// ---- Test (JWT check) ----
export const testAuth = () => api.get('/test')

// ---- Error helper ----
// Backend returns both plain strings (RuntimeException) and structured
// validation errors. Normalize into a readable message.
export const getErrorMessage = (err, fallback) => {
  const data = err?.response?.data
  if (typeof data === 'string' && data.trim()) return data
  if (data?.message) return data.message
  if (data?.error) return data.error
  if (Array.isArray(data)) return data[0] || fallback
  if (err?.response?.status === 401) return 'Session expired. Please login again.'
  if (err?.response?.status === 403) return 'Access denied. Bank Officer or Admin permissions required.'
  return fallback || 'Something went wrong. Please try again.'
}
