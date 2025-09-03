import { useState, useEffect, useCallback } from 'react';
import { Expense, ExpenseFormData, ExpenseStats } from '../types/expense';
import { apiService } from '../services/api';

interface UseExpensesReturn {
  expenses: Expense[];
  stats: ExpenseStats | null;
  loading: boolean;
  error: string | null;
  createExpense: (data: ExpenseFormData) => Promise<void>;
  updateExpense: (id: number, data: Partial<ExpenseFormData>) => Promise<void>;
  deleteExpense: (id: number) => Promise<void>;
  refreshExpenses: () => Promise<void>;
  filterExpenses: (filters: {
    category?: string;
    startDate?: string;
    endDate?: string;
  }) => Promise<void>;
}

export const useExpenses = (): UseExpensesReturn => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState<ExpenseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshExpenses = useCallback(async (filters?: {
    category?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      const [expensesData, statsData] = await Promise.all([
        apiService.getExpenses(filters),
        apiService.getStats()
      ]);
      
      setExpenses(expensesData);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch expenses');
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createExpense = useCallback(async (data: ExpenseFormData) => {
    try {
      setError(null);
      await apiService.createExpense(data);
      await refreshExpenses();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create expense';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [refreshExpenses]);

  const updateExpense = useCallback(async (id: number, data: Partial<ExpenseFormData>) => {
    try {
      setError(null);
      await apiService.updateExpense(id, data);
      await refreshExpenses();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update expense';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [refreshExpenses]);

  const deleteExpense = useCallback(async (id: number) => {
    try {
      setError(null);
      await apiService.deleteExpense(id);
      await refreshExpenses();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete expense';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [refreshExpenses]);

  const filterExpenses = useCallback(async (filters: {
    category?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    await refreshExpenses(filters);
  }, [refreshExpenses]);

  useEffect(() => {
    refreshExpenses();
  }, [refreshExpenses]);

  return {
    expenses,
    stats,
    loading,
    error,
    createExpense,
    updateExpense,
    deleteExpense,
    refreshExpenses,
    filterExpenses,
  };
};