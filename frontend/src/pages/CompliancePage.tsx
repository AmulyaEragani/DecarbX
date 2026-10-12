import React, { useEffect, useState } from 'react';
import { complianceApi } from '../services/api';
import { ShieldCheck, FileCheck2, AlertCircle } from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';

export const CompliancePage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    complianceApi.getOverview().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="text-emerald-400" size={24} />
          Compliance & Regulatory Readiness Center
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Evaluate reporting preparation and data completeness for GHG Protocol, EU CSRD / ESRS E1, CDP, and BRSR standards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading || !data ? (
          <div className="col-span-2 text-center p-8 text-slate-400">Loading framework readiness...</div>
        ) : (
          data.frameworks.map((f: any) => (
            <div key={f.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">{f.name}</h3>
                  <div className="text-[11px] text-slate-400 mt-0.5">Assurance Status: <span className="text-emerald-400 font-semibold">{f.assurance_status}</span></div>
                </div>
                <StatusBadge status={f.status} />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">Readiness & Completeness Score</span>
                  <span className="text-emerald-400 font-mono">{f.readiness_pct}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${f.readiness_pct}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800 text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Scope 1</div>
                  <div className="font-bold text-emerald-400 font-mono mt-0.5">{f.scope1}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Scope 2</div>
                  <div className="font-bold text-cyan-400 font-mono mt-0.5">{f.scope2}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Scope 3</div>
                  <div className="font-bold text-amber-400 font-mono mt-0.5">{f.scope3}</div>
                </div>
              </div>

              <p className="text-xs text-slate-400 pt-2 border-t border-slate-800">
                <strong className="text-slate-300">Notes:</strong> {f.notes}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
