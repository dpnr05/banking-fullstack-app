import React, {useEffect, useState} from 'react'
import {listAccounts, createAccount, listTransactions} from '../api'

export default function Accounts(){
  const [accounts, setAccounts] = useState([])
  const [name, setName] = useState('')
  const [init, setInit] = useState('1000')
  const [tx, setTx] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load(){
    try {
      setLoading(true)
      setError(null)
      const [accountsData, txData] = await Promise.all([
        listAccounts(),
        listTransactions()
      ])
      setAccounts(accountsData)
      setTx(txData)
    } catch (err) {
      setError(err.message)
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ load() }, [])

  async function onCreate(e){
    e.preventDefault()
    if (!name.trim()) {
      alert('Please enter account name')
      return
    }
    try {
      await createAccount({name, initialBalance: init})
      setName('')
      setInit('1000')
      load()
    } catch (err) {
      alert('Failed to create account: ' + (err?.response?.data?.error || err.message))
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div>
      <h2>📊 Accounts</h2>
      <form onSubmit={onCreate} className="account-form">
        <input 
          placeholder="Account name" 
          value={name} 
          onChange={e=>setName(e.target.value)} 
        />
        <input 
          type="number"
          placeholder="Initial balance"
          value={init} 
          onChange={e=>setInit(e.target.value)} 
        />
        <button type="submit">Create Account</button>
      </form>
      
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Balance</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {accounts.length === 0 ? (
            <tr><td colSpan="4" style={{textAlign:'center'}}>No accounts yet</td></tr>
          ) : (
            accounts.map(a=> (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.name}</td>
                <td className="balance">${parseFloat(a.balance).toFixed(2)}</td>
                <td>{new Date(a.created_at).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h3 style={{marginTop:24}}>📝 Recent Transactions</h3>
      {tx.length === 0 ? (
        <p className="empty">No transactions yet</p>
      ) : (
        <ul className="transaction-list">
          {tx.map(t=> {
            const fromName = accounts.find(a => a.id === t.from_account_id)?.name || `Account ${t.from_account_id}`
            const toName = accounts.find(a => a.id === t.to_account_id)?.name || `Account ${t.to_account_id}`
            return (
              <li key={t.id}>
                <strong>#{t.id}</strong>: {fromName} → {toName} 
                <span className="amount">${parseFloat(t.amount).toFixed(2)}</span>
                <span className="time">{new Date(t.created_at).toLocaleString()}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
