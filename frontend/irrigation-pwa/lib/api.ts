// src/lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface StatusResponse {
  humidity: number | null;
  pump_on: boolean;
  min_threshold: number;
  max_threshold: number;
  device_online: boolean;
}

export interface HumidityRecord {
  humidity: number;
  timestamp: number;
}

export interface ThresholdUpdate {
  min_humidity: number;
  max_humidity: number;
}

export const api = {
  async getStatus(): Promise<StatusResponse> {
    const response = await fetch(`${API_BASE}/api/status/`);
    if (!response.ok) throw new Error('Failed to fetch status');
    return response.json();
  },

  async getRecentHumidity(seconds: number = 60): Promise<HumidityRecord[]> {
    const response = await fetch(`${API_BASE}/api/recent-humidity/?seconds=${seconds}`);
    if (!response.ok) throw new Error('Failed to fetch humidity data');
    return response.json();
  },

  async updateThreshold(data: ThresholdUpdate): Promise<ThresholdUpdate> {
    const response = await fetch(`${API_BASE}/api/threshold/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update threshold');
    return response.json();
  },
};
