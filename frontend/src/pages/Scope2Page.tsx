import React, { useEffect, useState } from 'react';
import { emissionsApi } from '../services/api';
import { Emission } from '../types';
import { Zap, Sun, Building } from 'lucide-react';
import { KPICard } from '../components/ui/KPICard';

export const Scope2Page: React.FC = () => {
  const [emissions, setEmissions] = useState<Emission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    emissionsApi.list('Scope 2')
      .then((data) => {
        setEmissions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const totalScope2 = emissions.reduce((acc, curr) => acc + curr.co2e_tonnes, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Zap className="text-cyan-400" size={24} />
          Scope 2 Indirect Energy Emissions
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Indirect emissions from purchased electricity, steam, heating, and cooling consumed across enterprise facilities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Total Scope 2 Emissions" value={totalScope2.toLocaleString()} unit="tCO2e" icon={Zap} accentColor="cyan" />
        <KPICard title="Renewable Energy Share" value="28.5%" change="+6.2% YoY" changeType="positive" icon={Sun} accentColor="emerald" />
        <KPICard title="Grid Energy Intensity" value="0.42" unit="kgCO2e/kWh" icon={Building} accentColor="amber" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 font-bold text-sm text-white">Scope 2 Utility Ledger</div>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Utility Type</th>
              <th className="p-4">Consumption</th>
              <th className="p-4">Grid Factor</th>
              <th className="p-4">Calculated tCO2e</th>
              <th className="p-4">Period</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {loading ? (
              <tr><td colSpan={5} className="p-6 text-center text-slate-400">Loading Scope 2 data...</td></tr>
            ) : emissions.length === 0 ? (
              <tr><td colSpan={5} className="p-6 text-center text-slate-400">No Scope 2 emissions found.</td></tr>
            ) : (
              emissions.map((e) => (
                <tr key={e.id} className="hover:bg-slate-800/40">
                  <td className="p-4 font-semibold text-white">Purchased Energy #{e.activity_id}</td>
                  <td className="p-4 font-mono">{e.quantity.toLocaleString()} {e.unit}</td>
                  <td className="p-4 font-mono text-slate-400">{e.emission_factor_value} kgCO2e/{e.unit}</td>
                  <td className="p-4 font-mono font-bold text-cyan-400">{e.co2e_tonnes.toLocaleString()} tCO2e</td>
                  <td className="p-4 text-slate-400">{e.period}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
