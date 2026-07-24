import React from 'react';
import { Database, Search, Sliders, LayoutGrid, Smartphone, Lock, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Features() {
  const featureBlocks = [
    {
      num: "01",
      title: "Capture Opportunities",
      subtitle: "Store leads securely.",
      description: "Aggregates client enquiries directly into your MySQL database with strict server-side validation and field sanitization.",
      icon: Database,
      badge: "Intake Engine"
    },
    {
      num: "02",
      title: "Instant Search",
      subtitle: "Find any lead instantly.",
      description: "Search across client names, email addresses, and project details with zero-latency multi-field indexing.",
      icon: Search,
      badge: "Zero Latency"
    },
    {
      num: "03",
      title: "Status Tracking",
      subtitle: "Track New, Contacted and Closed leads.",
      description: "Streamline your intake lifecycle with instant dropdown status updates and automated pipeline recalculation.",
      icon: Sliders,
      badge: "Lifecycle Routing"
    },
    {
      num: "04",
      title: "Smart Organization",
      subtitle: "Group enquiries into structured pipelines.",
      description: "Filter opportunities by status tabs or toggle seamlessly between card grids and executive table views.",
      icon: LayoutGrid,
      badge: "Flexible Views"
    },
    {
      num: "05",
      title: "Responsive Design",
      subtitle: "Optimized across all device viewports.",
      description: "Crafted to deliver a flawless experience on desktop, tablet, and mobile with generous spacing and typography.",
      icon: Smartphone,
      badge: "Universal UI"
    },
    {
      num: "06",
      title: "Secure Storage",
      subtitle: "Enterprise MySQL database persistence.",
      description: "Powered by a robust Node/Express MVC backend with automated schema initialization and production readiness.",
      icon: Lock,
      badge: "MySQL Verified"
    }
  ];

  return (
    <section id="features" className="py-24 relative bg-[#F4EFE8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4A3728] bg-[#CDAA7D]/20 border border-[#CDAA7D]/40 px-4 py-1.5 rounded-full">
            Sandstone Capabilities
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-[#343434] tracking-tight">
            Editorial Feature Blocks
          </h2>
          <p className="text-[#6F6A63] text-base sm:text-lg">
            A cohesive set of features designed with warm minimalism and absolute precision.
          </p>
        </div>

        {/* Alternate Editorial Blocks Layout */}
        <div className="space-y-12">
          {featureBlocks.map((item, index) => {
            const IconComponent = item.icon;
            const isFlipped = index % 2 === 1;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`sandstone-card p-8 sm:p-10 border border-[#E5DDD3] shadow-sandstone grid md:grid-cols-12 gap-8 items-center ${
                  isFlipped ? 'md:grid-flow-dense' : ''
                }`}
              >
                {/* Visual Module Side */}
                <div className={`md:col-span-5 ${isFlipped ? 'md:col-start-8' : ''}`}>
                  <div className="p-8 rounded-[18px] bg-[#F4EFE8] border border-[#E5DDD3] flex flex-col justify-between h-48 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-xs font-bold text-[#4A3728]">BLOCK {item.num}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#FFFFFF] text-[#4A3728] border border-[#E5DDD3]">
                        {item.badge}
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-[14px] bg-[#4A3728] flex items-center justify-center text-[#CDAA7D]">
                      <IconComponent className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className={`md:col-span-7 space-y-3 ${isFlipped ? 'md:col-start-1' : ''}`}>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#343434]">
                    {item.title}
                  </h3>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#4A3728]">
                    {item.subtitle}
                  </h4>
                  <p className="text-[#6F6A63] text-sm leading-relaxed max-w-xl">
                    {item.description}
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#5E7A5D]">
                    <Check className="w-4 h-4" />
                    <span>Sandstone & Espresso Standard Verified</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
