import React, { useEffect, useState } from 'react';
import { suppliersApi } from '../services/api';
import { Award, Award as AwardIcon } from 'lucide-react';

export const SupplierScorecardsPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    suppliersApi.list().then((data) => {
      setSuppliers(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Award className="text-emerald-400" size={24} />
          Supplier Carbon & ESG Scorecards
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Multi-dimensional vendor ratings evaluating carbon intensity, data quality, governance, and net-zero alignment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center p-8 text-slate-400">Loading scorecards...</div>
        ) : (
          suppliers.map((s) => (
            <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">{s.name}</h3>
                  <div className="text-[10px] text-slate-400 font-mono">{s.code} • {s.category}</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-black text-lg text-emerald-400 font-mono">
                  {s.grade || 'A'}
                </div>
              </div>

              <div className="space-y-2 text-xs pt-2 border-t border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Carbon Intensity Score</span>
                  <span className="font-mono font-bold text-emerald-400">{s.sustainability_score} / 100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Scope 3 Data Quality</span>
                  <span className="font-mono font-bold text-cyan-400">{s.data_quality_score}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">ESG Governance & Compliance</span>
                  <span className="font-mono font-bold text-amber-400">{s.risk_level === 'Low' ? 85 : 55} / 100</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
