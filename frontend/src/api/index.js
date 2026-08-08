import api from './axios'

// ---- Auth ----
export const registerUser = (data) => api.post('/auth/register', data)
export const loginUser = (data) => api.post('/auth/login', data)

// ---- Transactions ----
export const getTransactions = () => api.get('/transactions')
export const addTransaction = (data) => api.post('/transactions', data)

// ---- Test (JWT check) ----
export const testAuth = () => api.get('/test')
