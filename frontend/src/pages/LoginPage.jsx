import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, Key, X, ArrowLeft } from 'lucide-react';
import { authService } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Forgot password modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const from = location.state?.from?.pathname || '/admin';

  const handleQuickFill = () => {
    setEmail('admin@leaddesk.com');
    setPassword('AdminPass123!');
    setErrorMsg('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email address and password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.login({
        email: email.trim(),
        password,
        rememberMe
      });

      if (response.success) {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      const serverMsg = err.response?.data?.message || 'Invalid email or password. Please verify credentials.';
      setErrorMsg(serverMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    try {
      await authService.forgotPassword(forgotEmail);
      setForgotSubmitted(true);
    } catch (err) {
      setForgotSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4EFE8] text-[#343434] flex flex-col font-sans selection:bg-[#4A3728] selection:text-white">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative bg-stationery-grid">
        
        <div className="w-full max-w-md space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-[16px] bg-[#4A3728] text-[#CDAA7D] flex items-center justify-center mx-auto shadow-espresso">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-[#343434]">
              Executive Login
            </h1>
            <p className="text-xs text-[#6F6A63]">
              Enter credentials to access the LeadDesk Mini workspace.
            </p>
          </div>

          {/* Quick Demo Credentials Hint Card */}
          <div className="p-3.5 rounded-[16px] bg-[#CDAA7D]/15 border border-[#CDAA7D]/40 flex items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5 text-left">
              <span className="font-bold text-[#4A3728]">Test Credentials:</span>
              <p className="text-[#6F6A63] text-[11px]">admin@leaddesk.com • AdminPass123!</p>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="px-3 py-1.5 rounded-xl bg-[#4A3728] hover:bg-[#34261C] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm transition-colors shrink-0"
            >
              Fill Credentials
            </button>
          </div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="sandstone-card p-8 border border-[#E5DDD3] shadow-sandstone relative"
          >
            
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-[14px] bg-[#A04E45]/10 border border-[#A04E45]/30 text-[#A04E45] text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} noValidate className="space-y-5">
              
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6F6A63] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#4A3728]" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@leaddesk.com"
                  required
                  className="w-full px-4 py-3 rounded-[14px] bg-[#FFFFFF] border border-[#E5DDD3] text-xs text-[#343434] placeholder-[#9CA3AF] focus:outline-none focus:border-[#4A3728] focus:ring-2 focus:ring-[#4A3728]/10 transition-all"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6F6A63] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#4A3728]" />
                    <span>Password</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotModalOpen(true);
                      setForgotSubmitted(false);
                      setForgotEmail(email);
                    }}
                    className="text-[11px] font-bold text-[#4A3728] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-4 pr-10 py-3 rounded-[14px] bg-[#FFFFFF] border border-[#E5DDD3] text-xs text-[#343434] placeholder-[#9CA3AF] focus:outline-none focus:border-[#4A3728] focus:ring-2 focus:ring-[#4A3728]/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F6A63] hover:text-[#343434]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-[#6F6A63] font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#4A3728] focus:ring-[#4A3728] border-[#E5DDD3] cursor-pointer"
                  />
                  <span>Remember Me (7 days session)</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[16px] bg-[#4A3728] hover:bg-[#34261C] disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider shadow-espresso transition-all transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4 text-[#CDAA7D]" />
                    <span>Sign In to Workspace</span>
                  </>
                )}
              </button>

            </form>
          </motion.div>

          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-[#6F6A63] hover:text-[#4A3728] transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Landing Page</span>
            </Link>
          </div>

        </div>

      </main>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {forgotModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setForgotModalOpen(false)}
              className="fixed inset-0 bg-[#343434]/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-[#FFFFFF] p-6 rounded-[20px] border border-[#E5DDD3] shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#E5DDD3] pb-3">
                <h3 className="font-heading font-bold text-base text-[#343434]">Forgot Password</h3>
                <button onClick={() => setForgotModalOpen(false)} className="text-[#6F6A63] hover:text-[#343434]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {forgotSubmitted ? (
                <div className="space-y-3 py-2 text-center">
                  <CheckCircle2 className="w-8 h-8 text-[#5E7A5D] mx-auto" />
                  <p className="text-xs text-[#6F6A63]">
                    Reset instructions dispatched to <span className="font-bold text-[#343434]">{forgotEmail}</span>. Check your inbox.
                  </p>
                  <button
                    onClick={() => setForgotModalOpen(false)}
                    className="w-full py-2 rounded-xl bg-[#4A3728] text-white text-xs font-bold uppercase tracking-wider"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <p className="text-xs text-[#6F6A63]">
                    Enter your admin email address to receive password recovery instructions.
                  </p>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="admin@leaddesk.com"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4EFE8] border border-[#E5DDD3] text-xs text-[#343434] focus:outline-none focus:border-[#4A3728]"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#4A3728] text-white text-xs font-bold uppercase tracking-wider shadow-sm"
                  >
                    Send Recovery Email
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
