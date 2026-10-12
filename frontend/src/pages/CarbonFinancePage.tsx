import React, { useEffect, useState } from 'react';
import { financeApi } from '../services/api';
import { Coins, DollarSign, TrendingDown } from 'lucide-react';
import { KPICard } from '../components/ui/KPICard';

export const CarbonFinancePage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    financeApi.getOverview().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return <div className="p-8 text-center text-slate-400">Loading Carbon Finance summary...</div>;
  }

  const { summary, budgets } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Coins className="text-emerald-400" size={24} />
          Enterprise Carbon Finance & Budget Allocation
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Internal carbon pricing ($/tCO2e), capital expenditure budgets, and remaining carbon allowances per manufacturing plant.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Total Carbon Budget" value={summary.total_allocated_tco2e.toLocaleString()} unit="tCO2e" icon={Coins} accentColor="emerald" />
        <KPICard title="Spent Carbon Allowance" value={summary.total_spent_tco2e.toLocaleString()} unit="tCO2e" icon={TrendingDown} accentColor="amber" />
        <KPICard title="Remaining Carbon" value={summary.remaining_carbon_tco2e.toLocaleString()} unit="tCO2e" icon={Coins} accentColor="cyan" />
        <KPICard title="Financial CapEx Budget" value={`$${(summary.total_financial_budget / 1000000).toFixed(2)}M`} icon={DollarSign} accentColor="indigo" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 font-bold text-sm text-white">Facility Carbon Budget Allocation (2026)</div>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Facility ID</th>
              <th className="p-4">Allocated tCO2e</th>
              <th className="p-4">Spent tCO2e</th>
              <th className="p-4">Remaining tCO2e</th>
              <th className="p-4">Financial Budget ($)</th>
              <th className="p-4">Burn Rate %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {budgets.map((b: any) => (
              <tr key={b.id} className="hover:bg-slate-800/40 font-mono">
                <td className="p-4 font-bold text-white font-sans">Facility #{b.facility_id}</td>
                <td className="p-4 text-white font-bold">{b.allocated_tco2e.toLocaleString()} tCO2e</td>
                <td className="p-4 text-amber-400 font-bold">{b.spent_tco2e.toLocaleString()} tCO2e</td>
                <td className="p-4 text-emerald-400 font-bold">{b.remaining_tco2e.toLocaleString()} tCO2e</td>
                <td className="p-4 text-slate-200">${b.budget_amount.toLocaleString()}</td>
                <td className="p-4 font-bold text-cyan-400">{Math.round((b.spent_tco2e / b.allocated_tco2e) * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
