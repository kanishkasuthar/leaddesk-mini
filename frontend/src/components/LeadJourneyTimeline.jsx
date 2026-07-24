import React, { useState } from 'react';
import { UserPlus, Database, Sliders, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LeadJourneyTimeline() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      step: "01",
      title: "Real-Time Capture",
      subtitle: "Validation & Intake",
      description: "Customer submits enquiry via Lead Capture Panel. Input parameters undergo instant client and server validation.",
      icon: UserPlus,
      details: ["Name & Email Format Check", "Budget Range Tagging", "XSS & Payload Sanitization"]
    },
    {
      step: "02",
      title: "MySQL Persistence",
      subtitle: "Secure Relational Storage",
      description: "Validated lead payload is saved into the MySQL database under the 'leads' table with default status set to 'New'.",
      icon: Database,
      details: ["Auto-Incremented Unique Lead ID", "Timestamped Creation Logging", "Indexed Query Efficiency"]
    },
    {
      step: "03",
      title: "Executive Allocation",
      subtitle: "Search & Lifecycle Routing",
      description: "Enquiries appear instantly inside the Lead Intelligence Control Center. Admin searches and filters leads with zero lag.",
      icon: Sliders,
      details: ["Instant Search across 4 Fields", "Status Filter Tabs", "Confirmation Modal Guard"]
    },
    {
      step: "04",
      title: "Deal Conversion",
      subtitle: "Status Update & Metrics",
      description: "Lead status transitions from 'New' to 'Contacted' or 'Closed', updating pipeline KPI metrics in real time.",
      icon: CheckCircle2,
      details: ["Instant PUT Request Dispatch", "Optimistic Local UI Update", "Live Dashboard Recalculation"]
    }
  ];

  return (
    <section className="py-20 relative bg-[#0A0B0D] border-t border-[#D4AF37]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-4 py-1.5 rounded-full shadow-bronze-glow">
            Lead Lifecycle Telemetry
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#F4F5F7]">
            Interactive Lead Journey Workflow
          </h2>
          <p className="text-[#8E95A5] text-sm sm:text-base">
            Click on any phase below to inspect how LeadDesk Mini processes customer enquiries from submission to closing.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid md:grid-cols-4 gap-4">
          {steps.map((item, index) => {
            const IconComp = item.icon;
            const isActive = activeStep === index;

            return (
              <div
                key={index}
                onClick={() => setActiveStep(index)}
                className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 border relative ${
                  isActive
                    ? 'bg-[#1C1F26] border-[#D4AF37] shadow-bronze-glow translate-y-[-4px]'
                    : 'bg-[#14161A]/80 border-[#D4AF37]/20 hover:border-[#D4AF37]/40 hover:bg-[#1C1F26]/60'
                }`}
              >
                {/* Step Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-bold font-heading ${isActive ? 'text-[#D4AF37]' : 'text-[#5C6270]'}`}>
                    PHASE {item.step}
                  </span>
                  <div className={`p-2 rounded-xl ${isActive ? 'bg-[#D4AF37] text-[#0A0B0D]' : 'bg-[#1C1F26] text-[#8E95A5]'}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                </div>

                {/* Title */}
                <h3 className={`font-heading text-lg font-bold mb-1 ${isActive ? 'text-[#F4F5F7]' : 'text-[#8E95A5]'}`}>
                  {item.title}
                </h3>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#C5A059] mb-3">
                  {item.subtitle}
                </p>

                <p className="text-xs text-[#8E95A5] leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* Details List */}
                <div className="space-y-1.5 pt-3 border-t border-[#D4AF37]/15">
                  {item.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2 text-[11px] text-[#F4F5F7]/80">
                      <ChevronRight className="w-3 h-3 text-[#D4AF37] shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
