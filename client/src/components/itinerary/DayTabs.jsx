import React from 'react';

/**
 * DayTabs
 * Understated editorial day switcher with subtle violet active indicator
 * and monospaced typography.
 */
export const DayTabs = ({ days = [], activeDay = 1, onSelectDay }) => {
  return (
    <div className="w-full border-b border-[#23232c] my-6">
      <div className="flex items-center gap-8 overflow-x-auto scrollbar-none pb-2">
        {days.map((day) => {
          const isSelected = activeDay === day.dayNumber;
          const formatted =
            day.dayNumber < 10 ? `DAY 0${day.dayNumber}` : `DAY ${day.dayNumber}`;

          return (
            <button
              key={day.dayNumber}
              type="button"
              onClick={() => onSelectDay(day.dayNumber)}
              className={`font-mono text-[11px] tracking-[0.22em] uppercase transition-all duration-200 pb-2 relative cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'text-[#f5f2eb] font-semibold'
                  : 'text-[#5c5851] hover:text-[#9e9a91]'
              }`}
            >
              <span>{formatted}</span>
              {isSelected && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#7a5293]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DayTabs;
