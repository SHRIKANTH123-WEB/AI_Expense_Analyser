import React, { useState } from 'react';
import { 
  Brain, 
  Zap, 
  Shield, 
  Sparkles, 
  CheckCircle, 
  HelpCircle, 
  ChevronDown, 
  TrendingUp, 
  IndianRupee, 
  ArrowRight,
  PlusCircle,
  FileText,
  Sun,
  Moon,
  ToggleLeft,
  X,
  Lock,
  Layers,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Login from './Login';
import Register from './Register';

const Landing = ({ isRegistering, setIsRegistering }) => {
  const { theme, toggleTheme } = useTheme();
  
  // Local state to manage Auth Modal
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const openAuth = (mode) => {
    setIsRegistering(mode === 'register');
    setShowAuthModal(true);
  };

  const faqs = [
    {
      q: "How does the Gemini AI Expense Audit work?",
      a: "SpendWise integrates Google's Gemini API to analyze your expense patterns. It doesn't just categorize; it reads descriptions, identifies recurring waste, flags pricing anomalies, and writes natural language suggestions to optimize your monthly cashflow."
    },
    {
      q: "Is my financial data secure?",
      a: "Yes. Your transactions are tied to your private account and encrypted. The raw data is sent securely to the Gemini API only for processing, and no data is shared with third-party advertisers."
    },
    {
      q: "Does SpendWise support Indian Rupee (₹)?",
      a: "Absolutely. SpendWise is fully localized for Indian financial contexts. All metrics, inputs, charts, and AI advice are natively calculated and presented in Indian Rupees (₹)."
    },
    {
      q: "Can I toggle between Light and Dark modes?",
      a: "Yes. SpendWise features a highly sophisticated global inverted grayscale filter. You can switch between Light and Dark mode seamlessly, ensuring accessibility while maintaining a professional, placement-ready presentation aesthetic."
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#040815] overflow-y-auto text-slate-200 font-sans selection:bg-brand-green selection:text-white transition-colors duration-300">
      
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-green/10 blur-[130px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[130px] rounded-full animate-pulse-slow delay-1000"></div>
        <div className="absolute top-[35%] left-[55%] w-[35%] h-[35%] bg-slate-500/5 blur-[100px] rounded-full animate-pulse-slow delay-2000"></div>
      </div>

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none"></div>

      {/* Header Bar */}
      <header className="relative z-20 flex items-center justify-between px-6 py-5 lg:px-12 border-b border-slate-900/60 bg-[#040815]/80 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-3">
          <div className="bg-brand-green/10 border border-brand-green/20 p-2.5 rounded-xl text-brand-green flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.25)]">
            <Brain className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
            SpendWise <span className="text-[10px] bg-brand-green/10 text-brand-green px-2 py-0.5 rounded border border-brand-green/20 font-bold uppercase tracking-wider">AI</span>
          </span>
        </div>

        {/* Navbar Controls: Theme Toggler & Auth Triggers */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Theme Selector Pill */}
          <div className="flex items-center bg-slate-900/80 border border-slate-800 rounded-xl p-1 gap-1">
            <button 
              onClick={() => toggleTheme('dark')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${theme === 'dark' ? 'bg-brand-green text-white shadow-sm' : 'text-slate-500 hover:text-slate-350'}`}
              title="Dark Mode"
            >
              <Moon className="h-3.5 w-3.5" />
            </button>
            <button 
              onClick={() => toggleTheme('light')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${theme === 'light' ? 'bg-brand-green text-white shadow-sm' : 'text-slate-500 hover:text-slate-350'}`}
              title="Light Mode"
            >
              <Sun className="h-3.5 w-3.5" />
            </button>
            <button 
              onClick={() => toggleTheme('grayscale')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${theme === 'grayscale' ? 'bg-brand-green text-white shadow-sm' : 'text-slate-500 hover:text-slate-350'}`}
              title="Grayscale Contrast"
            >
              <ToggleLeft className="h-3.5 w-3.5" />
            </button>
          </div>

          <button 
            onClick={() => openAuth('login')}
            className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-900 border border-slate-850 hover:border-brand-green/30 rounded-xl transition-all cursor-pointer"
          >
            Log In
          </button>
          
          <button 
            onClick={() => openAuth('register')}
            className="px-4 py-2 text-xs font-bold text-white bg-brand-green hover:bg-emerald-600 rounded-xl transition-all cursor-pointer hidden sm:block shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-16 lg:pt-16 lg:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Copy/Value Proposition */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left">
          {/* Accent Badge */}
          <div className="inline-flex self-start items-center gap-2 px-3 py-1.5 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green text-[10px] font-extrabold uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(16,185,129,0.1)] animate-float">
            <Sparkles className="h-3 w-3" />
            Empowering Smart Financial Audits
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-5 animate-slide-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            Automate Financial Analysis with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.2)]">AI Diagnostics</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl mb-8 leading-relaxed animate-slide-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            Stop sorting sheets manually. SpendWise embeds generative Large Language Models to analyze transactions, grade overall financial efficiency, and suggest custom cost savings in real-time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10 animate-slide-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            <button 
              onClick={() => openAuth('register')}
              className="group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-green hover:bg-emerald-600 text-white font-extrabold rounded-xl transition-all shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:shadow-[0_0_35px_rgba(16,185,129,0.4)] cursor-pointer hover:scale-[1.02]"
            >
              Initialize AI Engine
              <ArrowRight className="h-4.5 w-4.5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => openAuth('login')}
              className="px-6 py-3.5 bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold rounded-xl transition-all cursor-pointer"
            >
              Sign In to Account
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 border-t border-slate-900 pt-8 max-w-lg animate-slide-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            <div>
              <div className="text-2xl font-black text-white">₹3,400+</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Avg. Monthly Save</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">100%</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Data Privacy</div>
            </div>
            <div>
              <div className="text-2xl font-black text-brand-green">Gemini 1.5</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">AI Audit Core</div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Mock Dashboard Preview Panel */}
        <div className="lg:col-span-5 flex justify-center w-full relative animate-float">
          
          <div className="w-full max-w-md glass-panel rounded-3xl p-6 border border-slate-800/80 bg-slate-950/40 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
            {/* Top Accent */}
            <div className="h-1 w-full bg-gradient-to-r from-brand-green to-emerald-400 absolute top-0 left-0"></div>
            
            {/* Mock Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-900">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-brand-green animate-pulse"></div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest">Active Audit Session</span>
              </div>
              <span className="text-[9px] bg-brand-green/10 border border-brand-green/20 text-brand-green px-2 py-0.5 rounded font-bold">140ms Ping</span>
            </div>

            {/* Dashboard Mock Cards */}
            <div className="space-y-4">
              
              {/* Stat card 1 */}
              <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Optimized Net Saving</p>
                  <h3 className="text-lg font-black text-white mt-0.5">₹12,450.00</h3>
                </div>
                <div className="bg-brand-green/10 text-brand-green p-2.5 rounded-xl border border-brand-green/20">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>

              {/* Progress Graph Mock */}
              <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Monthly Budget Efficiency</p>
                  <span className="text-[10px] font-bold text-brand-green">84% Optimal</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900">
                  <div className="h-full bg-brand-green rounded-full shadow-[0_0_10px_rgba(16,185,129,0.6)]" style={{ width: '84%' }}></div>
                </div>
              </div>

              {/* Live activity line */}
              <div className="bg-slate-900/30 border border-slate-850/60 p-3 rounded-2xl flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Activity className="h-4 w-4 animate-pulse" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-slate-300 leading-tight"><strong>Gemini AI</strong>: "Detected subscription leakage in food orders. Recommended action active."</p>
                </div>
              </div>

            </div>

            {/* Glowing Orbs */}
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-brand-green/5 rounded-full blur-2xl group-hover:bg-brand-green/15 transition-colors"></div>
          </div>
        </div>
      </section>

      {/* Simulated AI Expense Audit Panel (Showcase Feature) */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 border-t border-slate-900/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white">
            See the Gemini AI Audit in Action
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Here is a mock review demonstrating how the AI evaluates typical monthly expenditures
          </p>
        </div>

        {/* Audit Simulator Card */}
        <div className="glass-panel rounded-3xl p-6 lg:p-8 max-w-4xl mx-auto border border-slate-800/80 bg-slate-950/20 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-green/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Mock Logged Expenses */}
            <div className="w-full md:w-1/2 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
                <PlusCircle className="h-4 w-4 text-brand-green" /> Simulated Transaction Feed
              </h3>
              
              <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-2xl flex items-center justify-between hover:border-slate-755 transition-colors">
                <div>
                  <h4 className="text-xs font-bold text-white">Daily Starbucks Cappuccino</h4>
                  <p className="text-[10px] text-slate-500">Food & Drink • Recurring</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-white">₹4,250</span>
                  <p className="text-[8px] text-slate-500">This Month</p>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-2xl flex items-center justify-between hover:border-slate-755 transition-colors">
                <div>
                  <h4 className="text-xs font-bold text-white">Gym Premium Membership</h4>
                  <p className="text-[10px] text-slate-500">Health & Wellness • Monthly</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-white">₹2,500</span>
                  <p className="text-[8px] text-slate-500">Fixed Cost</p>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-2xl flex items-center justify-between hover:border-slate-755 transition-colors">
                <div>
                  <h4 className="text-xs font-bold text-white">Weekend Uber Premier Rides</h4>
                  <p className="text-[10px] text-slate-500">Transport • Variable</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-white">₹3,400</span>
                  <p className="text-[8px] text-slate-500">This Month</p>
                </div>
              </div>
            </div>

            {/* AI Auditor Output */}
            <div className="w-full md:w-1/2 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4.5 w-4.5 text-brand-green animate-pulse" />
                  <span className="text-xs font-bold text-white tracking-wide">Gemini Financial Audit</span>
                </div>
                <span className="text-[8px] bg-brand-green/20 text-brand-green px-2 py-0.5 rounded border border-brand-green/30 font-bold uppercase tracking-widest">Active</span>
              </div>

              <div className="space-y-4 flex-1">
                <div className="text-xs text-slate-300 leading-relaxed border-l-2 border-brand-green pl-3">
                  <strong>AI Analysis Summary:</strong> "Your overall spending score is <strong>B-</strong>. We identified optimization opportunities that can recover up to <strong>₹3,800/month</strong> without impacting your standard of living."
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-300 p-2 rounded-xl">
                    ⚠️ <strong>High Coffee Waste:</strong> Daily coffee totals ₹4,250. Switching to an office espresso machine or local artisanal beans could save <strong>₹2,800</strong> monthly.
                  </div>
                  <div className="text-[10px] bg-brand-green/10 border border-brand-green/20 text-brand-green p-2 rounded-xl">
                    ✅ <strong>Healthy Spend:</strong> Gym Membership (₹2,500) represents a highly efficient investment in health, correlating positively with workspace productivity.
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800/80 pt-3 mt-4 text-[10px] text-slate-500 flex items-center justify-between">
                <span>Calculations updated in 140ms</span>
                <span className="text-brand-green font-bold flex items-center gap-0.5">₹3,800 Potential Save <TrendingUp className="h-3 w-3" /></span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Timeline Section: How it Works */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 border-t border-slate-900/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white">
            Simple 3-Step Integration
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Our optimized database and AI processor automate your budget optimization in seconds
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          
          <div className="flex flex-col items-start p-6 bg-slate-950/20 border border-slate-900 rounded-2xl relative overflow-hidden group hover:border-slate-800 transition-colors">
            <span className="text-4xl font-black text-slate-800/50 group-hover:text-brand-green/30 transition-colors mb-4">01</span>
            <h3 className="text-base font-bold text-white mb-2">Ingest Expenses</h3>
            <p className="text-xs text-slate-450 leading-relaxed">
              Create categories and log your transactions with ease. The input matches your locale currency in Indian Rupees (₹).
            </p>
          </div>

          <div className="flex flex-col items-start p-6 bg-slate-950/20 border border-slate-900 rounded-2xl relative overflow-hidden group hover:border-slate-800 transition-colors">
            <span className="text-4xl font-black text-slate-800/50 group-hover:text-brand-green/30 transition-colors mb-4">02</span>
            <h3 className="text-base font-bold text-white mb-2">Initialize AI Audit</h3>
            <p className="text-xs text-slate-450 leading-relaxed">
              Click the Gemini Audit button. The engine reviews your data and runs dynamic vector assessments to audit your habits.
            </p>
          </div>

          <div className="flex flex-col items-start p-6 bg-slate-950/20 border border-slate-900 rounded-2xl relative overflow-hidden group hover:border-slate-800 transition-colors">
            <span className="text-4xl font-black text-slate-800/50 group-hover:text-brand-green/30 transition-colors mb-4">03</span>
            <h3 className="text-base font-bold text-white mb-2">Optimize Cashflow</h3>
            <p className="text-xs text-slate-450 leading-relaxed">
              Review natural language advice, analyze expense charts, and apply adjustments to meet your financial goals.
            </p>
          </div>

        </div>
      </section>

      {/* Grid of Key Product Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 border-t border-slate-900/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white">
            Engineered for Placement Excellence
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Advanced features designed to demonstrate high technical competency
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          
          <div className="glass-panel p-5 rounded-2xl border border-slate-900 bg-slate-950/10 hover:border-brand-green/30 transition-all">
            <div className="h-10 w-10 bg-brand-green/10 text-brand-green rounded-xl flex items-center justify-center border border-brand-green/20 mb-3 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
              <Brain className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1.5">Google Gemini API</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Uses Google LLM models to provide natural language advice and audit transaction feeds.</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-900 bg-slate-950/10 hover:border-brand-green/30 transition-all">
            <div className="h-10 w-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-500/20 mb-3">
              <IndianRupee className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1.5">Indian Rupee Localization</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Fully structured in ₹, avoiding dollar placeholders to fit local placement panel needs.</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-900 bg-slate-950/10 hover:border-brand-green/30 transition-all">
            <div className="h-10 w-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/20 mb-3">
              <Shield className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1.5">Secure JWT Architecture</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Implements JSON Web Token verification to secure API channels and isolate database queries.</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-900 bg-slate-950/10 hover:border-brand-green/30 transition-all">
            <div className="h-10 w-10 bg-slate-800/50 text-slate-350 rounded-xl flex items-center justify-center border border-slate-700/50 mb-3">
              <Zap className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1.5">Interactive Charts</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Integrates clean responsive visualizations using Tailwind to graph spending trends by category.</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-900 bg-slate-950/10 hover:border-brand-green/30 transition-all">
            <div className="h-10 w-10 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center border border-amber-500/20 mb-3">
              <CheckCircle className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1.5">Grayscale Accessibility</h4>
            <p className="text-xs text-slate-400 leading-relaxed">A clean grayscale theme filter guarantees high contrast readability and a premium layout.</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-900 bg-slate-950/10 hover:border-brand-green/30 transition-all">
            <div className="h-10 w-10 bg-teal-500/10 text-teal-400 rounded-xl flex items-center justify-center border border-teal-500/20 mb-3">
              <FileText className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1.5">Structured Database</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Backed by optimized MongoDB schemas to provide rapid query response times.</p>
          </div>

        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-16 border-t border-slate-900/80">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-extrabold text-white flex items-center justify-center gap-2">
            <HelpCircle className="h-6 w-6 text-brand-green" /> Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-400 mt-2">Find answers to key technical questions about SpendWise AI</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index}
                className="border border-slate-800 bg-slate-950/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-slate-700"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-sm text-white hover:bg-slate-900/40 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <div 
                  className={`transition-all duration-350 overflow-hidden ${isOpen ? 'max-h-40 border-t border-slate-900/60' : 'max-h-0'}`}
                >
                  <div className="px-6 py-4 text-xs text-slate-400 leading-relaxed bg-slate-950/25">
                    {faq.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/40 py-10 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-brand-green/10 text-brand-green rounded flex items-center justify-center font-bold text-[10px]">SW</div>
            <span className="font-extrabold text-white text-sm">SpendWise AI</span>
          </div>
          <p className="text-[11px]">&copy; 2026 SpendWise AI Expense Analyzer. Placement Presentation Prototype.</p>
          <div className="flex gap-4">
            <span className="hover:text-white transition-colors cursor-default">Privacy</span>
            <span className="hover:text-white transition-colors cursor-default">Terms</span>
            <span className="hover:text-white transition-colors cursor-default">Documentation</span>
          </div>
        </div>
      </footer>

      {/* Modal Authentication Overlay */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          {/* Modal Background click to close */}
          <div className="absolute inset-0 cursor-default" onClick={() => setShowAuthModal(false)}></div>
          
          {/* Modal Content container */}
          <div className="relative w-full max-w-md animate-scale-in z-10 flex flex-col items-center">
            
            {/* Close Button on top of card */}
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-900/80 border border-slate-800/80 bg-slate-950/60 z-20 cursor-pointer transition-colors"
              title="Close Panel"
            >
              <X className="h-4 w-4" />
            </button>

            {isRegistering ? (
              <Register onNavigateToLogin={() => setIsRegistering(false)} />
            ) : (
              <Login onNavigateToRegister={() => setIsRegistering(true)} />
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Landing;
