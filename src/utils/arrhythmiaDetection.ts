
export interface SensorReading {
  timestamp: number;
  ppgValue: number;
  heartRate: number;
  rPeakInterval: number;
  oxygenSaturation: number;
  motionArtifact: number;
}

export interface ArrhythmiaResult {
  type: 'normal' | 'afib' | 'bradycardia' | 'tachycardia' | 'pvc' | 'artifact';
  confidence: number;
  description: string;
  severity: 'low' | 'medium' | 'high';
  recommendation: string;
}

export class ArrhythmiaDetector {
  private rrIntervals: number[] = [];
  private heartRates: number[] = [];
  private ppgBuffer: number[] = [];
  private readonly bufferSize = 30; // 30 seconds of data
  
  processSensorData(reading: SensorReading): ArrhythmiaResult {
    // Add to buffers
    this.rrIntervals.push(reading.rPeakInterval);
    this.heartRates.push(reading.heartRate);
    this.ppgBuffer.push(reading.ppgValue);
    
    // Maintain buffer size
    if (this.rrIntervals.length > this.bufferSize) {
      this.rrIntervals.shift();
      this.heartRates.shift();
      this.ppgBuffer.shift();
    }
    
    // Need minimum data for analysis
    if (this.rrIntervals.length < 10) {
      return {
        type: 'normal',
        confidence: 0.5,
        description: 'Collecting baseline data...',
        severity: 'low',
        recommendation: 'Continue monitoring'
      };
    }
    
    // Check for motion artifacts first
    if (reading.motionArtifact > 0.7) {
      return {
        type: 'artifact',
        confidence: 0.9,
        description: 'Motion detected - readings may be inaccurate',
        severity: 'low',
        recommendation: 'Keep wrist still for accurate readings'
      };
    }
    
    // Analyze for different arrhythmias
    const avgHR = this.calculateMean(this.heartRates);
    const rrVariability = this.calculateRRVariability();
    const irregularityScore = this.calculateIrregularityScore();
    
    // Bradycardia detection (HR < 60)
    if (avgHR < 60) {
      return {
        type: 'bradycardia',
        confidence: 0.85,
        description: `Slow heart rate detected (${Math.round(avgHR)} BPM)`,
        severity: avgHR < 50 ? 'high' : 'medium',
        recommendation: 'Consult healthcare provider if symptoms persist'
      };
    }
    
    // Tachycardia detection (HR > 100)
    if (avgHR > 100) {
      return {
        type: 'tachycardia',
        confidence: 0.85,
        description: `Fast heart rate detected (${Math.round(avgHR)} BPM)`,
        severity: avgHR > 120 ? 'high' : 'medium',
        recommendation: 'Monitor closely, seek medical attention if sustained'
      };
    }
    
    // Atrial Fibrillation detection (irregular rhythm + specific patterns)
    if (irregularityScore > 0.6 && rrVariability > 50) {
      return {
        type: 'afib',
        confidence: 0.78,
        description: 'Irregular rhythm pattern detected - possible AFib',
        severity: 'high',
        recommendation: 'Seek immediate medical evaluation'
      };
    }
    
    // Premature Ventricular Contractions (PVCs)
    if (this.detectPVCs()) {
      return {
        type: 'pvc',
        confidence: 0.72,
        description: 'Premature beats detected',
        severity: 'medium',
        recommendation: 'Monitor frequency, consult cardiologist if frequent'
      };
    }
    
    // Normal rhythm
    return {
      type: 'normal',
      confidence: 0.92,
      description: 'Normal sinus rhythm',
      severity: 'low',
      recommendation: 'Continue regular monitoring'
    };
  }
  
  private calculateMean(values: number[]): number {
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }
  
  private calculateRRVariability(): number {
    if (this.rrIntervals.length < 5) return 0;
    
    const mean = this.calculateMean(this.rrIntervals);
    const squaredDiffs = this.rrIntervals.map(interval => Math.pow(interval - mean, 2));
    const variance = this.calculateMean(squaredDiffs);
    return Math.sqrt(variance);
  }
  
  private calculateIrregularityScore(): number {
    if (this.rrIntervals.length < 5) return 0;
    
    let irregularCount = 0;
    for (let i = 1; i < this.rrIntervals.length; i++) {
      const diff = Math.abs(this.rrIntervals[i] - this.rrIntervals[i-1]);
      if (diff > 200) { // More than 200ms difference
        irregularCount++;
      }
    }
    
    return irregularCount / (this.rrIntervals.length - 1);
  }
  
  private detectPVCs(): boolean {
    if (this.rrIntervals.length < 5) return false;
    
    // Look for pattern: short interval followed by long interval
    for (let i = 1; i < this.rrIntervals.length - 1; i++) {
      const current = this.rrIntervals[i];
      const next = this.rrIntervals[i + 1];
      const prev = this.rrIntervals[i - 1];
      
      // PVC pattern: compensatory pause
      if (current < prev * 0.8 && next > prev * 1.2) {
        return true;
      }
    }
    
    return false;
  }
}
