import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LayoutDashboard, Home, Download, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CommandPalette({ isOpen, onClose, onFocusSearch, onExportCSV }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-28 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#161616]/40 backdrop-blur-sm"
        />

        {/* Command Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="relative w-full max-w-lg bg-[#FFFFFF] rounded-2xl border border-[#E5E4E0] shadow-2xl overflow-hidden z-10 space-y-2 p-4"
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#E5E4E0] text-xs font-bold text-[#6E2132]">
            <span>COMMAND PALETTE (Ctrl + K)</span>
            <button onClick={onClose} className="text-[#6B7280] hover:text-[#161616]">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => {
                onClose();
                onFocusSearch();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F6F5F2] text-xs font-medium text-[#161616] transition-colors text-left"
            >
              <Search className="w-4 h-4 text-[#6E2132]" />
              <span>Search Leads (/ key shortcut)</span>
            </button>

            <button
              onClick={() => {
                onClose();
                navigate('/admin');
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F6F5F2] text-xs font-medium text-[#161616] transition-colors text-left"
            >
              <LayoutDashboard className="w-4 h-4 text-[#6E2132]" />
              <span>Open Executive Workspace (/admin)</span>
            </button>

            <button
              onClick={() => {
                onClose();
                navigate('/');
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F6F5F2] text-xs font-medium text-[#161616] transition-colors text-left"
            >
              <Home className="w-4 h-4 text-[#6E2132]" />
              <span>Go to Monolith Landing Page</span>
            </button>

            {onExportCSV && (
              <button
                onClick={() => {
                  onClose();
                  onExportCSV();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F6F5F2] text-xs font-medium text-[#161616] transition-colors text-left"
              >
                <Download className="w-4 h-4 text-[#6E2132]" />
                <span>Export Leads to CSV</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
