import React from 'react';
import { MapPin, Navigation, ExternalLink, Car, Clock } from 'lucide-react';
import { getGoogleMapsMultiStopUrl, calculateDayTransitEstimates } from '../../utils/mapsNavigation';

export const GoogleMapsTransitCard = ({
  destination = 'Jaipur, Rajasthan',
  dayNumber = 1,
  stops = [],
  className = '',
}) => {
  if (!stops || stops.length === 0) return null;

  const mapsUrl = getGoogleMapsMultiStopUrl(destination, stops);
  const { totalDistanceKm, totalDurationMin, autoFareRange, cabFareRange } =
    calculateDayTransitEstimates(stops);

  return (
    <div
      className={`rounded-xl border dark:border-[#2a2a36] border-[#ded7ca] dark:bg-[#131318] bg-[#fbf9f4] p-4 sm:p-5 shadow-sm transition-all duration-200 mb-8 ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Summary & Sequence */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-[#6D3FD9]/15 text-[#6D3FD9] dark:text-[#a78bfa]">
              <Navigation size={14} className="rotate-45" />
            </span>
            <span className="font-mono text-xs font-semibold tracking-wider uppercase text-[#6D3FD9] dark:text-[#cebfdf]">
              DAY 0{dayNumber} · REAL-TIME NAVIGATION ROUTE
            </span>
          </div>

          <p className="font-sans text-xs dark:text-[#9e9a91] text-[#5c564b] max-w-xl leading-relaxed">
            Sequence of {stops.length} waypoints in {destination.split(',')[0].trim()} optimized for zero dead mileage.
          </p>

          {/* Waypoint Breadcrumbs */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-mono dark:text-[#cebfdf] text-[#4d2379]">
            {stops.map((stop, idx) => (
              <React.Fragment key={stop.name || idx}>
                <span className="px-2 py-0.5 rounded dark:bg-[#1c1c24] bg-[#ede7dc] font-medium truncate max-w-[150px] sm:max-w-[200px]">
                  {idx + 1}. {stop.name}
                </span>
                {idx < stops.length - 1 && (
                  <span className="dark:text-[#5c5851] text-[#9c9485]">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Right: Primary 1-Click CTA */}
        <div className="shrink-0 flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-2">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg bg-[#6D3FD9] hover:bg-[#5b2fb8] active:scale-[0.98] text-white font-mono text-xs font-semibold tracking-wider uppercase transition-all duration-150 shadow-sm hover:shadow-md cursor-pointer group"
          >
            <MapPin size={15} className="group-hover:scale-110 transition-transform" />
            <span>Open Route in Google Maps</span>
            <ExternalLink size={13} className="opacity-80" />
          </a>
          <span className="text-[10px] font-mono dark:text-[#5c5851] text-[#827b6d] text-center md:text-right">
            Launches multi-stop GPS directions
          </span>
        </div>
      </div>

      {/* Indian Transit Intelligence Ledger Bar */}
      <div className="mt-4 pt-3.5 border-t dark:border-[#20202a] border-[#e8e2d5] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-[#6D3FD9] dark:text-[#a78bfa]">📏</span>
          <div>
            <span className="block text-[9px] dark:text-[#5c5851] text-[#827b6d] uppercase">Total Distance</span>
            <span className="font-semibold dark:text-[#f5f2eb] text-[#18181c]">
              ~{totalDistanceKm} km
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock size={14} className="text-[#6D3FD9] dark:text-[#a78bfa]" />
          <div>
            <span className="block text-[9px] dark:text-[#5c5851] text-[#827b6d] uppercase">Transit Time</span>
            <span className="font-semibold dark:text-[#f5f2eb] text-[#18181c]">
              ~{totalDurationMin} mins
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-base">🛺</span>
          <div>
            <span className="block text-[9px] dark:text-[#5c5851] text-[#827b6d] uppercase">Auto Rickshaw</span>
            <span className="font-semibold dark:text-[#f5f2eb] text-[#18181c]">
              {autoFareRange}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Car size={14} className="text-[#6D3FD9] dark:text-[#a78bfa]" />
          <div>
            <span className="block text-[9px] dark:text-[#5c5851] text-[#827b6d] uppercase">Cab (Uber/Ola)</span>
            <span className="font-semibold dark:text-[#f5f2eb] text-[#18181c]">
              {cabFareRange}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapsTransitCard;
