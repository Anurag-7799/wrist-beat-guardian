
import React from 'react';
import { Heart, Activity, Droplets, Zap } from 'lucide-react';
import { SensorReading } from '../utils/arrhythmiaDetection';

interface VitalSignsPanelProps {
  currentReading: SensorReading | null;
  averageHR: number;
  hrVariability: number;
}

const VitalSignsPanel: React.FC<VitalSignsPanelProps> = ({ 
  currentReading, 
  averageHR, 
  hrVariability 
}) => {
  if (!currentReading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Vital Signs</h3>
        <div className="text-center text-gray-500">No sensor data available</div>
      </div>
    );
  }

  const getHRColor = (hr: number) => {
    if (hr < 60) return 'text-yellow-600';
    if (hr > 100) return 'text-red-600';
    return 'text-green-600';
  };

  const getMotionStatus = (motion: number) => {
    if (motion < 0.3) return { text: 'Stable', color: 'text-green-600' };
    if (motion < 0.7) return { text: 'Light Motion', color: 'text-yellow-600' };
    return { text: 'High Motion', color: 'text-red-600' };
  };

  const motionStatus = getMotionStatus(currentReading.motionArtifact);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Vital Signs</h3>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Heart Rate */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <Heart className={`w-6 h-6 ${getHRColor(currentReading.heartRate)}`} />
          </div>
          <div>
            <div className="text-sm text-gray-500">Heart Rate</div>
            <div className={`text-xl font-bold ${getHRColor(currentReading.heartRate)}`}>
              {Math.round(currentReading.heartRate)} BPM
            </div>
          </div>
        </div>

        {/* Average HR */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Avg HR (30s)</div>
            <div className="text-xl font-bold text-blue-600">
              {Math.round(averageHR)} BPM
            </div>
          </div>
        </div>

        {/* Oxygen Saturation */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-cyan-100 rounded-lg">
            <Droplets className="w-6 h-6 text-cyan-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">SpO₂</div>
            <div className="text-xl font-bold text-cyan-600">
              {Math.round(currentReading.oxygenSaturation)}%
            </div>
          </div>
        </div>

        {/* HRV */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Zap className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">HRV</div>
            <div className="text-xl font-bold text-purple-600">
              {Math.round(hrVariability)}ms
            </div>
          </div>
        </div>
      </div>

      {/* Motion Status */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Motion Status:</span>
          <span className={`text-sm font-medium ${motionStatus.color}`}>
            {motionStatus.text}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VitalSignsPanel;
