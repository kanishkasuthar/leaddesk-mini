import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, User, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { authService } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Password Complexity Indicator Checks
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[@$!%*#?&]/.test(password);

  const criteriaCount = [hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  
  let strengthLabel = 'Weak';
  let strengthColor = 'bg-[#A04E45]';
  let strengthWidth = '20%';

  if (criteriaCount === 5) {
    strengthLabel = 'Strong';
    strengthColor = 'bg-[#5E7A5D]';
    strengthWidth = '100%';
  } else if (criteriaCount >= 3) {
    strengthLabel = 'Medium';
    strengthColor = 'bg-[#CDAA7D]';
    strengthWidth = `${(criteriaCount / 5) * 100}%`;
  } else if (criteriaCount > 0) {
    strengthWidth = `${(criteriaCount / 5) * 100}%`;
  } else {
    strengthWidth = '0%';
  }

  // Persistent Session Check: Redirect logged-in admins straight to dashboard
  useEffect(() => {
    const existingToken = authService.getToken();
    if (existingToken) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const validateForm = () => {
    const errs = {};

    if (!name.trim()) {
      errs.name = 'Full Name is required';
    }

    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errs.email = 'Please enter a valid email address';
      }
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (!hasMinLength || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      errs.password = 'Password must meet all complexity requirements';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.register({
        name: name.trim(),
        email: email.trim(),
        password,
        confirmPassword
      });

      if (response.success) {
        setSuccessMsg(response.message || 'Admin account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login', { state: { registeredEmail: email.trim() } });
        }, 1800);
      }
    } catch (err) {

      const serverMsg = err.response?.data?.message || 'Failed to create admin account. Please try again.';
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
              <UserPlus className="w-6 h-6" />
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#343434]">
              Admin Registration
            </h1>
            <p className="text-xs sm:text-sm text-[#6F6A63]">
              Create a new executive admin account for LeadDesk Mini.
            </p>
          </div>

          {/* Editorial Card */}
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

            {successMsg && (
              <div className="mb-5 p-3.5 rounded-[14px] bg-[#5E7A5D]/10 border border-[#5E7A5D]/30 text-[#5E7A5D] text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleRegister} noValidate className="space-y-4">

              {/* Full Name Field */}
              <div className="space-y-1.5">
                <label htmlFor="reg-name" className="text-xs font-bold uppercase tracking-wider text-[#6F6A63] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#4A3728]" />
                  <span>Full Name</span>
                </label>
                <input
                  id="reg-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: '' }));
                  }}
                  placeholder="e.g. Executive Officer"
                  required
                  disabled={isLoading}
                  className={`w-full px-4 py-3 rounded-[14px] bg-[#FFFFFF] border text-xs text-[#343434] placeholder-[#9CA3AF] focus:outline-none transition-all disabled:opacity-60 ${
                    fieldErrors.name
                      ? 'border-[#A04E45] ring-2 ring-[#A04E45]/10'
                      : 'border-[#E5DDD3] focus:border-[#4A3728] focus:ring-2 focus:ring-[#4A3728]/10'
                  }`}
                />
                {fieldErrors.name && (
                  <p className="text-[11px] text-[#A04E45] font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{fieldErrors.name}</span>
                  </p>
                )}
              </div>

              {/* Email Address Field */}
              <div className="space-y-1.5">
                <label htmlFor="reg-email" className="text-xs font-bold uppercase tracking-wider text-[#6F6A63] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#4A3728]" />
                  <span>Email Address</span>
                </label>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
                  }}
                  placeholder="name@company.com"
                  required
                  disabled={isLoading}
                  className={`w-full px-4 py-3 rounded-[14px] bg-[#FFFFFF] border text-xs text-[#343434] placeholder-[#9CA3AF] focus:outline-none transition-all disabled:opacity-60 ${
                    fieldErrors.email
                      ? 'border-[#A04E45] ring-2 ring-[#A04E45]/10'
                      : 'border-[#E5DDD3] focus:border-[#4A3728] focus:ring-2 focus:ring-[#4A3728]/10'
                  }`}
                />
                {fieldErrors.email && (
                  <p className="text-[11px] text-[#A04E45] font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{fieldErrors.email}</span>
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label htmlFor="reg-password" className="text-xs font-bold uppercase tracking-wider text-[#6F6A63] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#4A3728]" />
                  <span>Password</span>
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
                    }}
                    placeholder="••••••••••••"
                    required
                    disabled={isLoading}
                    className={`w-full pl-4 pr-10 py-3 rounded-[14px] bg-[#FFFFFF] border text-xs text-[#343434] placeholder-[#9CA3AF] focus:outline-none transition-all disabled:opacity-60 ${
                      fieldErrors.password
                        ? 'border-[#A04E45] ring-2 ring-[#A04E45]/10'
                        : 'border-[#E5DDD3] focus:border-[#4A3728] focus:ring-2 focus:ring-[#4A3728]/10'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F6A63] hover:text-[#343434] focus:outline-none disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-[11px] text-[#A04E45] font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{fieldErrors.password}</span>
                  </p>
                )}
              </div>

              {/* Password Strength Progress Bar & Rules Helper */}
              {password.length > 0 && (
                <div className="space-y-1 pt-0.5">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#6F6A63]">
                    <span>Password Strength</span>
                    <span className={criteriaCount === 5 ? "text-[#5E7A5D]" : criteriaCount >= 3 ? "text-[#CDAA7D]" : "text-[#A04E45]"}>
                      {strengthLabel}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#E5DDD3] overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${strengthColor}`} style={{ width: strengthWidth }} />
                  </div>
                </div>
              )}

              <div className="p-3 rounded-[12px] bg-[#F4EFE8] border border-[#E5DDD3] space-y-1 text-[11px]">
                <p className="font-bold text-[#4A3728] text-[10px] uppercase tracking-wider">Password Requirements:</p>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[#6F6A63]">
                  <span className={hasMinLength ? "text-[#5E7A5D] font-bold" : ""}>✓ 8+ Characters</span>
                  <span className={hasUpper ? "text-[#5E7A5D] font-bold" : ""}>✓ 1 Uppercase (A-Z)</span>
                  <span className={hasLower ? "text-[#5E7A5D] font-bold" : ""}>✓ 1 Lowercase (a-z)</span>
                  <span className={hasNumber ? "text-[#5E7A5D] font-bold" : ""}>✓ 1 Number (0-9)</span>
                  <span className={hasSpecial ? "text-[#5E7A5D] font-bold col-span-2" : "col-span-2"}>✓ 1 Special (@$!%*#?&)</span>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5">
                <label htmlFor="reg-confirm-password" className="text-xs font-bold uppercase tracking-wider text-[#6F6A63] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#4A3728]" />
                  <span>Confirm Password</span>
                </label>
                <div className="relative">
                  <input
                    id="reg-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (fieldErrors.confirmPassword) setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
                    }}
                    placeholder="••••••••••••"
                    required
                    disabled={isLoading}
                    className={`w-full pl-4 pr-10 py-3 rounded-[14px] bg-[#FFFFFF] border text-xs text-[#343434] placeholder-[#9CA3AF] focus:outline-none transition-all disabled:opacity-60 ${
                      fieldErrors.confirmPassword
                        ? 'border-[#A04E45] ring-2 ring-[#A04E45]/10'
                        : 'border-[#E5DDD3] focus:border-[#4A3728] focus:ring-2 focus:ring-[#4A3728]/10'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F6A63] hover:text-[#343434] focus:outline-none disabled:opacity-50"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-[11px] text-[#A04E45] font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{fieldErrors.confirmPassword}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[16px] bg-[#4A3728] hover:bg-[#34261C] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider shadow-espresso transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#4A3728] mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Creating Admin Account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 text-[#CDAA7D]" />
                    <span>Register Admin Account</span>
                  </>
                )}
              </button>

            </form>

            <div className="mt-6 pt-4 border-t border-[#E5DDD3] text-center text-xs text-[#6F6A63]">
              Already registered as an admin?{' '}
              <Link to="/login" className="font-bold text-[#4A3728] hover:underline">
                Sign In Here
              </Link>
            </div>
          </motion.div>

          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-[#6F6A63] hover:text-[#4A3728] transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Landing Page</span>
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
