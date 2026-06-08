import React from 'react';
import { Menu, Sparkles, User, CreditCard, Moon, Sun, Monitor } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="lg:hidden sticky top-0 z-40 w-full bg-[#0C1226] border-b border-slate-900/60 backdrop-blur-md px-4 sm:px-6">
      <div className="flex h-16 items-center justify-between">
        {/* Left Side: Toggle Sidebar Menu */}
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Center: Brand (mobile view only) */}
        <div className="flex items-center gap-2">
          <div className="bg-brand-green/10 border border-brand-green/20 p-2 rounded-xl text-brand-green flex items-center justify-center">
            <CreditCard className="h-4.5 w-4.5" />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white">
            SpendWise <span className="text-[8px] bg-brand-green/20 text-brand-green px-1 py-0.5 rounded border border-brand-green/25 font-bold uppercase tracking-wider">AI</span>
          </span>
        </div>

        {/* Right Side: Account & Theme Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-0.5">
            <button onClick={() => toggleTheme('dark')} className={`p-1.5 rounded-lg ${theme === 'dark' ? 'bg-brand-green/20 text-brand-green' : 'text-slate-400'}`}>
              <Moon className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => toggleTheme('light')} className={`p-1.5 rounded-lg ${theme === 'light' ? 'bg-brand-green/20 text-brand-green' : 'text-slate-400'}`}>
              <Sun className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => toggleTheme('grayscale')} className={`p-1.5 rounded-lg ${theme === 'grayscale' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}>
              <Monitor className="h-3.5 w-3.5" />
            </button>
          </div>
          {user && (
            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-brand-green border border-slate-700">
              <User className="h-4 w-4" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
