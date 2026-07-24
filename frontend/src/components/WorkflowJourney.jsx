import React from 'react';
import { motion } from 'framer-motion';
import { User, Send, Lock, Eye, PhoneCall, CheckCircle2 } from 'lucide-react';

export default function WorkflowJourney() {
  const steps = [
    { name: "Visitor", icon: User, desc: "Arrives at the Monolith experience" },
    { name: "Lead Submitted", icon: Send, desc: "Fills out the intake form" },
    { name: "Automatically Stored", icon: Lock, desc: "Saved securely in MySQL database" },
    { name: "Reviewed", icon: Eye, desc: "Surfaces in Executive Workspace" },
    { name: "Contacted", icon: PhoneCall, desc: "Pipeline status updated by team" },
    { name: "Closed", icon: CheckCircle2, desc: "Opportunity converts successfully" }
  ];

  return (
    <section id="workflow" className="py-24 bg-[#FFFFFF] border-t border-[#E5DDD3] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4A3728] bg-[#CDAA7D]/20 border border-[#CDAA7D]/40 px-3.5 py-1 rounded-full">
            Horizontal Journey
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#343434] tracking-tight">
            The Sandstone Opportunity Lifecycle
          </h2>
          <p className="text-[#6F6A63] text-sm sm:text-base">
            An automated, seamless 6-step lifecycle from initial visit to deal closing.
          </p>
        </div>

        {/* Horizontal Workflow Stepper */}
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-4">
          {steps.map((item, index) => {
            const IconComp = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="sandstone-card p-5 border border-[#E5DDD3] flex flex-col justify-between text-center items-center space-y-3 shadow-sandstone group hover:border-[#4A3728]/40"
              >
                <div className="w-10 h-10 rounded-[14px] bg-[#4A3728] text-[#CDAA7D] flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                  <IconComp className="w-5 h-5" />
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A3728]">STEP 0{index + 1}</span>
                  <h4 className="font-heading font-bold text-[#343434] text-sm mt-0.5">{item.name}</h4>
                  <p className="text-[11px] text-[#6F6A63] mt-1 leading-normal">{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
