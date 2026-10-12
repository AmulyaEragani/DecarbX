import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const normalized = status.toUpperCase();

  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';

  if (['VALID', 'ACTIVE', 'READY', 'COMPLETE', 'LOW', 'DEMO CONNECTED', 'ON TRACK', 'VERIFIED', 'COMPLETED', 'A+', 'A'].includes(normalized)) {
    colorClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  } else if (['WARNING', 'UNDER REVIEW', 'MEDIUM', 'IN PROGRESS', 'AT RISK', 'PENDING REVIEW', 'B', 'B-'].includes(normalized)) {
    colorClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  } else if (['REJECTED', 'HIGH', 'HIGH RISK', 'ERROR', 'FAILED', 'DISCONNECTED', 'C', 'D'].includes(normalized)) {
    colorClasses = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      {status}
    </span>
  );
};
