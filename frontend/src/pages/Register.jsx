import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';

const Register = ({ onNavigateToLogin }) => {
  const { register, error: authError, setError } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    // Basic Validations
    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      return setFormError('All fields are required');
    }
    if (formData.username.trim().length < 3) {
      return setFormError('Username must be at least 3 characters');
    }
    if (formData.password.length < 6) {
      return setFormError('Password must be at least 6 characters');
    }
    if (formData.password !== formData.confirmPassword) {
      return setFormError('Passwords do not match');
    }

    setIsSubmitting(true);
    const result = await register(
      formData.username.trim(),
      formData.email.trim().toLowerCase(),
      formData.password
    );
    setIsSubmitting(false);

    if (!result.success) {
      setFormError(result.message || 'Registration failed');
    }
  };

  return (
    <div className="w-full max-w-md glass-panel rounded-3xl p-8 shadow-2xl relative overflow-hidden border border-slate-800/80 bg-slate-950/40 backdrop-blur-xl">
      {/* Top Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-brand-green to-emerald-400 absolute top-0 left-0"></div>

      {/* Brand */}
      <div className="text-center mb-5">
        <div className="inline-flex bg-brand-green/10 p-3 rounded-2xl text-brand-green border border-brand-green/20 mb-3 items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <Sparkles className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-extrabold tracking-tight text-white">
          Create Account
        </h2>
        <p className="text-slate-400 text-xs mt-1">
          Start auditing your expenses with AI precision
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {(formError || authError) && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-2 px-3 rounded-xl flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{formError || authError}</span>
          </div>
        )}

        {/* Username */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <User className="h-4 w-4" />
            </div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="e.g. johndoe"
              className="w-full bg-slate-900/60 border border-slate-800 focus:border-brand-green/50 focus:ring-1 focus:ring-brand-green/50 rounded-xl py-2 pl-9 pr-4 text-slate-200 text-sm outline-none transition-all duration-200"
              required
            />
          </div>
        </div>

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

        {/* Confirm Password */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-slate-900/60 border border-slate-800 focus:border-brand-green/50 focus:ring-1 focus:ring-brand-green/50 rounded-xl py-2 pl-9 pr-10 text-slate-200 text-sm outline-none transition-all duration-200"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 mt-2 text-sm font-bold text-white rounded-xl bg-brand-green hover:bg-emerald-600 shadow-lg shadow-brand-green/20 hover:shadow-brand-green/30 transition-all duration-200 disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? 'Creating Account...' : 'Get Started'}
        </button>
      </form>

      {/* Redirect */}
      <div className="text-center mt-5 text-xs text-slate-400">
        Already have an account?{' '}
        <button
          onClick={() => {
            setError(null);
            onNavigateToLogin();
          }}
          className="text-brand-green font-bold hover:underline cursor-pointer"
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default Register;
