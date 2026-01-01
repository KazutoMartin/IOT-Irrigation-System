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
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 5,
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
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: (value: any) => `${value}%`,
        },
      },
      x: {
        ticks: {
          maxRotation: 0,
          autoSkipPadding: 20,
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
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Humidity Over Time</h2>
        <div className="text-sm text-gray-600">
          Last 60 seconds
        </div>
      </div>
      <div style={{ height: '300px' }}>
        <Line ref={chartRef} data={chartData} options={options} />
      </div>
      <div className="mt-4 flex justify-around text-sm">
        <div className="text-center">
          <div className="text-gray-600">Min Threshold</div>
          <div className="text-lg font-semibold text-red-600">{minThreshold}%</div>
        </div>
        <div className="text-center">
          <div className="text-gray-600">Max Threshold</div>
          <div className="text-lg font-semibold text-green-600">{maxThreshold}%</div>
        </div>
      </div>
    </div>
  );
}
