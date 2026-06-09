import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LayoutDashboard, Brain, LogOut, Plus, Sparkles, User, CreditCard, Moon, Sun, Monitor } from 'lucide-react';

const Sidebar = ({ onAddExpenseClick, isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Mobile Overlay backdrop */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        ></div>
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-[#0C1226] border-r border-slate-900/60 transform lg:transform-none transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center px-6 border-b border-slate-900/60 gap-3">
          <div className="bg-brand-green/10 border border-brand-green/20 p-2 rounded-xl text-brand-green flex items-center justify-center">
            <CreditCard className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1">
              SpendWise <span className="text-[9px] bg-brand-green/20 text-brand-green px-1.5 py-0.5 rounded border border-brand-green/25 font-bold uppercase tracking-wider">AI</span>
            </span>
          </div>
        </div>

        {/* Action button */}
        <div className="p-4">
          <button
            onClick={() => {
              onAddExpenseClick();
              if (isOpen) toggleSidebar();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white rounded-xl bg-brand-green hover:bg-brand-green/90 shadow-md shadow-brand-green/10 hover:-translate-y-0.5 transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            Add Expense
          </button>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold active-nav-link"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard Overview
          </a>
          <a
            href="#recent-transactions"
            onClick={() => isOpen && toggleSidebar()}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors"
          >
            <CreditCard className="h-4 w-4" />
            Transaction History
          </a>
          <a
            href="#ai-insights"
            onClick={() => isOpen && toggleSidebar()}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors"
          >
            <Brain className="h-4 w-4" />
            AI Spending Audit
          </a>
        </nav>

        {/* Theme Switcher */}
        <div className="px-4 py-3 border-t border-slate-900/60 flex items-center justify-between gap-2">
          <button
            onClick={() => toggleTheme('dark')}
            className={`p-2 rounded-xl flex-1 flex justify-center items-center gap-1.5 transition-colors ${theme === 'dark' ? 'bg-brand-green/20 text-brand-green border border-brand-green/30' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'}`}
            title="Dark Mode"
          >
            <Moon className="h-4 w-4" />
          </button>
          <button
            onClick={() => toggleTheme('light')}
            className={`p-2 rounded-xl flex-1 flex justify-center items-center gap-1.5 transition-colors ${theme === 'light' ? 'bg-brand-green/20 text-brand-green border border-brand-green/30' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'}`}
            title="Light Mode"
          >
            <Sun className="h-4 w-4" />
          </button>
          <button
            onClick={() => toggleTheme('grayscale')}
            className={`p-2 rounded-xl flex-1 flex justify-center items-center gap-1.5 transition-colors ${theme === 'grayscale' ? 'bg-slate-700/50 text-white border border-slate-600' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'}`}
            title="Grayscale"
          >
            <Monitor className="h-4 w-4" />
          </button>
        </div>

        {/* Footer User Card */}
        {user && (
          <div className="p-4 border-t border-slate-900/60 flex flex-col gap-3">
            <div className="flex items-center gap-3 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/20">
              <div className="h-9 w-9 rounded-full bg-slate-850 flex items-center justify-center text-brand-green border border-slate-850">
                <User className="h-4.5 w-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate capitalize">
                  {user.username}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold border border-slate-800 hover:border-brand-orange/20 hover:bg-brand-orange/5 text-slate-400 hover:text-brand-orange rounded-xl transition-all duration-200"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout Session
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
