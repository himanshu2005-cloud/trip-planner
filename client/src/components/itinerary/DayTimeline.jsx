import React from 'react';
import DayHeader from '../editorial/DayHeader';
import TimelineItem from '../editorial/TimelineItem';
import TravelButton from '../editorial/TravelButton';

export const DayTimeline = ({
  day,
  destination = 'Paris, France',
  activeDay = 1,
  onRegenerateDay,
  isRegenerating = false,
  selectedStopIndex = 0,
  onSelectStop,
}) => {
  if (!day || !day.stops || day.stops.length === 0) {
    return (
      <div className="py-16 text-center text-[#5c5851] font-serif italic text-base">
        No scheduled waypoints recorded for this day.
      </div>
    );
  }

  const city = destination.split(',')[0].trim().toUpperCase();

  return (
    <div className="flex flex-col">
      {/* Editorial Day Header */}
      <DayHeader
        dayNumber={day.dayNumber || activeDay}
        city={city}
        date={day.date || `DAY ${day.dayNumber}`}
        weather={day.weather || '22°C Clear'}
        title={day.title || 'Curated Exploration'}
      />

      {/* Sequential Journal Stops */}
      <div className="flex flex-col">
        {day.stops.map((stop, index) => (
          <TimelineItem
            key={stop.attractionId || `${day.dayNumber}-${index}`}
            stop={stop}
            index={index}
            isLast={index === day.stops.length - 1}
            isSelected={selectedStopIndex === index}
            onSelect={() => onSelectStop && onSelectStop(index)}
          />
        ))}
      </div>

      {/* Understated Regenerate / Replan Day Prompt */}
      {onRegenerateDay && (
        <div className="mt-8 pt-6 border-t border-[#1c1c23] flex items-center justify-between">
          <span className="font-serif italic text-xs text-[#5c5851]">
            Want a different rhythm for {city}?
          </span>
          <TravelButton
            variant="ghost"
            onClick={() => onRegenerateDay(day.dayNumber)}
            disabled={isRegenerating}
            className="text-[10px] tracking-[0.16em] text-[#cebfdf] hover:text-[#f5f2eb]"
          >
            {isRegenerating ? 'RE-COMPOSING...' : 'RE-OPTIMIZE THIS DAY ↻'}
          </TravelButton>
        </div>
      )}
    </div>
  );
};

export default DayTimeline;
