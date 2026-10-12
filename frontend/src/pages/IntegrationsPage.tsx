import React, { useEffect, useState } from 'react';
import { integrationsApi } from '../services/api';
import { Integration } from '../types';
import { Network, RefreshCw, CheckCircle2, Server, Database } from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';

import { useFilter } from '../context/FilterContext';

export const IntegrationsPage: React.FC = () => {
  const { triggerRefresh } = useFilter();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<number | null>(null);

  const loadIntegrations = () => {
    setLoading(true);
    integrationsApi.list()
      .then((data) => {
        setIntegrations(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadIntegrations();
  }, []);

  const handleSyncNow = (id: number) => {
    setSyncingId(id);
    integrationsApi.sync(id).then(() => {
      setSyncingId(null);
      loadIntegrations();
      triggerRefresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Network className="text-emerald-400" size={24} />
            Enterprise Data Sources & Integration Adapters
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Functional simulated local connectors for SAP ERP, Oracle SCM, Microsoft Dynamics, Siemens MES, Windchill PLM, and Smart IoT Meters.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-xl border border-emerald-500/30 text-xs font-semibold">
          <CheckCircle2 size={16} />
          <span>Local Demo Adapters Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 text-center p-8 text-slate-400">Loading enterprise adapters...</div>
        ) : (
          integrations.map((item) => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <h3 className="font-bold text-white text-base mt-2">{item.system_name}</h3>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                <p className="text-xs text-slate-300 mt-3">{item.details}</p>

                <div className="mt-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sync Frequency:</span>
                    <span className="font-medium text-white">{item.sync_frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Successful Sync:</span>
                    <span className="font-mono font-bold text-emerald-400">{item.last_sync}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Records Imported:</span>
                    <span className="font-mono font-bold text-white">{item.records_imported.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">Adapter Protocol: REST/gRPC</span>
                <button
                  onClick={() => handleSyncNow(item.id)}
                  disabled={syncingId === item.id}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/20 transition-colors"
                >
                  <RefreshCw size={14} className={syncingId === item.id ? 'animate-spin' : ''} />
                  <span>{syncingId === item.id ? 'Syncing...' : 'Sync Now'}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
