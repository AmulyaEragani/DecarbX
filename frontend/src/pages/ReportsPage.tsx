import React, { useEffect, useState } from 'react';
import { reportsApi } from '../services/api';
import { FileText, Download, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportsApi.list().then((res) => {
      setReports(res);
      setLoading(false);
    });
  }, []);

  const handleDownloadCsv = (reportId: string) => {
    const downloadUrl = reportsApi.exportCsv(reportId);
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="text-emerald-400" size={24} />
          Enterprise Sustainability Reporting Hub
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Export verified ESG carbon inventories, Scope 1-3 breakdowns, supplier assessments, and PCF declarations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center p-8 text-slate-400">Loading enterprise reports...</div>
        ) : (
          reports.map((rep) => (
            <div key={rep.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                  {rep.category}
                </span>
                <h3 className="font-bold text-white text-sm mt-2">{rep.name}</h3>
                <p className="text-xs text-slate-400 mt-2">{rep.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">Period: {rep.period}</span>
                <button
                  onClick={() => handleDownloadCsv(rep.id)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20 transition-colors"
                >
                  <Download size={14} />
                  <span>Download CSV</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
