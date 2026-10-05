import React from 'react';
import DayHeader from '../editorial/DayHeader';
import TimelineItem from '../editorial/TimelineItem';
import TravelButton from '../editorial/TravelButton';
import GoogleMapsTransitCard from './GoogleMapsTransitCard';

export const DayTimeline = ({
  day,
  destination = 'Jaipur, Rajasthan',
  activeDay = 1,
  onRegenerateDay,
  isRegenerating = false,
  selectedStopIndex = 0,
  onSelectStop,
  onMoveStop,
  onDeleteStop,
  onOpenAddModal,
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

      {/* 🗺️ Real Google Maps Multi-Stop Navigation & Indian Transit Card */}
      <GoogleMapsTransitCard
        destination={destination}
        dayNumber={day.dayNumber || activeDay}
        stops={day.stops}
      />

      {/* Sequential Journal Stops */}
      <div className="flex flex-col">
        {day.stops.map((stop, index) => (
          <TimelineItem
            key={stop.attractionId || `${day.dayNumber}-${index}-${stop.name}`}
            stop={stop}
            index={index}
            destination={destination}
            isFirst={index === 0}
            isLast={index === day.stops.length - 1}
            isSelected={selectedStopIndex === index}
            onSelect={() => onSelectStop && onSelectStop(index)}
            onMoveUp={onMoveStop ? () => onMoveStop(index, 'up') : undefined}
            onMoveDown={onMoveStop ? () => onMoveStop(index, 'down') : undefined}
            onDelete={onDeleteStop ? () => onDeleteStop(index) : undefined}
          />
        ))}
      </div>

      {/* Footer Action Bar: Add Stop & Re-optimize */}
      <div className="mt-8 pt-6 border-t dark:border-[#1c1c23] border-[#e2dbcd] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {onOpenAddModal && (
          <button
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border dark:border-[#2b2b36] border-[#ded7ca] dark:bg-[#15151c] bg-[#f6f2ea] hover:border-[#6D3FD9] text-xs font-mono dark:text-[#cebfdf] text-[#552787] font-semibold transition-all cursor-pointer shadow-sm w-fit"
          >
            <span>+ ADD STOP TO DAY 0{activeDay}</span>
          </button>
        )}

        {onRegenerateDay && (
          <div className="flex items-center gap-3">
            <span className="font-serif italic text-xs dark:text-[#5c5851] text-[#847c6e]">
              Want a different rhythm for {city}?
            </span>
            <TravelButton
              variant="ghost"
              onClick={() => onRegenerateDay(day.dayNumber)}
              disabled={isRegenerating}
              className="text-[10px] tracking-[0.16em] dark:text-[#cebfdf] text-[#552787] dark:hover:text-[#f5f2eb] hover:text-[#18181c]"
            >
              {isRegenerating ? 'RE-COMPOSING...' : 'RE-OPTIMIZE THIS DAY ↻'}
            </TravelButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default DayTimeline;
