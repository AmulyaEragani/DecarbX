import React from 'react';
import { Building2, Calendar, Factory, Search, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useFilter } from '../../context/FilterContext';

export const Header: React.FC = () => {
  const {
    selectedFacilityId,
    setSelectedFacilityId,
    selectedPeriod,
    setSelectedPeriod,
    facilities,
    triggerRefresh
  } = useFilter();

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Organization & Context Selectors */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs font-semibold text-white">
          <Building2 size={15} className="text-emerald-400" />
          <span className="hidden sm:inline">Acme Manufacturing Group</span>
        </div>

        {/* Dynamic Facility Selector */}
        <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700/60 text-xs text-slate-300">
          <Factory size={14} className="text-cyan-400 shrink-0" />
          <select
            value={selectedFacilityId === undefined ? '' : selectedFacilityId}
            onChange={(e) => setSelectedFacilityId(e.target.value === '' ? undefined : Number(e.target.value))}
            className="bg-transparent text-xs font-medium text-white focus:outline-none cursor-pointer"
          >
            <option value="" className="bg-slate-900 text-white">All Facilities (4 Sites)</option>
            {facilities.map((f) => (
              <option key={f.id} value={f.id} className="bg-slate-900 text-white">
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic Period Selector */}
        <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700/60 text-xs text-slate-300">
          <Calendar size={14} className="text-amber-400 shrink-0" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-transparent text-xs font-medium text-white focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-slate-900 text-white">All Reporting Periods</option>
            <option value="2026-Q1" className="bg-slate-900 text-white">2026 - Q1 YTD</option>
            <option value="2025-YTD" className="bg-slate-900 text-white">2025 - Full Year YTD</option>
            <option value="2025-Q4" className="bg-slate-900 text-white">2025 - Q4</option>
            <option value="2025-Q3" className="bg-slate-900 text-white">2025 - Q3</option>
            <option value="2025-Q2" className="bg-slate-900 text-white">2025 - Q2</option>
          </select>
        </div>
      </div>

      {/* Right: Search, Refresh Button & User Profile */}
      <div className="flex items-center space-x-3">
        {/* Refresh Data Action Button */}
        <button
          onClick={triggerRefresh}
          title="Refresh Data & Recalculate Metrics"
          className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold transition-all shadow"
        >
          <RefreshCw size={14} />
          <span className="hidden sm:inline">Refresh Data</span>
        </button>

        {/* Data Quality Indicator */}
        <div className="hidden lg:flex items-center space-x-1.5 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30 text-xs font-medium">
          <CheckCircle2 size={14} />
          <span>Data Quality: 96.8%</span>
        </div>

        {/* User Context */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-xs text-emerald-400">
            SA
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-white leading-tight">Sustainability Architect</div>
            <div className="text-[10px] text-slate-400">GHG Auditor & Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
};
