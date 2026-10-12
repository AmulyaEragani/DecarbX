import React, { useEffect, useState } from 'react';
import { emissionsApi } from '../services/api';
import { Emission } from '../types';
import { Truck, PackageCheck, Plane, Users } from 'lucide-react';
import { KPICard } from '../components/ui/KPICard';

export const Scope3Page: React.FC = () => {
  const [emissions, setEmissions] = useState<Emission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    emissionsApi.list('Scope 3')
      .then((data) => {
        setEmissions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const totalScope3 = emissions.reduce((acc, curr) => acc + curr.co2e_tonnes, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Truck className="text-amber-400" size={24} />
          Scope 3 Value Chain Emissions
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Upstream and downstream emissions across the corporate value chain (purchased goods & services, logistics, business travel, waste, employee commuting).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Total Scope 3 Emissions" value={totalScope3.toLocaleString()} unit="tCO2e" icon={Truck} accentColor="amber" />
        <KPICard title="Cat 1: Purchased Goods" value={(totalScope3 * 0.55).toFixed(1)} unit="tCO2e" icon={PackageCheck} accentColor="emerald" />
        <KPICard title="Cat 4: Upstream Freight" value={(totalScope3 * 0.25).toFixed(1)} unit="tCO2e" icon={Truck} accentColor="cyan" />
        <KPICard title="Cat 6: Business Travel" value={(totalScope3 * 0.20).toFixed(1)} unit="tCO2e" icon={Plane} accentColor="indigo" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 font-bold text-sm text-white">Scope 3 Activity & Supply Chain Calculations</div>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Supply Chain Activity</th>
              <th className="p-4">Quantity & Unit</th>
              <th className="p-4">Factor Source</th>
              <th className="p-4">Calculated tCO2e</th>
              <th className="p-4">Period</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {loading ? (
              <tr><td colSpan={5} className="p-6 text-center text-slate-400">Loading Scope 3 data...</td></tr>
            ) : emissions.length === 0 ? (
              <tr><td colSpan={5} className="p-6 text-center text-slate-400">No Scope 3 emissions found.</td></tr>
            ) : (
              emissions.map((e) => (
                <tr key={e.id} className="hover:bg-slate-800/40">
                  <td className="p-4 font-semibold text-white">Scope 3 Value Chain Item #{e.activity_id}</td>
                  <td className="p-4 font-mono">{e.quantity.toLocaleString()} {e.unit}</td>
                  <td className="p-4 font-mono text-slate-400">{e.emission_factor_source}</td>
                  <td className="p-4 font-mono font-bold text-amber-400">{e.co2e_tonnes.toLocaleString()} tCO2e</td>
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
