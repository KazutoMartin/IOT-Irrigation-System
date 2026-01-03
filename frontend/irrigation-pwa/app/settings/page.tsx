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
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f1e] via-[#1a1a2e] to-[#16213e] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-purple-600 border-t-indigo-600 rounded-full animate-spin pixel-corners mb-4"></div>
          <div className="text-lg text-purple-400 font-bold glow-purple">LOADING_SETTINGS...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1e] via-[#1a1a2e] to-[#16213e]">
      {/* Pixel Art Header */}
      <header className="bg-[#1a1a2e] border-b-4 border-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 pixel-corners flex items-center justify-center">
                <span className="text-white font-bold text-xl">⚙</span>
              </div>
              <h1 className="text-lg md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 glow-purple">
                SETTINGS_CONFIG
              </h1>
            </div>
            <Link
              href="/"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 md:px-6 md:py-3 pixel-corners pixel-button font-bold text-xs md:text-sm border-2 border-indigo-400 hover:from-indigo-500 hover:to-purple-500 transition-all glow-text"
            >
              ◄ DASHBOARD
            </Link>
          </div>
        </div>
        
        {/* Decorative Line */}
        <div className="h-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600"></div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Info Panel */}
        <div className="mb-6 bg-[#1a1a2e] border-2 border-indigo-600/30 pixel-corners p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-indigo-600 pixel-corners flex-shrink-0 flex items-center justify-center">
              <span className="text-white text-xs">ℹ</span>
            </div>
            <p className="text-[10px] md:text-xs text-indigo-300 leading-relaxed">
              Configure humidity thresholds to control automatic irrigation. 
              The pump activates when humidity drops below MIN and stops when it reaches MAX.
            </p>
          </div>
        </div>

        {status && (
          <ThresholdControl
            minThreshold={status.min_threshold}
            maxThreshold={status.max_threshold}
            onUpdate={handleThresholdUpdate}
          />
        )}

        {/* Current Status Panel */}
        {status && (
          <div className="mt-6 bg-[#1a1a2e] border-2 border-purple-600/30 pixel-corners p-4">
            <h3 className="text-xs font-bold text-purple-400 mb-3 tracking-wider">
              CURRENT_STATUS
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-purple-950/30 border border-purple-600/30 pixel-corners p-3">
                <div className="text-[8px] text-purple-300 mb-1">MIN_SET</div>
                <div className="text-xl font-bold text-purple-400 glow-purple">
                  {status.min_threshold}%
                </div>
              </div>
              <div className="bg-indigo-950/30 border border-indigo-600/30 pixel-corners p-3">
                <div className="text-[8px] text-indigo-300 mb-1">MAX_SET</div>
                <div className="text-xl font-bold text-indigo-400 glow-text">
                  {status.max_threshold}%
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Pixel Art Footer */}
      <footer className="mt-12 border-t-4 border-purple-600 bg-[#1a1a2e]">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <div className="flex justify-center gap-2 mb-2">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 bg-indigo-600 pixel-corners"
                style={{ opacity: 0.3 + (Math.random() * 0.7) }}
              ></div>
            ))}
          </div>
          <p className="text-[8px] md:text-[10px] text-purple-400/70">
            SYSTEM_CONFIG_PANEL © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
