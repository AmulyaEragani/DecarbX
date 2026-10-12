import React, { useEffect, useState } from 'react';
import { productsApi } from '../services/api';
import { Product } from '../types';
import { Boxes, Layers, RefreshCw, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

export const LCAPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number>(1);
  const [lcaDetails, setLcaDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi.list().then((data) => {
      setProducts(data);
      if (data.length > 0) {
        setSelectedProductId(data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedProductId) {
      setLoading(true);
      productsApi.getDetails(selectedProductId)
        .then((res) => {
          setLcaDetails(res);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [selectedProductId]);

  const STAGE_COLORS = ['#34d399', '#38bdf8', '#fbbf24', '#a78bfa', '#f43f5e', '#64748b'];

  const chartData = lcaDetails ? [
    { stage: 'Raw Material', kgco2e: lcaDetails.stage_breakdown['Raw Material'] },
    { stage: 'Manufacturing', kgco2e: lcaDetails.stage_breakdown['Manufacturing'] },
    { stage: 'Transportation', kgco2e: lcaDetails.stage_breakdown['Transportation'] },
    { stage: 'Packaging', kgco2e: lcaDetails.stage_breakdown['Packaging'] },
    { stage: 'Use Phase', kgco2e: lcaDetails.stage_breakdown['Use Phase'] },
    { stage: 'End of Life', kgco2e: lcaDetails.stage_breakdown['End of Life'] },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Boxes className="text-emerald-400" size={24} />
            Life Cycle Assessment (LCA) Model
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Visual lifecycle breakdown across Raw Materials, Manufacturing, Logistics, Use Phase, and Disposal.
          </p>
        </div>

        {/* Product selector dropdown */}
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-2 rounded-xl">
          <label className="text-xs text-slate-400">Select Product:</label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(Number(e.target.value))}
            className="bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
            ))}
          </select>
        </div>
      </div>

      {loading || !lcaDetails ? (
        <div className="text-center p-12 text-slate-400">Loading LCA lifecycle details...</div>
      ) : (
        <div className="space-y-6">
          {/* LCA Stage KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {Object.entries(lcaDetails.percentages).map(([stage, pct]: any, idx) => (
              <div key={stage} className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow">
                <div className="text-[10px] uppercase font-semibold text-slate-400 truncate">{stage}</div>
                <div className="text-lg font-black text-white mt-1 font-mono">{lcaDetails.stage_breakdown[stage]} <span className="text-[10px] font-normal text-slate-400">kg</span></div>
                <div className="text-[10px] font-bold text-emerald-400 mt-1">{pct}% of PCF</div>
              </div>
            ))}
          </div>

          {/* Bar Chart Visualizer */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
            <h3 className="text-sm font-bold text-white mb-1">Lifecycle Stage Carbon Breakdown (kgCO2e/product)</h3>
            <p className="text-xs text-slate-400 mb-4">Total Product Carbon Footprint: <strong className="text-emerald-400">{lcaDetails.total_pcf_kgco2e} kgCO2e</strong></p>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="stage" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="kgco2e" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STAGE_COLORS[index % STAGE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Materials & Processes Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bill of Materials (BOM) */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
                <span>Bill of Materials (BOM) Raw Carbon</span>
                <span className="text-xs font-mono text-emerald-400">Total: {lcaDetails.stage_breakdown['Raw Material']} kg</span>
              </h3>
              <div className="space-y-2">
                {lcaDetails.materials.map((m: any) => (
                  <div key={m.id} className="p-3 bg-slate-800/40 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-white">{m.material_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{m.quantity} {m.unit}</div>
                    </div>
                    <div className="text-right font-mono font-bold text-emerald-400">
                      {m.co2e_kg} kgCO2e
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Manufacturing Processes */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
              <h3 className="text-sm font-bold text-white mb-3">Manufacturing & Process Activity</h3>
              <div className="space-y-2">
                {lcaDetails.processes.map((p: any) => (
                  <div key={p.id} className="p-3 bg-slate-800/40 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-white">{p.process_name}</div>
                      <div className="text-[10px] text-slate-400">{p.stage}</div>
                    </div>
                    <div className="text-right font-mono font-bold text-cyan-400">
                      {p.co2e_kg} kgCO2e
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
