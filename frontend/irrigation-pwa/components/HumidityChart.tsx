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
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.1,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(167, 139, 250)',
        pointBorderColor: 'rgb(99, 102, 241)',
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
        backgroundColor: 'rgba(26, 26, 46, 0.95)',
        titleColor: 'rgb(167, 139, 250)',
        bodyColor: 'rgb(129, 140, 248)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 2,
        padding: 12,
        displayColors: false,
        titleFont: {
          family: "'Press Start 2P', cursive",
          size: 10,
        },
        bodyFont: {
          family: "'Press Start 2P', cursive",
          size: 9,
        },
        callbacks: {
          label: function(context: any) {
            return `${context.parsed.y}%`;
          }
        }
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
        ticks: {
          callback: (value: any) => `${value}%`,
          color: 'rgb(129, 140, 248)',
          font: {
            family: "'Press Start 2P', cursive",
            size: 8,
          },
        },
        border: {
          color: 'rgb(99, 102, 241)',
        },
      },
      x: {
        grid: {
          color: 'rgba(139, 92, 246, 0.1)',
          lineWidth: 1,
        },
        ticks: {
          maxRotation: 0,
          autoSkipPadding: 20,
          color: 'rgb(167, 139, 250)',
          font: {
            family: "'Press Start 2P', cursive",
            size: 7,
          },
        },
        border: {
          color: 'rgb(139, 92, 246)',
        },
      },
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart' as const,
    },
  };

  useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
      chart.update('none');
    }
  }, [data]);

  return (
    <div className="bg-[#1a1a2e] pixel-corners pixel-border p-4 relative overflow-hidden h-full flex flex-col">
      {/* Animated scanline effect */}
      <div className="absolute inset-0 scanline pointer-events-none"></div>
      
      {/* Header with glitch effect */}
      <div className="flex justify-between items-center mb-3 relative z-10">
        <h2 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 glow-text animate-glitch-text">
          HUMIDITY_GRAPH
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1 h-1 bg-purple-500 pixel-corners animate-pulse"
                style={{ animationDelay: `${i * 150}ms` }}
              ></div>
            ))}
          </div>
          <div className="text-[9px] text-purple-400 font-bold tracking-wider">
            LAST_60_SEC
          </div>
        </div>
      </div>

      {/* Chart with fade-in animation */}
      <div className="flex-1 relative z-10 animate-fade-in">
        <Line ref={chartRef} data={chartData} options={options} />
      </div>

      {/* Threshold indicators with pulsing animation */}
      <div className="mt-3 flex justify-around text-[10px] relative z-10">
        <div className="text-center relative group">
          <div className="absolute inset-0 bg-red-600/10 pixel-corners animate-pulse-slow"></div>
          <div className="text-red-300/70 font-bold tracking-wider mb-1 relative z-10">MIN_THRESH</div>
          <div className="text-lg font-bold text-red-400 glow-text relative z-10 animate-threshold-pulse">
            {minThreshold}%
          </div>
          {/* Warning indicator */}
          <div className="flex justify-center gap-1 mt-1">
            <div className="w-1 h-1 bg-red-500 pixel-corners animate-blink"></div>
            <div className="w-1 h-1 bg-red-500 pixel-corners animate-blink" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>

        <div className="w-px bg-gradient-to-b from-transparent via-indigo-600 to-transparent"></div>

        <div className="text-center relative group">
          <div className="absolute inset-0 bg-green-600/10 pixel-corners animate-pulse-slow" style={{ animationDelay: '0.5s' }}></div>
          <div className="text-green-300/70 font-bold tracking-wider mb-1 relative z-10">MAX_THRESH</div>
          <div className="text-lg font-bold text-green-400 glow-text relative z-10 animate-threshold-pulse" style={{ animationDelay: '0.3s' }}>
            {maxThreshold}%
          </div>
          {/* Success indicator */}
          <div className="flex justify-center gap-1 mt-1">
            <div className="w-1 h-1 bg-green-500 pixel-corners animate-pulse"></div>
            <div className="w-1 h-1 bg-green-500 pixel-corners animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>
      </div>

      {/* Corner decorations with animation */}
      <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-indigo-500 pixel-corners animate-corner-glow"></div>
      <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-purple-500 pixel-corners animate-corner-glow" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-purple-500 pixel-corners animate-corner-glow" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-indigo-500 pixel-corners animate-corner-glow" style={{ animationDelay: '1.5s' }}></div>
    </div>
  );
}
