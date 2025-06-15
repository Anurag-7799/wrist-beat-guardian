
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';

interface HeartRateChartProps {
  data: Array<{
    timestamp: number;
    heartRate: number;
    time: string;
  }>;
}

const HeartRateChart: React.FC<HeartRateChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Heart Rate Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="time" 
              stroke="#666"
              fontSize={12}
            />
            <YAxis 
              domain={[40, 140]}
              stroke="#666"
              fontSize={12}
              label={{ value: 'BPM', angle: -90, position: 'insideLeft' }}
            />
            <ReferenceLine y={60} stroke="#fbbf24" strokeDasharray="5 5" />
            <ReferenceLine y={100} stroke="#f87171" strokeDasharray="5 5" />
            <Line 
              type="monotone" 
              dataKey="heartRate" 
              stroke="#dc2626"
              strokeWidth={2}
              dot={{ fill: '#dc2626', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: '#dc2626', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center mt-2 text-xs text-gray-500 space-x-4">
        <div className="flex items-center">
          <div className="w-3 h-0.5 bg-yellow-400 mr-1"></div>
          <span>Bradycardia (≤60)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-0.5 bg-red-400 mr-1"></div>
          <span>Tachycardia (≥100)</span>
        </div>
      </div>
    </div>
  );
};

export default HeartRateChart;
