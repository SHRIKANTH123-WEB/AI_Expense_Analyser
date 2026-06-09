import React, { useState, useEffect } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { Edit2, Trash2, Search, Filter, Calendar, Download, RefreshCw, AlertTriangle } from 'lucide-react';

const CATEGORIES = ['All', 'Food', 'Transport', 'Shopping', 'Entertainment', 'Education', 'Healthcare', 'Other'];

const ExpenseList = ({ onEdit }) => {
  const { expenses, loading, fetchExpenses, deleteExpense } = useExpenses();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  useEffect(() => {
    fetchExpenses({ search, category, startDate, endDate });
  }, [category, startDate, endDate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchExpenses({ search, category, startDate, endDate });
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setStartDate('');
    setEndDate('');
    fetchExpenses({ search: '', category: 'All', startDate: '', endDate: '' });
  };

  const confirmDelete = (exp) => {
    setExpenseToDelete(exp);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (expenseToDelete) {
      await deleteExpense(expenseToDelete._id);
      setDeleteModalOpen(false);
      setExpenseToDelete(null);
    }
  };

  const exportToCSV = () => {
    if (expenses.length === 0) return;
    
    const headers = ['Date', 'Title', 'Category', 'Amount (₹)', 'Description'];
    const rows = expenses.map((exp) => [
      new Date(exp.date).toLocaleDateString(),
      `"${exp.title.replace(/"/g, '""')}"`,
      exp.category,
      (typeof exp.amount === 'number' ? exp.amount : parseFloat(exp.amount) || 0).toFixed(2),
      `"${(exp.description || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SpendWise_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getBadgeStyle = (cat) => {
    switch (cat) {
      case 'Food': return 'bg-brand-green/10 text-brand-green border border-brand-green/20';
      case 'Shopping': return 'bg-brand-orange/10 text-brand-orange border border-brand-orange/20';
      case 'Transport': return 'bg-blue-500/10 text-blue-450 border border-blue-500/20';
      case 'Entertainment': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'Education': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'Healthcare': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 space-y-5">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900/60 pb-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Transaction History
          </h3>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">
            Review detailed transactions logs
          </p>
        </div>

        <div className="flex items-center gap-2">
          {expenses.length > 0 && (
            <button
              onClick={exportToCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 hover:border-brand-green/30 hover:bg-brand-green/5 text-slate-300 hover:text-brand-green transition-all duration-200 text-xs font-semibold cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </button>
          )}
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 hover:bg-slate-800/40 text-slate-400 hover:text-slate-200 transition-all duration-200 text-xs cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Filter Filters */}
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/40 border border-slate-850 focus:border-brand-green/45 focus:ring-0 rounded-xl py-2 pl-9 pr-3 text-slate-250 text-xs outline-none transition-all duration-200"
          />
          <button type="submit" className="absolute left-3 top-2.5 text-slate-500 hover:text-slate-350 cursor-pointer">
            <Search className="h-4 w-4" />
          </button>
        </div>

        <div className="relative">
          <div className="absolute left-3 top-2.5 text-slate-500 pointer-events-none">
            <Filter className="h-4 w-4" />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-900/40 border border-slate-850 focus:border-brand-green/45 focus:ring-0 rounded-xl py-2 pl-9 pr-3 text-slate-250 text-xs outline-none transition-all duration-200 appearance-none cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        <div className="relative col-span-1 sm:col-span-2 grid grid-cols-2 gap-2">
          <div className="relative">
            <div className="absolute left-2.5 top-2.5 text-slate-500 pointer-events-none">
              <Calendar className="h-3.5 w-3.5" />
            </div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-900/40 border border-slate-850 focus:border-brand-green/45 focus:ring-0 rounded-xl py-2 pl-8 pr-2 text-slate-300 text-[10px] sm:text-xs outline-none cursor-pointer"
            />
          </div>
          <div className="relative">
            <div className="absolute left-2.5 top-2.5 text-slate-500 pointer-events-none">
              <Calendar className="h-3.5 w-3.5" />
            </div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-900/40 border border-slate-850 focus:border-brand-green/45 focus:ring-0 rounded-xl py-2 pl-8 pr-2 text-slate-300 text-[10px] sm:text-xs outline-none cursor-pointer"
            />
          </div>
        </div>
      </form>

      {/* Grid List Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-900/60">
        {loading ? (
          <div className="p-8 flex items-center justify-center gap-2 text-slate-500 text-xs font-semibold">
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-brand-green" />
            Loading transaction logs...
          </div>
        ) : expenses.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/25 border-b border-slate-900/60 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60 text-xs">
              {expenses.map((exp) => (
                <tr key={exp._id} className="hover:bg-slate-900/10 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-200">
                    {exp.title}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${getBadgeStyle(exp.category)}`}>
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-medium">
                    {new Date(exp.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-white text-right text-sm">
                    ₹{(typeof exp.amount === 'number' ? exp.amount : parseFloat(exp.amount) || 0).toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onEdit(exp)}
                        className="p-1.5 rounded-lg border border-slate-800 hover:border-brand-green/20 text-slate-500 hover:text-brand-green hover:bg-brand-green/5 transition-all cursor-pointer"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => confirmDelete(exp)}
                        className="p-1.5 rounded-lg border border-slate-800 hover:border-brand-orange/20 text-slate-500 hover:text-brand-orange hover:bg-brand-orange/5 transition-all cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-10 flex flex-col items-center justify-center text-center">
            <span className="text-2xl mb-2">🔎</span>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">No logs recorded</h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Add transactions or reset filters to display data here.
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm glass-panel rounded-2xl shadow-2xl p-6 relative border border-slate-800 flex flex-col items-center text-center animate-slide-in">
            <div className="h-12 w-12 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange mb-4 border border-brand-orange/20">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Delete Expense?</h3>
            <p className="text-slate-400 text-sm mb-6">
              Are you sure you want to delete <span className="font-semibold text-slate-300">"{expenseToDelete?.title}"</span>? This action cannot be undone.
            </p>
            <div className="flex w-full gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-2 rounded-xl text-sm font-semibold border border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 rounded-xl text-sm font-semibold bg-brand-orange hover:bg-brand-orange/90 text-white shadow-md shadow-brand-orange/10 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
