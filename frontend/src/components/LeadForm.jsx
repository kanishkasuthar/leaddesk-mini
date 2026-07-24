import React, { useState } from 'react';
import { Send, User, Mail, DollarSign, MessageSquare, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { leadService } from '../services/api';
import Toast from './Toast';

const BUDGET_OPTIONS = [
  "Below ₹10,000",
  "₹10,000–₹25,000",
  "₹25,000–₹50,000",
  "Above ₹50,000"
];

export default function LeadForm() {
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
    <section id="contact" className="py-24 relative bg-[#F4EFE8] border-t border-[#E5DDD3]">
      
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4A3728] bg-[#CDAA7D]/20 border border-[#CDAA7D]/40 px-3.5 py-1 rounded-full">
            Luxury Application Form
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#343434]">
            Submit an Opportunity
          </h2>
          <p className="text-[#6F6A63] text-sm sm:text-base max-w-xl mx-auto">
            Fill out the form below to log your project requirements directly into LeadDesk Mini.
          </p>
        </div>

        {/* Form Card */}
        <div className="sandstone-card p-8 sm:p-10 border border-[#E5DDD3] shadow-sandstone relative">
          
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            
            {/* Row 1: Name & Email */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-[#6F6A63] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#4A3728]" />
                  <span>Full Name</span>
                  <span className="text-[#A04E45] font-bold">*</span>
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3.5 rounded-[16px] bg-[#FFFFFF] border text-[#343434] placeholder-[#9CA3AF] focus:outline-none transition-all ${
                      errors.name && touched.name
                        ? 'border-[#A04E45] ring-2 ring-[#A04E45]/10'
                        : 'border-[#E5DDD3] focus:border-[#4A3728] focus:ring-2 focus:ring-[#4A3728]/10'
                    }`}
                  />
                  {formData.name && !errors.name && (
                    <CheckCircle2 className="w-4 h-4 text-[#5E7A5D] absolute right-3.5 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                {errors.name && touched.name && (
                  <p id="name-error" className="text-xs text-[#A04E45] flex items-center gap-1.5 mt-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-[#6F6A63] flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#4A3728]" />
                  <span>Email Address</span>
                  <span className="text-[#A04E45] font-bold">*</span>
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    placeholder="john@example.com"
                    className={`w-full px-4 py-3.5 rounded-[16px] bg-[#FFFFFF] border text-[#343434] placeholder-[#9CA3AF] focus:outline-none transition-all ${
                      errors.email && touched.email
                        ? 'border-[#A04E45] ring-2 ring-[#A04E45]/10'
                        : 'border-[#E5DDD3] focus:border-[#4A3728] focus:ring-2 focus:ring-[#4A3728]/10'
                    }`}
                  />
                  {formData.email && !errors.email && (
                    <CheckCircle2 className="w-4 h-4 text-[#5E7A5D] absolute right-3.5 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                {errors.email && touched.email && (
                  <p id="email-error" className="text-xs text-[#A04E45] flex items-center gap-1.5 mt-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

            </div>

            {/* Row 2: Budget Dropdown */}
            <div className="space-y-2">
              <label htmlFor="budget" className="text-xs font-bold uppercase tracking-wider text-[#6F6A63] flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#4A3728]" />
                <span>Budget Range</span>
                <span className="text-[#A04E45] font-bold">*</span>
              </label>
              <div className="relative">
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(errors.budget)}
                  aria-describedby={errors.budget ? "budget-error" : undefined}
                  className={`w-full px-4 py-3.5 rounded-[16px] bg-[#FFFFFF] border text-[#343434] focus:outline-none transition-all appearance-none cursor-pointer ${
                    errors.budget && touched.budget
                      ? 'border-[#A04E45] ring-2 ring-[#A04E45]/10'
                      : 'border-[#E5DDD3] focus:border-[#4A3728] focus:ring-2 focus:ring-[#4A3728]/10'
                  }`}
                >
                  <option value="" disabled className="text-[#9CA3AF]">
                    Select project budget range
                  </option>
                  {BUDGET_OPTIONS.map((opt, i) => (
                    <option key={i} value={opt} className="text-[#343434] py-2">
                      {opt}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#6F6A63] text-xs">
                  ▼
                </div>
              </div>
              {errors.budget && touched.budget && (
                <p id="budget-error" className="text-xs text-[#A04E45] flex items-center gap-1.5 mt-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.budget}</span>
                </p>
              )}
            </div>

            {/* Row 3: Message Textarea */}
            <div className="space-y-2">
              <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-[#6F6A63] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#4A3728]" />
                <span>Message</span>
                <span className="text-[#A04E45] font-bold">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "message-error" : undefined}
                placeholder="Describe your project goals or inquiry details..."
                className={`w-full px-4 py-3.5 rounded-[16px] bg-[#FFFFFF] border text-[#343434] placeholder-[#9CA3AF] focus:outline-none transition-all resize-none ${
                  errors.message && touched.message
                    ? 'border-[#A04E45] ring-2 ring-[#A04E45]/10'
                    : 'border-[#E5DDD3] focus:border-[#4A3728] focus:ring-2 focus:ring-[#4A3728]/10'
                }`}
              />
              {errors.message && touched.message && (
                <p id="message-error" className="text-xs text-[#A04E45] flex items-center gap-1.5 mt-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.message}</span>
                </p>
              )}
            </div>

            {/* Submit Button (Deep Espresso #4A3728) */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-[18px] bg-[#4A3728] hover:bg-[#34261C] disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider shadow-espresso transition-all transform hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>Submitting Opportunity...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Opportunity</span>
                    <Send className="w-4 h-4 text-[#CDAA7D]" />
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>
    </section>
  );
}
