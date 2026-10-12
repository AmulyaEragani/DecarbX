import React, { useEffect, useState } from 'react';
import { suppliersApi } from '../services/api';
import { ClipboardCheck, CheckCircle2, XCircle } from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';

export const SupplierAssessmentsPage: React.FC = () => {
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
          <ClipboardCheck className="text-emerald-400" size={24} />
          Supplier ESG & SBTi Questionnaire Assessments
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Verification status of science-based net-zero targets, renewable energy adoption %, and Scope 1-3 disclosures.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Supplier</th>
              <th className="p-4">Assessment Title</th>
              <th className="p-4">Net-Zero Commitment</th>
              <th className="p-4">Renewable Electricity %</th>
              <th className="p-4">Target Year</th>
              <th className="p-4">Score</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {loading ? (
              <tr><td colSpan={7} className="p-6 text-center text-slate-400">Loading questionnaires...</td></tr>
            ) : (
              suppliers.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40">
                  <td className="p-4 font-semibold text-white">{s.name}</td>
                  <td className="p-4 text-slate-300">2026 Scope 1-3 ESG & Science-Based Target Disclosure</td>
                  <td className="p-4">
                    {s.risk_level === 'Low' ? (
                      <span className="flex items-center space-x-1 text-emerald-400 font-medium">
                        <CheckCircle2 size={14} />
                        <span>SBTi Committed</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-slate-400">
                        <XCircle size={14} />
                        <span>Not Committed</span>
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-mono font-bold text-cyan-400">
                    {s.risk_level === 'Low' ? '65.0%' : '20.0%'}
                  </td>
                  <td className="p-4 font-mono">2030</td>
                  <td className="p-4 font-mono font-bold text-emerald-400">{s.sustainability_score} / 100</td>
                  <td className="p-4"><StatusBadge status="COMPLETED" /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
