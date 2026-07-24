import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Toast({ message, type = 'success', onClose, autoDismiss = 4000 }) {
  useEffect(() => {
    if (message && autoDismiss && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [message, autoDismiss, onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          role="alert"
          aria-live="assertive"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#FFFFFF]/95 border border-[#E5E4E0] shadow-2xl text-[#161616] backdrop-blur-md"
        >
          {type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-[#6E2132] shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}

          <p className="text-xs font-semibold text-[#161616] pr-2">
            {message}
          </p>

          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close notification"
              className="text-[#6B7280] hover:text-[#161616] p-1 rounded-lg hover:bg-[#F6F5F2] transition-colors ml-auto"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
