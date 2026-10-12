import React, { useEffect, useState } from 'react';
import { reductionApi } from '../services/api';
import { Target, TrendingDown, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';
import { KPICard } from '../components/ui/KPICard';

export const ReductionTargetsPage: React.FC = () => {
  const [targets, setTargets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reductionApi.getTargets().then((res) => {
      setTargets(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Target className="text-emerald-400" size={24} />
          Corporate Science-Based Net-Zero Targets
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Baseline emissions (2023) vs 2030 targets compliant with SBTi 1.5°C Paris Agreement trajectory.
        </p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading targets...</div>
        ) : (
          targets.map((t) => (
            <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-extrabold text-white">{t.name}</h3>
                    <StatusBadge status={t.status} />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Scope Coverage: {t.scope_coverage}</p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Target Reduction</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">-{t.reduction_pct}%</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Baseline ({t.baseline_year})</div>
                  <div className="text-xl font-bold text-white font-mono">{t.baseline_emissions_tco2e.toLocaleString()} tCO2e</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Current YTD</div>
                  <div className="text-xl font-bold text-amber-400 font-mono">{t.current_emissions_tco2e.toLocaleString()} tCO2e</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Target ({t.target_year})</div>
                  <div className="text-xl font-bold text-emerald-400 font-mono">{t.target_emissions_tco2e.toLocaleString()} tCO2e</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
