import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

const Login = ({ onNavigateToRegister }) => {
  const { login, error: authError, setError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setError(null);

    if (!formData.email.trim() || !formData.password.trim()) {
      return setFormError('All fields are required');
    }

    setIsSubmitting(true);
    const result = await login(
      formData.email.trim().toLowerCase(),
      formData.password
    );
    setIsSubmitting(false);

    if (!result.success) {
      setFormError(result.message || 'Login failed. Verify credentials.');
    }
  };

  return (
    <div className="w-full max-w-md glass-panel rounded-3xl p-8 shadow-2xl relative overflow-hidden border border-slate-800/80 bg-slate-950/40 backdrop-blur-xl">
      {/* Top Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-brand-green to-emerald-400 absolute top-0 left-0"></div>

      {/* Brand */}
      <div className="text-center mb-6">
        <div className="inline-flex bg-brand-green/10 p-3 rounded-2xl text-brand-green border border-brand-green/20 mb-3 items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <Sparkles className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-extrabold tracking-tight text-white">
          Access AI Engine
        </h2>
        <p className="text-slate-400 text-xs mt-1">
          Sign in to audit your financial records
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {(formError || authError) && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-2 px-3 rounded-xl flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{formError || authError}</span>
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full bg-slate-900/60 border border-slate-800 focus:border-brand-green/50 focus:ring-1 focus:ring-brand-green/50 rounded-xl py-2 pl-9 pr-4 text-slate-200 text-sm outline-none transition-all duration-200"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-slate-900/60 border border-slate-800 focus:border-brand-green/50 focus:ring-1 focus:ring-brand-green/50 rounded-xl py-2 pl-9 pr-9 text-slate-200 text-sm outline-none transition-all duration-200"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-350"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 mt-2 text-sm font-bold text-white rounded-xl bg-brand-green hover:bg-emerald-600 shadow-lg shadow-brand-green/20 hover:shadow-brand-green/30 transition-all duration-200 disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}
        </button>
      </form>

      {/* Redirect */}
      <div className="text-center mt-5 text-xs text-slate-400">
        New to SpendWise?{' '}
        <button
          onClick={() => {
            setError(null);
            onNavigateToRegister();
          }}
          className="text-brand-green font-bold hover:underline cursor-pointer"
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

export default Login;
