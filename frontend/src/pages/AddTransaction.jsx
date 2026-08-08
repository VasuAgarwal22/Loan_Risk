import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import TransactionForm from '../components/TransactionForm'
import { addTransaction } from '../api'

export default function AddTransaction() {
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (payload) => {
    setSubmitting(true)
    try {
      await addTransaction(payload)
      toast.success('Transaction added successfully!')
      navigate('/transactions')
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to add transaction'
      toast.error(Array.isArray(msg) ? msg[0] : msg)
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add Transaction</h1>
      <div className="bg-white rounded-xl shadow p-8">
        <TransactionForm onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </div>
  )
}
