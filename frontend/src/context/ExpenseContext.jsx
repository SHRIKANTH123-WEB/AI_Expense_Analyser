import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const ExpenseContext = createContext(null);

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // AI report states
  const [aiReports, setAiReports] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);

  const fetchExpenses = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category && filters.category !== 'All') params.category = filters.category;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

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
      setExpenses((prev) => [res.data, ...prev]);
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
      setExpenses((prev) =>
        prev.map((exp) => (exp._id === id ? res.data : exp))
      );
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
      setExpenses((prev) => prev.filter((exp) => exp._id !== id));
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
