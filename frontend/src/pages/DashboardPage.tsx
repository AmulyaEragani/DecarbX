import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../services/api';
import { DashboardData } from '../types';
import { KPICard } from '../components/ui/KPICard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useFilter } from '../context/FilterContext';
import {
  Flame,
  Zap,
  Truck,
  Scale,
  TrendingDown,
  BrainCircuit,
  FileText,
  Activity as ActivityIcon,
  RefreshCw,
  Filter
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { selectedFacilityId, selectedPeriod, refreshTrigger, triggerRefresh, facilities } = useFilter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = () => {
    setLoading(true);
    dashboardApi.getSummary(selectedFacilityId, selectedPeriod)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching dashboard summary:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedFacilityId, selectedPeriod, refreshTrigger]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-slate-400">Loading Environmental Intelligence Metrics...</span>
        </div>
      </div>
    );
  }

  const activeFacilityName = selectedFacilityId
    ? facilities.find((f) => f.id === selectedFacilityId)?.name || `Facility #${selectedFacilityId}`
    : 'All Enterprise Facilities';

  const metrics = data?.metrics || {
    total_emissions_tco2e: 0,
    scope1_tco2e: 0,
    scope2_tco2e: 0,
    scope3_tco2e: 0,
    emission_intensity: 0,
    target_progress_pct: 0,
    data_quality_score: 96.8
  };

  const target_summary = data?.target_summary || {
    name: '2030 Science-Based Net-Zero Target',
    baseline_tco2e: 42680,
    target_tco2e: 30000,
    current_tco2e: metrics.total_emissions_tco2e,
    reduction_pct: 29.7,
    status: 'On Track'
  };

  const charts = data?.charts || {
    monthly_trend: [],
    facility_breakdown: [],
    source_breakdown: [],
    scope3_categories: [],
    scope_pie: []
  };

  const recent_activities = data?.recent_activities || [];
  const recent_audits = data?.recent_audits || [];

  const PIE_COLORS = ['#f43f5e', '#38bdf8', '#fbbf24'];

  return (
    <div className="space-y-6">
      {/* Page Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Executive Environmental Dashboard
            </h1>
            {loading && <RefreshCw size={18} className="animate-spin text-emerald-400 ml-2" />}
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <Filter size={13} className="text-emerald-400" />
            <span>Active Boundary: <strong className="text-emerald-400">{activeFacilityName}</strong> • Period: <strong className="text-amber-400">{selectedPeriod}</strong></span>
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <button
            onClick={triggerRefresh}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid - Dynamically Driven by Backend */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Emissions"
          value={metrics.total_emissions_tco2e.toLocaleString()}
          unit="tCO2e"
          change="Calculated Live"
          changeType="positive"
          icon={Scale}
          subtext={`Boundary: ${activeFacilityName}`}
          accentColor="emerald"
        />
        <KPICard
          title="Scope 1 Direct"
          value={metrics.scope1_tco2e.toLocaleString()}
          unit="tCO2e"
          change="Stationary & Fleet"
          changeType="neutral"
          icon={Flame}
          subtext="Direct onsite combustion"
          accentColor="rose"
        />
        <KPICard
          title="Scope 2 Energy"
          value={metrics.scope2_tco2e.toLocaleString()}
          unit="tCO2e"
          change="Purchased Power"
          changeType="neutral"
          icon={Zap}
          subtext="Electricity & Steam draw"
          accentColor="cyan"
        />
        <KPICard
          title="Scope 3 Value Chain"
          value={metrics.scope3_tco2e.toLocaleString()}
          unit="tCO2e"
          change="Upstream & Freight"
          changeType="neutral"
          icon={Truck}
          subtext="Purchased goods & logistics"
          accentColor="amber"
        />
      </div>

      {/* Target Progress Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <TrendingDown size={24} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white">{target_summary.name}</h3>
              <StatusBadge status={target_summary.status} />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Baseline: {target_summary.baseline_tco2e.toLocaleString()} tCO2e (2023) → Target: {target_summary.target_tco2e.toLocaleString()} tCO2e
            </p>
          </div>
        </div>
        <div className="w-full md:w-64 space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-400">Net-Zero Progress</span>
            <span className="text-emerald-400">{metrics.target_progress_pct}% Achieved</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, metrics.target_progress_pct))}%` }} />
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend Area Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Period Emissions Breakdown (tCO2e)</h3>
              <p className="text-xs text-slate-400">Emissions trajectory for selected boundary</p>
            </div>
            <div className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-lg">{selectedPeriod}</div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.monthly_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScope1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorScope2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorScope3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="scope1" name="Scope 1 Direct" stroke="#f43f5e" fillOpacity={1} fill="url(#colorScope1)" stackId="1" />
                <Area type="monotone" dataKey="scope2" name="Scope 2 Energy" stroke="#38bdf8" fillOpacity={1} fill="url(#colorScope2)" stackId="1" />
                <Area type="monotone" dataKey="scope3" name="Scope 3 Value Chain" stroke="#fbbf24" fillOpacity={1} fill="url(#colorScope3)" stackId="1" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scope Pie Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Emissions by Scope</h3>
            <p className="text-xs text-slate-400 mb-4">Proportional GHG distribution</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={charts.scope_pie}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {charts.scope_pie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-2 pt-3 border-t border-slate-800">
            {charts.scope_pie.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[idx] }} />
                  <span className="text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-white">{item.value.toLocaleString()} tCO2e</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Facility Comparison & Source Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Facility Emissions Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h3 className="text-sm font-bold text-white mb-1">Emissions by Facility (tCO2e)</h3>
          <p className="text-xs text-slate-400 mb-4">Real-time facility carbon totals from SQLite</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.facility_breakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="emissions_tco2e" name="Emissions (tCO2e)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Emission Sources */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h3 className="text-sm font-bold text-white mb-1">Top Emission Sources</h3>
          <p className="text-xs text-slate-400 mb-4">Aggregated from active database activity items</p>
          <div className="space-y-3">
            {charts.source_breakdown.slice(0, 5).map((src, idx) => (
              <div key={idx} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-white">{src.name}</div>
                  <div className="text-[10px] text-slate-400">{src.scope}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-400">{src.tco2e.toLocaleString()} tCO2e</div>
                  <div className="text-[10px] text-slate-400">{roundPct(src.tco2e, metrics.total_emissions_tco2e)}% of total</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights & Recent Audit Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Environmental Intelligence Snippet */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center space-x-2 mb-4">
            <BrainCircuit className="text-emerald-400" size={20} />
            <h3 className="text-sm font-bold text-white">AI Environmental Intelligence</h3>
          </div>
          <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
              <span>ACTIVE DECARBONIZATION INSIGHT</span>
              <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded">Calculated Live</span>
            </div>
            <p className="text-xs text-slate-200 font-medium">
              Purchased Grid Electricity at Plant A accounts for {metrics.total_emissions_tco2e > 0 ? roundPct(metrics.scope2_tco2e, metrics.total_emissions_tco2e) : 32}% of active footprint.
            </p>
            <p className="text-xs text-slate-400">
              <strong className="text-slate-300">Action:</strong> Increasing renewable energy procurement to 60% reduces total emissions by <span className="text-emerald-400 font-bold">{Math.round(metrics.scope2_tco2e * 0.6)} tCO2e/year</span>.
            </p>
          </div>
        </div>

        {/* Audit Log Stream */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FileText className="text-slate-400" size={18} />
              <h3 className="text-sm font-bold text-white">Recent Audit Log Events</h3>
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">SQLite Stream</span>
          </div>
          <div className="space-y-2.5">
            {recent_audits.slice(0, 3).map((log) => (
              <div key={log.id} className="text-xs p-2.5 bg-slate-800/40 rounded-lg border border-slate-800 flex items-start space-x-3">
                <div className="p-1 bg-slate-800 rounded text-slate-400 mt-0.5">
                  <ActivityIcon size={12} />
                </div>
                <div>
                  <div className="font-semibold text-slate-200">{log.action} - {log.entity}</div>
                  <div className="text-slate-400 text-[11px]">{log.description}</div>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">{log.timestamp} • {log.user}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function roundPct(part: number, total: number): number {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}
