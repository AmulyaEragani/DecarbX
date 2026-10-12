import React, { useEffect, useState } from 'react';
import { productsApi } from '../services/api';
import { Product } from '../types';
import { Package, ArrowRight, PieChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    productsApi.list()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Package className="text-emerald-400" size={24} />
          Products Catalog & PCF Summary
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Product carbon intensity tracking, material composition, and life cycle carbon declarations (ISO 14067).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center p-8 text-slate-400">Loading products...</div>
        ) : (
          products.map((p) => (
            <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4 hover:border-slate-700 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">{p.name}</h3>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">SKU: {p.sku}</div>
                </div>
                <span className="bg-slate-800 text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-700">
                  {p.category}
                </span>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Product Footprint (PCF)</div>
                  <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-0.5">
                    {p.pcf_kgco2e} <span className="text-xs text-slate-400 font-sans font-normal">kgCO2e/{p.unit}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Annual Production</div>
                  <div className="text-sm font-bold text-white">{p.annual_volume.toLocaleString()} units</div>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => navigate(`/pcf?product_id=${p.id}`)}
                  className="flex-1 flex items-center justify-center space-x-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 py-1.5 rounded-lg border border-emerald-500/30 text-xs font-semibold transition-colors"
                >
                  <PieChart size={14} />
                  <span>View PCF</span>
                </button>
                <button
                  onClick={() => navigate(`/lca?product_id=${p.id}`)}
                  className="flex-1 flex items-center justify-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold transition-colors"
                >
                  <span>LCA Lifecycle</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
