import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverable = false,
  onClick,
  ...props
}) => {
  const baseStyles = 'bg-[#18181b] border border-[#27272a] rounded-[8px]';
  const hoverStyles = hoverable
    ? 'hover:border-[#3f3f46] transition-colors cursor-pointer'
    : '';

  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
