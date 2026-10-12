import React, { useEffect, useState } from 'react';
import { analyticsApi } from '../services/api';
import { Lightbulb, DollarSign, TrendingDown, Clock, ArrowRight } from 'lucide-react';

export const RecommendationsPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.getRecommendations().then((res) => {
      setRecommendations(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Lightbulb className="text-emerald-400" size={24} />
          Decarbonization Opportunity Recommendations
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          AI-generated carbon reduction initiatives with projected tCO2e impact, financial savings, and payback analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center p-8 text-slate-400">Loading recommendations...</div>
        ) : (
          recommendations.map((rec) => (
            <div key={rec.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {rec.category}
                </span>
                <h3 className="font-bold text-white text-sm mt-2">{rec.title}</h3>

                <div className="mt-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Est. Annual Reduction:</span>
                    <span className="font-bold text-emerald-400 font-mono">{rec.estimated_reduction_tco2e.toLocaleString()} tCO2e</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Cost Savings:</span>
                    <span className="font-bold text-white font-mono">{rec.estimated_cost_savings}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Payback Period:</span>
                    <span className="font-bold text-cyan-400 font-mono">{rec.payback_years}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-3 border-t border-slate-800/60 pt-2">
                  <strong className="text-slate-300">Rationale:</strong> {rec.why}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Difficulty: <strong className="text-white">{rec.difficulty}</strong></span>
                <button className="flex items-center space-x-1 text-emerald-400 font-bold hover:text-emerald-300 transition-colors">
                  <span>Create Project</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
