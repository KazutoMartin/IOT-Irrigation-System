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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Irrigation System</h1>
            <Link
              href="/settings"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Settings
            </Link>
          </div>
        </div>
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
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
              Waiting for sensor data...
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
