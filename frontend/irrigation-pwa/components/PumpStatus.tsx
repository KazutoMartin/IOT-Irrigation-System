// src/components/PumpStatus.tsx
'use client';

interface PumpStatusProps {
  isOn: boolean;
  currentHumidity: number | null;
  isOnline: boolean;
}

export default function PumpStatus({ isOn, currentHumidity, isOnline }: PumpStatusProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">System Status</h2>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Current Humidity</div>
          <div className="text-3xl font-bold text-blue-600">
            {currentHumidity !== null ? `${currentHumidity}%` : '--'}
          </div>
        </div>

        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Pump Status</div>
          <div className={`text-3xl font-bold ${isOn ? 'text-green-600' : 'text-gray-400'}`}>
            {isOn ? 'ON' : 'OFF'}
          </div>
          <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
            isOn ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
          }`}>
            <div className={`w-2 h-2 rounded-full ${isOn ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            {isOn ? 'Watering' : 'Idle'}
          </div>
        </div>
      </div>
    </div>
  );
}
