const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/expenseSplitter', { useNewUrlParser: true, useUnifiedTopology: true });

// Define Expense schema and model
const expenseSchema = new mongoose.Schema({
  amount: Number,
  paidBy: String,
  splitAmong: [String]
});
const Expense = mongoose.model('Expense', expenseSchema);

// Add new member route
app.post('/api/members', (req, res) => {
  const { name } = req.body;
  res.json({ message: `Member ${name} added successfully!` });
});

// Add new expense route
app.post('/api/expenses', async (req, res) => {
  const { amount, paidBy, splitAmong } = req.body;
  const expense = new Expense({ amount, paidBy, splitAmong });
  await expense.save();
  res.json({ message: 'Expense added successfully!' });
});

// Get recent expenses route
app.get('/api/expenses/recent', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ _id: -1 }).limit(10); // Fetch recent 10 expenses
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent expenses', error });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
