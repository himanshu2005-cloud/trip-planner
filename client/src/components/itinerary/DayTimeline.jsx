import React from 'react';
import StopCard from './StopCard';
import Button from '../ui/Button';
import { RefreshCw, Clock } from 'lucide-react';

export const DayTimeline = ({
  day,
  onRegenerateDay,
  isRegenerating = false,
}) => {
  if (!day || !day.stops || day.stops.length === 0) {
    return (
      <div className="py-12 text-center text-text-muted">
        <p className="text-sm">No attractions scheduled for this day.</p>
      </div>
    );
  }

  const firstStop = day.stops[0];
  const lastStop = day.stops[day.stops.length - 1];

  return (
    <div className="flex flex-col">
      {/* Day Subheader (DESIGN.md §12: DAY 2 · Historic Paris · 8:30 AM → 7:00 PM) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/[0.08] mb-5 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
              Day {day.dayNumber}
            </span>
            <span className="text-text-muted text-xs">·</span>
            <span className="text-xs text-text-secondary font-medium">
              {day.title || 'Curated Exploration'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Clock size={12} className="text-purple-400" />
            <span>
              {firstStop?.startTime || '09:00'} → {day.endTime || '18:30'}
            </span>
            <span>·</span>
            <span>{day.stops.length} stops</span>
            <span>·</span>
            <span className="text-success font-medium">₹{day.totalCost || 0}</span>
          </div>
        </div>

        {/* Regenerate Day Action Button (DESIGN.md §15) */}
        {onRegenerateDay && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onRegenerateDay(day.dayNumber)}
            disabled={isRegenerating}
            className="sm:self-center"
          >
            <RefreshCw
              size={13}
              className={isRegenerating ? 'animate-spin text-purple-400' : ''}
            />
            <span>Regenerate Day</span>
          </Button>
        )}
      </div>

      {/* Sequential Timeline Stops */}
      <div className="mt-1">
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
