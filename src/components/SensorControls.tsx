
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

interface SensorControlsProps {
  isMonitoring: boolean;
  onToggleMonitoring: () => void;
  arrhythmiaMode: string;
  onArrhythmiaModeChange: (mode: string) => void;
  motionLevel: number;
  onMotionLevelChange: (level: number) => void;
}

const SensorControls: React.FC<SensorControlsProps> = ({
  isMonitoring,
  onToggleMonitoring,
  arrhythmiaMode,
  onArrhythmiaModeChange,
  motionLevel,
  onMotionLevelChange
}) => {
  const arrhythmiaTypes = [
    { value: 'normal', label: 'Normal Rhythm' },
    { value: 'bradycardia', label: 'Bradycardia' },
    { value: 'tachycardia', label: 'Tachycardia' },
    { value: 'afib', label: 'Atrial Fibrillation' },
    { value: 'pvc', label: 'PVCs' }
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Sensor Controls</h3>
      
      {/* Start/Stop Monitoring */}
      <div className="space-y-4">
        <div>
          <Button
            onClick={onToggleMonitoring}
            className={`w-full ${
              isMonitoring 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </Button>
        </div>

        {/* Arrhythmia Mode Simulation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Simulate Condition
          </label>
          <select
            value={arrhythmiaMode}
            onChange={(e) => onArrhythmiaModeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {arrhythmiaTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Motion Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Motion Level: {Math.round(motionLevel * 100)}%
          </label>
          <Slider
            value={[motionLevel * 100]}
            onValueChange={(value) => onMotionLevelChange(value[0] / 100)}
            max={100}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Still</span>
            <span>High Motion</span>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center space-x-2 pt-2">
          <div className={`w-3 h-3 rounded-full ${
            isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
          }`}></div>
          <span className="text-sm text-gray-600">
            {isMonitoring ? 'Monitoring Active' : 'Monitoring Stopped'}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default SensorControls;
