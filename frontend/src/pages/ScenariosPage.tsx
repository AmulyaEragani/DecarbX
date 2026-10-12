import React, { useEffect, useState } from 'react';
import { scenariosApi } from '../services/api';
import { Scenario } from '../types';
import { Sliders, Save, RefreshCw, TrendingDown, Layers, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export const ScenariosPage: React.FC = () => {
  const [savedScenarios, setSavedScenarios] = useState<Scenario[]>([]);
  const [loadingScenarios, setLoadingScenarios] = useState(true);

  // Simulator Sliders State
  const [renewablePct, setRenewablePct] = useState(50);
  const [transportPct, setTransportPct] = useState(25);
  const [materialPct, setMaterialPct] = useState(20);
  const [supplierPct, setSupplierPct] = useState(30);
  const [energyPct, setEnergyPct] = useState(20);

  // Simulation result state
  const [simulation, setSimulation] = useState<any>(null);
  const [simulating, setSimulating] = useState(false);

  // Save Modal state
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [scenarioName, setScenarioName] = useState('2030 Renewable Transition Strategy');
  const [scenarioDesc, setScenarioDesc] = useState('Comprehensive decarbonization plan targeting 50% solar and 30% supply chain decarbonization.');

  const runSimulation = () => {
    setSimulating(true);
    scenariosApi.simulate({
      renewable_energy_pct: renewablePct,
      transport_reduction_pct: transportPct,
      material_efficiency_pct: materialPct,
      supplier_improvement_pct: supplierPct,
      energy_efficiency_pct: energyPct
    }).then((res) => {
      setSimulation(res);
      setSimulating(false);
    });
  };

  const loadSavedScenarios = () => {
    setLoadingScenarios(true);
    scenariosApi.list().then((data) => {
      setSavedScenarios(data);
      setLoadingScenarios(false);
    });
  };

  useEffect(() => {
    runSimulation();
    loadSavedScenarios();
  }, []);

  useEffect(() => {
    runSimulation();
  }, [renewablePct, transportPct, materialPct, supplierPct, energyPct]);

  const handleSaveScenario = (e: React.FormEvent) => {
    e.preventDefault();
    scenariosApi.create({
      name: scenarioName,
      description: scenarioDesc,
      renewable_energy_pct: renewablePct,
      transport_reduction_pct: transportPct,
      material_efficiency_pct: materialPct,
      supplier_improvement_pct: supplierPct,
      energy_efficiency_pct: energyPct
    }).then(() => {
      setShowSaveModal(false);
      loadSavedScenarios();
    });
  };

  const chartData = simulation ? [
    {
      category: 'Total Emissions',
      Baseline: simulation.baseline_emissions_tco2e,
      Projected: simulation.projected_emissions_tco2e,
    },
    {
      category: 'Scope 1',
      Baseline: simulation.breakdown.scope1.baseline,
      Projected: simulation.breakdown.scope1.projected,
    },
    {
      category: 'Scope 2',
      Baseline: simulation.breakdown.scope2.baseline,
      Projected: simulation.breakdown.scope2.projected,
    },
    {
      category: 'Scope 3',
      Baseline: simulation.breakdown.scope3.baseline,
      Projected: simulation.breakdown.scope3.projected,
    },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Sliders className="text-emerald-400" size={24} />
            What-If Decarbonization Scenario Simulator
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Simulate future carbon trajectories by adjusting renewable energy, transport fleet electrification, and supplier decarbonization parameters.
          </p>
        </div>

        <button
          onClick={() => setShowSaveModal(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/20"
        >
          <Save size={16} />
          <span>Save Current Scenario</span>
        </button>
      </div>

      {/* Simulator Inputs & Realtime KPI Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders Control Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-800 pb-3">
            <span>Simulation Parameters</span>
            <span className="text-[10px] text-emerald-400 uppercase font-semibold">Live Reactive</span>
          </h3>

          {/* Renewable Energy Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">Renewable Energy Adoption</span>
              <span className="text-emerald-400 font-mono font-bold">{renewablePct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={renewablePct}
              onChange={(e) => setRenewablePct(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer bg-slate-800 rounded-lg"
            />
            <p className="text-[10px] text-slate-400">Replaces fossil grid electricity with solar/wind VPPA</p>
          </div>

          {/* Transportation Reduction Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">Transportation / Fleet Reduction</span>
              <span className="text-cyan-400 font-mono font-bold">{transportPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={transportPct}
              onChange={(e) => setTransportPct(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer bg-slate-800 rounded-lg"
            />
            <p className="text-[10px] text-slate-400">Electric logistics fleet and route optimization</p>
          </div>

          {/* Material Efficiency Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">Material Efficiency & Circularity</span>
              <span className="text-amber-400 font-mono font-bold">{materialPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={materialPct}
              onChange={(e) => setMaterialPct(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer bg-slate-800 rounded-lg"
            />
            <p className="text-[10px] text-slate-400">Scrap reduction and secondary recycled aluminum/steel</p>
          </div>

          {/* Supplier Decarbonization Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">Supplier Improvement Mandate</span>
              <span className="text-indigo-400 font-mono font-bold">{supplierPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={supplierPct}
              onChange={(e) => setSupplierPct(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer bg-slate-800 rounded-lg"
            />
            <p className="text-[10px] text-slate-400">Tier-1 vendor Science-Based Target enforcement</p>
          </div>

          {/* Energy Efficiency Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">Energy Efficiency Retrofits</span>
              <span className="text-rose-400 font-mono font-bold">{energyPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={energyPct}
              onChange={(e) => setEnergyPct(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer bg-slate-800 rounded-lg"
            />
            <p className="text-[10px] text-slate-400">Heat recovery systems, VFD motor drives, LED lighting</p>
          </div>
        </div>

        {/* Realtime KPI Simulation Result Card & Chart */}
        <div className="lg:col-span-2 space-y-6">
          {simulation && (
            <>
              {/* Projected Summary Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Current Baseline</div>
                  <div className="text-xl font-bold text-white font-mono mt-1">
                    {simulation.baseline_emissions_tco2e.toLocaleString()} <span className="text-xs font-normal text-slate-400">tCO2e</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Projected Scenario</div>
                  <div className="text-xl font-bold text-cyan-400 font-mono mt-1">
                    {simulation.projected_emissions_tco2e.toLocaleString()} <span className="text-xs font-normal text-slate-400">tCO2e</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Absolute Reduction</div>
                  <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
                    -{simulation.reduction_tco2e.toLocaleString()} <span className="text-xs font-normal text-slate-400">tCO2e</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Percentage Reduction</div>
                  <div className="text-xl font-black text-emerald-400 font-mono mt-1">
                    -{simulation.reduction_pct}%
                  </div>
                </div>
              </div>

              {/* Comparison Chart */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
                <h3 className="text-sm font-bold text-white mb-1">Baseline vs Projected Scenario Comparison</h3>
                <p className="text-xs text-slate-400 mb-4">Emissions trajectory across Scope 1, Scope 2, and Scope 3</p>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="category" stroke="#64748b" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Bar dataKey="Baseline" fill="#64748b" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Projected" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Saved Scenarios Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 font-bold text-sm text-white">Saved Scenario Library</div>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Scenario Name</th>
              <th className="p-4">Renewable %</th>
              <th className="p-4">Baseline</th>
              <th className="p-4">Projected</th>
              <th className="p-4">Reduction tCO2e</th>
              <th className="p-4">Reduction %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {loadingScenarios ? (
              <tr><td colSpan={6} className="p-6 text-center text-slate-400">Loading saved scenarios...</td></tr>
            ) : (
              savedScenarios.map((sc) => (
                <tr key={sc.id} className="hover:bg-slate-800/40">
                  <td className="p-4 font-semibold text-white">
                    {sc.name}
                    <div className="text-[10px] text-slate-400 font-normal">{sc.description}</div>
                  </td>
                  <td className="p-4 font-mono font-bold text-cyan-400">{sc.renewable_energy_pct}%</td>
                  <td className="p-4 font-mono">{sc.baseline_emissions_tco2e.toLocaleString()} tCO2e</td>
                  <td className="p-4 font-mono">{sc.projected_emissions_tco2e.toLocaleString()} tCO2e</td>
                  <td className="p-4 font-mono font-bold text-emerald-400">-{sc.reduction_tco2e.toLocaleString()} tCO2e</td>
                  <td className="p-4 font-mono font-black text-emerald-400">-{sc.reduction_pct}%</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-white">Save Decarbonization Scenario</h2>
            <form onSubmit={handleSaveScenario} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Scenario Name</label>
                <input
                  type="text"
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <textarea
                  value={scenarioDesc}
                  onChange={(e) => setScenarioDesc(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500 h-20"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-400">Projected Reduction:</span>
                  <span className="text-emerald-400 font-mono">-{simulation?.reduction_pct}% (-{simulation?.reduction_tco2e} tCO2e)</span>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold shadow-lg shadow-emerald-500/20"
                >
                  Save to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
