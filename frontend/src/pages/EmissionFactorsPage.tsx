import React, { useEffect, useState } from 'react';
import { emissionFactorsApi } from '../services/api';
import { EmissionFactor } from '../types';
import { Scale, Info, CheckCircle, Database } from 'lucide-react';

export const EmissionFactorsPage: React.FC = () => {
  const [factors, setFactors] = useState<EmissionFactor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    emissionFactorsApi.list()
      .then((data) => {
        setFactors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Scale className="text-emerald-400" size={24} />
            Emission Factor Library & Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global carbon intensity factors mapped to GHG Protocol standards (DEFRA, EPA, IEA, Ecoinvent).
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-amber-400">
          <Info size={14} />
          <span>Demo reference factors clearly labeled</span>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Activity Type</th>
              <th className="p-4">Scope</th>
              <th className="p-4">Factor Value</th>
              <th className="p-4">Unit</th>
              <th className="p-4">Source Authority</th>
              <th className="p-4">Region / Year</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {loading ? (
              <tr><td colSpan={7} className="p-6 text-center text-slate-400">Loading emission factors...</td></tr>
            ) : (
              factors.map((ef) => (
                <tr key={ef.id} className="hover:bg-slate-800/40">
                  <td className="p-4 font-semibold text-white">{ef.activity_type}</td>
                  <td className="p-4">
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] font-bold text-emerald-400 border border-slate-700">
                      {ef.scope}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-bold text-white">{ef.factor}</td>
                  <td className="p-4 font-mono text-slate-400">kgCO2e / {ef.unit}</td>
                  <td className="p-4 text-slate-300">{ef.source}</td>
                  <td className="p-4 text-slate-400">{ef.region} ({ef.year})</td>
                  <td className="p-4">
                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-semibold">
                      DEMO REFERENCE
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
