import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const ExpenseContext = createContext(null);

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Track active filters to reuse them during data synchronization
  const [activeFilters, setActiveFilters] = useState({
    search: '',
    category: 'All',
    startDate: '',
    endDate: ''
  });

  // AI report states
  const [aiReports, setAiReports] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);

  const fetchExpenses = async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    // Merge filters and preserve them in state
    const mergedFilters = { ...activeFilters, ...filters };
    setActiveFilters(mergedFilters);

    try {
      const params = {};
      if (mergedFilters.search) params.search = mergedFilters.search;
      if (mergedFilters.category && mergedFilters.category !== 'All') params.category = mergedFilters.category;
      if (mergedFilters.startDate) params.startDate = mergedFilters.startDate;
      if (mergedFilters.endDate) params.endDate = mergedFilters.endDate;

      const res = await axios.get('/api/expenses', { params });
      setExpenses(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching expenses');
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expenseData) => {
    setError(null);
    try {
      const res = await axios.post('/api/expenses', expenseData);
      // Synchronize state with database using active filters
      await fetchExpenses(activeFilters);
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error adding expense';
      setError(errMsg);
      return { success: false, message: errMsg };
    }
  };

  const updateExpense = async (id, expenseData) => {
    setError(null);
    try {
      const res = await axios.put(`/api/expenses/${id}`, expenseData);
      // Synchronize state with database using active filters
      await fetchExpenses(activeFilters);
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error updating expense';
      setError(errMsg);
      return { success: false, message: errMsg };
    }
  };

  const deleteExpense = async (id) => {
    setError(null);
    try {
      await axios.delete(`/api/expenses/${id}`);
      // Synchronize state with database using active filters
      await fetchExpenses(activeFilters);
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error deleting expense';
      setError(errMsg);
      return { success: false, message: errMsg };
    }
  };

  const fetchAIReports = async () => {
    try {
      const res = await axios.get('/api/ai/reports');
      setAiReports(res.data);
      if (res.data.length > 0 && !currentReport) {
        setCurrentReport(res.data[0]);
      }
    } catch (err) {
      console.error('Error fetching AI reports:', err);
    }
  };

  const analyzeSpending = async () => {
    setAiLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/ai/analyze');
      setCurrentReport(res.data);
      setAiReports((prev) => [res.data, ...prev]);
      return { success: true, report: res.data };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to generate AI analysis.';
      setError(errMsg);
      return { success: false, message: errMsg };
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        loading,
        error,
        aiReports,
        aiLoading,
        currentReport,
        setCurrentReport,
        fetchExpenses,
        addExpense,
        updateExpense,
        deleteExpense,
        fetchAIReports,
        analyzeSpending,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => useContext(ExpenseContext);
