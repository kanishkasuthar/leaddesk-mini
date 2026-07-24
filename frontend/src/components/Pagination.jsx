import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalItems, itemsPerPage = 10, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-[#F6F5F2] border-t border-[#E5E4E0] text-xs text-[#6B7280] font-medium">
      {/* Summary */}
      <div>
        Showing <span className="text-[#161616] font-bold">{startItem}</span> to{' '}
        <span className="text-[#161616] font-bold">{endItem}</span> of{' '}
        <span className="text-[#6E2132] font-bold">{totalItems}</span> opportunities
      </div>

      {/* Page controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="p-2 rounded-xl bg-[#FFFFFF] border border-[#E5E4E0] text-[#161616] hover:text-[#6E2132] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                currentPage === page
                  ? 'bg-[#6E2132] text-white shadow-burgundy'
                  : 'bg-[#FFFFFF] text-[#6B7280] hover:text-[#161616] border border-[#E5E4E0]'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="p-2 rounded-xl bg-[#FFFFFF] border border-[#E5E4E0] text-[#161616] hover:text-[#6E2132] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
