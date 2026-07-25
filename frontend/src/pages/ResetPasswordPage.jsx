import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { authService } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const validatePassword = () => {
    if (!newPassword) {
      setErrorMsg('Please enter your new password.');
      return false;
    }
    if (newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return false;
    }
    const hasLetter = /[A-Za-z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    if (!hasLetter || !hasNumber) {
      setErrorMsg('Password must contain at least one letter and one number.');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please recheck.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!validatePassword()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.resetPassword({
        token,
        newPassword
      });

      if (response.success) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      }
    } catch (err) {

      const serverMsg = err.response?.data?.message || 'Invalid or expired password reset link. Please request a new one.';
      setErrorMsg(serverMsg);
    } finally {
      setIsLoading(false);
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
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-[#343434]">
              Set New Password
            </h1>
            <p className="text-xs text-[#6F6A63]">
              Choose a strong password to secure your admin account.
            </p>
          </div>

          {/* Form Card */}
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

            {isSuccess ? (
              <div className="space-y-4 text-center py-4">
                <div className="w-12 h-12 rounded-full bg-[#5E7A5D]/20 text-[#5E7A5D] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-xl text-[#343434]">Password Reset Complete</h3>
                  <p className="text-xs text-[#6F6A63]">
                    Your password has been updated successfully. Redirecting you to login...
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    to="/login"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[14px] bg-[#4A3728] text-white font-bold text-xs uppercase tracking-wider shadow-sm hover:bg-[#34261C] transition-all"
                  >
                    Proceed to Login
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                
                {/* New Password */}
                <div className="space-y-1.5">
                  <label htmlFor="new-password" className="text-xs font-bold uppercase tracking-wider text-[#6F6A63] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#4A3728]" />
                    <span>New Password</span>
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters..."
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
                  <p className="text-[11px] text-[#6F6A63]">Must be at least 8 characters with letters & numbers.</p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label htmlFor="confirm-password" className="text-xs font-bold uppercase tracking-wider text-[#6F6A63] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#4A3728]" />
                    <span>Confirm New Password</span>
                  </label>
                  <input
                    id="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password..."
                    required
                    className="w-full px-4 py-3 rounded-[14px] bg-[#FFFFFF] border border-[#E5DDD3] text-xs text-[#343434] placeholder-[#9CA3AF] focus:outline-none focus:border-[#4A3728] focus:ring-2 focus:ring-[#4A3728]/10 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[16px] bg-[#4A3728] hover:bg-[#34261C] disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider shadow-espresso transition-all transform hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <span>Save New Password</span>
                  )}
                </button>

              </form>
            )}
          </motion.div>

          <div className="text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-xs font-semibold text-[#6F6A63] hover:text-[#4A3728] transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Executive Login</span>
            </Link>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
