import React from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

export default function WhyLeadManagement() {
  const reasons = [
    {
      title: "Eliminate Response Latency",
      desc: "71% of prospective clients select the service provider that responds first. LeadDesk Mini centralizes inquiries instantly.",
      icon: Clock
    },
    {
      title: "Structured Budget Qualification",
      desc: "Every lead includes explicit budget ranges, enabling team allocation based on deal size and strategic fit.",
      icon: TrendingUp
    },
    {
      title: "Zero Data Leakage",
      desc: "Client inquiries are safely validated and stored directly inside MySQL relational database tables.",
      icon: ShieldCheck
    },
    {
      title: "Transparent Lifecycle Visibility",
      desc: "Clear status progression from New to Contacted and Closed provides full operational transparency.",
      icon: Zap
    }
  ];

  return (
    <section className="py-24 bg-[#FFFFFF] border-t border-[#E5DDD3] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4A3728] bg-[#CDAA7D]/20 border border-[#CDAA7D]/40 px-3.5 py-1 rounded-full">
            Strategic Imperative
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-[#343434] tracking-tight">
            Why Businesses Need Better Lead Management
          </h2>
          <p className="text-[#6F6A63] text-base">
            In modern commercial operations, unorganized inquiries mean lost revenue. Here is how LeadDesk Mini bridges the gap.
          </p>
        </div>

        {/* 4 Reasons Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((item, index) => {
            const IconComp = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="sandstone-card p-6 border border-[#E5DDD3] space-y-4 shadow-sandstone group hover:border-[#4A3728]/40"
              >
                <div className="w-10 h-10 rounded-[14px] bg-[#4A3728] text-[#CDAA7D] flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                  <IconComp className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-[#343434] text-lg">
                  {item.title}
                </h3>
                <p className="text-xs text-[#6F6A63] leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
