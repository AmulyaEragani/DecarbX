import React, { useEffect, useState } from 'react';
import { activitiesApi, emissionsApi } from '../services/api';
import { Activity } from '../types';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useFilter } from '../context/FilterContext';
import { Plus, Filter, RefreshCw, Database, Check, Calculator, Calendar } from 'lucide-react';

export const ActivitiesPage: React.FC = () => {
  const { facilities, triggerRefresh } = useFilter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [scopeFilter, setScopeFilter] = useState<string>('ALL');
  const [showModal, setShowModal] = useState(false);
  const [calculatingId, setCalculatingId] = useState<number | null>(null);

  // New activity form state
  const [formData, setFormData] = useState({
    facility_id: 1,
    activity_type: 'Electricity (Grid)',
    activity_name: 'Custom Facility Activity Draw',
    quantity: 15000,
    unit: 'kWh',
    scope: 'Scope 2',
    period: '2026-Q1',
    activity_date: '2026-01-20',
    source: 'Manual Data Entry'
  });

  const loadActivities = () => {
    setLoading(true);
    activitiesApi.list()
      .then((data) => {
        setActivities(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    activitiesApi.create(formData).then(() => {
      setShowModal(false);
      loadActivities();
      triggerRefresh();
    });
  };

  const handleRecalculate = (activityId: number) => {
    setCalculatingId(activityId);
    emissionsApi.calculate(activityId).then(() => {
      setCalculatingId(null);
      loadActivities();
      triggerRefresh();
    });
  };

  const filtered = activities.filter((a) => (scopeFilter === 'ALL' ? true : a.scope === scopeFilter));

  return (
    <div className="space-y-6">
      {/* Header toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="text-emerald-400" size={24} />
            Activity Data Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Standardized activity data records across facilities, energy draw, fuel, logistics, and supply chain.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-lg shadow-emerald-500/20"
          >
            <Plus size={16} />
            <span>Add Activity Data</span>
          </button>
        </div>
      </div>

      {/* Scope Filter Tabs */}
      <div className="flex items-center justify-between bg-slate-900 p-2 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-1">
          {['ALL', 'Scope 1', 'Scope 2', 'Scope 3'].map((scope) => (
            <button
              key={scope}
              onClick={() => setScopeFilter(scope)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                scopeFilter === scope
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {scope === 'ALL' ? 'All Activity Records' : scope}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-400 pr-2">
          Total Records: <strong className="text-white">{filtered.length}</strong>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Activity Name</th>
                <th className="p-4">Type & Scope</th>
                <th className="p-4">Quantity & Unit</th>
                <th className="p-4">Source System</th>
                <th className="p-4">Period / Date</th>
                <th className="p-4">Validation Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Loading activity records from database...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No activity data records found.
                  </td>
                </tr>
              ) : (
                filtered.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-semibold text-white">
                      {act.activity_name || act.activity_type}
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: #{act.id}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-200">{act.activity_type}</div>
                      <span className="inline-block mt-0.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        {act.scope}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-white">
                      {act.quantity.toLocaleString()} <span className="text-slate-400 font-sans text-xs">{act.unit}</span>
                    </td>
                    <td className="p-4 text-slate-400">
                      <span className="bg-slate-800 px-2 py-1 rounded text-[11px] font-mono border border-slate-700">
                        {act.source}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-xs">
                      <div className="flex items-center space-x-1">
                        <Calendar size={12} className="text-slate-400" />
                        <span>{act.period}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">{act.activity_date}</div>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={act.status} />
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleRecalculate(act.id)}
                        disabled={calculatingId === act.id}
                        className="inline-flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 px-2.5 py-1 rounded-lg border border-slate-700 text-[11px] font-semibold transition-colors"
                      >
                        <Calculator size={12} />
                        <span>{calculatingId === act.id ? 'Calculating...' : 'Recalculate'}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Activity Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-white">Record New Activity Data</h2>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Target Facility</label>
                <select
                  value={formData.facility_id}
                  onChange={(e) => setFormData({ ...formData, facility_id: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  {facilities.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Activity Name</label>
                <input
                  type="text"
                  value={formData.activity_name}
                  onChange={(e) => setFormData({ ...formData, activity_name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Activity Type</label>
                  <select
                    value={formData.activity_type}
                    onChange={(e) => setFormData({ ...formData, activity_type: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Electricity (Grid)">Electricity (Grid)</option>
                    <option value="Natural Gas">Natural Gas</option>
                    <option value="Diesel Fuel">Diesel Fuel</option>
                    <option value="Purchased Steel">Purchased Steel</option>
                    <option value="Road Freight">Road Freight</option>
                    <option value="Business Travel (Air)">Business Travel (Air)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Scope</label>
                  <select
                    value={formData.scope}
                    onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Scope 1">Scope 1</option>
                    <option value="Scope 2">Scope 2</option>
                    <option value="Scope 3">Scope 3</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="kWh">kWh</option>
                    <option value="litres">litres</option>
                    <option value="kg">kg</option>
                    <option value="tonnes">tonnes</option>
                    <option value="km">km</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Reporting Period</label>
                  <input
                    type="text"
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.activity_date}
                    onChange={(e) => setFormData({ ...formData, activity_date: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold shadow-lg shadow-emerald-500/20"
                >
                  Create & Calculate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
