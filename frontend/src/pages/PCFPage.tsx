import React, { useEffect, useState } from 'react';
import { productsApi } from '../services/api';
import { Product } from '../types';
import { PieChart, Calculator, CheckCircle2, Factory } from 'lucide-react';
import { KPICard } from '../components/ui/KPICard';

export const PCFPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number>(1);
  const [pcfResult, setPcfResult] = useState<any>(null);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    productsApi.list().then((data) => {
      setProducts(data);
      if (data.length > 0) setSelectedProductId(data[0].id);
    });
  }, []);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const handleRecalculatePCF = () => {
    setCalculating(true);
    productsApi.calculatePcf(selectedProductId).then((res) => {
      setPcfResult(res);
      setCalculating(false);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <PieChart className="text-emerald-400" size={24} />
            Product Carbon Footprint (PCF) Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Quantify kgCO2e per unit manufactured according to GHG Protocol Product Life Cycle Standard and ISO 14067.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(Number(e.target.value))}
            className="bg-slate-900 border border-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
            ))}
          </select>
          <button
            onClick={handleRecalculatePCF}
            disabled={calculating}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/20"
          >
            <Calculator size={16} />
            <span>{calculating ? 'Calculating PCF...' : 'Recalculate PCF'}</span>
          </button>
        </div>
      </div>

      {selectedProduct && (
        <div className="space-y-6">
          {/* Main PCF Display Card */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/50 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                Verified Product Footprint
              </span>
              <h2 className="text-2xl font-black text-white mt-2">{selectedProduct.name}</h2>
              <div className="text-xs text-slate-400 font-mono mt-0.5">SKU: {selectedProduct.sku} • Category: {selectedProduct.category}</div>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-center min-w-[200px]">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Total Unit Carbon Footprint</div>
              <div className="text-4xl font-black text-emerald-400 font-mono mt-1">
                {selectedProduct.pcf_kgco2e}
              </div>
              <div className="text-xs text-slate-400 font-medium">kgCO2e per {selectedProduct.unit}</div>
            </div>
          </div>

          {/* Breakdown percentage cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Raw Materials</div>
              <div className="text-lg font-bold text-white mt-1">42%</div>
              <div className="text-[11px] text-emerald-400 font-mono font-semibold">{(selectedProduct.pcf_kgco2e * 0.42).toFixed(1)} kg</div>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Manufacturing</div>
              <div className="text-lg font-bold text-white mt-1">21%</div>
              <div className="text-[11px] text-cyan-400 font-mono font-semibold">{(selectedProduct.pcf_kgco2e * 0.21).toFixed(1)} kg</div>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Electricity</div>
              <div className="text-lg font-bold text-white mt-1">15%</div>
              <div className="text-[11px] text-amber-400 font-mono font-semibold">{(selectedProduct.pcf_kgco2e * 0.15).toFixed(1)} kg</div>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Transportation</div>
              <div className="text-lg font-bold text-white mt-1">12%</div>
              <div className="text-[11px] text-indigo-400 font-mono font-semibold">{(selectedProduct.pcf_kgco2e * 0.12).toFixed(1)} kg</div>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Packaging</div>
              <div className="text-lg font-bold text-white mt-1">6%</div>
              <div className="text-[11px] text-rose-400 font-mono font-semibold">{(selectedProduct.pcf_kgco2e * 0.06).toFixed(1)} kg</div>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">End of Life</div>
              <div className="text-lg font-bold text-white mt-1">4%</div>
              <div className="text-[11px] text-slate-400 font-mono font-semibold">{(selectedProduct.pcf_kgco2e * 0.04).toFixed(1)} kg</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
