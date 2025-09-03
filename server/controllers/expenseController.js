const Expense = require('../models/Expense');

// In-memory storage (replace with database in production)
let expenses = [];
let nextId = 1;

const expenseController = {
  // Get all expenses with optional filtering
  getAllExpenses: (req, res) => {
    try {
      let filteredExpenses = [...expenses];
      
      // Filter by category
      if (req.query.category && req.query.category !== 'all') {
        filteredExpenses = filteredExpenses.filter(
          expense => expense.category.toLowerCase() === req.query.category.toLowerCase()
        );
      }
      
      // Filter by date range
      if (req.query.startDate) {
        filteredExpenses = filteredExpenses.filter(
          expense => new Date(expense.date) >= new Date(req.query.startDate)
        );
      }
      
      if (req.query.endDate) {
        filteredExpenses = filteredExpenses.filter(
          expense => new Date(expense.date) <= new Date(req.query.endDate)
        );
      }
      
      // Sort by date (newest first)
      filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      res.json({
        success: true,
        data: filteredExpenses,
        total: filteredExpenses.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching expenses',
        error: error.message
      });
    }
  },

  // Get expense by ID
  getExpenseById: (req, res) => {
    try {
      const expense = expenses.find(exp => exp.id === parseInt(req.params.id));
      
      if (!expense) {
        return res.status(404).json({
          success: false,
          message: 'Expense not found'
        });
      }
      
      res.json({
        success: true,
        data: expense
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching expense',
        error: error.message
      });
    }
  },

  // Create new expense
  createExpense: (req, res) => {
    try {
      const validationErrors = Expense.validate(req.body);
      
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        });
      }
      
      const expense = new Expense(
        nextId++,
        req.body.title,
        req.body.amount,
        req.body.category,
        req.body.date,
        req.body.description
      );
      
      expenses.push(expense);
      
      res.status(201).json({
        success: true,
        message: 'Expense created successfully',
        data: expense
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating expense',
        error: error.message
      });
    }
  },

  // Update expense
  updateExpense: (req, res) => {
    try {
      const expense = expenses.find(exp => exp.id === parseInt(req.params.id));
      
      if (!expense) {
        return res.status(404).json({
          success: false,
          message: 'Expense not found'
        });
      }
      
      const validationErrors = Expense.validate({ ...expense, ...req.body });
      
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        });
      }
      
      expense.update(req.body);
      
      res.json({
        success: true,
        message: 'Expense updated successfully',
        data: expense
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating expense',
        error: error.message
      });
    }
  },

  // Delete expense
  deleteExpense: (req, res) => {
    try {
      const expenseIndex = expenses.findIndex(exp => exp.id === parseInt(req.params.id));
      
      if (expenseIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Expense not found'
        });
      }
      
      const deletedExpense = expenses.splice(expenseIndex, 1)[0];
      
      res.json({
        success: true,
        message: 'Expense deleted successfully',
        data: deletedExpense
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting expense',
        error: error.message
      });
    }
  },

  // Get expense statistics
  getStats: (req, res) => {
    try {
      const totalExpenses = expenses.length;
      const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      // Category breakdown
      const categoryStats = expenses.reduce((stats, expense) => {
        if (!stats[expense.category]) {
          stats[expense.category] = { count: 0, amount: 0 };
        }
        stats[expense.category].count++;
        stats[expense.category].amount += expense.amount;
        return stats;
      }, {});
      
      // Monthly breakdown
      const monthlyStats = expenses.reduce((stats, expense) => {
        const month = new Date(expense.date).toISOString().slice(0, 7); // YYYY-MM
        if (!stats[month]) {
          stats[month] = { count: 0, amount: 0 };
        }
        stats[month].count++;
        stats[month].amount += expense.amount;
        return stats;
      }, {});
      
      res.json({
        success: true,
        data: {
          totalExpenses,
          totalAmount,
          averageAmount: totalExpenses > 0 ? totalAmount / totalExpenses : 0,
          categoryStats,
          monthlyStats
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching statistics',
        error: error.message
      });
    }
  }
};

module.exports = expenseController;