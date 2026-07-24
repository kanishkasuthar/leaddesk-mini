import React from 'react';

export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-[#E5E4E0]/60">
      <td className="py-4 px-6">
        <div className="h-4 bg-[#E5E4E0] rounded-md w-28" />
      </td>
      <td className="py-4 px-6">
        <div className="h-4 bg-[#E5E4E0] rounded-md w-36" />
      </td>
      <td className="py-4 px-6">
        <div className="h-4 bg-[#E5E4E0] rounded-md w-24" />
      </td>
      <td className="py-4 px-6">
        <div className="h-4 bg-[#E5E4E0] rounded-md w-48" />
      </td>
      <td className="py-4 px-6">
        <div className="h-4 bg-[#E5E4E0] rounded-md w-20" />
      </td>
      <td className="py-4 px-6">
        <div className="h-7 bg-[#E5E4E0] rounded-lg w-24" />
      </td>
    </tr>
  );
}

export function CardSkeleton() {
  return (
    <div className="monolith-card p-6 rounded-2xl border border-[#E5E4E0] animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-3 bg-[#E5E4E0] rounded w-20" />
        <div className="w-8 h-8 bg-[#E5E4E0] rounded-xl" />
      </div>
      <div className="h-8 bg-[#E5E4E0] rounded-lg w-16" />
    </div>
  );
}
