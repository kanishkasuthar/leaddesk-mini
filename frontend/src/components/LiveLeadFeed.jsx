import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Shield, User, DollarSign, Calendar } from 'lucide-react';

export default function LiveLeadFeed() {
  const liveLeads = [
    {
      time: "09:12",
      name: "Aditi Sharma",
      email: "aditi.s@enterprise.in",
      budget: "₹50,000",
      status: "NEW"
    },
    {
      time: "08:45",
      name: "Vikram Malhotra",
      email: "vikram@malhotratech.com",
      budget: "₹25,000–₹50,000",
      status: "NEW"
    },
    {
      time: "Yesterday",
      name: "Ananya Gupta",
      email: "ananya@designstudio.io",
      budget: "Above ₹50,000",
      status: "CONTACTED"
    }
  ];

  return (
    <div className="w-full max-w-md relative space-y-4">
      {/* Editorial Header */}
      <div className="flex items-center justify-between px-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#6E2132] animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#6E2132]">Live Opportunity Feed</span>
        </div>
        <span className="text-[11px] font-semibold text-[#6B7280]">Real-Time Stream</span>
      </div>

      {/* Floating Notification Cards */}
      {liveLeads.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.15 }}
          whileHover={{ scale: 1.02 }}
          className="monolith-card p-4 sm:p-5 flex items-center justify-between border border-[#E5E4E0] shadow-sm hover:border-[#6E2132]/30"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#6E2132]/10 flex items-center justify-center text-[#6E2132] font-bold text-sm shrink-0">
              {item.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-heading font-bold text-[#161616] text-sm">{item.name}</h4>
                <span className="text-[10px] text-[#6B7280] font-mono">{item.time}</span>
              </div>
              <p className="text-xs text-[#6B7280]">{item.email}</p>
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            <span className="text-xs font-bold text-[#6E2132] mb-1">{item.budget}</span>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#6E2132]/10 text-[#6E2132] border border-[#6E2132]/20">
              {item.status}
            </span>
          </div>
        </motion.div>
      ))}

      {/* Floating Accent Badge */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-5 -right-3 bg-[#161616] text-[#FFFFFF] px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold"
      >
        <Sparkles className="w-4 h-4 text-[#6E2132]" />
        <span>MySQL Persistence Engine</span>
      </motion.div>
    </div>
  );
}
