import React, { useState } from 'react';

/**
 * RouteMap
 * Cinematic editorial map interface with dark cartographic aesthetic,
 * restrained violet route polyline, and numbered stop sequence.
 */
export const RouteMap = ({
  stops = [],
  destination = 'Kyoto, Japan',
  activeDay = 1,
  selectedStopIndex = 0,
  onSelectStop,
}) => {
  const [internalSelectedIdx, setInternalSelectedIdx] = useState(0);
  const activeIdx = onSelectStop ? selectedStopIndex : internalSelectedIdx;

  const handleSelect = (idx) => {
    if (onSelectStop) {
      onSelectStop(idx);
    } else {
      setInternalSelectedIdx(idx);
    }
  };

  // Harmonious geographic projection points for stops
  const getCoordinates = (index, total) => {
    const paddingX = 18;
    const paddingY = 22;
    const width = 100 - paddingX * 2;
    const height = 100 - paddingY * 2;

    if (total <= 1) return { x: 50, y: 50 };

    const x = paddingX + (index / (total - 1)) * width;
    // Gentle organic curvature for realism
    const y = paddingY + (height / 2) + Math.sin(index * 1.9 + 0.4) * (height / 2.6);

    return { x: Math.round(x), y: Math.round(y) };
  };

  const points = stops.map((stop, i) => ({
    ...stop,
    coords: getCoordinates(i, stops.length),
  }));

  const currentStop = stops[activeIdx] || stops[0];

  return (
    <div className="w-full bg-[#131317] border border-[#23232c] flex flex-col overflow-hidden">
      {/* Top Map Header & Minimal Coordinates */}
      <div className="px-5 py-3.5 border-b border-[#23232c] flex items-center justify-between bg-[#0e0e12]">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#7a5293]" />
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#cebfdf] uppercase">
            DAY {activeDay < 10 ? `0${activeDay}` : activeDay} · ROUTE ATLAS
          </span>
        </div>
        <span className="font-mono text-[10px] tracking-wider text-[#5c5851] uppercase">
          {stops.length} WAYPOINTS
        </span>
      </div>

      {/* Horizontal Waypoint Track: 01 ───── 02 ───── 03 ───── 04 */}
      <div className="px-5 py-2.5 border-b border-[#1c1c23] bg-[#0c0c0f] flex items-center gap-2 overflow-x-auto scrollbar-none">
        {points.map((p, idx) => {
          const isSelected = activeIdx === idx;
          const num = idx + 1 < 10 ? `0${idx + 1}` : idx + 1;
          return (
            <React.Fragment key={idx}>
              <button
                type="button"
                onClick={() => handleSelect(idx)}
                className={`font-mono text-[11px] px-2 py-0.5 tracking-widest transition-all cursor-pointer ${
                  isSelected
                    ? 'text-[#f5f2eb] bg-[#432357] border border-[#7a5293]'
                    : 'text-[#5c5851] hover:text-[#9e9a91]'
                }`}
              >
                {num}
              </button>
              {idx < points.length - 1 && (
                <div className="w-5 h-[1px] bg-[#23232c] shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Cartographic Canvas Area */}
      <div className="relative w-full h-[360px] sm:h-[440px] bg-[#0a0a0d] overflow-hidden select-none flex items-center justify-center">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Minimalist Topographic Contours / River Vector Lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-30,120 C120,80 240,240 450,140 S650,220 800,160"
            fill="none"
            stroke="#5c5851"
            strokeWidth="1"
            strokeDasharray="4,6"
          />
          <path
            d="M-10,260 C160,280 260,110 500,290 S700,200 850,280"
            fill="none"
            stroke="#7a5293"
            strokeWidth="0.8"
            strokeDasharray="3,8"
          />
        </svg>

        {/* Connected Route SVG */}
        <div className="absolute inset-6">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Subtle violet route line */}
            {points.length > 1 && (
              <path
                d={points.reduce((acc, curr, i) => {
                  return i === 0
                    ? `M ${curr.coords.x} ${curr.coords.y}`
                    : `${acc} L ${curr.coords.x} ${curr.coords.y}`;
                }, '')}
                fill="none"
                stroke="#7a5293"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Dotted hairline connector */}
            {points.length > 1 && (
              <path
                d={points.reduce((acc, curr, i) => {
                  return i === 0
                    ? `M ${curr.coords.x} ${curr.coords.y}`
                    : `${acc} L ${curr.coords.x} ${curr.coords.y}`;
                }, '')}
                fill="none"
                stroke="#cebfdf"
                strokeWidth="0.7"
                strokeDasharray="2,3"
                strokeLinecap="round"
              />
            )}

            {/* Stop Nodes */}
            {points.map((p, idx) => {
              const isSelected = activeIdx === idx;
              return (
                <g
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className="cursor-pointer group"
                >
                  {/* Subtle ring around selected */}
                  {isSelected && (
                    <circle
                      cx={p.coords.x}
                      cy={p.coords.y}
                      r="7"
                      fill="none"
                      stroke="#7a5293"
                      strokeWidth="1"
                      opacity="0.8"
                    />
                  )}

                  {/* Marker Node */}
                  <circle
                    cx={p.coords.x}
                    cy={p.coords.y}
                    r={isSelected ? '4.8' : '3.6'}
                    fill={isSelected ? '#7a5293' : '#141418'}
                    stroke={isSelected ? '#f5f2eb' : '#5c5851'}
                    strokeWidth="1.2"
                    className="transition-all duration-200"
                  />

                  {/* Number inside */}
                  <text
                    x={p.coords.x}
                    y={p.coords.y + 1.2}
                    textAnchor="middle"
                    fill={isSelected ? '#ffffff' : '#9e9a91'}
                    fontSize="3"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="500"
                    className="pointer-events-none select-none"
                  >
                    {idx + 1}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Minimalist Floating Stop Dispatch Card */}
        {currentStop && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-4 sm:right-auto sm:max-w-xs bg-[#131317]/95 border border-[#23232c] p-4 backdrop-blur-md">
            <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-[#7a5293] uppercase mb-1">
              <span>STOP 0{activeIdx + 1} / {points.length < 10 ? `0${points.length}` : points.length}</span>
              <span className="text-[#9e9a91]">{currentStop.startTime || '09:00'}</span>
            </div>
            <h4 className="font-serif text-base text-[#f5f2eb] tracking-tight truncate">
              {currentStop.name}
            </h4>
            <div className="flex items-center justify-between text-[11px] font-mono text-[#5c5851] mt-2 pt-2 border-t border-[#1c1c23]">
              <span>{currentStop.category || 'Sight'}</span>
              <span className="text-[#cebfdf]">
                {currentStop.cost === 0 ? 'Free' : `₹${currentStop.cost?.toLocaleString()}`}
              </span>
            </div>
          </div>
        )}

        {/* Minimal Compass Mark */}
        <div className="absolute top-4 right-4 text-[10px] font-mono text-[#5c5851] tracking-[0.2em] uppercase">
          N ↑
        </div>
      </div>
    </div>
  );
};

export default RouteMap;
