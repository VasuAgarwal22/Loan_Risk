/**
 * Currency, Date and Status Formatters for Loan Risk Management System
 */

export const formatCurrency = (val) => {
  if (val === null || val === undefined || isNaN(Number(val))) return '₹0'
  const num = Number(val)
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num)
}

export const formatCurrencyDetailed = (val) => {
  if (val === null || val === undefined || isNaN(Number(val))) return '₹0.00'
  const num = Number(val)
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

export const formatDate = (dateString) => {
  if (!dateString) return '—'
  try {
    const d = new Date(dateString)
    if (isNaN(d.getTime())) return String(dateString)
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return String(dateString)
  }
}

export const formatDateTime = (dateString) => {
  if (!dateString) return '—'
  try {
    const d = new Date(dateString)
    if (isNaN(d.getTime())) return String(dateString)
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return String(dateString)
  }
}

export const getTimeOfDayGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export const loanStatusConfig = {
  PENDING: {
    label: 'Pending',
    badge: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    dot: 'bg-amber-500',
  },
  APPROVED: {
    label: 'Approved',
    badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    dot: 'bg-emerald-500',
  },
  REJECTED: {
    label: 'Rejected',
    badge: 'bg-rose-50 text-rose-700 border border-rose-200/60',
    dot: 'bg-rose-500',
  },
}

export const transactionStatusConfig = {
  SUCCESS: {
    label: 'Success',
    badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    dot: 'bg-emerald-500',
  },
  PENDING: {
    label: 'Pending',
    badge: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    dot: 'bg-amber-500',
  },
  FAILED: {
    label: 'Failed',
    badge: 'bg-rose-50 text-rose-700 border border-rose-200/60',
    dot: 'bg-rose-500',
  },
}

export const riskLevelConfig = {
  LOW: {
    label: 'Low Risk',
    badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    border: 'border-emerald-500',
    ring: 'text-emerald-500',
    color: '#10B981',
    bgColor: 'bg-emerald-500',
    textColor: 'text-emerald-700',
  },
  MEDIUM: {
    label: 'Medium Risk',
    badge: 'bg-amber-50 text-amber-700 border border-amber-200',
    border: 'border-amber-500',
    ring: 'text-amber-500',
    color: '#F59E0B',
    bgColor: 'bg-amber-500',
    textColor: 'text-amber-700',
  },
  HIGH: {
    label: 'High Risk',
    badge: 'bg-rose-50 text-rose-700 border border-rose-200',
    border: 'border-rose-500',
    ring: 'text-rose-500',
    color: '#F43F5E',
    bgColor: 'bg-rose-500',
    textColor: 'text-rose-700',
  },
}
