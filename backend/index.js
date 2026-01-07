const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./db');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Health check
app.get('/api/health', (req, res) => res.json({status: 'ok'}));

// Get all accounts
app.get('/api/accounts', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, balance, created_at FROM accounts ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'internal_error'});
  }
});

// Get single account
app.get('/api/accounts/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [rows] = await pool.query('SELECT id, name, balance, created_at FROM accounts WHERE id=?', [id]);
    if (!rows.length) return res.status(404).json({error: 'not_found'});
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'internal_error'});
  }
});

// Create new account
app.post('/api/accounts', async (req, res) => {
  try {
    const {name, initialBalance} = req.body;
    if (!name) return res.status(400).json({error: 'name_required'});
    const balance = Number(initialBalance || 0).toFixed(2);
    const [result] = await pool.query('INSERT INTO accounts (name, balance) VALUES (?, ?)', [name, balance]);
    const [rows] = await pool.query('SELECT id, name, balance, created_at FROM accounts WHERE id=?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'internal_error'});
  }
});

// Transfer funds between accounts (with transaction)
app.post('/api/transactions', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const {from_account_id, to_account_id, amount} = req.body;
    const aFrom = Number(from_account_id);
    const aTo = Number(to_account_id);
    const amt = Number(amount);
    
    if (!amt || amt <= 0) return res.status(400).json({error: 'invalid_amount'});
    if (aFrom === aTo) return res.status(400).json({error: 'same_account'});
    
    await conn.beginTransaction();

    // Lock and check balances
    const [[fromRow]] = await conn.query('SELECT id, balance FROM accounts WHERE id=? FOR UPDATE', [aFrom]);
    const [[toRow]] = await conn.query('SELECT id, balance FROM accounts WHERE id=? FOR UPDATE', [aTo]);
    
    if (!fromRow || !toRow) {
      await conn.rollback();
      return res.status(404).json({error: 'account_not_found'});
    }
    
    const fromBal = Number(fromRow.balance);
    if (fromBal < amt) {
      await conn.rollback();
      return res.status(400).json({error: 'insufficient_funds'});
    }

    // Update balances
    const newFrom = (fromBal - amt).toFixed(2);
    const newTo = (Number(toRow.balance) + amt).toFixed(2);
    await conn.query('UPDATE accounts SET balance=? WHERE id=?', [newFrom, aFrom]);
    await conn.query('UPDATE accounts SET balance=? WHERE id=?', [newTo, aTo]);

    // Insert transaction record
    const [txResult] = await conn.query('INSERT INTO transactions (from_account_id, to_account_id, amount) VALUES (?, ?, ?)', [aFrom, aTo, amt.toFixed(2)]);
    
    await conn.commit();
    res.status(201).json({status: 'ok', transaction_id: txResult.insertId});
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({error: 'internal_error'});
  } finally {
    conn.release();
  }
});

// Get transaction history
app.get('/api/transactions', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, from_account_id, to_account_id, amount, created_at FROM transactions ORDER BY id DESC LIMIT 100');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'internal_error'});
  }
});

app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
