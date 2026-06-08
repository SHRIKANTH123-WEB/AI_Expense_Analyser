import React from 'react';
import { IndianRupee, Calendar, TrendingUp, PiggyBank, ArrowUpRight } from 'lucide-react';

const StatsCards = ({ expenses }) => {
  // Calculate analytics
  const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const monthlyExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
  });

  const monthlyTotal = monthlyExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  
  // Set standard budget limit
  const monthlyBudget = 1500;
  const budgetPercentage = Math.min(100, Math.round((monthlyTotal / monthlyBudget) * 100));

  // Determine highest spending category
  const categories = {};
  expenses.forEach(exp => {
    categories[exp.category] = (categories[exp.category] || 0) + exp.amount;
  });

  let highestCat = 'N/A';
  let highestAmount = 0;
  Object.entries(categories).forEach(([cat, amt]) => {
    if (amt > highestAmount) {
      highestAmount = amt;
      highestCat = cat;
    }
  });

  const average = expenses.length > 0 ? total / expenses.length : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* 1. Total Spending (White highlight) */}
      <div className="glass-panel rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between h-32 transition-all duration-200 hover:border-slate-800">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Capital Outlay
          </span>
          <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800/80 text-slate-400">
            <IndianRupee className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2">
          <span className="text-3xl font-extrabold tracking-tight text-white font-sans">
            ₹{total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-brand-green font-bold flex items-center gap-0.5"><ArrowUpRight className="h-3 w-3 inline" /> {expenses.length}</span> transaction logs
          </p>
        </div>
      </div>

      {/* 2. Monthly Budget Status (Green Glow) */}
      <div className="glass-panel rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between h-32 transition-all duration-200 hover:border-slate-800">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Monthly Target
          </span>
          <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800/80 text-brand-green">
            <Calendar className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2">
          <div className="flex justify-between items-baseline">
            <span className="text-3xl font-extrabold tracking-tight text-white font-sans">
              ₹{monthlyTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className={`text-[10px] font-bold ${budgetPercentage > 85 ? 'text-brand-orange' : 'text-brand-green'}`}>
              {budgetPercentage}%
            </span>
          </div>
          <div className="mt-2">
            <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  budgetPercentage > 85 ? 'bg-brand-orange' : 'bg-brand-green'
                }`}
                style={{ width: `${budgetPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-[9px] text-slate-500 mt-1">
              <span>Limit: ₹{monthlyBudget}</span>
              <span>Remaining: ₹{Math.max(0, monthlyBudget - monthlyTotal).toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Outlier Category (Orange Accent) */}
      <div className="glass-panel rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between h-32 transition-all duration-200 hover:border-slate-800">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Highest Category
          </span>
          <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800/80 text-brand-orange">
            <TrendingUp className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2">
          <span className="text-3xl font-extrabold tracking-tight text-white font-sans truncate block pr-6">
            {highestCat}
          </span>
          <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
            <span>Spent: <strong className="text-brand-orange font-bold">₹{highestAmount.toFixed(0)}</strong></span>
            {total > 0 && (
              <span className="bg-brand-orange/10 border border-brand-orange/15 text-brand-orange px-1.5 py-0.2 rounded text-[9px] font-semibold">
                {Math.round((highestAmount / total) * 100)}% share
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4. Average Size */}
      <div className="glass-panel rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between h-32 transition-all duration-200 hover:border-slate-800">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Average Expense
          </span>
          <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800/80 text-slate-400">
            <PiggyBank className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-2">
          <span className="text-3xl font-extrabold tracking-tight text-white font-sans">
            ₹{average.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <p className="text-[10px] text-slate-500 mt-1">
            Average size per transaction log
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
