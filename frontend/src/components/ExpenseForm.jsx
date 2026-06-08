import React, { useState, useEffect } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { X, Calendar, IndianRupee, Tag, FileText } from 'lucide-react';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Education', 'Healthcare', 'Other'];

const ExpenseForm = ({ isOpen, onClose, currentEditItem, setEditItem }) => {
  const { addExpense, updateExpense } = useExpenses();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().slice(0, 10),
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Hydrate fields if editing
  useEffect(() => {
    if (currentEditItem) {
      setFormData({
        title: currentEditItem.title,
        amount: currentEditItem.amount.toString(),
        category: currentEditItem.category,
        date: new Date(currentEditItem.date).toISOString().slice(0, 10),
        description: currentEditItem.description || '',
      });
      setFormError('');
    } else {
      setFormData({
        title: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().slice(0, 10),
        description: '',
      });
    }
  }, [currentEditItem, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Validations
    if (!formData.title.trim()) {
      return setFormError('Title is required');
    }
    if (formData.title.trim().length > 50) {
      return setFormError('Title must be 50 characters or less');
    }
    const numAmount = parseFloat(formData.amount);
    if (isNaN(numAmount) || numAmount <= 0 || numAmount > 100000000) {
      return setFormError('Amount must be a positive number up to 100M');
    }
    if (!formData.category) {
      return setFormError('Category is required');
    }
    if (formData.date > new Date().toISOString().slice(0, 10)) {
      return setFormError('Expense date cannot be in the future');
    }

    setIsSubmitting(true);
    let result;
    if (currentEditItem) {
      result = await updateExpense(currentEditItem._id, {
        ...formData,
        amount: numAmount,
      });
    } else {
      result = await addExpense({
        ...formData,
        amount: numAmount,
      });
    }

    setIsSubmitting(false);

    if (result.success) {
      handleClose();
    } else {
      setFormError(result.message || 'Something went wrong');
    }
  };

  const handleClose = () => {
    setEditItem(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg glass-panel rounded-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Decorative Top Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary-500 via-indigo-500 to-primary-600"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            {currentEditItem ? '✏️ Edit Expense' : '➕ Add Expense'}
          </h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {formError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-2 px-3 rounded-lg">
              {formError}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Title / Item
            </label>
            <div className="relative">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Grocery shopping"
                maxLength="50"
                className="w-full bg-slate-900 border border-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl py-2 px-3 text-slate-200 text-sm outline-none transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Amount and Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Amount (₹)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <IndianRupee className="h-4 w-4" />
                </div>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl py-2 pl-9 pr-3 text-slate-200 text-sm outline-none transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Tag className="h-4 w-4" />
                </div>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl py-2 pl-9 pr-3 text-slate-200 text-sm outline-none transition-all duration-200 appearance-none cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Calendar className="h-4 w-4" />
              </div>
              <input
                type="date"
                name="date"
                value={formData.date}
                max={new Date().toISOString().slice(0, 10)}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl py-2 pl-9 pr-3 text-slate-200 text-sm outline-none transition-all duration-200 cursor-pointer"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Description (Optional)
            </label>
            <div className="relative">
              <div className="absolute top-2.5 left-3 pointer-events-none text-slate-500">
                <FileText className="h-4 w-4" />
              </div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add notes about this transaction..."
                rows="3"
                className="w-full bg-slate-900 border border-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl py-2 pl-9 pr-3 text-slate-200 text-sm outline-none transition-all duration-200 resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-semibold rounded-xl border border-slate-800 hover:bg-slate-850 hover:text-slate-100 text-slate-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-primary-600 to-indigo-500 hover:from-primary-500 hover:to-indigo-400 shadow-md shadow-primary-600/20 hover:shadow-primary-600/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : currentEditItem ? 'Save Changes' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
