import React, { useEffect, useState } from 'react';
import { analyticsApi } from '../services/api';
import { BrainCircuit, AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';

export const AIAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.getAll()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return <div className="p-8 text-center text-slate-400">Loading AI Environmental Analytics Engine...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <BrainCircuit className="text-emerald-400" size={24} />
          AI Environmental Intelligence & Analytics
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Automated trend detection, anomaly identification, emission driver analysis, and rule-backed decarbonization recommendations.
        </p>
      </div>

      {/* Driver Insights */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <TrendingUp className="text-cyan-400" size={18} />
          Primary Carbon Drivers & Root Cause Analysis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.insights.map((ins: any) => (
            <div key={ins.id} className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-2">
              <div className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">{ins.category}</div>
              <h4 className="font-bold text-white text-xs">{ins.title}</h4>
              <p className="text-xs text-slate-300 font-medium">{ins.impact}</p>
              <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-700/50">
                <strong className="text-slate-300">Why it occurred:</strong> {ins.explanation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
