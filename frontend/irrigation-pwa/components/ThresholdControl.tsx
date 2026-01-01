// src/components/ThresholdControl.tsx
'use client';

import { useState } from 'react';

interface ThresholdControlProps {
  minThreshold: number;
  maxThreshold: number;
  onUpdate: (min: number, max: number) => Promise<void>;
}

export default function ThresholdControl({ 
  minThreshold, 
  maxThreshold, 
  onUpdate 
}: ThresholdControlProps) {
  const [min, setMin] = useState(minThreshold);
  const [max, setMax] = useState(maxThreshold);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdate = async () => {
    if (min >= max) {
      setMessage('Min must be less than max');
      return;
    }

    setIsUpdating(true);
    setMessage('');

    try {
      await onUpdate(min, max);
      setMessage('Thresholds updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update thresholds');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Threshold Settings</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Humidity (Turn pump ON)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="99"
              value={min}
              onChange={(e) => setMin(Number(e.target.value))}
              className="flex-1"
            />
            <input
              type="number"
              min="1"
              max="99"
              value={min}
              onChange={(e) => setMin(Number(e.target.value))}
              className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center"
            />
            <span className="text-gray-600">%</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Humidity (Turn pump OFF)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="2"
              max="100"
              value={max}
              onChange={(e) => setMax(Number(e.target.value))}
              className="flex-1"
            />
            <input
              type="number"
              min="2"
              max="100"
              value={max}
              onChange={(e) => setMax(Number(e.target.value))}
              className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center"
            />
            <span className="text-gray-600">%</span>
          </div>
        </div>

        <button
          onClick={handleUpdate}
          disabled={isUpdating || min >= max}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isUpdating ? 'Updating...' : 'Apply Changes'}
        </button>

        {message && (
          <div className={`text-sm text-center p-2 rounded ${
            message.includes('success') 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
