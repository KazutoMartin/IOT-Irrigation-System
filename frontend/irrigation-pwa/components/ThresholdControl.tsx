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
    <div className="bg-[#1a1a2e] pixel-corners pixel-border p-6 scanline">
      {/* Header */}
      <div className="mb-6 pb-3 border-b-2 border-purple-600/30">
        <h2 className="text-xs md:text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 glow-purple">
          THRESHOLD_CONFIG
        </h2>
      </div>

      <div className="space-y-6">
        {/* MIN Threshold Control */}
        <div className="bg-gradient-to-br from-red-900/20 to-red-950/40 border-2 border-red-500/30 pixel-corners p-4">
          <label className="block text-[10px] font-bold text-red-300 mb-3 tracking-wider">
            ▼ MIN_HUMIDITY [PUMP_ON]
          </label>
          
          <div className="space-y-3">
            {/* Range Slider with Pixel Art Style */}
            <div className="relative">
              <input
                type="range"
                min="1"
                max="99"
                value={min}
                onChange={(e) => setMin(Number(e.target.value))}
                className="w-full h-3 bg-red-950 pixel-corners appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${min}%, #450a0a ${min}%, #450a0a 100%)`
                }}
              />
            </div>

            {/* Number Input */}
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max="99"
                value={min}
                onChange={(e) => setMin(Number(e.target.value))}
                className="flex-1 bg-red-950/50 border-2 border-red-700 pixel-corners px-3 py-2 text-center text-lg font-bold text-red-400 focus:outline-none focus:border-red-500"
              />
              <span className="text-red-400 font-bold text-xl">%</span>
            </div>

            {/* Visual Bar Indicator */}
            <div className="flex gap-1 h-2">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 pixel-corners transition-all ${
                    i < (min / 5) ? 'bg-red-500' : 'bg-red-950'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* MAX Threshold Control */}
        <div className="bg-gradient-to-br from-green-900/20 to-green-950/40 border-2 border-green-500/30 pixel-corners p-4">
          <label className="block text-[10px] font-bold text-green-300 mb-3 tracking-wider">
            ▲ MAX_HUMIDITY [PUMP_OFF]
          </label>
          
          <div className="space-y-3">
            {/* Range Slider */}
            <div className="relative">
              <input
                type="range"
                min="2"
                max="100"
                value={max}
                onChange={(e) => setMax(Number(e.target.value))}
                className="w-full h-3 bg-green-950 pixel-corners appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #22c55e 0%, #22c55e ${max}%, #052e16 ${max}%, #052e16 100%)`
                }}
              />
            </div>

            {/* Number Input */}
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="2"
                max="100"
                value={max}
                onChange={(e) => setMax(Number(e.target.value))}
                className="flex-1 bg-green-950/50 border-2 border-green-700 pixel-corners px-3 py-2 text-center text-lg font-bold text-green-400 focus:outline-none focus:border-green-500"
              />
              <span className="text-green-400 font-bold text-xl">%</span>
            </div>

            {/* Visual Bar Indicator */}
            <div className="flex gap-1 h-2">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 pixel-corners transition-all ${
                    i < (max / 5) ? 'bg-green-500' : 'bg-green-950'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <button
          onClick={handleUpdate}
          disabled={isUpdating || min >= max}
          className={`w-full py-4 px-6 pixel-corners pixel-button font-bold text-sm tracking-wider transition-all ${
            isUpdating || min >= max
              ? 'bg-gray-800 text-gray-600 border-2 border-gray-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-2 border-indigo-400 hover:from-indigo-500 hover:to-purple-500 glow-text'
          }`}
        >
          {isUpdating ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 bg-white pixel-corners animate-ping"></span>
              UPDATING...
            </span>
          ) : (
            '▶ APPLY_CHANGES'
          )}
        </button>

        {/* Message Display */}
        {message && (
          <div className={`text-[10px] text-center p-3 pixel-corners font-bold ${
            message.includes('success')
              ? 'bg-green-900/50 text-green-400 border-2 border-green-500/50'
              : 'bg-red-900/50 text-red-400 border-2 border-red-500/50'
          }`}>
            {message.includes('success') ? '✓ ' : '✗ '}
            {message.toUpperCase()}
          </div>
        )}
      </div>

      {/* Decorative Bottom Elements */}
      <div className="mt-6 flex gap-2">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1 pixel-corners bg-gradient-to-r from-indigo-600 to-purple-600"
            style={{ opacity: 1 - (i * 0.1) }}
          ></div>
        ))}
      </div>
    </div>
  );
}
