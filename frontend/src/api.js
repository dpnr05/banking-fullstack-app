import axios from 'axios'

const api = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 5000
})

export async function listAccounts(){
  const r = await api.get('/accounts')
  return r.data
}

export async function createAccount(payload){
  const r = await api.post('/accounts', payload)
  return r.data
}

export async function transfer(payload){
  const r = await api.post('/transactions', payload)
  return r.data
}

export async function listTransactions(){
  const r = await api.get('/transactions')
  return r.data
}

export default api
