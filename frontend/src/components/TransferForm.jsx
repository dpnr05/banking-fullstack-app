import React, {useState, useEffect} from 'react'
import {transfer, listAccounts} from '../api'

export default function TransferForm({onSuccess}){
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    listAccounts().then(setAccounts).catch(console.error)
  }, [])

  async function onSubmit(e){
    e.preventDefault()
    
    if (!from || !to || !amount) {
      alert('Please fill all fields')
      return
    }
    
    if (from === to) {
      alert('Cannot transfer to the same account')
      return
    }

    setLoading(true)
    try {
      await transfer({
        from_account_id: Number(from), 
        to_account_id: Number(to), 
        amount: Number(amount)
      })
      alert('✅ Transfer successful!')
      setFrom('')
      setTo('')
      setAmount('')
      if (onSuccess) onSuccess()
    } catch (err) {
      const msg = err?.response?.data?.error || err.message
      alert('❌ Transfer failed: ' + msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="transfer-section">
      <h2>💸 Transfer Money</h2>
      <form onSubmit={onSubmit} className="transfer-form">
        <div className="form-row">
          <select value={from} onChange={e=>setFrom(e.target.value)} disabled={loading}>
            <option value="">From account</option>
            {accounts.map(a=> (
              <option key={a.id} value={a.id}>
                {a.name} (${parseFloat(a.balance).toFixed(2)})
              </option>
            ))}
          </select>
          
          <select value={to} onChange={e=>setTo(e.target.value)} disabled={loading}>
            <option value="">To account</option>
            {accounts.map(a=> (
              <option key={a.id} value={a.id}>
                {a.name} (${parseFloat(a.balance).toFixed(2)})
              </option>
            ))}
          </select>
          
          <input 
            type="number" 
            step="0.01"
            min="0.01"
            placeholder="Amount" 
            value={amount} 
            onChange={e=>setAmount(e.target.value)}
            disabled={loading}
          />
          
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Transfer'}
          </button>
        </div>
      </form>
    </div>
  )
}
