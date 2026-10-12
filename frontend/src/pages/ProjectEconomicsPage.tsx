import React, { useEffect, useState } from 'react';
import { financeApi } from '../services/api';
import { TrendingUp, DollarSign, BarChart2 } from 'lucide-react';

export const ProjectEconomicsPage: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    financeApi.getProjects().then((res) => {
      setProjects(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="text-emerald-400" size={24} />
          Marginal Abatement Cost & Project Economics
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Cost per tonne of CO2e reduced ($/tCO2e), financial return on investment (ROI), and marginal abatement efficiency curve.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Project Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Capital Investment</th>
              <th className="p-4">Expected tCO2e Reduced</th>
              <th className="p-4">Cost per tCO2e Reduced</th>
              <th className="p-4">ROI %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {loading ? (
              <tr><td colSpan={6} className="p-6 text-center text-slate-400">Loading project economics...</td></tr>
            ) : (
              projects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40">
                  <td className="p-4 font-semibold text-white">{p.name}</td>
                  <td className="p-4"><span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] font-medium text-emerald-400">{p.category}</span></td>
                  <td className="p-4 font-mono font-bold text-white">${p.investment_amount.toLocaleString()}</td>
                  <td className="p-4 font-mono font-bold text-emerald-400">{p.expected_reduction_tco2e.toLocaleString()} tCO2e</td>
                  <td className="p-4 font-mono font-bold text-amber-400">${(p.investment_amount / max(p.expected_reduction_tco2e, 1)).toFixed(2)} / tCO2e</td>
                  <td className="p-4 font-mono font-bold text-cyan-400">{p.roi_pct}%</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function max(a: number, b: number): number {
  return a > b ? a : b;
}
