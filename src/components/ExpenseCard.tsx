import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Calendar, Tag, FileText } from 'lucide-react';
import { Expense, ExpenseFormData } from '../types/expense';
import { ExpenseForm } from './ExpenseForm';

interface ExpenseCardProps {
  expense: Expense;
  onUpdate: (id: number, data: Partial<ExpenseFormData>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Food & Dining': 'bg-orange-100 text-orange-800',
      'Transportation': 'bg-blue-100 text-blue-800',
      'Shopping': 'bg-pink-100 text-pink-800',
      'Entertainment': 'bg-purple-100 text-purple-800',
      'Bills & Utilities': 'bg-red-100 text-red-800',
      'Healthcare': 'bg-green-100 text-green-800',
      'Travel': 'bg-indigo-100 text-indigo-800',
      'Education': 'bg-yellow-100 text-yellow-800',
      'Personal Care': 'bg-teal-100 text-teal-800',
      'Other': 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const handleEdit = async (data: ExpenseFormData) => {
    try {
      await onUpdate(expense.id, data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(expense.id);
    } catch (error) {
      console.error('Error deleting expense:', error);
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <ExpenseForm
        onSubmit={handleEdit}
        initialData={{
          title: expense.title,
          amount: expense.amount.toString(),
          category: expense.category,
          date: expense.date,
          description: expense.description || '',
        }}
        isEditing={true}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{expense.title}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(expense.date)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Tag className="w-4 h-4" />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                  {expense.category}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(expense.amount)}
            </div>
          </div>
        </div>

        {expense.description && (
          <div className="mb-4 p-3 bg-gray-50 rounded-xl">
            <div className="flex items-start space-x-2">
              <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
              <p className="text-sm text-gray-700">{expense.description}</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Created {formatDate(expense.createdAt)}
          </div>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsEditing(true)}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
              title="Edit expense"
            >
              <Edit2 className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
              title="Delete expense"
            >
              {isDeleting ? (
                <motion.div
                  className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};