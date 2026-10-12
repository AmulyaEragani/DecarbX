import React, { useEffect, useState } from 'react';
import { suppliersApi } from '../services/api';
import { Supplier } from '../types';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Users, AlertTriangle, ShieldCheck, FileSpreadsheet } from 'lucide-react';
import { KPICard } from '../components/ui/KPICard';

export const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    suppliersApi.list()
      .then((data) => {
        setSuppliers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const totalEmissions = suppliers.reduce((acc, curr) => acc + curr.total_emissions_tco2e, 0);
  const avgDataQuality = suppliers.length ? Math.round(suppliers.reduce((acc, curr) => acc + curr.data_quality_score, 0) / suppliers.length) : 0;
  const highRiskCount = suppliers.filter((s) => s.risk_level === 'High').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Users className="text-emerald-400" size={24} />
          Supplier Sustainability Network & Scope 3
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor vendor carbon footprint, ESG risk tiers, Scope 3 data completeness, and climate commitments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Total Vendor Emissions" value={totalEmissions.toLocaleString()} unit="tCO2e" icon={Users} accentColor="amber" />
        <KPICard title="Avg Data Quality" value={`${avgDataQuality}%`} icon={ShieldCheck} accentColor="emerald" />
        <KPICard title="High Risk Suppliers" value={highRiskCount} icon={AlertTriangle} accentColor="rose" />
        <KPICard title="Active Tier-1 Vendors" value={suppliers.length} icon={FileSpreadsheet} accentColor="indigo" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Supplier Name</th>
              <th className="p-4">Category & Country</th>
              <th className="p-4">Scope 3 Emissions</th>
              <th className="p-4">Data Quality %</th>
              <th className="p-4">Sustainability Score</th>
              <th className="p-4">Risk Level</th>
              <th className="p-4">ESG Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {loading ? (
              <tr><td colSpan={7} className="p-6 text-center text-slate-400">Loading suppliers data...</td></tr>
            ) : (
              suppliers.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40">
                  <td className="p-4 font-semibold text-white">
                    {s.name}
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{s.code}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-slate-200">{s.category}</div>
                    <div className="text-[10px] text-slate-400">{s.country}</div>
                  </td>
                  <td className="p-4 font-mono font-bold text-amber-400">
                    {s.total_emissions_tco2e.toLocaleString()} tCO2e
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: `${s.data_quality_score}%` }} />
                      </div>
                      <span className="font-mono text-white font-bold">{s.data_quality_score}%</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-bold text-emerald-400">
                    {s.sustainability_score} / 100
                  </td>
                  <td className="p-4">
                    <StatusBadge status={s.risk_level === 'High' ? 'HIGH RISK' : s.risk_level === 'Medium' ? 'MEDIUM' : 'LOW'} />
                  </td>
                  <td className="p-4 font-black text-white text-sm">
                    <span className="bg-slate-800 px-2.5 py-1 rounded border border-slate-700 font-mono">
                      {s.grade || 'A'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
