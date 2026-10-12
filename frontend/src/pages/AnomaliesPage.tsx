import React, { useEffect, useState } from 'react';
import { analyticsApi } from '../services/api';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';

export const AnomaliesPage: React.FC = () => {
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.getAnomalies().then((res) => {
      setAnomalies(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <AlertTriangle className="text-amber-400" size={24} />
          AI Anomaly & Outlier Detection
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Automated identification of abnormal energy spikes, facility consumption deviations, and data entry errors.
        </p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading anomalies...</div>
        ) : (
          anomalies.map((anom) => (
            <div key={anom.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{anom.title}</h3>
                    <div className="text-[11px] text-slate-400 font-medium">{anom.facility}</div>
                  </div>
                </div>
                <StatusBadge status={anom.severity} />
              </div>

              <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                {anom.description}
              </p>

              <div className="text-xs text-slate-400 pt-2 flex items-center space-x-2">
                <strong className="text-emerald-400">Recommended Action:</strong>
                <span>{anom.recommendation}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
