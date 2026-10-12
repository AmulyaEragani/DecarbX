import React from 'react';
import { Cpu, Zap, Activity } from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';

export const IoTMetersPage: React.FC = () => {
  const meters = [
    { id: 'IOT-PLANT-A-01', location: 'Plant A - Substation 1', type: 'Modbus Power Meter', rate: '850.4 kWh/hr', status: 'ACTIVE' },
    { id: 'IOT-PLANT-A-02', location: 'Plant A - Assembly Line B', type: 'MQTT Energy Sensor', rate: '420.1 kWh/hr', status: 'ACTIVE' },
    { id: 'IOT-PLANT-B-01', location: 'Plant B - Stamping Press Floor', type: 'Smart Industrial Meter', rate: '1240.8 kWh/hr', status: 'ACTIVE' },
    { id: 'IOT-PLANT-C-01', location: 'Plant C - Cleanroom HVAC', type: 'BACnet Utility Meter', rate: '310.5 kWh/hr', status: 'ACTIVE' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Cpu className="text-emerald-400" size={24} />
          Smart IoT Energy Telemetry & Sub-Metering
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time energy telemetry streaming from Modbus, MQTT, and BACnet meters across facility shop floors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {meters.map((m) => (
          <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap size={18} className="text-cyan-400" />
                <span className="font-mono font-bold text-white text-xs">{m.id}</span>
              </div>
              <StatusBadge status={m.status} />
            </div>

            <div className="text-xs font-semibold text-slate-200">{m.location}</div>
            <div className="text-[11px] text-slate-400 font-mono">Protocol: {m.type}</div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Live Power Telemetry Draw:</span>
              <span className="font-mono font-bold text-emerald-400">{m.rate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
