import React, { useEffect, useState } from 'react';
import { reductionApi } from '../services/api';
import { FolderKanban, CheckCircle2, TrendingUp, DollarSign } from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reductionApi.getProjects().then((res) => {
      setProjects(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <FolderKanban className="text-emerald-400" size={24} />
          Decarbonization Reduction Projects
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Active capital decarbonization projects, ROI tracking, expected tCO2e reduction, and facility assignments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 text-center p-8 text-slate-400">Loading reduction projects...</div>
        ) : (
          projects.map((p) => (
            <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {p.category}
                  </span>
                  <h3 className="font-bold text-white text-sm mt-1.5">{p.name}</h3>
                  <div className="text-[11px] text-slate-400">Owner: {p.owner}</div>
                </div>
                <StatusBadge status={p.status} />
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center text-xs">
                <div>
                  <div className="text-[10px] uppercase text-slate-400">Investment</div>
                  <div className="font-bold text-white font-mono mt-0.5">${(p.investment_amount / 1000000).toFixed(2)}M</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-slate-400">Est. Reduction</div>
                  <div className="font-bold text-emerald-400 font-mono mt-0.5">{p.expected_reduction_tco2e.toLocaleString()} tCO2e</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-slate-400">Expected ROI</div>
                  <div className="font-bold text-cyan-400 font-mono mt-0.5">{p.roi_pct}%</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
