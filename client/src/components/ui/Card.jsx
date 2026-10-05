import React from 'react';

export const Card = ({
  children,
  className = '',
  glass = true,
  hoverable = false,
  onClick,
  ...props
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-250';
  const glassStyles = glass
    ? 'bg-white/[0.055] border border-white/[0.09] backdrop-blur-[18px] shadow-glass'
    : 'bg-purple-950/40 border border-purple-800/30';
  const hoverStyles = hoverable
    ? 'hover:-translate-y-1 hover:border-purple-500/30 hover:shadow-glow-sm cursor-pointer'
    : '';

  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${glassStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
