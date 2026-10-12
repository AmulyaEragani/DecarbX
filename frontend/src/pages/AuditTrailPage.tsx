import React, { useEffect, useState } from 'react';
import { auditApi } from '../services/api';
import { AuditLog } from '../types';
import { History, Activity as ActivityIcon } from 'lucide-react';

export const AuditTrailPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auditApi.list().then((res) => {
      setLogs(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <History className="text-emerald-400" size={24} />
          Immutable Environmental Audit Trail
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Double-entry audit log recording every data upload, factor change, emission calculation, and scenario save.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">User / Agent</th>
              <th className="p-4">Action</th>
              <th className="p-4">Entity</th>
              <th className="p-4">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
            {loading ? (
              <tr><td colSpan={5} className="p-6 text-center text-slate-400 font-sans">Loading audit logs...</td></tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 font-sans">
                  <td className="p-4 text-slate-400 font-mono text-[11px]">{log.timestamp}</td>
                  <td className="p-4 text-emerald-400 font-semibold">{log.user}</td>
                  <td className="p-4 font-bold text-white">{log.action}</td>
                  <td className="p-4"><span className="bg-slate-800 px-2 py-0.5 rounded text-[11px]">{log.entity}</span></td>
                  <td className="p-4 text-slate-300 text-xs">{log.description}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
