import React from 'react'
import Accounts from './components/Accounts'
import TransferForm from './components/TransferForm'

export default function App(){
  const [refreshKey, setRefreshKey] = React.useState(0)

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="container">
      <h1>🏦 Banking Sample</h1>
      <p className="subtitle">React + Node.js + MySQL Fullstack Demo</p>
      
      <TransferForm onSuccess={handleRefresh} />
      <hr />
      <Accounts key={refreshKey} />
    </div>
  )
}
