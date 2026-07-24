import React, { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';

const QUOTES = [
  "Every conversation begins with a lead.",
  "Great businesses begin with meaningful conversations.",
  "Opportunity favors the prepared pipeline.",
  "Clarity in communication unlocks exponential growth."
];

export default function QuoteBanner() {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * QUOTES.length);
    setQuote(QUOTES[randomIndex]);
  }, []);

  return (
    <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5E4E0] shadow-sm flex items-center gap-3">
      <Quote className="w-5 h-5 text-[#6E2132] shrink-0" />
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Today's Executive Quote</span>
        <p className="text-xs font-semibold text-[#161616] italic">"{quote}"</p>
      </div>
    </div>
  );
}
