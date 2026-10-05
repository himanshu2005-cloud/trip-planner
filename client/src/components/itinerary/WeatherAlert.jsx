import React, { useState } from 'react';

/**
 * WeatherAlert
 * Editorial meteorological advisory dispatch.
 */
export const WeatherAlert = ({
  rainForecast = 'Intense midday heat expected near 13:00',
  originalRoute = 'Nahargarh Fort Outdoor Ramparts (13:00)',
  updatedRoute = 'Early Morning Amber Fort → Shaded City Palace Museum',
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full dark:bg-[#131317] bg-white border dark:border-[#23232c] border-[#ded7ca] p-4 mb-6 rounded-xl shadow-sm">
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#6D3FD9] dark:text-[#a78bfa] uppercase font-semibold">
            METEOROLOGICAL DISPATCH
          </span>
          <span className="dark:text-[#32323e] text-[#d5cdbe] text-xs">/</span>
          <span className="font-serif italic text-sm dark:text-[#ffffff] text-[#18181c]">
            {rainForecast}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="font-mono text-[10px] tracking-wider uppercase dark:text-[#a09c93] text-[#6b6558] hover:dark:text-[#ffffff] hover:text-[#18181c] transition-colors cursor-pointer"
        >
          {open ? 'COLLAPSE —' : 'DETAILS +'}
        </button>
      </div>

      {open && (
        <div className="mt-3 pt-3 border-t dark:border-[#23232c] border-[#e8e2d5] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <span className="text-[10px] dark:text-[#7e796e] text-[#847c6d] uppercase tracking-wider block mb-1">
              ORIGINAL EXPOSURE
            </span>
            <span className="dark:text-[#a09c93] text-[#5c564b] line-through">
              {originalRoute}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[#6D3FD9] dark:text-[#c084fc] uppercase tracking-wider block mb-1 font-semibold">
              ADAPTED SEQUENCE
            </span>
            <span className="dark:text-[#ffffff] text-[#18181c] font-medium">
              {updatedRoute}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherAlert;
