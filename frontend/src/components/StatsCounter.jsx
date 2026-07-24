import React from 'react';
import { motion } from 'framer-motion';

export default function StatsCounter() {
  const stats = [
    { label: "Active Opportunities", value: "1,280+", sub: "Tracked live" },
    { label: "Projects Delivered", value: "98.4%", sub: "On-time completion" },
    { label: "Response Rate", value: "< 15m", sub: "Average intake turnaround" },
    { label: "Client Satisfaction", value: "4.95 / 5", sub: "Executive feedback rating" }
  ];

  return (
    <section className="py-20 bg-[#FFFFFF] border-t border-[#E5E4E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-center lg:text-left space-y-1"
            >
              <h3 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#161616]">
                {item.value}
              </h3>
              <p className="text-xs font-bold uppercase tracking-wider text-[#6E2132]">
                {item.label}
              </p>
              <p className="text-[11px] text-[#6B7280]">
                {item.sub}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
