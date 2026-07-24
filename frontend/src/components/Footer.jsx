import React from 'react';
import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#FFFFFF] border-t border-[#E5DDD3] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[12px] bg-[#4A3728] flex items-center justify-center text-[#CDAA7D] font-bold text-sm">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-heading text-lg font-bold text-[#343434] tracking-tight">
              LeadDesk <span className="text-[#4A3728]">Mini</span>
            </span>
          </div>

          {/* Exact Mandatory Attribution Statement */}
          <div className="text-xs text-[#6F6A63] font-medium text-center md:text-right">
            Built for{' '}
            <a
              href="https://digitalheroesco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4A3728] hover:text-[#34261C] font-semibold underline underline-offset-4 decoration-[#CDAA7D] transition-colors"
            >
              Digital Heroes
            </a>{' '}
            Training Task
          </div>

        </div>

        {/* Tech Badges */}
        <div className="mt-8 pt-6 border-t border-[#F4EFE8] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6F6A63] gap-4">
          <p>© {new Date().getFullYear()} LeadDesk Mini. Sandstone & Espresso Edition.</p>
          
          <div className="flex items-center gap-2 flex-wrap">
            {['React', 'Vite', 'Node', 'Express', 'MySQL', 'Tailwind'].map((tech) => (
              <span key={tech} className="px-2.5 py-0.5 rounded-full bg-[#F4EFE8] text-[#4A3728] border border-[#E5DDD3] text-[10px] font-bold uppercase tracking-wider">
                {tech}
              </span>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
