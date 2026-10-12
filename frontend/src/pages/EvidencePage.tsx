import React, { useEffect, useState } from 'react';
import { complianceApi } from '../services/api';
import { Evidence } from '../types';
import { FileCheck, FileText, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';

export const EvidencePage: React.FC = () => {
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    complianceApi.getEvidence().then((res) => {
      setEvidence(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <FileCheck className="text-emerald-400" size={24} />
          Digital Audit Evidence & Assurance Library
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Third-party utility billing statements, fuel logs, EPD certificates, and ISO 14064 verification documents.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Document Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Uploaded Date</th>
              <th className="p-4">Period</th>
              <th className="p-4">Verification Status</th>
              <th className="p-4">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {loading ? (
              <tr><td colSpan={6} className="p-6 text-center text-slate-400">Loading evidence library...</td></tr>
            ) : (
              evidence.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-800/40">
                  <td className="p-4 font-semibold text-white flex items-center space-x-2">
                    <FileText size={16} className="text-emerald-400 shrink-0" />
                    <span>{doc.document_name}</span>
                  </td>
                  <td className="p-4"><span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] font-medium">{doc.category}</span></td>
                  <td className="p-4 font-mono text-slate-400">{doc.uploaded_date}</td>
                  <td className="p-4 font-mono text-slate-400">{doc.reporting_period}</td>
                  <td className="p-4"><StatusBadge status={doc.status} /></td>
                  <td className="p-4 text-slate-400 text-[11px]">{doc.notes}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
