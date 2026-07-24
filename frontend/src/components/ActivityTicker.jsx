import React from 'react';
import { Activity, ShieldCheck, Zap, Database, TrendingUp, Sparkles } from 'lucide-react';

export default function ActivityTicker() {
  const events = [
    { icon: Zap, text: "Lead #104 (Aarav Sharma) captured & assigned to Priority Pipeline", time: "Just now" },
    { icon: Database, text: "MySQL Database Schema verified & synchronized", time: "2m ago" },
    { icon: ShieldCheck, text: "Server-side field validation active — 0 vulnerabilities", time: "5m ago" },
    { icon: TrendingUp, text: "Pipeline lead response speed optimized (+34% conversion rate)", time: "12m ago" },
    { icon: Sparkles, text: "Lead #102 status upgraded from Contacted to Closed", time: "18m ago" }
  ];

  return (
    <div className="w-full bg-[#14161A] border-b border-[#D4AF37]/20 py-2.5 px-4 overflow-hidden relative z-30">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        
        {/* Left Live Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A0B0D] border border-[#D4AF37]/30 shrink-0 text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
          <Activity className="w-3 h-3 text-[#D4AF37]" />
          <span>Live Telemetry</span>
        </div>

        {/* Scrolling Ticker Line */}
        <div className="overflow-hidden relative w-full mask-gradient">
          <div className="animate-ticker flex items-center gap-10 text-xs font-medium text-[#8E95A5]">
            {[...events, ...events].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="flex items-center gap-2 shrink-0">
                  <IconComp className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-[#F4F5F7] font-semibold">{item.text}</span>
                  <span className="text-[#5C6270] text-[10px]">({item.time})</span>
                  <span className="text-[#D4AF37]/30 ml-4">•</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
