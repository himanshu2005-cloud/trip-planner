import React, { useState } from 'react';

/**
 * EditorialImage
 * Cinematic travel photography frame with subtle print texture,
 * caption metadata, and restrained hover transition.
 */
export const EditorialImage = ({
  src,
  alt,
  caption,
  figureNumber,
  location,
  aspectRatio = 'aspect-[4/5]',
  className = '',
  priority = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <figure className={`flex flex-col group ${className}`}>
      <div
        className={`relative overflow-hidden bg-[#141418] ${aspectRatio} w-full`}
      >
        <img
          src={src}
          alt={alt || caption || 'Travel photography'}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.03] ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
          }`}
        />
        {/* Subtle photo vignetting */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0c0c0f]/40 via-transparent to-transparent opacity-60" />
      </div>

      {(caption || figureNumber || location) && (
        <figcaption className="mt-2.5 flex items-baseline justify-between text-[11px] text-[#9e9a91] tracking-[0.06em]">
          <span className="font-serif italic text-[#c5c1b8]">
            {caption}
          </span>
          <span className="font-mono text-[10px] tracking-wider text-[#5c5851] uppercase">
            {figureNumber && <span className="mr-2">{figureNumber}</span>}
            {location}
          </span>
        </figcaption>
      )}
    </figure>
  );
};

export default EditorialImage;
