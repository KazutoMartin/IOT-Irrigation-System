// src/components/PumpStatus.tsx
'use client';

interface PumpStatusProps {
  isOn: boolean;
  currentHumidity: number | null;
  isOnline: boolean;
}

export default function PumpStatus({ isOn, currentHumidity, isOnline }: PumpStatusProps) {
  return (
    <div className="bg-[#1a1a2e] pixel-corners pixel-border p-6 scanline">
      {/* Header with retro online indicator */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs md:text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 glow-text">
          SYSTEM_STATUS
        </h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-4 h-4 ${isOnline ? 'bg-green-400' : 'bg-red-500'} pixel-corners`}>
              {isOnline && (
                <div className="absolute inset-0 bg-green-400 pixel-corners animate-ping opacity-75"></div>
              )}
            </div>
          </div>
          <span className={`text-[8px] md:text-[10px] font-bold ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
            {isOnline ? '[ONLINE]' : '[OFFLINE]'}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Humidity Display */}
        <div className="relative bg-gradient-to-br from-blue-900/40 to-blue-950/60 border-2 border-blue-500/50 pixel-corners p-4">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50"></div>
          <div className="text-[8px] text-blue-300 mb-2 tracking-wider">HUMIDITY</div>
          <div className="text-2xl md:text-4xl font-bold text-blue-400 glow-text tabular-nums">
            {currentHumidity !== null ? `${currentHumidity}` : '--'}
            <span className="text-lg md:text-2xl">%</span>
          </div>
          <div className="mt-2 h-2 bg-blue-950/50 pixel-corners overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500"
              style={{ width: currentHumidity !== null ? `${currentHumidity}%` : '0%' }}
            ></div>
          </div>
        </div>

        {/* Pump Status */}
        <div className={`relative border-2 pixel-corners p-4 ${
          isOn 
            ? 'bg-gradient-to-br from-green-900/40 to-emerald-950/60 border-green-500/50' 
            : 'bg-gradient-to-br from-gray-900/40 to-gray-950/60 border-gray-600/50'
        }`}>
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${isOn ? 'green' : 'gray'}-400 to-transparent opacity-50`}></div>
          <div className={`text-[8px] mb-2 tracking-wider ${isOn ? 'text-green-300' : 'text-gray-400'}`}>
            PUMP_STATE
          </div>
          <div className={`text-2xl md:text-4xl font-bold ${isOn ? 'text-green-400 glow-text' : 'text-gray-500'} mb-3`}>
            {isOn ? 'ON' : 'OFF'}
          </div>
          
          {/* Animated Pump Indicator */}
          <div className={`flex items-center gap-2 px-2 py-1 ${
            isOn ? 'bg-green-950/60 border border-green-500/50' : 'bg-gray-900/60 border border-gray-600/50'
          } pixel-corners text-[8px]`}>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-1 h-3 ${isOn ? 'bg-green-400' : 'bg-gray-600'} pixel-corners ${
                    isOn ? 'animate-pulse' : ''
                  }`}
                  style={{ animationDelay: `${i * 150}ms` }}
                ></div>
              ))}
            </div>
            <span className={isOn ? 'text-green-400' : 'text-gray-500'}>
              {isOn ? '[WATERING]' : '[IDLE]'}
            </span>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Bar */}
      <div className="mt-4 h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 pixel-corners"></div>
    </div>
  );
}
