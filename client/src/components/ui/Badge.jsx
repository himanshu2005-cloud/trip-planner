import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  className = '',
  icon: Icon,
}) => {
  const variantStyles = {
    default: 'bg-[#18181b] text-[#a1a1aa] border-[#27272a]',
    purple: 'bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/20',
    success: 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20',
    warning: 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20',
    danger: 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-medium border ${
        variantStyles[variant] || variantStyles.default
      } ${className}`}
    >
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
};

export default Badge;
