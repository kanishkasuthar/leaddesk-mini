import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Database, Search, Sliders, CheckCircle2 } from 'lucide-react';

export default function StorySection() {
  return (
    <section id="story" className="py-28 bg-[#F4EFE8] border-t border-[#E5DDD3] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-24">
        
        {/* Story Block 1: Asymmetrical Overlapping Layout */}
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 space-y-6"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-[#4A3728] bg-[#CDAA7D]/20 border border-[#CDAA7D]/40 px-3.5 py-1 rounded-full">
              Chapter 01 — Secure Intake
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-[#343434] leading-[1.1]">
              Capture without friction. <br />
              <span className="text-[#4A3728] italic font-serif">Persist with certainty.</span>
            </h2>
            <p className="text-[#6F6A63] text-base leading-relaxed">
              Every client inquiry contains a potential partnership. LeadDesk Mini validates and structures input parameters both on the client interface and server API layer, preserving records directly in your MySQL database.
            </p>

            <div className="pt-2 grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-[16px] bg-[#FFFFFF] border border-[#E5DDD3] shadow-sm">
                <Database className="w-5 h-5 text-[#4A3728] mb-2" />
                <h4 className="font-heading font-bold text-[#343434] text-sm">MySQL Relational DB</h4>
                <p className="text-xs text-[#6F6A63] mt-0.5">Schema initialized with default 'New' status</p>
              </div>

              <div className="p-4 rounded-[16px] bg-[#FFFFFF] border border-[#E5DDD3] shadow-sm">
                <Shield className="w-5 h-5 text-[#4A3728] mb-2" />
                <h4 className="font-heading font-bold text-[#343434] text-sm">Dual Layer Validation</h4>
                <p className="text-xs text-[#6F6A63] mt-0.5">Client-side & server middleware checks</p>
              </div>
            </div>
          </motion.div>

          {/* Right Side Overlapping Visual Offset */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative mx-auto max-w-md">
              
              {/* Main Card */}
              <div className="sandstone-card p-6 border border-[#E5DDD3] shadow-sandstone relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#4A3728]" />
                    <span className="font-heading text-xs font-bold text-[#343434]">Inquiry Telemetry</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#CDAA7D]/20 text-[#4A3728] border border-[#CDAA7D]/40">
                    Validated
                  </span>
                </div>

                <div className="p-4 rounded-[14px] bg-[#F4EFE8] border border-[#E5DDD3] text-xs text-[#343434] space-y-1">
                  <p className="font-bold text-sm text-[#4A3728]">Vikram Malhotra</p>
                  <p className="text-[#6F6A63]">vikram@malhotratech.com</p>
                  <p className="font-semibold text-[#4A3728] pt-1">Budget: ₹25,000–₹50,000</p>
                </div>
              </div>

              {/* Offset Overlapping Badge Card */}
              <div className="absolute -bottom-6 -left-6 bg-[#4A3728] text-white p-5 rounded-[20px] shadow-espresso z-20 hidden sm:flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-[#CDAA7D]" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#CDAA7D]">Zero Latency Engine</div>
                  <div className="font-heading text-sm font-bold">Instant API Sync</div>
                </div>
              </div>

            </div>
          </motion.div>

        </div>

        {/* Story Block 2: Chapter 02 Flipped Composition */}
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Visual Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 lg:order-1 order-2"
          >
            <div className="sandstone-card p-6 border border-[#E5DDD3] shadow-sandstone space-y-4 max-w-md mx-auto">
              <div className="flex items-center justify-between border-b border-[#E5DDD3] pb-3">
                <span className="font-heading text-xs font-bold text-[#4A3728]">Multi-Field Search Query</span>
                <Search className="w-4 h-4 text-[#4A3728]" />
              </div>
              <div className="p-3 rounded-xl bg-[#F4EFE8] text-xs font-mono text-[#343434] border border-[#E5DDD3]">
                Query: "Sharma" ➔ 1 Record Found
              </div>
              <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E5DDD3] text-xs space-y-1">
                <p className="font-bold text-[#343434]">Aarav Sharma</p>
                <p className="text-[#6F6A63]">aarav.sharma@example.com</p>
              </div>
            </div>
          </motion.div>

          {/* Right Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-6 lg:order-2 order-1 space-y-6"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-[#4A3728] bg-[#CDAA7D]/20 border border-[#CDAA7D]/40 px-3.5 py-1 rounded-full">
              Chapter 02 — Executive Visibility
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-[#343434] leading-[1.1]">
              Instant search. <br />
              <span className="text-[#4A3728] italic font-serif">Seamless pipeline control.</span>
            </h2>
            <p className="text-[#6F6A63] text-base leading-relaxed">
              Find any lead instantly across names, emails, budgets, or message contents. Transition statuses from New to Contacted or Closed with instant database updates and confirmation guards.
            </p>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
