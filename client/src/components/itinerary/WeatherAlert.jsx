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
    <div className="w-full bg-[#131317] border border-[#23232c] p-4 mb-6">
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#7a5293] uppercase font-semibold">
            METEOROLOGICAL DISPATCH
          </span>
          <span className="text-[#32323e] text-xs">/</span>
          <span className="font-serif italic text-sm text-[#f5f2eb]">
            {rainForecast}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="font-mono text-[10px] tracking-wider uppercase text-[#9e9a91] hover:text-[#f5f2eb] transition-colors"
        >
          {open ? 'COLLAPSE —' : 'DETAILS +'}
        </button>
      </div>

      {open && (
        <div className="mt-3 pt-3 border-t border-[#1c1c23] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <span className="text-[10px] text-[#5c5851] uppercase tracking-wider block mb-1">
              ORIGINAL EXPOSURE
            </span>
            <span className="text-[#9e9a91] line-through">
              {originalRoute}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[#cebfdf] uppercase tracking-wider block mb-1">
              ADAPTED SEQUENCE
            </span>
            <span className="text-[#f5f2eb]">
              {updatedRoute}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherAlert;
