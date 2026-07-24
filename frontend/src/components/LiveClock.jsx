import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function LiveClock() {
  const [timeStr, setTimeStr] = useState('');
  const [dayStr, setDayStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format time in Indian Standard Time (Bangalore)
      const time = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).format(now);

      const day = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }).format(now);

      setTimeStr(time);
      setDayStr(day);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E5E4E0] text-[11px] font-medium text-[#6B7280] shadow-sm">
      <span className="w-1.5 h-1.5 rounded-full bg-[#6E2132] animate-pulse" />
      <span className="font-semibold text-[#161616]">Bangalore</span>
      <span className="text-[#E5E4E0]">•</span>
      <span className="font-mono text-[#161616] font-semibold">{timeStr}</span>
      <span className="text-[#E5E4E0]">•</span>
      <span className="text-[#6B7280]">{dayStr}</span>
    </div>
  );
}
