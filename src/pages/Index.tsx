import React, { useState, useEffect, useRef } from 'react';
import { ArrhythmiaDetector, SensorReading, ArrhythmiaResult } from '../utils/arrhythmiaDetection';
import { WristSensorSimulator } from '../utils/sensorSimulator';
import VitalSignsPanel from '../components/VitalSignsPanel';
import HeartRateChart from '../components/HeartRateChart';
import PPGWaveform from '../components/PPGWaveform';
import ArrhythmiaAlert from '../components/ArrhythmiaAlert';
import SensorControls from '../components/SensorControls';
import { Activity } from 'lucide-react';

const Index = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [currentReading, setCurrentReading] = useState<SensorReading | null>(null);
  const [arrhythmiaResult, setArrhythmiaResult] = useState<ArrhythmiaResult | null>(null);
  const [heartRateData, setHeartRateData] = useState<Array<{timestamp: number, heartRate: number, time: string}>>([]);
  const [ppgData, setPpgData] = useState<Array<{timestamp: number, ppgValue: number, time: string}>>([]);
  const [arrhythmiaMode, setArrhythmiaMode] = useState('normal');
  const [motionLevel, setMotionLevel] = useState(0);
  
  const detectorRef = useRef(new ArrhythmiaDetector());
  const simulatorRef = useRef(new WristSensorSimulator());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    simulatorRef.current.setArrhythmiaMode(arrhythmiaMode);
  }, [arrhythmiaMode]);

  useEffect(() => {
    simulatorRef.current.setMotionLevel(motionLevel);
  }, [motionLevel]);

  useEffect(() => {
    if (isMonitoring) {
      intervalRef.current = setInterval(() => {
        const reading = simulatorRef.current.generateReading();
        const result = detectorRef.current.processSensorData(reading);
        
        setCurrentReading(reading);
        setArrhythmiaResult(result);
        
        // Format time for display
        const timeStr = new Date(reading.timestamp).toLocaleTimeString();
        
        // Update heart rate data (keep last 30 points)
        setHeartRateData(prev => {
          const newData = [...prev, {
            timestamp: reading.timestamp,
            heartRate: reading.heartRate,
            time: timeStr
          }];
          return newData.slice(-30);
        });
        
        // Update PPG data (keep last 20 points for smooth animation)
        setPpgData(prev => {
          const newData = [...prev, {
            timestamp: reading.timestamp,
            ppgValue: reading.ppgValue,
            time: timeStr
          }];
          return newData.slice(-20);
        });
      }, 100); // 10Hz sampling rate
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isMonitoring]);

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    if (!isMonitoring) {
      // Reset data when starting new session
      setHeartRateData([]);
      setPpgData([]);
    }
  };

  const calculateAverageHR = () => {
    if (heartRateData.length === 0) return 0;
    const sum = heartRateData.reduce((acc, data) => acc + data.heartRate, 0);
    return sum / heartRateData.length;
  };

  const calculateHRV = () => {
    if (!currentReading) return 0;
    // Simplified HRV calculation - in real implementation, this would be more complex
    return Math.abs(Math.sin(Date.now() / 1000)) * 50 + 20;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Activity className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Arrhythmia Monitor</h1>
                <p className="text-sm text-gray-500">Wrist-based cardiac rhythm analysis</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Last Update</div>
              <div className="text-sm font-medium text-gray-900">
                {currentReading ? new Date(currentReading.timestamp).toLocaleTimeString() : '--:--:--'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls */}
          <div className="lg:col-span-1">
            <SensorControls
              isMonitoring={isMonitoring}
              onToggleMonitoring={toggleMonitoring}
              arrhythmiaMode={arrhythmiaMode}
              onArrhythmiaModeChange={setArrhythmiaMode}
              motionLevel={motionLevel}
              onMotionLevelChange={setMotionLevel}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Alert Panel */}
            {arrhythmiaResult && (
              <ArrhythmiaAlert result={arrhythmiaResult} />
            )}

            {/* Vital Signs */}
            <VitalSignsPanel
              currentReading={currentReading}
              averageHR={calculateAverageHR()}
              hrVariability={calculateHRV()}
            />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Heart Rate Trend */}
              <HeartRateChart data={heartRateData} />
              
              {/* PPG Waveform */}
              <PPGWaveform data={ppgData} />
            </div>

            {/* Technical Details */}
            {currentReading && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Technical Data</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">R-R Interval</div>
                    <div className="font-mono text-gray-900">{Math.round(currentReading.rPeakInterval)}ms</div>
                  </div>
                  <div>
                    <div className="text-gray-500">PPG Signal</div>
                    <div className="font-mono text-gray-900">{Math.round(currentReading.ppgValue)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Motion Artifact</div>
                    <div className="font-mono text-gray-900">{Math.round(currentReading.motionArtifact * 100)}%</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Timestamp</div>
                    <div className="font-mono text-gray-900">{new Date(currentReading.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
