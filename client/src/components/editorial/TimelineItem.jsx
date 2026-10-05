import React from 'react';
import EditorialImage from './EditorialImage';

// Authentic atmospheric curated imagery mapped to typical travel categories/names
const ATMOSPHERIC_PHOTOS = {
  shrine: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop',
  temple: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop',
  garden: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?q=80&w=1200&auto=format&fit=crop',
  cafe: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop',
  food: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop',
  tower: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop',
  museum: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1200&auto=format&fit=crop',
  default: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop',
};

const getPhotoForStop = (name = '', category = '') => {
  const query = `${name} ${category}`.toLowerCase();
  if (query.includes('shrine')) return ATMOSPHERIC_PHOTOS.shrine;
  if (query.includes('temple')) return ATMOSPHERIC_PHOTOS.temple;
  if (query.includes('garden') || query.includes('park')) return ATMOSPHERIC_PHOTOS.garden;
  if (query.includes('cafe') || query.includes('coffee') || query.includes('breakfast')) return ATMOSPHERIC_PHOTOS.cafe;
  if (query.includes('food') || query.includes('lunch') || query.includes('dinner') || query.includes('bistro')) return ATMOSPHERIC_PHOTOS.food;
  if (query.includes('tower') || query.includes('eiffel') || query.includes('view')) return ATMOSPHERIC_PHOTOS.tower;
  if (query.includes('museum') || query.includes('louvre') || query.includes('art')) return ATMOSPHERIC_PHOTOS.museum;
  return null;
};

export const TimelineItem = ({
  stop,
  index,
  isLast = false,
  onSelect,
  isSelected = false,
}) => {
  const {
    name,
    category,
    rating,
    startTime,
    duration,
    cost,
    travelToNext,
    description,
    image,
  } = stop;

  // Key stops show a curated editorial photograph to create visual rhythm
  const shouldShowPhoto = image || (index === 1 || index === 2);
  const photoUrl = image || getPhotoForStop(name, category) || ATMOSPHERIC_PHOTOS.default;

  const durationFormatted =
    duration >= 60
      ? `${Math.floor(duration / 60)}h ${duration % 60 ? `${duration % 60}m` : ''}`
      : `${duration || 60}m`;

  return (
    <article
      onClick={onSelect}
      className={`relative group transition-all duration-300 ${
        isSelected ? 'opacity-100' : 'opacity-90 hover:opacity-100'
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start py-6">
        {/* Left Column: Monospaced Time & Number (3 cols) */}
        <div className="md:col-span-3 flex md:flex-col items-baseline justify-between md:justify-start gap-2">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#7a5293] font-semibold">
              {(index + 1 < 10 ? `0${index + 1}` : index + 1)}
            </span>
            <span className="font-mono text-sm tracking-wider text-[#e7e3da]">
              {startTime || '09:00'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-[#5c5851] uppercase tracking-wider">
            <span>{durationFormatted}</span>
            <span>·</span>
            <span>{cost === 0 ? 'Free' : `₹${cost?.toLocaleString()}`}</span>
          </div>
        </div>

        {/* Right Column: Place Name, Notes & Optional Photograph (9 cols) */}
        <div className="md:col-span-9 flex flex-col gap-3">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#7a5293] font-semibold">
                {category || 'Destination'}
              </span>
              {rating && (
                <span className="text-[11px] text-[#9e9a91] font-mono">
                  ★ {rating}
                </span>
              )}
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl text-[#f5f2eb] tracking-tight mt-1 group-hover:text-[#cebfdf] transition-colors">
              {name}
            </h3>

            {description && (
              <p className="font-serif italic text-sm text-[#9e9a91] mt-1.5 leading-relaxed max-w-xl">
                {description}
              </p>
            )}
          </div>

          {/* Editorial Photograph for Visual Rhythm */}
          {shouldShowPhoto && (
            <div className="my-4 max-w-xl">
              <EditorialImage
                src={photoUrl}
                caption={`Impression: ${name}`}
                location={category || 'FIELD NOTE'}
                figureNumber={`0${index + 1}`}
                aspectRatio="aspect-[16/9]"
              />
            </div>
          )}

          {/* Transit Connection to Next Stop */}
          {!isLast && travelToNext && (
            <div className="mt-3 pt-3 flex items-center gap-3 text-[11px] font-mono text-[#5c5851] tracking-wider uppercase">
              <span className="text-[#7a5293]">↓</span>
              <span>
                {travelToNext.durationMinutes || 15} MIN TRANSIT
              </span>
              <span>·</span>
              <span>
                {travelToNext.distanceKm || 1.2} KM
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Editorial Thin Rule Between Journal Stops */}
      {!isLast && (
        <div className="w-full my-2 flex items-center gap-4">
          <div className="w-8 h-[1px] bg-[#32323e]" />
          <div className="flex-1 h-[1px] bg-[#1c1c23]" />
        </div>
      )}
    </article>
  );
};

export default TimelineItem;
