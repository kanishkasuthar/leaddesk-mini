import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, LayoutGrid, List, CheckCircle, Sparkles, PhoneCall, Inbox } from 'lucide-react';

export default function ProductPreview() {
  const [activeTab, setActiveTab] = useState('Cards');

  const demoLeads = [
    {
      id: 101,
      name: "Priya Sharma",
      email: "priya@sharmadesigns.in",
      budget: "₹50,000",
      status: "New",
      badgeClass: "bg-[#CDAA7D]/20 text-[#4A3728] border-[#CDAA7D]/40",
      message: "Required custom web application architecture with MySQL backend."
    },
    {
      id: 102,
      name: "Aarav Mehta",
      email: "aarav@mehtagroup.com",
      budget: "₹25,000 – ₹50,000",
      status: "Contacted",
      badgeClass: "bg-[#5E7A5D]/20 text-[#344533] border-[#5E7A5D]/40",
      message: "Needs operational dashboard integration for sales team."
    },
    {
      id: 103,
      name: "Kavita Rao",
      email: "kavita@rao-ventures.com",
      budget: "Above ₹50,000",
      status: "Closed",
      badgeClass: "bg-[#4A3728] text-white border-[#4A3728]",
      message: "Project successfully onboarded and proposal signed."
    }
  ];

  return (
    <section className="py-24 bg-[#F4EFE8] border-t border-[#E5DDD3] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4A3728] bg-[#CDAA7D]/20 border border-[#CDAA7D]/40 px-3.5 py-1 rounded-full">
            Live Workspace Mockup
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-[#343434] tracking-tight">
            Live Product Preview
          </h2>
          <p className="text-[#6F6A63] text-base">
            Experience the calm visual hierarchy and effortless status tracking of LeadDesk Mini.
          </p>
        </div>

        {/* Live Workspace Container */}
        <div className="sandstone-card p-6 sm:p-8 border border-[#E5DDD3] shadow-sandstone space-y-6">
          
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#E5DDD3] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#A04E45]" />
              <div className="w-3 h-3 rounded-full bg-[#A67C52]" />
              <div className="w-3 h-3 rounded-full bg-[#5E7A5D]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#4A3728] ml-2">LeadDesk Workspace Preview</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('Cards')}
                className={`px-3 py-1.5 rounded-[10px] text-xs font-bold transition-all ${
                  activeTab === 'Cards' ? 'bg-[#4A3728] text-white' : 'bg-[#F4EFE8] text-[#6F6A63]'
                }`}
              >
                Cards View
              </button>
              <button
                onClick={() => setActiveTab('Table')}
                className={`px-3 py-1.5 rounded-[10px] text-xs font-bold transition-all ${
                  activeTab === 'Table' ? 'bg-[#4A3728] text-white' : 'bg-[#F4EFE8] text-[#6F6A63]'
                }`}
              >
                Table View
              </button>
            </div>
          </div>

          {/* Cards View Mode */}
          {activeTab === 'Cards' ? (
            <div className="grid md:grid-cols-3 gap-6">
              {demoLeads.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-[18px] bg-[#F4EFE8] border border-[#E5DDD3] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#6F6A63]">#{item.id}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${item.badgeClass}`}>
                      {item.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-heading font-bold text-[#343434] text-base">{item.name}</h4>
                    <p className="text-xs text-[#6F6A63]">{item.email}</p>
                  </div>

                  <div className="p-3 rounded-[12px] bg-[#FFFFFF] border border-[#E5DDD3] text-xs text-[#343434]">
                    "{item.message}"
                  </div>

                  <div className="pt-2 flex justify-between text-xs font-bold text-[#4A3728]">
                    <span>Budget:</span>
                    <span>{item.budget}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Table View Mode */
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F4EFE8] border-b border-[#E5DDD3] text-[#6F6A63] font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Budget</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DDD3]">
                  {demoLeads.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3.5 px-4 font-bold text-[#343434]">{item.name}</td>
                      <td className="py-3.5 px-4 text-[#6F6A63]">{item.email}</td>
                      <td className="py-3.5 px-4 font-bold text-[#4A3728]">{item.budget}</td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${item.badgeClass}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
