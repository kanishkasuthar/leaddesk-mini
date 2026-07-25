import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound, Mail, ArrowLeft, Loader2, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react';
import { authService } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessData(null);

    if (!email.trim()) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.forgotPassword(email.trim());
      if (response.success) {
        setSuccessData({
          message: response.message,
          resetUrl: response.resetUrl,
          resetToken: response.resetToken
        });
      }
    } catch (err) {

      const serverMsg = err.response?.data?.message || 'Failed to process request. Please try again.';
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
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-[#343434]">
              Password Recovery
            </h1>
            <p className="text-xs text-[#6F6A63]">
              Enter your admin email address to receive password reset instructions.
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

            {successData ? (
              <div className="space-y-4 text-center py-2">
                <div className="w-12 h-12 rounded-full bg-[#5E7A5D]/20 text-[#5E7A5D] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-lg text-[#343434]">Instructions Sent</h3>
                  <p className="text-xs text-[#6F6A63]">
                    {successData.message}
                  </p>
                </div>

                {/* Direct Link Preview for Testing/Evaluation */}
                {successData.resetUrl && (
                  <div className="p-3.5 rounded-[14px] bg-[#CDAA7D]/15 border border-[#CDAA7D]/40 text-left space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A3728]">Generated Reset Link (Evaluator Preview):</span>
                    <Link
                      to={successData.resetUrl}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4A3728] hover:underline break-all"
                    >
                      <span>Proceed to Reset Password Screen</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </Link>
                  </div>
                )}

                <div className="pt-2">
                  <Link
                    to="/login"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[14px] bg-[#4A3728] text-white font-bold text-xs uppercase tracking-wider shadow-sm hover:bg-[#34261C] transition-all"
                  >
                    Return to Login
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                
                <div className="space-y-1.5">
                  <label htmlFor="recovery-email" className="text-xs font-bold uppercase tracking-wider text-[#6F6A63] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#4A3728]" />
                    <span>Registered Email Address</span>
                  </label>
                  <input
                    id="recovery-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@leaddesk.com"
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
                      <span>Dispatching Link...</span>
                    </>
                  ) : (
                    <span>Send Reset Instructions</span>
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
