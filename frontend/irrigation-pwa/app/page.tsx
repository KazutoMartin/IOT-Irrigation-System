// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import HumidityChart from '@/components/HumidityChart';
import PumpStatus from '@/components/PumpStatus';
import { api, HumidityRecord, StatusResponse } from '@/lib/api';
import { wsClient, TelemetryMessage } from '@/lib/websocket';

export default function Dashboard() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [humidityData, setHumidityData] = useState<HumidityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
  
  useEffect(() => {
    loadInitialData();
    wsClient.connect();

    const unsubscribe = wsClient.subscribe(handleTelemetry);
    const statusInterval = setInterval(loadStatus, 5000);

    return () => {
      unsubscribe();
      clearInterval(statusInterval);
      wsClient.disconnect();
    };
  }, []);

  const loadInitialData = async () => {
    try {
      const [statusData, humidityHistory] = await Promise.all([
        api.getStatus(),
        api.getRecentHumidity(60),
      ]);
      setStatus(statusData);
      setHumidityData(humidityHistory);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatus = async () => {
    try {
      const statusData = await api.getStatus();
      setStatus(statusData);
    } catch (error) {
      console.error('Failed to load status:', error);
    }
  };

  const handleTelemetry = (message: TelemetryMessage) => {
    if (message.type === 'telemetry') {
      setHumidityData(prev => {
        const newData = [...prev, {
          humidity: message.humidity,
          timestamp: message.timestamp,
        }];

        const cutoffTime = message.timestamp - 60;
        return newData.filter(d => d.timestamp > cutoffTime);
      });

      setStatus(prev => prev ? {
        ...prev,
        humidity: message.humidity,
        pump_on: message.pump_on,
        device_online: true,
      } : null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f1e] via-[#1a1a2e] to-[#16213e] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-indigo-600 border-t-purple-600 rounded-full animate-spin pixel-corners mb-4"></div>
          <div className="text-lg text-indigo-400 font-bold glow-text">LOADING_SYSTEM...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1e] via-[#1a1a2e] to-[#16213e]">
      {/* Pixel Art Header */}
      <header className="bg-[#1a1a2e] border-b-4 border-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 pixel-corners flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white pixel-corners"></div>
              </div>
              <h1 className="text-lg md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 glow-text">
                IRRIGATION_SYS_v4.5
              </h1>
            </div>
            <Link
              href="/settings"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 md:px-6 md:py-3 pixel-corners pixel-button font-bold text-xs md:text-sm border-2 border-purple-400 hover:from-purple-500 hover:to-indigo-500 transition-all glow-text"
            >
              ⚙ SETTINGS
            </Link>
          </div>
        </div>
        
        {/* Decorative Line */}
        <div className="h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600"></div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {status && (
            <PumpStatus
              isOn={status.pump_on}
              currentHumidity={status.humidity}
              isOnline={status.device_online}
            />
          )}

          {status && humidityData.length > 0 && (
            <HumidityChart
              data={humidityData}
              minThreshold={status.min_threshold}
              maxThreshold={status.max_threshold}
            />
          )}

          {humidityData.length === 0 && (
            <div className="bg-[#1a1a2e] pixel-corners pixel-border p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-4 h-4 bg-indigo-600 pixel-corners animate-pulse"
                      style={{ animationDelay: `${i * 200}ms` }}
                    ></div>
                  ))}
                </div>
                <span className="text-indigo-400 font-bold text-sm glow-text">
                  WAITING_FOR_SENSOR_DATA...
                </span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Pixel Art Footer */}
      <footer className="mt-12 border-t-4 border-indigo-600 bg-[#1a1a2e]">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <div className="flex justify-center gap-2 mb-2">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 bg-purple-600 pixel-corners"
                style={{ opacity: 0.3 + (Math.random() * 0.7) }}
              ></div>
            ))}
          </div>
          <p className="text-[8px] md:text-[10px] text-indigo-400/70">
            M © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
