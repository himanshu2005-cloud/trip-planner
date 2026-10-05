import React from 'react';
import {
  Clock,
  IndianRupee,
  Star,
  MapPin,
  ExternalLink,
  Navigation,
  Compass,
} from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export const StopCard = ({ stop, index, isLast = false }) => {
  const {
    name,
    category,
    rating,
    startTime,
    duration,
    cost,
    openingHours,
    travelToNext,
    imageUrl,
  } = stop;

  // Instagram external search link per DESIGN.md §21
  const instagramSearchUrl = `https://www.instagram.com/explore/tags/${encodeURIComponent(
    name.replace(/\s+/g, '').toLowerCase()
  )}/`;

  return (
    <div className="relative pl-8 pb-7 last:pb-2">
      {/* Timeline vertical connector line */}
      {!isLast && (
        <div className="absolute left-[13px] top-8 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/60 via-purple-700/40 to-transparent" />
      )}

      {/* Numbered circular node: 1, 2, 3 matching map markers */}
      <div className="absolute left-0 top-1.5 w-7 h-7 rounded-full bg-gradient-to-tr from-purple-800 to-purple-600 border-2 border-purple-400 flex items-center justify-center text-xs font-bold text-white shadow-glow-sm z-10">
        {index + 1}
      </div>

      <Card hoverable className="p-4 sm:p-5 border-white/[0.08] hover:border-purple-500/40">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex-1">
            {/* Time & Meta tags */}
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-bold text-purple-400 font-mono tracking-tight bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-800/40">
                {startTime || '09:00'}
              </span>
              <Badge variant="purple">{category || 'Attraction'}</Badge>
              {rating && (
                <span className="flex items-center gap-1 text-xs font-semibold text-warning">
                  <Star size={12} className="fill-warning" />
                  {rating}
                </span>
              )}
            </div>

            <h4 className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
              {name}
            </h4>

            {/* Visit Details: Duration & Opening status */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted mt-2">
              <div className="flex items-center gap-1">
                <Clock size={13} className="text-purple-400" />
                <span>{duration >= 60 ? `${Math.floor(duration / 60)}h ${duration % 60 ? `${duration % 60}m` : ''}` : `${duration}m`} visit</span>
              </div>

              {openingHours && (
                <div className="flex items-center gap-1.5 text-text-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  <span>Open until {openingHours.close}</span>
                </div>
              )}
            </div>
          </div>

          {/* Cost Badge */}
          <div className="sm:self-start">
            <span
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl border flex items-center gap-1 ${
                cost === 0
                  ? 'bg-success/10 text-success border-success/30'
                  : 'bg-white/[0.05] text-text-primary border-white/[0.1]'
              }`}
            >
              {cost === 0 ? (
                'Free'
              ) : (
                <>
                  <IndianRupee size={12} />
                  <span>{cost.toLocaleString()}</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Footer info: Instagram link & travel pills */}
        <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between">
          <a
            href={instagramSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-accent-pink transition-colors font-medium"
            title="Search attraction photos on Instagram"
          >
            <span>Find on Instagram</span>
            <ExternalLink size={12} />
          </a>

          <span className="text-[11px] text-text-muted">Stop #{index + 1}</span>
        </div>

        {/* Travel to next indicator */}
        {!isLast && travelToNext && (
          <div className="mt-3 py-2 px-3 rounded-xl bg-purple-950/40 border border-purple-800/30 flex items-center justify-between text-xs text-text-secondary">
            <div className="flex items-center gap-2">
              <Navigation size={13} className="text-accent-blue" />
              <span>
                {travelToNext.distanceKm} km · ~{travelToNext.durationMinutes} min travel
              </span>
            </div>
            <span className="text-[10px] text-text-muted uppercase">Short commute</span>
          </div>
        )}
      </Card>
    </div>
  );
};

export default StopCard;
