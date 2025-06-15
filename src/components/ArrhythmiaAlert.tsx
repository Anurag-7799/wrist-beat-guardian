
import React from 'react';
import { AlertTriangle, Heart, CheckCircle, Activity } from 'lucide-react';
import { ArrhythmiaResult } from '../utils/arrhythmiaDetection';

interface ArrhythmiaAlertProps {
  result: ArrhythmiaResult;
}

const ArrhythmiaAlert: React.FC<ArrhythmiaAlertProps> = ({ result }) => {
  const getAlertConfig = (type: string, severity: string) => {
    switch (type) {
      case 'normal':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-600',
          titleColor: 'text-green-800'
        };
      case 'artifact':
        return {
          icon: Activity,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          iconColor: 'text-gray-600',
          titleColor: 'text-gray-800'
        };
      case 'afib':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-600',
          titleColor: 'text-red-800'
        };
      default:
        const isHighSeverity = severity === 'high';
        return {
          icon: isHighSeverity ? AlertTriangle : Heart,
          bgColor: isHighSeverity ? 'bg-red-50' : 'bg-yellow-50',
          borderColor: isHighSeverity ? 'border-red-200' : 'border-yellow-200',
          iconColor: isHighSeverity ? 'text-red-600' : 'text-yellow-600',
          titleColor: isHighSeverity ? 'text-red-800' : 'text-yellow-800'
        };
    }
  };

  const config = getAlertConfig(result.type, result.severity);
  const IconComponent = config.icon;

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">High Priority</span>;
      case 'medium':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Medium Priority</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Low Priority</span>;
    }
  };

  return (
    <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4`}>
      <div className="flex items-start space-x-3">
        <IconComponent className={`w-6 h-6 ${config.iconColor} mt-0.5`} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className={`text-lg font-semibold ${config.titleColor}`}>
              {result.type === 'normal' ? 'Normal Rhythm' : 
               result.type === 'afib' ? 'Atrial Fibrillation' :
               result.type === 'bradycardia' ? 'Bradycardia' :
               result.type === 'tachycardia' ? 'Tachycardia' :
               result.type === 'pvc' ? 'Premature Beats' :
               'Motion Artifact'}
            </h4>
            {getSeverityBadge(result.severity)}
          </div>
          
          <p className="text-gray-700 mb-3">{result.description}</p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Confidence Level:</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      result.confidence > 0.8 ? 'bg-green-500' :
                      result.confidence > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${result.confidence * 100}%` }}
                  ></div>
                </div>
                <span className="font-medium">{Math.round(result.confidence * 100)}%</span>
              </div>
            </div>
            
            <div className="bg-white bg-opacity-50 rounded p-3 mt-3">
              <div className="text-sm font-medium text-gray-700 mb-1">Recommendation:</div>
              <div className="text-sm text-gray-600">{result.recommendation}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArrhythmiaAlert;
