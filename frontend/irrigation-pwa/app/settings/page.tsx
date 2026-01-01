// src/app/settings/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ThresholdControl from '@/components/ThresholdControl';
import { api, StatusResponse } from '@/lib/api';

export default function Settings() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const data = await api.getStatus();
      setStatus(data);
    } catch (error) {
      console.error('Failed to load status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleThresholdUpdate = async (min: number, max: number) => {
    await api.updateThreshold({
      min_humidity: min,
      max_humidity: max,
    });
    
    setStatus(prev => prev ? {
      ...prev,
      min_threshold: min,
      max_threshold: max,
    } : null);
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
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {status && (
          <ThresholdControl
            minThreshold={status.min_threshold}
            maxThreshold={status.max_threshold}
            onUpdate={handleThresholdUpdate}
          />
        )}
      </main>
    </div>
  );
}
