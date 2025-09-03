const express = require('express');
const expenseController = require('../controllers/expenseController');

const router = express.Router();

// GET /api/expenses - Get all expenses with optional filtering
router.get('/', expenseController.getAllExpenses);

// GET /api/expenses/stats - Get expense statistics
router.get('/stats', expenseController.getStats);

// GET /api/expenses/:id - Get expense by ID
router.get('/:id', expenseController.getExpenseById);

// POST /api/expenses - Create new expense
router.post('/', expenseController.createExpense);

// PUT /api/expenses/:id - Update expense
router.put('/:id', expenseController.updateExpense);

// DELETE /api/expenses/:id - Delete expense
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;