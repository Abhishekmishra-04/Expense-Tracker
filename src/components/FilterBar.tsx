import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Calendar, Tag, RotateCcw } from 'lucide-react';
import { EXPENSE_CATEGORIES } from '../types/expense';

interface FilterBarProps {
  onFilter: (filters: {
    category?: string;
    startDate?: string;
    endDate?: string;
  }) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: '',
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Apply filters
    const activeFilters: any = {};
    if (newFilters.category) activeFilters.category = newFilters.category;
    if (newFilters.startDate) activeFilters.startDate = newFilters.startDate;
    if (newFilters.endDate) activeFilters.endDate = newFilters.endDate;
    
    onFilter(activeFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { category: '', startDate: '', endDate: '' };
    setFilters(clearedFilters);
    onFilter({});
  };

  const hasActiveFilters = filters.category || filters.startDate || filters.endDate;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filter Expenses</h3>
        </div>
        {hasActiveFilters && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearFilters}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear Filters</span>
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <Tag className="w-4 h-4" />
            <span>Category</span>
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">All Categories</option>
            {EXPENSE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4" />
            <span>Start Date</span>
          </label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4" />
            <span>End Date</span>
          </label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>
    </motion.div>
  );
};