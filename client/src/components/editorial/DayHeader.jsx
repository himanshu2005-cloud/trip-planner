import React from 'react';

/**
 * DayHeader
 * Magazine-style editorial header for trip days:
 * DAY 01 ────────────── TOKYO, APRIL 18 · 24°C
 */
export const DayHeader = ({
  dayNumber = 1,
  city = 'TOKYO',
  date = 'APRIL 18',
  weather = '22°C Clear',
  title = '',
}) => {
  const formattedDay = dayNumber < 10 ? `DAY 0${dayNumber}` : `DAY ${dayNumber}`;

  return (
    <header className="w-full mb-10 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-xs font-semibold tracking-[0.25em] text-[#cebfdf] uppercase">
            {formattedDay}
          </span>
          <span className="text-[#5c5851] text-xs font-mono">/</span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#f5f2eb] tracking-tight">
            {city}
          </h2>
          {title && (
            <span className="hidden md:inline font-serif italic text-base text-[#9e9a91]">
              — {title}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-[#9e9a91] tracking-[0.15em] uppercase">
          {date && <span>{date}</span>}
          {weather && (
            <>
              <span className="text-[#32323e]">·</span>
              <span className="text-[#cebfdf]">{weather}</span>
            </>
          )}
        </div>
      </div>

      <div className="w-full h-[1px] bg-[#23232c]" />
    </header>
  );
};

export default DayHeader;
