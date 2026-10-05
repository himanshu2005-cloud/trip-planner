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
        className={`inline-flex items-center gap-2 group font-sans text-[11px] font-semibold tracking-[0.18em] uppercase dark:text-[#f5f2eb] text-[#18181c] dark:hover:text-[#c084fc] hover:text-[#6D3FD9] transition-colors py-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
        {...props}
      >
        <span className="relative">
          {children}
          <span className="absolute left-0 right-0 -bottom-1 h-[1px] dark:bg-[#32323e] bg-[#ded7ca] group-hover:bg-[#6D3FD9] dark:group-hover:bg-[#c084fc] transition-colors" />
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
        className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 dark:bg-[#141418] bg-white hover:dark:bg-[#1a1a20] hover:bg-[#f6f2ea] border dark:border-[#23232c] border-[#ded7ca] hover:border-[#6D3FD9] dark:text-[#f5f2eb] text-[#18181c] font-sans text-[11px] font-semibold tracking-[0.14em] uppercase transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm ${className}`}
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
        className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#6D3FD9] hover:bg-[#5b2fb8] border border-[#8b5cf6]/50 text-white font-sans text-[11px] font-semibold tracking-[0.14em] uppercase transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm ${className}`}
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
      className={`inline-flex items-center gap-1.5 text-[11px] font-mono tracking-[0.14em] uppercase dark:text-[#9e9a91] text-[#635f56] dark:hover:text-[#ffffff] hover:text-[#18181c] transition-colors cursor-pointer disabled:opacity-40 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default TravelButton;
