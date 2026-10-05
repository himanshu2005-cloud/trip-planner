import React from 'react';
import { MapPin, Navigation, Compass } from 'lucide-react';
import Card from '../ui/Card';

export const ItineraryMap = ({ stops = [], destination = 'Destination' }) => {
  return (
    <Card className="p-0 overflow-hidden flex flex-col h-full min-h-[400px] border-purple-500/20 relative">
      {/* Top Map Header bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="bg-background/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/[0.1] text-xs font-medium text-text-primary shadow-glass flex items-center gap-2 pointer-events-auto">
          <Compass size={14} className="text-purple-400" />
          <span>Interactive Route · {destination}</span>
        </div>

        <div className="bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/[0.1] text-xs font-medium text-text-secondary shadow-glass pointer-events-auto">
          {stops.length} Stops Mapped
        </div>
      </div>

      {/* Map visualization canvas / placeholder */}
      <div className="w-full flex-1 min-h-[380px] bg-gradient-to-br from-purple-950/60 via-background to-purple-900/40 relative flex items-center justify-center p-6">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        {stops && stops.length > 0 ? (
          <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-4 py-8">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {stops.map((stop, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-700/80 border border-purple-400/40 text-white text-xs font-semibold shadow-glow-sm">
                    <span className="w-4 h-4 rounded-full bg-white text-purple-950 text-[10px] flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span className="truncate max-w-[100px]">{stop.name}</span>
                  </div>
                  {idx < stops.length - 1 && (
                    <Navigation size={12} className="text-purple-400 rotate-90 sm:rotate-0" />
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-text-muted text-center mt-2">
              Route coordinates mapped with nearest-neighbour + 2-opt TSP
            </p>
          </div>
        ) : (
          <div className="relative z-10 text-center text-text-muted">
            <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-white/[0.04] flex items-center justify-center">
              <MapPin size={22} className="text-purple-400" />
            </div>
            <p className="text-sm font-medium text-text-secondary">
              Select or generate a day to view route markers
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ItineraryMap;
