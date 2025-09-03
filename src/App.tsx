import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { ExpenseForm } from './components/ExpenseForm';
import { FilterBar } from './components/FilterBar';
import { ExpenseList } from './components/ExpenseList';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { useExpenses } from './hooks/useExpenses';
import { apiService } from './services/api';

function App() {
  const {
    expenses,
    stats,
    loading,
    error,
    createExpense,
    updateExpense,
    deleteExpense,
    refreshExpenses,
    filterExpenses,
  } = useExpenses();

  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const isHealthy = await apiService.checkHealth();
        setServerStatus(isHealthy ? 'online' : 'offline');
      } catch {
        setServerStatus('offline');
      }
    };

    checkServerStatus();
    const interval = setInterval(checkServerStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (serverStatus === 'offline') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Header />
        <div className="container mx-auto px-6 py-8">
          <ErrorMessage
            message="Unable to connect to the server. Please make sure the backend is running on port 3001."
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Server Status Indicator */}
          <AnimatePresence>
            {serverStatus === 'checking' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-lg mb-6 text-center"
              >
                Connecting to server...
              </motion.div>
            )}
          </AnimatePresence>

          {/* Statistics Cards */}
          <StatsCards stats={stats} loading={loading} />

          {/* Add Expense Form */}
          <ExpenseForm onSubmit={createExpense} />

          {/* Filter Bar */}
          <FilterBar onFilter={filterExpenses} />

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-xl mb-6"
              >
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expense List */}
          {loading && expenses.length === 0 ? (
            <LoadingSpinner />
          ) : (
            <ExpenseList
              expenses={expenses}
              loading={loading}
              onUpdate={updateExpense}
              onDelete={deleteExpense}
            />
          )}
        </motion.div>
      </main>
    </div>
  );
}

export default App;