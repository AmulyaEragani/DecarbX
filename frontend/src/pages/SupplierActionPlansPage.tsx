import React, { useEffect, useState } from 'react';
import { suppliersApi } from '../services/api';
import { ListTodo, CheckCircle } from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';

export const SupplierActionPlansPage: React.FC = () => {
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
          <ListTodo className="text-emerald-400" size={24} />
          Supplier Decarbonization Action Plans
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Corrective action plans, renewable energy transition roadmap mandates, and progress tracking for Tier-1 vendors.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Supplier</th>
              <th className="p-4">Action Plan Mandate</th>
              <th className="p-4">Target Date</th>
              <th className="p-4">Progress %</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {loading ? (
              <tr><td colSpan={5} className="p-6 text-center text-slate-400">Loading action plans...</td></tr>
            ) : (
              suppliers.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40">
                  <td className="p-4 font-semibold text-white">{s.name}</td>
                  <td className="p-4 text-slate-300">
                    <div className="font-semibold text-white">Green Energy Transition & EPD Certification</div>
                    <div className="text-[10px] text-slate-400">Increase renewable electricity procurement to 80% and submit verified EPDs.</div>
                  </td>
                  <td className="p-4 font-mono">2026-12-31</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: '45%' }} />
                      </div>
                      <span className="font-mono font-bold text-white">45%</span>
                    </div>
                  </td>
                  <td className="p-4"><StatusBadge status="IN PROGRESS" /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
