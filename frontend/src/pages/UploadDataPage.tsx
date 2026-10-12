import React, { useState } from 'react';
import { activitiesApi } from '../services/api';
import { useFilter } from '../context/FilterContext';
import { UploadCloud, CheckCircle2, AlertTriangle, XCircle, FileText, ArrowRight } from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';

export const UploadDataPage: React.FC = () => {
  const { triggerRefresh } = useFilter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setUploading(true);
    activitiesApi.uploadCsv(selectedFile)
      .then((res) => {
        setReport(res);
        setUploading(false);
        triggerRefresh();
      })
      .catch((err) => {
        console.error(err);
        setUploading(false);
      });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <UploadCloud className="text-emerald-400" size={24} />
          Activity Data Ingestion & CSV Validation
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Upload bulk activity data files (facility, activity, quantity, unit, scope, period). Backend rules validate units, scopes, and calculate Data Quality Score %.
        </p>
      </div>

      {/* File Upload Box */}
      <div className="bg-slate-900 border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-2xl p-8 text-center space-y-4 transition-all">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <UploadCloud size={32} />
        </div>
        <div>
          <h3 className="font-bold text-white text-sm">Select or Drag CSV Activity File</h3>
          <p className="text-xs text-slate-400 mt-1">Expected columns: <code className="text-emerald-400">facility, activity, quantity, unit, scope, period</code></p>
        </div>

        <div className="flex items-center justify-center space-x-3">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
          />
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/20"
          >
            <span>{uploading ? 'Processing & Validating...' : 'Validate & Import'}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Validation Report Result */}
      {report && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <CheckCircle2 className="text-emerald-400" size={18} />
              CSV Validation Report Results
            </h3>
            <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30 font-bold text-xs">
              Data Quality Score: {report.data_quality_score}%
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Records Processed</div>
              <div className="text-2xl font-bold text-white font-mono mt-1">{report.total_processed}</div>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Valid Records</div>
              <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">{report.valid_count}</div>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Warnings</div>
              <div className="text-2xl font-bold text-amber-400 font-mono mt-1">{report.warnings_count}</div>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Rejected</div>
              <div className="text-2xl font-bold text-rose-400 font-mono mt-1">{report.rejected_count}</div>
            </div>
          </div>

          {/* Records Table */}
          <div className="overflow-x-auto border border-slate-800 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-3">Facility</th>
                  <th className="p-3">Activity</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Scope</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {report.items.map((item: any, idx: number) => (
                  <tr key={idx}>
                    <td className="p-3 font-semibold text-white">{item.record.facility || 'Plant A'}</td>
                    <td className="p-3">{item.record.activity}</td>
                    <td className="p-3 font-mono">{item.record.quantity} {item.record.unit}</td>
                    <td className="p-3 font-mono text-emerald-400">{item.record.scope}</td>
                    <td className="p-3"><StatusBadge status={item.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
