import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Compass,
  Layers,
  Maximize2,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export const ItineraryMap = ({
  stops = [],
  destination = 'Paris, France',
  activeDay = 1,
}) => {
  const [selectedStopIdx, setSelectedStopIdx] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isMobileCollapsed, setIsMobileCollapsed] = useState(false);

  // Geographic SVG positions calculated relative to stop index for smooth visual demo
  const getCoordinates = (index, total) => {
    // Generate harmonious bezier curve points based on stop count
    const padding = 15;
    const width = 100 - padding * 2;
    const height = 100 - padding * 2;

    if (total <= 1) return { x: 50, y: 50 };

    const angle = (index / (total - 1)) * Math.PI * 0.9 + 0.3;
    const x = padding + (index / (total - 1)) * width;
    // undulating y-axis for realistic city layout
    const y = 50 + Math.sin(index * 1.8) * (height / 3.2);

    return { x: Math.round(x), y: Math.round(y) };
  };

  const points = stops.map((stop, i) => ({
    ...stop,
    coords: getCoordinates(i, stops.length),
  }));

  const activeStop = stops[selectedStopIdx] || stops[0];

  return (
    <Card className="p-0 overflow-hidden flex flex-col border-purple-500/30 shadow-glass relative bg-[#0d0718]">
      {/* ── Top Map Header & Controls ────────────────────────────────────────── */}
      <div className="p-3.5 sm:p-4 border-b border-white/[0.08] bg-background-secondary/80 backdrop-blur-md flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-600/30 text-purple-400 flex items-center justify-center">
            <Compass size={16} />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-text-primary tracking-tight">
              Day {activeDay} Route Map
            </h4>
            <span className="text-[10px] text-text-muted">
              {stops.length} stops · {destination}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Mobile Collapse Toggle */}
          <button
            onClick={() => setIsMobileCollapsed(!isMobileCollapsed)}
            className="lg:hidden p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.05] transition-colors"
            title="Toggle map view"
          >
            {isMobileCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-lg border border-white/[0.06]">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.6))}
              className="p-1 text-text-muted hover:text-text-primary rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
              className="p-1 text-text-muted hover:text-text-primary rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Map Canvas / Visual Area ─────────────────────────────────────────── */}
      {!isMobileCollapsed && (
        <div className="relative w-full h-[360px] sm:h-[460px] overflow-hidden flex items-center justify-center select-none">
          {/* Dark Cartographic Background Grid */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(168, 85, 247, 0.4) 1px, transparent 0)',
              backgroundSize: '28px 28px',
            }}
          />

          {/* Subtle City River / Transit Vector Lines for realism */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M-50,180 Q150,220 300,160 T650,240"
              fill="none"
              stroke="#818CF8"
              strokeWidth="24"
              strokeLinecap="round"
            />
            <path
              d="M-20,320 Q200,280 400,340 T700,290"
              fill="none"
              stroke="#67E8F9"
              strokeWidth="12"
              strokeLinecap="round"
            />
          </svg>

          {/* Connected Route Polyline (1 → 2 → 3 → 4) */}
          <div
            className="absolute inset-4 transition-transform duration-300"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {/* Glowing underlying path */}
              {points.length > 1 && (
                <path
                  d={points.reduce((acc, curr, i) => {
                    return i === 0
                      ? `M ${curr.coords.x} ${curr.coords.y}`
                      : `${acc} L ${curr.coords.x} ${curr.coords.y}`;
                  }, '')}
                  fill="none"
                  stroke="#A855F7"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]"
                />
              )}

              {/* Dashed trajectory connector */}
              {points.length > 1 && (
                <path
                  d={points.reduce((acc, curr, i) => {
                    return i === 0
                      ? `M ${curr.coords.x} ${curr.coords.y}`
                      : `${acc} L ${curr.coords.x} ${curr.coords.y}`;
                  }, '')}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                  strokeLinecap="round"
                />
              )}

              {/* Numbered Stops Markers (1, 2, 3) */}
              {points.map((p, idx) => {
                const isSelected = selectedStopIdx === idx;
                return (
                  <g
                    key={idx}
                    onClick={() => setSelectedStopIdx(idx)}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing ring for active selection */}
                    {isSelected && (
                      <circle
                        cx={p.coords.x}
                        cy={p.coords.y}
                        r="6"
                        fill="none"
                        stroke="#A855F7"
                        strokeWidth="1.5"
                        className="animate-ping opacity-75"
                      />
                    )}

                    {/* Outer marker pin */}
                    <circle
                      cx={p.coords.x}
                      cy={p.coords.y}
                      r={isSelected ? '4.8' : '3.8'}
                      fill={isSelected ? '#9333EA' : '#241044'}
                      stroke={isSelected ? '#E879F9' : '#8B5CF6'}
                      strokeWidth="1.2"
                      className="transition-all duration-200"
                    />

                    {/* Number label inside pin */}
                    <text
                      x={p.coords.x}
                      y={p.coords.y + 1.2}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="3.2"
                      fontWeight="bold"
                      className="pointer-events-none select-none"
                    >
                      {idx + 1}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Active Stop Floating Overlay Card */}
          {activeStop && (
            <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-auto sm:max-w-xs z-30 animate-fade-in">
              <div className="p-3.5 rounded-xl bg-purple-950/90 border border-purple-500/40 backdrop-blur-xl shadow-glass">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-pink animate-pulse" />
                    Stop #{selectedStopIdx + 1} Selected
                  </span>
                  <span className="text-[11px] font-semibold text-text-primary">
                    {activeStop.startTime || '09:00'}
                  </span>
                </div>

                <h5 className="text-sm font-bold text-text-primary truncate">
                  {activeStop.name}
                </h5>

                <div className="flex items-center justify-between text-xs text-text-muted mt-2 pt-2 border-t border-white/[0.08]">
                  <span>{activeStop.category || 'Attraction'}</span>
                  <span className="text-success font-medium">
                    {activeStop.cost === 0 ? 'Free' : `₹${activeStop.cost?.toLocaleString()}`}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Compass Rose Widget in top right */}
          <div className="absolute top-3 right-3 pointer-events-none z-10 flex flex-col items-center opacity-70">
            <div className="w-6 h-6 rounded-full border border-purple-500/40 bg-purple-950/60 backdrop-blur-sm flex items-center justify-center text-[10px] font-bold text-purple-300">
              N
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ItineraryMap;
