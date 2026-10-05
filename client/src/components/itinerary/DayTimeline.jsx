import React from 'react';
import StopCard from './StopCard';
import Button from '../ui/Button';
import { RefreshCw } from 'lucide-react';

export const DayTimeline = ({ day, onRegenerateDay, isRegenerating = false }) => {
  if (!day || !day.stops || day.stops.length === 0) {
    return (
      <div className="py-12 text-center text-text-muted">
        <p className="text-sm">No stops scheduled for this day.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-text-primary">
            Day {day.dayNumber} Timeline
          </h3>
          <p className="text-xs text-text-muted">
            {day.stops.length} stops · Est. Cost: ₹{day.totalCost || 0} · Travel:{' '}
            {day.totalTravelTime || 0} min
          </p>
        </div>

        {onRegenerateDay && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onRegenerateDay(day.dayNumber)}
            disabled={isRegenerating}
          >
            <RefreshCw
              size={14}
              className={isRegenerating ? 'animate-spin text-purple-400' : ''}
            />
            <span>Regenerate Day</span>
          </Button>
        )}
      </div>

      <div className="mt-2">
        {day.stops.map((stop, index) => (
          <StopCard
            key={stop.attractionId || index}
            stop={stop}
            index={index}
            isLast={index === day.stops.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default DayTimeline;
