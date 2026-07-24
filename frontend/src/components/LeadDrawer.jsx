import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, DollarSign, Calendar, MessageSquare, CheckCircle, Clock, FileText, Send, User } from 'lucide-react';

export default function LeadDrawer({ lead, isOpen, onClose, onStatusChange }) {
  const [notes, setNotes] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);

  useEffect(() => {
    if (lead) {
      // Load saved notes from localStorage if available
      const stored = localStorage.getItem(`lead_notes_${lead.id}`);
      if (stored) {
        setSavedNotes(JSON.parse(stored));
      } else {
        setSavedNotes([
          { text: "Lead captured via Web Application Intake.", date: lead.created_at || new Date().toISOString() }
        ]);
      }
    }
  }, [lead]);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!notes.trim() || !lead) return;

    const newNote = { text: notes.trim(), date: new Date().toISOString() };
    const updated = [newNote, ...savedNotes];
    setSavedNotes(updated);
    localStorage.setItem(`lead_notes_${lead.id}`, JSON.stringify(updated));
    setNotes('');
  };

  if (!isOpen || !lead) return null;

  const formatDate = (dateStr) => {
    try {
      return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(dateStr));
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#161616]/40 backdrop-blur-sm transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="w-screen max-w-md bg-[#FFFFFF] shadow-2xl border-l border-[#E5E4E0] flex flex-col justify-between"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#E5E4E0] flex items-center justify-between bg-[#F6F5F2]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E2132]">Opportunity File #{lead.id}</span>
                <h3 className="font-heading text-xl font-bold text-[#161616] mt-0.5">{lead.name}</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-[#6B7280] hover:text-[#161616] hover:bg-[#FFFFFF] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="p-6 space-y-6 overflow-y-auto flex-grow">
              
              {/* Status Selector */}
              <div className="p-4 rounded-xl bg-[#F6F5F2] border border-[#E5E4E0] space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Pipeline Status</label>
                <select
                  value={lead.status}
                  onChange={(e) => onStatusChange(lead.id, e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E5E4E0] font-bold text-xs text-[#161616] focus:outline-none focus:border-[#6E2132] cursor-pointer"
                >
                  <option value="New">New Opportunity</option>
                  <option value="Contacted">Contacted / In Discussion</option>
                  <option value="Closed">Closed Deal</option>
                </select>
              </div>

              {/* Lead Information */}
              <div className="space-y-3">
                <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#6B7280]">Contact Info & Budget</h4>
                <div className="space-y-2 text-xs text-[#161616]">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#6E2132]" />
                    <a href={`mailto:${lead.email}`} className="font-medium hover:text-[#6E2132]">{lead.email}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#6E2132]" />
                    <span className="font-bold text-[#6E2132]">{lead.budget}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#6B7280]">
                    <Calendar className="w-4 h-4 text-[#6B7280]" />
                    <span>Captured on {formatDate(lead.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Inquiry Message */}
              <div className="space-y-2">
                <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#6B7280]">Project Brief Message</h4>
                <div className="p-4 rounded-xl bg-[#F6F5F2] border border-[#E5E4E0] text-xs text-[#161616] leading-relaxed italic">
                  "{lead.message}"
                </div>
              </div>

              {/* GitHub-Style Activity Timeline */}
              <div className="space-y-3 pt-2">
                <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#6B7280]">GitHub Activity Timeline</h4>
                <div className="relative pl-6 space-y-4 border-l-2 border-[#E5E4E0] ml-2">
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#6E2132] border-2 border-[#FFFFFF]" />
                    <p className="text-xs font-bold text-[#161616]">Opportunity Created</p>
                    <p className="text-[10px] text-[#6B7280]">{formatDate(lead.created_at)}</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#6B7280] border-2 border-[#FFFFFF]" />
                    <p className="text-xs font-bold text-[#161616]">Viewed in Control Center</p>
                    <p className="text-[10px] text-[#6B7280]">Real-time review active</p>
                  </div>
                  {lead.status !== 'New' && (
                    <div className="relative">
                      <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#6E2132] border-2 border-[#FFFFFF]" />
                      <p className="text-xs font-bold text-[#6E2132]">Status Changed to {lead.status}</p>
                      <p className="text-[10px] text-[#6B7280]">Updated by Admin</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes Section */}
              <div className="space-y-3 pt-2">
                <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#6B7280]">Internal Executive Notes</h4>
                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add executive note..."
                    className="flex-grow px-3 py-2 text-xs rounded-xl bg-[#F6F5F2] border border-[#E5E4E0] text-[#161616] focus:outline-none focus:border-[#6E2132]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-[#6E2132] text-white text-xs font-bold shadow-sm hover:bg-[#541926] transition-colors"
                  >
                    Save
                  </button>
                </form>

                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {savedNotes.map((n, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-[#F6F5F2] text-[11px] text-[#161616] border border-[#E5E4E0]">
                      <p className="font-medium">{n.text}</p>
                      <span className="text-[9px] text-[#6B7280]">{formatDate(n.date)}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-[#E5E4E0] bg-[#F6F5F2] flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-[#161616] text-[#FFFFFF] text-xs font-bold hover:bg-[#333333] transition-colors"
              >
                Close Drawer
              </button>
            </div>

          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
