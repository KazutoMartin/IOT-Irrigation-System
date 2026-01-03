// src/components/HumidityChart.tsx
'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface HumidityChartProps {
  data: Array<{ humidity: number; timestamp: number }>;
  minThreshold: number;
  maxThreshold: number;
}

export default function HumidityChart({ data, minThreshold, maxThreshold }: HumidityChartProps) {
  const chartRef = useRef<ChartJS<'line'>>(null);

  const chartData = {
    labels: data.map(d => new Date(d.timestamp * 1000).toLocaleTimeString()),
    datasets: [
      {
        label: 'Humidity (%)',
        data: data.map(d => d.humidity),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        fill: true,
        tension: 0,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: '#a855f7',
        pointBorderColor: '#1a1a2e',
        pointBorderWidth: 2,
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: '#1a1a2e',
        titleColor: '#6366f1',
        bodyColor: '#a855f7',
        borderColor: '#6366f1',
        borderWidth: 2,
        padding: 10,
        titleFont: {
          family: 'Press Start 2P',
          size: 8,
        },
        bodyFont: {
          family: 'Press Start 2P',
          size: 8,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(99, 102, 241, 0.1)',
          lineWidth: 1,
        },
        border: {
          color: '#6366f1',
          width: 2,
        },
        ticks: {
          color: '#a855f7',
          font: {
            family: 'Press Start 2P',
            size: 8,
          },
          callback: (value: any) => `${value}%`,
        },
      },
      x: {
        grid: {
          color: 'rgba(168, 85, 247, 0.1)',
          lineWidth: 1,
        },
        border: {
          color: '#a855f7',
          width: 2,
        },
        ticks: {
          color: '#6366f1',
          maxRotation: 0,
          autoSkipPadding: 20,
          font: {
            family: 'Press Start 2P',
            size: 6,
          },
        },
      },
    },
    animation: {
      duration: 300,
    },
  };

  useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
      chart.update('none');
    }
  }, [data]);

  return (
    <div className="bg-[#1a1a2e] pixel-corners pixel-border p-4 scanline">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-indigo-600/30">
        <h2 className="text-xs md:text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 glow-text">
          HUMIDITY_MONITOR
        </h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 pixel-corners animate-pulse"></div>
          <span className="text-[8px] text-purple-400">LIVE_60s</span>
        </div>
      </div>

      {/* Chart Container with CRT Effect */}
      <div className="relative bg-[#0f0f1e] border-2 border-indigo-900/50 pixel-corners p-3" style={{ height: '300px' }}>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(99, 102, 241, 0.3) 2px, rgba(99, 102, 241, 0.3) 4px)'
          }}></div>
        </div>
        <Line ref={chartRef} data={chartData} options={options} />
      </div>

      {/* Threshold Indicators */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-red-900/30 to-red-950/50 border-2 border-red-500/40 pixel-corners p-3">
          <div className="text-[8px] text-red-300 mb-1 tracking-wider">MIN_THRESHOLD</div>
          <div className="flex items-baseline gap-1">
            <div className="text-xl md:text-2xl font-bold text-red-400 glow-text tabular-nums">
              {minThreshold}
            </div>
            <span className="text-xs text-red-500">%</span>
          </div>
          <div className="mt-2 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-1 h-1 bg-red-950 pixel-corners">
                {i < 2 && <div className="h-full bg-red-500"></div>}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-900/30 to-green-950/50 border-2 border-green-500/40 pixel-corners p-3">
          <div className="text-[8px] text-green-300 mb-1 tracking-wider">MAX_THRESHOLD</div>
          <div className="flex items-baseline gap-1">
            <div className="text-xl md:text-2xl font-bold text-green-400 glow-text tabular-nums">
              {maxThreshold}
            </div>
            <span className="text-xs text-green-500">%</span>
          </div>
          <div className="mt-2 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-1 h-1 bg-green-950 pixel-corners">
                {i < 4 && <div className="h-full bg-green-500"></div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
