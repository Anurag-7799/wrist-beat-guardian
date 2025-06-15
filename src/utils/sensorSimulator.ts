
import { SensorReading } from './arrhythmiaDetection';

export class WristSensorSimulator {
  private baseHeartRate: number = 75;
  private currentPhase: number = 0;
  private noiseLevel: number = 0.1;
  private motionLevel: number = 0;
  private arrhythmiaMode: string = 'normal';
  
  setArrhythmiaMode(mode: string) {
    this.arrhythmiaMode = mode;
    
    switch (mode) {
      case 'bradycardia':
        this.baseHeartRate = 45;
        break;
      case 'tachycardia':
        this.baseHeartRate = 115;
        break;
      case 'afib':
        this.baseHeartRate = 85;
        this.noiseLevel = 0.3;
        break;
      case 'pvc':
        this.baseHeartRate = 72;
        break;
      default:
        this.baseHeartRate = 75;
        this.noiseLevel = 0.1;
    }
  }
  
  setMotionLevel(level: number) {
    this.motionLevel = Math.max(0, Math.min(1, level));
  }
  
  generateReading(): SensorReading {
    const timestamp = Date.now();
    
    // Generate heart rate with variability
    let heartRate = this.baseHeartRate;
    
    // Add natural variability
    heartRate += (Math.random() - 0.5) * 10;
    
    // Add arrhythmia-specific patterns
    if (this.arrhythmiaMode === 'afib') {
      heartRate += (Math.random() - 0.5) * 30; // High variability
    } else if (this.arrhythmiaMode === 'pvc') {
      // Occasionally add premature beats
      if (Math.random() < 0.1) {
        heartRate *= 0.7; // Premature beat
      }
    }
    
    // Add motion artifacts
    if (this.motionLevel > 0.3) {
      heartRate += (Math.random() - 0.5) * this.motionLevel * 40;
    }
    
    // Generate PPG waveform (simplified)
    this.currentPhase += (heartRate / 60) * 2 * Math.PI * 0.1; // 100ms intervals
    const ppgValue = Math.sin(this.currentPhase) * 1000 + 2000 + 
                     (Math.random() - 0.5) * this.noiseLevel * 200;
    
    // Calculate R-R interval (time between heartbeats)
    const rPeakInterval = (60 / heartRate) * 1000; // in milliseconds
    
    // Add arrhythmia-specific R-R interval variations
    let adjustedRRInterval = rPeakInterval;
    if (this.arrhythmiaMode === 'afib') {
      adjustedRRInterval += (Math.random() - 0.5) * 400; // High variability
    } else if (this.arrhythmiaMode === 'pvc') {
      if (Math.random() < 0.1) {
        adjustedRRInterval *= 0.6; // Short interval for PVC
      }
    }
    
    // Oxygen saturation (typically 95-100%)
    const oxygenSaturation = 98 + (Math.random() - 0.5) * 4 - this.motionLevel * 3;
    
    return {
      timestamp,
      ppgValue: Math.max(0, ppgValue),
      heartRate: Math.max(30, Math.min(200, heartRate)),
      rPeakInterval: Math.max(300, Math.min(2000, adjustedRRInterval)),
      oxygenSaturation: Math.max(90, Math.min(100, oxygenSaturation)),
      motionArtifact: this.motionLevel + (Math.random() - 0.5) * 0.2
    };
  }
}
