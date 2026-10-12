import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Database,
  Flame,
  Zap,
  Truck,
  Scale,
  Package,
  Boxes,
  PieChart,
  Users,
  ClipboardCheck,
  Award,
  ListTodo,
  BrainCircuit,
  AlertTriangle,
  Lightbulb,
  Target,
  Sliders,
  FolderKanban,
  UploadCloud,
  Network,
  Cpu,
  ShieldCheck,
  FileCheck,
  History,
  Coins,
  TrendingUp,
  FileText,
  Leaf
} from 'lucide-react';

interface NavSection {
  title: string;
  items: Array<{
    name: string;
    path: string;
    icon: React.ElementType;
  }>;
}

export const Sidebar: React.FC = () => {
  const sections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'CARBON ACCOUNTING',
      items: [
        { name: 'Activity Data', path: '/activities', icon: Database },
        { name: 'Scope 1 Emissions', path: '/scope1', icon: Flame },
        { name: 'Scope 2 Emissions', path: '/scope2', icon: Zap },
        { name: 'Scope 3 Emissions', path: '/scope3', icon: Truck },
        { name: 'Emission Factors', path: '/emission-factors', icon: Scale }
      ]
    },
    {
      title: 'PRODUCT FOOTPRINT',
      items: [
        { name: 'Products Catalog', path: '/products', icon: Package },
        { name: 'Life Cycle Assessment (LCA)', path: '/lca', icon: Boxes },
        { name: 'Product Footprint (PCF)', path: '/pcf', icon: PieChart }
      ]
    },
    {
      title: 'SUPPLIERS',
      items: [
        { name: 'Supplier Network', path: '/suppliers', icon: Users },
        { name: 'ESG Assessments', path: '/supplier-assessments', icon: ClipboardCheck },
        { name: 'Supplier Scorecards', path: '/supplier-scorecards', icon: Award },
        { name: 'Action Plans', path: '/supplier-action-plans', icon: ListTodo }
      ]
    },
    {
      title: 'AI ANALYTICS',
      items: [
        { name: 'AI Insights', path: '/analytics/insights', icon: BrainCircuit },
        { name: 'Anomaly Detection', path: '/analytics/anomalies', icon: AlertTriangle },
        { name: 'Recommendations', path: '/analytics/recommendations', icon: Lightbulb }
      ]
    },
    {
      title: 'REDUCTION PLANNING',
      items: [
        { name: 'Net-Zero Targets', path: '/reduction/targets', icon: Target },
        { name: 'Scenario Simulator', path: '/scenarios', icon: Sliders },
        { name: 'Reduction Projects', path: '/reduction/projects', icon: FolderKanban }
      ]
    },
    {
      title: 'DATA SOURCES',
      items: [
        { name: 'Upload CSV Data', path: '/upload', icon: UploadCloud },
        { name: 'Enterprise Adapters', path: '/integrations', icon: Network },
        { name: 'IoT Telemetry', path: '/iot-meters', icon: Cpu }
      ]
    },
    {
      title: 'COMPLIANCE',
      items: [
        { name: 'Compliance Readiness', path: '/compliance', icon: ShieldCheck },
        { name: 'Evidence Library', path: '/evidence', icon: FileCheck },
        { name: 'Audit Trail', path: '/audit-trail', icon: History }
      ]
    },
    {
      title: 'CARBON FINANCE',
      items: [
        { name: 'Carbon Budget', path: '/finance/budget', icon: Coins },
        { name: 'Project Economics', path: '/finance/economics', icon: TrendingUp }
      ]
    },
    {
      title: 'REPORTS',
      items: [
        { name: 'Enterprise Reports', path: '/reports', icon: FileText }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center space-x-3">
        <div className="p-2 bg-emerald-500 rounded-lg shadow-lg shadow-emerald-500/20 text-slate-950 font-bold">
          <Leaf size={22} className="stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1">
            Decarb<span className="text-emerald-400">X</span>
          </h1>
          <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Environmental Intelligence</p>
        </div>
      </div>

      {/* Navigation Scroll Area */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {sections.map((section, idx) => (
          <div key={idx}>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <Icon size={16} className="mr-2.5 shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/60 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Local Engine Active</span>
        </div>
        <span className="text-slate-400 font-mono text-[10px]">v1.0.0</span>
      </div>
    </aside>
  );
};
