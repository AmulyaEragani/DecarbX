import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  subtext?: string;
  accentColor?: 'emerald' | 'cyan' | 'amber' | 'indigo' | 'rose';
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  change,
  changeType = 'positive',
  icon: Icon,
  subtext,
  accentColor = 'emerald'
}) => {
  const accentClasses = {
    emerald: 'border-l-4 border-emerald-500 text-emerald-400 bg-emerald-500/10',
    cyan: 'border-l-4 border-cyan-500 text-cyan-400 bg-cyan-500/10',
    amber: 'border-l-4 border-amber-500 text-amber-400 bg-amber-500/10',
    indigo: 'border-l-4 border-indigo-500 text-indigo-400 bg-indigo-500/10',
    rose: 'border-l-4 border-rose-500 text-rose-400 bg-rose-500/10',
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
          <div className={`p-2.5 rounded-lg ${accentClasses[accentColor]}`}>
            <Icon size={20} />
          </div>
        </div>

        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold tracking-tight text-white">{value}</span>
          {unit && <span className="text-sm font-medium text-slate-400">{unit}</span>}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        {change && (
          <span className={`font-semibold ${changeType === 'positive' ? 'text-emerald-400' : changeType === 'negative' ? 'text-rose-400' : 'text-slate-400'}`}>
            {change}
          </span>
        )}
        {subtext && <span className="text-slate-400 truncate">{subtext}</span>}
      </div>
    </div>
  );
};
