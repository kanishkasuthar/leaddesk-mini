import React, { useState } from 'react';
import { ArrowRight, Sparkles, LayoutDashboard, Send, User, Mail, DollarSign, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { leadService } from '../services/api';
import Toast from './Toast';

const BUDGET_OPTIONS = [
  "Below ₹10,000",
  "₹10,000–₹25,000",
  "₹25,000–₹50,000",
  "Above ₹50,000"
];

export default function Hero() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    budget: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  const validateField = (fieldName, value) => {
    let error = '';
    if (fieldName === 'name') {
      if (!value.trim()) error = 'Full name is required';
      else if (value.trim().length < 2) error = 'Full name must be at least 2 characters';
    } else if (fieldName === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) error = 'Email address is required';
      else if (!emailRegex.test(value.trim())) error = 'Please enter a valid email address';
    } else if (fieldName === 'budget') {
      if (!value) error = 'Budget range selection is required';
    } else if (fieldName === 'message') {
      if (!value.trim()) error = 'Message content is required';
      else if (value.trim().length < 5) error = 'Message must be at least 5 characters long';
    }

    setErrors(prev => ({ ...prev, [fieldName]: error }));
    return !error;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    else if (formData.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) newErrors.email = 'Email address is required';
    else if (!emailRegex.test(formData.email.trim())) newErrors.email = 'Please enter a valid email address';

    if (!formData.budget) newErrors.budget = 'Please select a budget range';

    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.trim().length < 5) newErrors.message = 'Message must be at least 5 characters long';

    setErrors(newErrors);
    setTouched({ name: true, email: true, budget: true, message: true });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setToast({ message: '', type: 'success' });

    try {
      const response = await leadService.submitLead(formData);

      if (response.success) {
        setToast({
          message: '✓ Opportunity captured successfully.',
          type: 'success'
        });

        setFormData({ name: '', email: '', budget: '', message: '' });
        setErrors({});
        setTouched({});
      }
    } catch (err) {
      console.error('Form submission error:', err);
      const serverMsg = err.response?.data?.message || 'Failed to capture opportunity. Check inputs.';
      const serverErrors = err.response?.data?.errors || {};

      if (Object.keys(serverErrors).length > 0) {
        setErrors(serverErrors);
      }

      setToast({ message: serverMsg, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="home" className="relative pt-12 pb-20 md:pt-24 md:pb-28 overflow-hidden bg-[#F4EFE8] bg-stationery-grid">
      
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6">
            
            {/* Pill Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E5DDD3] text-[#4A3728] text-xs font-bold uppercase tracking-wider shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#4A3728]" />
              <span>Sandstone & Espresso Workspace</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#343434] leading-[1.08]"
            >
              Every Conversation{' '}
              <span className="text-[#4A3728] italic font-serif">
                Has Potential.
              </span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-base sm:text-xl text-[#6F6A63] font-normal leading-relaxed"
            >
              LeadDesk Mini helps teams organize enquiries into meaningful business opportunities through a beautifully designed workspace.
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto"
            >
              <a
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-[18px] bg-[#4A3728] hover:bg-[#34261C] text-white font-bold text-xs uppercase tracking-wider shadow-espresso transition-all transform hover:-translate-y-0.5"
              >
                <span>Start Managing</span>
                <ArrowRight className="w-4 h-4 text-[#CDAA7D]" />
              </a>

              <a
                href="/admin"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-[18px] bg-[#FFFFFF] hover:bg-[#ECE4DA] text-[#343434] font-bold text-xs uppercase tracking-wider border border-[#E5DDD3] shadow-sm transition-all"
              >
                <LayoutDashboard className="w-4 h-4 text-[#4A3728]" />
                <span>Explore Dashboard</span>
              </a>
            </motion.div>

          </div>

          {/* Right Column: Layered Integrated Lead Capture Panel */}
          <div className="lg:col-span-6" id="contact">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="sandstone-card p-6 sm:p-8 border border-[#E5DDD3] shadow-sandstone relative space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[#E5DDD3] pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A3728]">Integrated Intake Panel</span>
                  <h3 className="font-heading text-lg font-bold text-[#343434]">Submit Opportunity Brief</h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#CDAA7D]/20 text-[#4A3728] border border-[#CDAA7D]/40">
                  Live Intake
                </span>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                
                {/* Row 1: Name & Email */}
                <div className="grid sm:grid-cols-2 gap-4">
                  
                  {/* Name */}
                  <div className="space-y-1">
                    <label htmlFor="name" className="text-[11px] font-bold uppercase tracking-wider text-[#6F6A63] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#4A3728]" />
                      <span>Full Name</span>
                      <span className="text-[#A04E45]">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="John Doe"
                      className={`w-full px-3.5 py-2.5 rounded-[14px] bg-[#FFFFFF] border text-xs text-[#343434] placeholder-[#9CA3AF] focus:outline-none transition-all ${
                        errors.name && touched.name
                          ? 'border-[#A04E45] ring-2 ring-[#A04E45]/10'
                          : 'border-[#E5DDD3] focus:border-[#4A3728] focus:ring-2 focus:ring-[#4A3728]/10'
                      }`}
                    />
                    {errors.name && touched.name && (
                      <p className="text-[10px] text-[#A04E45] flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-wider text-[#6F6A63] flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#4A3728]" />
                      <span>Email Address</span>
                      <span className="text-[#A04E45]">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="john@example.com"
                      className={`w-full px-3.5 py-2.5 rounded-[14px] bg-[#FFFFFF] border text-xs text-[#343434] placeholder-[#9CA3AF] focus:outline-none transition-all ${
                        errors.email && touched.email
                          ? 'border-[#A04E45] ring-2 ring-[#A04E45]/10'
                          : 'border-[#E5DDD3] focus:border-[#4A3728] focus:ring-2 focus:ring-[#4A3728]/10'
                      }`}
                    />
                    {errors.email && touched.email && (
                      <p className="text-[10px] text-[#A04E45] flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                </div>

                {/* Budget */}
                <div className="space-y-1">
                  <label htmlFor="budget" className="text-[11px] font-bold uppercase tracking-wider text-[#6F6A63] flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#4A3728]" />
                    <span>Budget Range</span>
                    <span className="text-[#A04E45]">*</span>
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-3.5 py-2.5 rounded-[14px] bg-[#FFFFFF] border text-xs text-[#343434] focus:outline-none transition-all appearance-none cursor-pointer ${
                      errors.budget && touched.budget
                        ? 'border-[#A04E45] ring-2 ring-[#A04E45]/10'
                        : 'border-[#E5DDD3] focus:border-[#4A3728] focus:ring-2 focus:ring-[#4A3728]/10'
                    }`}
                  >
                    <option value="" disabled className="text-[#9CA3AF]">
                      Select project budget range
                    </option>
                    {BUDGET_OPTIONS.map((opt, i) => (
                      <option key={i} value={opt} className="text-[#343434] py-1">
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.budget && touched.budget && (
                    <p className="text-[10px] text-[#A04E45] flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.budget}</span>
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label htmlFor="message" className="text-[11px] font-bold uppercase tracking-wider text-[#6F6A63] flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#4A3728]" />
                    <span>Message</span>
                    <span className="text-[#A04E45]">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Describe your project goals..."
                    className={`w-full px-3.5 py-2.5 rounded-[14px] bg-[#FFFFFF] border text-xs text-[#343434] placeholder-[#9CA3AF] focus:outline-none transition-all resize-none ${
                      errors.message && touched.message
                        ? 'border-[#A04E45] ring-2 ring-[#A04E45]/10'
                        : 'border-[#E5DDD3] focus:border-[#4A3728] focus:ring-2 focus:ring-[#4A3728]/10'
                    }`}
                  />
                  {errors.message && touched.message && (
                    <p className="text-[10px] text-[#A04E45] flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.message}</span>
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[16px] bg-[#4A3728] hover:bg-[#34261C] disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider shadow-espresso transition-all transform hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Capturing...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Opportunity Brief</span>
                      <Send className="w-3.5 h-3.5 text-[#CDAA7D]" />
                    </>
                  )}
                </button>

              </form>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
