import React, { useEffect } from 'react';
import { AlertTriangle, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConfirmModal({ isOpen, title, message, targetStatus, onConfirm, onCancel, isLoading }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!isLoading ? onCancel : undefined}
          className="fixed inset-0 bg-[#161616]/30 backdrop-blur-sm"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
          className="relative w-full max-w-md bg-[#FFFFFF] p-6 sm:p-8 rounded-2xl border border-[#E5E4E0] shadow-2xl z-10 space-y-6"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#6E2132]/10 border border-[#6E2132]/20 text-[#6E2132] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 id="confirm-modal-title" className="font-heading text-lg font-bold text-[#161616]">
                {title || 'Confirm Status Update'}
              </h3>
            </div>
            {!isLoading && (
              <button
                onClick={onCancel}
                aria-label="Close modal"
                className="text-[#6B7280] hover:text-[#161616] p-1 rounded-lg hover:bg-[#F6F5F2] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Message */}
          <p className="text-[#6B7280] text-xs sm:text-sm leading-relaxed">
            {message}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl bg-[#F6F5F2] hover:bg-[#E5E4E0] text-[#161616] border border-[#E5E4E0] text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6E2132] hover:bg-[#541926] text-white text-xs font-bold uppercase tracking-wider shadow-burgundy transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span>Updating...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Confirm Update</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
