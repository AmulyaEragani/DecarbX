import React, { useEffect, useState } from 'react';
import { emissionsApi } from '../services/api';
import { Emission } from '../types';
import { Flame, Factory, Truck, Fuel } from 'lucide-react';
import { KPICard } from '../components/ui/KPICard';

export const Scope1Page: React.FC = () => {
  const [emissions, setEmissions] = useState<Emission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    emissionsApi.list('Scope 1')
      .then((data) => {
        setEmissions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const totalScope1 = emissions.reduce((acc, curr) => acc + curr.co2e_tonnes, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Flame className="text-rose-500" size={24} />
          Scope 1 Direct Emissions
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Direct greenhouse gas emissions from sources owned or controlled by the enterprise (onsite natural gas, diesel fleet, stationary combustion).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Total Scope 1 Emissions" value={totalScope1.toLocaleString()} unit="tCO2e" icon={Flame} accentColor="rose" />
        <KPICard title="Natural Gas Combustion" value={(totalScope1 * 0.60).toFixed(1)} unit="tCO2e" icon={Factory} accentColor="amber" />
        <KPICard title="Company Fleet & Transport" value={(totalScope1 * 0.40).toFixed(1)} unit="tCO2e" icon={Truck} accentColor="indigo" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 font-bold text-sm text-white">Scope 1 Activity Calculation Ledger</div>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Activity Source</th>
              <th className="p-4">Quantity & Unit</th>
              <th className="p-4">Emission Factor</th>
              <th className="p-4">Calculated tCO2e</th>
              <th className="p-4">Reporting Period</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {loading ? (
              <tr><td colSpan={5} className="p-6 text-center text-slate-400">Loading Scope 1 data...</td></tr>
            ) : emissions.length === 0 ? (
              <tr><td colSpan={5} className="p-6 text-center text-slate-400">No Scope 1 emissions found.</td></tr>
            ) : (
              emissions.map((e) => (
                <tr key={e.id} className="hover:bg-slate-800/40">
                  <td className="p-4 font-semibold text-white">Scope 1 Direct Source #{e.activity_id}</td>
                  <td className="p-4 font-mono">{e.quantity.toLocaleString()} {e.unit}</td>
                  <td className="p-4 font-mono text-slate-400">{e.emission_factor_value} kgCO2e/{e.unit}</td>
                  <td className="p-4 font-mono font-bold text-rose-400">{e.co2e_tonnes.toLocaleString()} tCO2e</td>
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
