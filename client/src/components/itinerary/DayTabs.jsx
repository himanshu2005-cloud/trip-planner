import React from 'react';

/**
 * DayTabs
 * Understated editorial day switcher with subtle violet active indicator
 * and monospaced typography.
 */
export const DayTabs = ({ days = [], activeDay = 1, onSelectDay }) => {
  return (
    <div className="w-full border-b dark:border-[#23232c] border-[#ded7ca] my-6">
      <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-none pb-2">
        {days.map((day) => {
          const isSelected = activeDay === day.dayNumber;
          const formatted =
            day.dayNumber < 10 ? `DAY 0${day.dayNumber}` : `DAY ${day.dayNumber}`;

          return (
            <button
              key={day.dayNumber}
              type="button"
              onClick={() => onSelectDay(day.dayNumber)}
              className={`font-mono text-xs tracking-[0.2em] uppercase transition-all duration-200 pb-2 relative cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'dark:text-[#ffffff] text-[#18181c] font-bold'
                  : 'dark:text-[#8a857b] text-[#6b6558] hover:dark:text-[#ffffff] hover:text-[#18181c] font-medium'
              }`}
            >
              <span>{formatted}</span>
              {isSelected && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] dark:bg-[#a855f7] bg-[#6D3FD9] shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DayTabs;
