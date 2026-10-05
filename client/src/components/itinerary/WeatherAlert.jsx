import React from 'react';
import { CloudRain, AlertTriangle } from 'lucide-react';
import Card from '../ui/Card';

export const WeatherAlert = ({
  message = 'Rain expected during afternoon hours',
  details = 'Outdoor attractions have been intelligently scheduled around indoor visits.',
}) => {
  return (
    <Card className="p-4 border-accent-blue/30 bg-accent-blue/5">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-accent-blue/20 text-accent-blue flex items-center justify-center shrink-0 mt-0.5">
          <CloudRain size={18} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
            <span>Weather Intelligence</span>
          </h4>
          <p className="text-xs text-text-secondary mt-0.5">{message}</p>
          {details && <p className="text-xs text-text-muted mt-1">{details}</p>}
        </div>
      </div>
    </Card>
  );
};

export default WeatherAlert;
