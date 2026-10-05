import React from 'react';
import {
  Clock,
  IndianRupee,
  Star,
  MapPin,
  ExternalLink,
  Navigation,
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
  } = stop;

  const instagramSearchUrl = `https://www.instagram.com/explore/tags/${encodeURIComponent(
    name.replace(/\s+/g, '').toLowerCase()
  )}/`;

  return (
    <div className="relative pl-8 pb-8 last:pb-0">
      {/* Timeline vertical connector */}
      {!isLast && (
        <div className="absolute left-3.5 top-8 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/50 to-purple-800/20" />
      )}

      {/* Numbered node */}
      <div className="absolute left-0 top-1.5 w-7 h-7 rounded-full bg-purple-700 border-2 border-purple-400 flex items-center justify-center text-xs font-bold text-white shadow-glow-sm">
        {index + 1}
      </div>

      <Card className="p-4 sm:p-5 hover:border-purple-500/40">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-purple-400">
                {startTime || '09:00'}
              </span>
              <Badge variant="purple">{category || 'Attraction'}</Badge>
              {rating && (
                <span className="flex items-center gap-1 text-xs text-warning">
                  <Star size={12} className="fill-warning" />
                  {rating}
                </span>
              )}
            </div>
            <h4 className="text-base font-semibold text-text-primary tracking-tight">
              {name}
            </h4>
          </div>

          <div className="flex items-center gap-2 sm:self-start">
            <span className="text-xs font-medium text-text-secondary bg-white/[0.05] px-2.5 py-1 rounded-lg border border-white/[0.08] flex items-center gap-1">
              <IndianRupee size={12} />
              {cost === 0 ? 'Free' : cost}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted mt-3 pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-1">
            <Clock size={13} className="text-purple-400" />
            <span>{duration || 60} mins visit</span>
          </div>

          {openingHours && (
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              <span>
                {openingHours.open} – {openingHours.close}
              </span>
            </div>
          )}

          <a
            href={instagramSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-purple-400 hover:text-accent-pink transition-colors ml-auto"
          >
            <span>Instagram</span>
            <ExternalLink size={12} />
          </a>
        </div>

        {/* Travel to next indicator */}
        {!isLast && travelToNext && (
          <div className="mt-3 py-1.5 px-3 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center gap-2 text-xs text-text-secondary">
            <Navigation size={12} className="text-accent-blue" />
            <span>
              {travelToNext.distanceKm} km · ~{travelToNext.durationMinutes} min travel
            </span>
          </div>
        )}
      </Card>
    </div>
  );
};

export default StopCard;
