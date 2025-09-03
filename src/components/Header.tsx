import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingDown } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl"
    >
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="relative">
              <Wallet className="w-10 h-10" />
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">ExpenseTracker</h1>
              <p className="text-indigo-100 text-sm">Manage your personal finances</p>
            </div>
          </motion.div>
          
          <motion.div
            className="hidden md:flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TrendingDown className="w-5 h-5" />
            <span className="text-sm font-medium">Track • Analyze • Save</span>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};