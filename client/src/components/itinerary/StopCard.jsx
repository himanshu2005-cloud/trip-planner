import React from 'react';
import { Clock, IndianRupee, Star, ExternalLink, Navigation } from 'lucide-react';
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
    <div className="relative pl-8 pb-8 last:pb-2">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[13px] top-6 bottom-0 w-[1px] bg-[#27272a]" />
      )}

      {/* Node */}
      <div className="absolute left-[9px] top-1.5 w-[9px] h-[9px] rounded-full bg-[#8b5cf6] border-[2px] border-[#18181b] z-10" />

      <Card hoverable className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[12px] font-medium text-[#8b5cf6] font-mono">
                {startTime || '09:00'}
              </span>
              <Badge variant="default">{category || 'Attraction'}</Badge>
              {rating && (
                <span className="flex items-center gap-1 text-[11px] font-medium text-[#a1a1aa]">
                  <Star size={10} className="fill-[#a1a1aa] text-[#a1a1aa]" />
                  {rating}
                </span>
              )}
            </div>

            <h4 className="text-[15px] font-medium text-[#f4f4f5] tracking-tight">
              {name}
            </h4>

            <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#71717a] mt-1.5">
              <div className="flex items-center gap-1.5">
                <Clock size={12} />
                <span>{duration >= 60 ? `${Math.floor(duration / 60)}h ${duration % 60 ? `${duration % 60}m` : ''}` : `${duration}m`}</span>
              </div>

              {openingHours && (
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                  <span>Until {openingHours.close}</span>
                </div>
              )}
            </div>
          </div>

          <div className="sm:self-start">
            <span
              className={`text-[12px] font-medium px-2 py-1 rounded-[4px] border flex items-center gap-1 ${
                cost === 0
                  ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20'
                  : 'bg-[#18181b] text-[#f4f4f5] border-[#27272a]'
              }`}
            >
              {cost === 0 ? (
                'Free'
              ) : (
                <>
                  <IndianRupee size={10} />
                  <span>{cost.toLocaleString()}</span>
                </>
              )}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#27272a] flex items-center justify-between">
          <a
            href={instagramSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors font-medium"
          >
            <span>Instagram</span>
            <ExternalLink size={10} />
          </a>
        </div>

        {!isLast && travelToNext && (
          <div className="mt-3 py-1.5 px-2.5 rounded-[4px] bg-[#121212] border border-[#27272a] flex items-center gap-2 text-[11px] text-[#a1a1aa]">
            <Navigation size={10} />
            <span>
              {travelToNext.distanceKm} km · {travelToNext.durationMinutes} min
            </span>
          </div>
        )}
      </Card>
    </div>
  );
};

export default StopCard;
