
import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface PPGWaveformProps {
  data: Array<{
    timestamp: number;
    ppgValue: number;
    time: string;
  }>;
}

const PPGWaveform: React.FC<PPGWaveformProps> = ({ data }) => {
  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
      <h3 className="text-lg font-semibold text-green-400 mb-4">PPG Waveform (Live)</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis 
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={false}
            />
            <YAxis 
              domain={['dataMin - 100', 'dataMax + 100']}
              axisLine={false}
              tickLine={false}
              tick={false}
            />
            <Line 
              type="monotone" 
              dataKey="ppgValue" 
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="text-xs text-green-400 mt-2">
        Real-time photoplethysmography signal from wrist sensor
      </div>
    </div>
  );
};

export default PPGWaveform;
