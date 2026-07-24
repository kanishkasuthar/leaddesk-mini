import React from 'react';
import { Plus, RefreshCw, Download } from 'lucide-react';

export default function QuickActions({ onAddLead, onRefresh, onExportCSV }) {
  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2 bg-[#FFFFFF] border border-[#E5E4E0] p-1.5 rounded-2xl shadow-xl">
      <button
        onClick={onAddLead}
        title="Add New Lead (Shortcut: N)"
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#6E2132] hover:bg-[#541926] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Add Lead</span>
      </button>

      <button
        onClick={onRefresh}
        title="Refresh Telemetry"
        className="p-2 rounded-xl hover:bg-[#F6F5F2] text-[#161616] border border-[#E5E4E0] transition-colors"
      >
        <RefreshCw className="w-4 h-4 text-[#6E2132]" />
      </button>

      <button
        onClick={onExportCSV}
        title="Export CSV"
        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#F6F5F2] text-[#161616] border border-[#E5E4E0] text-xs font-bold uppercase tracking-wider transition-colors"
      >
        <Download className="w-4 h-4 text-[#6E2132]" />
        <span className="hidden sm:inline">Export CSV</span>
      </button>
    </div>
  );
}
