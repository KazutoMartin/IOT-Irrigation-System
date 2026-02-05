// src/components/PumpStatus.tsx
'use client';

interface PumpStatusProps {
  isOn: boolean;
  currentHumidity: number | null;
  isOnline: boolean;
}

export default function PumpStatus({ isOn, currentHumidity, isOnline }: PumpStatusProps) {
  return (
    <div className="bg-[#1a1a2e] pixel-corners pixel-border p-4 relative overflow-hidden">
      {/* Animated scanline effect */}
      <div className="absolute inset-0 scanline pointer-events-none"></div>
      
      {/* Header with typing cursor animation */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <h2 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 glow-text">
          SYSTEM_STATUS
          <span className="inline-block w-2 h-4 bg-indigo-400 ml-1 animate-blink"></span>
        </h2>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 pixel-corners ${isOnline ? 'bg-green-400 animate-pulse-glow' : 'bg-red-500 animate-blink-slow'}`} />
          <span className="text-[10px] text-gray-400 font-bold tracking-wider">
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 relative z-10">
        {/* Humidity Box with value pop animation */}
        <div className="text-center p-3 bg-gradient-to-br from-blue-950/50 to-indigo-950/50 pixel-corners border-2 border-indigo-600/50 relative group">
          <div className="absolute inset-0 bg-indigo-600/10 pixel-corners animate-pulse-slow"></div>
          <div className="text-[9px] text-indigo-300 mb-1 font-bold tracking-wider relative z-10">
            HUMIDITY_LVL
          </div>
          <div className="text-3xl font-bold text-indigo-400 glow-text relative z-10 animate-value-update">
            {currentHumidity !== null ? `${currentHumidity}%` : '--'}
          </div>
          {/* Pixel decoration */}
          <div className="absolute top-1 left-1 w-1 h-1 bg-indigo-400 pixel-corners"></div>
          <div className="absolute bottom-1 right-1 w-1 h-1 bg-indigo-400 pixel-corners"></div>
        </div>

        {/* Pump Status Box with breathing animation */}
        <div className="text-center p-3 bg-gradient-to-br from-purple-950/50 to-indigo-950/50 pixel-corners border-2 border-purple-600/50 relative group">
          <div className={`absolute inset-0 pixel-corners ${isOn ? 'animate-breathing bg-green-600/10' : 'bg-gray-600/10'}`}></div>
          <div className="text-[9px] text-purple-300 mb-1 font-bold tracking-wider relative z-10">
            PUMP_STATE
          </div>
          <div className={`text-3xl font-bold relative z-10 ${isOn ? 'text-green-400 glow-text animate-pump-active' : 'text-gray-500'}`}>
            {isOn ? 'ON' : 'OFF'}
          </div>
          
          {/* Animated status indicator */}
          <div className={`mt-2 inline-flex items-center gap-2 px-2 py-1 pixel-corners text-[9px] font-bold tracking-wider relative z-10 ${
            isOn ? 'bg-green-900/50 text-green-300 border border-green-500/50' : 'bg-gray-800/50 text-gray-400 border border-gray-600/50'
          }`}>
            <div className="relative">
              <div className={`w-1.5 h-1.5 pixel-corners ${isOn ? 'bg-green-400' : 'bg-gray-500'}`} />
              {isOn && (
                <>
                  <div className="absolute inset-0 w-1.5 h-1.5 bg-green-400 pixel-corners animate-ping"></div>
                  <div className="absolute inset-0 w-1.5 h-1.5 bg-green-400 pixel-corners animate-pulse"></div>
                </>
              )}
            </div>
            {isOn ? 'WATERING' : 'IDLE'}
          </div>
          
          {/* Pixel decoration */}
          <div className="absolute top-1 right-1 w-1 h-1 bg-purple-400 pixel-corners"></div>
          <div className="absolute bottom-1 left-1 w-1 h-1 bg-purple-400 pixel-corners"></div>
        </div>
      </div>

      {/* Bottom pixel border animation */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-slide-right"></div>
    </div>
  );
}
