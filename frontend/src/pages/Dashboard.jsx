import React, { useState, useEffect } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatsCards from '../components/StatsCards';
import ChartsSection from '../components/ChartsSection';
import ExpenseList from '../components/ExpenseList';
import AISpan from '../components/AISpan';
import ExpenseForm from '../components/ExpenseForm';
import { Plus, Sparkles, RefreshCw, Layers } from 'lucide-react';

const Dashboard = () => {
  const { expenses, fetchExpenses, loading } = useExpenses();
  const { user } = useAuth();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initial fetch on mount
  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleEditTrigger = (item) => {
    setEditItem(item);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditItem(null);
    setIsFormOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex bg-brand-bg font-sans">
      {/* Desktop & Mobile Left Sidebar */}
      <Sidebar
        onAddExpenseClick={() => setIsFormOpen(true)}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main Content Layout Container */}
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen w-full">
        {/* Mobile Header */}
        <Navbar onToggleSidebar={toggleSidebar} />

        {/* Dashboard Frame */}
        <main className="bg-brand-inner flex-1 px-4 sm:px-6 lg:px-8 py-8 space-y-6 overflow-y-auto animate-slide-in">
          {/* Welcome Dashboard Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] bg-brand-green/15 text-brand-green border border-brand-green/20 font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 w-fit uppercase tracking-widest mb-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-green animate-pulse"></span> Live Auditing Connected
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent flex items-center gap-2">
                Finance Command Center
              </h1>
              <p className="text-slate-400 text-xs mt-1">
                Monitored account: <strong className="text-slate-350 capitalize">{user?.username}</strong> ({user?.email})
              </p>
            </div>

            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center justify-center gap-1.5 px-4.5 py-2.5 text-xs font-bold text-white rounded-xl bg-brand-green hover:bg-brand-green/90 shadow-lg shadow-brand-green/10 hover:-translate-y-0.5 transition-all duration-200 shrink-0 self-start sm:self-center cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add Expense
            </button>
          </div>

          {/* KPI metrics cards */}
          <StatsCards expenses={expenses} />

          {/* Analytical Charts */}
          <ChartsSection expenses={expenses} />

          {/* Tabular logs and AI Audit split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Recent list panel */}
            <div id="recent-transactions" className="lg:col-span-2 scroll-mt-20">
              <ExpenseList onEdit={handleEditTrigger} />
            </div>

            {/* AI Audits card */}
            <div id="ai-insights" className="lg:col-span-1 scroll-mt-20">
              <AISpan />
            </div>
          </div>
        </main>
      </div>

      {/* Slideout/Drawer Dialog */}
      <ExpenseForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        currentEditItem={editItem}
        setEditItem={setEditItem}
      />
    </div>
  );
};

export default Dashboard;
