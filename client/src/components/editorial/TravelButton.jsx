import React from 'react';

/**
 * TravelButton
 * Editorial button avoiding SaaS pill buttons.
 * Variants:
 *  - 'arrow': Minimal text + arrow (e.g. EXPLORE →, VIEW ITINERARY →)
 *  - 'solid': Charcoal surface + subtle violet/charcoal border
 *  - 'violet': Deep purple base + restrained violet border
 *  - 'ghost': Understated text action
 */
export const TravelButton = ({
  children,
  variant = 'arrow',
  arrow = true,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  ...props
}) => {
  if (variant === 'arrow') {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`inline-flex items-center gap-2 group font-sans text-[11px] font-medium tracking-[0.18em] uppercase text-[#f5f2eb] hover:text-[#cebfdf] transition-colors py-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
        {...props}
      >
        <span className="relative">
          {children}
          <span className="absolute left-0 right-0 -bottom-1 h-[1px] bg-[#32323e] group-hover:bg-[#cebfdf] transition-colors" />
        </span>
        {arrow && (
          <span className="text-[14px] font-serif transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        )}
      </button>
    );
  }

  if (variant === 'solid') {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#141418] hover:bg-[#1a1a20] border border-[#23232c] hover:border-[#7a5293] text-[#f5f2eb] font-sans text-[11px] font-medium tracking-[0.14em] uppercase transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
        {...props}
      >
        <span>{children}</span>
        {arrow && <span className="text-[13px] font-serif">→</span>}
      </button>
    );
  }

  if (variant === 'violet') {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#432357] hover:bg-[#522a6a] border border-[#7a5293] text-[#f5f2eb] font-sans text-[11px] font-medium tracking-[0.14em] uppercase transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
        {...props}
      >
        <span>{children}</span>
        {arrow && <span className="text-[13px] font-serif">→</span>}
      </button>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 text-[11px] tracking-[0.14em] uppercase text-[#9e9a91] hover:text-[#f5f2eb] transition-colors cursor-pointer disabled:opacity-40 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default TravelButton;
