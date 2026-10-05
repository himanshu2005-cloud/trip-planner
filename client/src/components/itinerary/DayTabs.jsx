import React from 'react';

export const DayTabs = ({ days = [], activeDay = 1, onSelectDay }) => {
  return (
    <div className="flex flex-col gap-2">
      {/* Horizontal Tabs Row (DESIGN.md §12) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {days.map((day) => {
          const isSelected = activeDay === day.dayNumber;
          return (
            <button
              key={day.dayNumber}
              type="button"
              onClick={() => onSelectDay(day.dayNumber)}
              className={`px-5 py-2.5 rounded-xl font-medium text-xs tracking-wider uppercase whitespace-nowrap transition-all duration-200 cursor-pointer select-none border ${
                isSelected
                  ? 'bg-gradient-to-r from-purple-700 via-purple-600 to-purple-500 text-white border-purple-400/60 shadow-glow scale-[1.02]'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-text-secondary hover:text-text-primary border-white/[0.08]'
              }`}
            >
              Day {day.dayNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DayTabs;
